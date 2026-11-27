import 'server-only'

import { unstable_cache } from 'next/cache'
import sanitizeHtml from 'sanitize-html'

import { SUPABASE_REVALIDATE, storageUrl, supabase } from './client'
import { statementDate, fiscalYearLabel, fiscalYearStart } from './dates'

/**
 * Server-side reads of the existing IEL Supabase tables (plan §6).
 * Same tables, columns and ordering as the old browser scripts; nothing is written.
 * Each call is cached for SUPABASE_REVALIDATE seconds under a `supabase:<table>` tag.
 * On failure the functions throw; pages catch and show a friendly message
 * (Next keeps serving the last good cached result while revalidating).
 */

const cached = <A extends unknown[], R>(fn: (...args: A) => Promise<R>, key: string, table: string) =>
  unstable_cache(fn, ['supabase', key], { revalidate: SUPABASE_REVALIDATE, tags: [`supabase:${table}`] })

// ── News (News page: 20 latest, newest first) ───────────────────────────────

export type NewsItem = { title: string; pdfUrl: string | null }

export const getNews = cached(
  async (limit: number = 20): Promise<NewsItem[]> => {
    const { data, error } = await supabase()
      .from('news')
      .select('short_des, pdf')
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) throw new Error(`news: ${error.message}`)
    return (data ?? []).map((r) => ({
      // Same fallback text as the old script for rows without a description.
      title: (r.short_des as string | null)?.trim() || 'Update on Attock Cement Acquisition',
      pdfUrl: storageUrl(r.pdf as string | null),
    }))
  },
  'news',
  'news',
)

// ── Learn articles (blogs) ───────────────────────────────────────────────────

export type BlogSummary = { id: string; title: string; image: string | null; excerpt: string }
export type BlogPost = { id: string; title: string; image: string | null; html: string; createdAt: string | null }

// `desc` is HTML written in another admin panel; the `blogs` table is publicly writable
// (supabase/SECURITY_FINDINGS.md A6), so it is always sanitised before rendering.
const BLOG_HTML: sanitizeHtml.IOptions = {
  allowedTags: [
    ...sanitizeHtml.defaults.allowedTags,
    'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'figure', 'figcaption', 'span', 'u', 's',
  ],
  allowedAttributes: {
    a: ['href', 'name', 'target', 'rel'],
    img: ['src', 'alt', 'width', 'height'],
    '*': ['class'],
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  transformTags: { a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }) },
}

function toExcerpt(html: string | null | undefined, max = 150): string {
  const text = sanitizeHtml(String(html ?? ''), { allowedTags: [], allowedAttributes: {} })
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
  return text.length <= max ? text : text.slice(0, max).replace(/\s+\S*$/, '') + '…'
}

export const getBlogs = cached(
  async (): Promise<BlogSummary[]> => {
    const { data, error } = await supabase()
      .from('blogs')
      .select('title, img, desc, id')
      .order('created_at', { ascending: false })
    if (error) throw new Error(`blogs: ${error.message}`)
    return (data ?? []).map((b) => ({
      id: String(b.id),
      title: (b.title as string) || 'Untitled',
      image: storageUrl(b.img as string | null),
      excerpt: toExcerpt(b.desc as string),
    }))
  },
  'blogs',
  'blogs',
)

export const getBlog = cached(
  async (id: string): Promise<BlogPost | null> => {
    const { data, error } = await supabase()
      .from('blogs')
      .select('title, img, desc, created_at')
      .eq('id', id)
      .maybeSingle()
    if (error) throw new Error(`blog ${id}: ${error.message}`)
    if (!data) return null
    return {
      id,
      title: (data.title as string) || 'Untitled',
      image: storageUrl(data.img as string | null),
      html: sanitizeHtml(String(data.desc ?? ''), BLOG_HTML),
      createdAt: (data.created_at as string) ?? null,
    }
  },
  'blog',
  'blogs',
)

// ── Research ─────────────────────────────────────────────────────────────────

export type Sector = { name: string }
export type ResearchReport = {
  id: string
  name: string
  shortDesc: string
  reportType: string
  sectorName: string
  createdAt: string | null
  pdfUrl: string | null
}

export const getSectors = cached(
  async (): Promise<Sector[]> => {
    const { data, error } = await supabase().from('sector').select('sector_name').order('sector_name', { ascending: true })
    if (error) throw new Error(`sector: ${error.message}`)
    return (data ?? []).map((s) => ({ name: String(s.sector_name) }))
  },
  'sectors',
  'sector',
)

export const getResearch = cached(
  async (): Promise<ResearchReport[]> => {
    const { data, error } = await supabase()
      .from('research')
      .select('id, name, short_desc, report_type, sector_name, created_at, pdf_url')
      .order('created_at', { ascending: false })
    if (error) throw new Error(`research: ${error.message}`)
    return (data ?? []).map((r) => ({
      id: String(r.id),
      name: (r.name as string) || 'Untitled Document',
      shortDesc: (r.short_desc as string) ?? '',
      reportType: (r.report_type as string) ?? '',
      sectorName: (r.sector_name as string) ?? '',
      createdAt: (r.created_at as string) ?? null,
      pdfUrl: storageUrl(r.pdf_url as string | null),
    }))
  },
  'research',
  'research',
)

// ── Financial statements ─────────────────────────────────────────────────────

export const STATEMENT_TABS = [
  'Audited Financials 30 June',
  'Half Yearly 31 Dec',
  'Quarter Ended 30 Sept',
  'Quarter Ended 31 March',
  'LCB',
] as const
export type StatementTab = (typeof STATEMENT_TABS)[number]

export type StatementInput = { tab: string; title: string; pdfUrl: string | null; date?: string | null }
export type Statement = { title: string; pdfUrl: string | null; date: string | null }
export type StatementYear = { fyStart: number; label: string; items: Statement[] }
export type StatementsByTab = Record<StatementTab, StatementYear[]>

/** Supabase rows (`finanicial_statements`): tab, short_des, pdf, optional statement_date. */
export const getSupabaseStatements = cached(
  async (): Promise<StatementInput[]> => {
    const { data, error } = await supabase()
      .from('finanicial_statements')
      .select('*')
      .order('created_at', { ascending: true })
    if (error) throw new Error(`finanicial_statements: ${error.message}`)
    return (data ?? []).map((r) => ({
      tab: String(r.tab ?? ''),
      title: String(r.short_des ?? ''),
      pdfUrl: storageUrl(r.pdf as string | null),
      date: (r.statement_date as string | null) ?? null,
    }))
  },
  'statements',
  'finanicial_statements',
)

/**
 * Merge site-kept and Supabase statements, then group each tab by financial year
 * (1 July – 30 June), newest year and newest document first. Same rules as the old
 * NewReport script: a real date wins, otherwise the date is read from the title.
 */
export function groupStatements(rows: StatementInput[]): StatementsByTab {
  const result = Object.fromEntries(STATEMENT_TABS.map((t) => [t, [] as StatementYear[]])) as StatementsByTab
  for (const tab of STATEMENT_TABS) {
    const byYear = new Map<number, { item: Statement; t: number }[]>()
    for (const row of rows.filter((r) => r.tab === tab)) {
      const d = statementDate(row.date, row.title)
      const fy = d ? fiscalYearStart(d) : fiscalYearStart(new Date(0))
      const list = byYear.get(fy) ?? []
      list.push({
        item: { title: row.title || 'Untitled Document', pdfUrl: row.pdfUrl, date: d ? d.toISOString().slice(0, 10) : null },
        t: d ? d.getTime() : 0,
      })
      byYear.set(fy, list)
    }
    result[tab] = [...byYear.entries()]
      .sort((a, b) => b[0] - a[0])
      .map(([fy, list]) => ({
        fyStart: fy,
        label: fiscalYearLabel(fy),
        items: list.sort((a, b) => b.t - a.t).map((x) => x.item),
      }))
  }
  return result
}
