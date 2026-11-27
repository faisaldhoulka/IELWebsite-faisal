/**
 * One-time seed: loads the current site's content into the CMS (plan §3 "One-time seed").
 * This is NOT an import from Supabase — Supabase data stays there and is read live.
 *
 *   npm run seed            # refuses to run if pages already exist
 *   npm run seed -- --reset # deletes seeded collections first, then seeds again
 *
 * Users, media and the change log are never touched.
 */
import 'dotenv/config'

import fs from 'node:fs'
import path from 'node:path'

import { JSDOM } from 'jsdom'
import { convertHTMLToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import { getPayload, type CollectionSlug, type GlobalSlug } from 'payload'

import { editor } from '../src/lib/editor'
import config from '../src/payload.config'
import { homepage, pages } from './seed-data/pages'
import {
  accountOpening,
  board,
  corporateReports,
  footer,
  management,
  membersDir,
  navigation,
  partners,
  popups,
  services,
  siteSettings,
  staticStatements,
  transactions,
} from './seed-data/site'

const RESET = process.argv.includes('--reset')
const SEEDED: CollectionSlug[] = [
  'transactions',
  'services',
  'pages',
  'team-members',
  'partners',
  'corporate-reports',
  'static-financial-statements',
  'announcements',
]
// No revalidation (no Next.js server here) and no change-log rows for the seed itself.
const context = { disableRevalidate: true, disableAudit: true }

async function main() {
  const payload = await getPayload({ config })
  const log = (msg: string) => payload.logger.info(`seed: ${msg}`)

  const existing = await payload.count({ collection: 'pages', overrideAccess: true })
  if (existing.totalDocs > 0 && !RESET) {
    log(`${existing.totalDocs} pages already exist. Run with --reset to replace seeded content.`)
    process.exit(1)
  }
  if (RESET) {
    for (const collection of SEEDED) {
      const { docs } = await payload.delete({ collection, where: { id: { exists: true } }, overrideAccess: true, context })
      log(`cleared ${collection} (${docs.length})`)
    }
  }

  // Rich text: HTML → Lexical with the site's own editor features (incl. tables).
  const editorConfig = await editorConfigFactory.fromEditor({ config: payload.config, editor })
  const toLexical = (html: string) => convertHTMLToLexical({ editorConfig, html, JSDOM })

  // ── Globals ────────────────────────────────────────────────────────────────
  const setGlobal = (slug: GlobalSlug, data: Record<string, unknown>) =>
    payload.updateGlobal({ slug, data, overrideAccess: true, context })

  await setGlobal('site-settings', siteSettings)
  await setGlobal('navigation', navigation)
  await setGlobal('footer', footer)
  await setGlobal('account-opening', accountOpening)
  await setGlobal('popups', {
    ...popups,
    notices: popups.notices.map(({ bodyHtml, ...notice }) => ({ ...notice, body: toLexical(bodyHtml) })),
  })
  log('globals: site settings, header menu, footer, account opening, homepage pop-ups')

  // ── Pages ──────────────────────────────────────────────────────────────────
  const pageIds = new Map<string, number | string>()
  for (const p of pages) {
    const layout = p.layout.map((block) => {
      if (block.blockType === 'richText' && typeof block.html === 'string') {
        const { html, ...rest } = block
        return { ...rest, content: toLexical(html as string) }
      }
      return block
    })
    if (p.legalHtml) {
      const html = fs.readFileSync(path.resolve('scripts/seed-data/legal', `${p.legalHtml}.html`), 'utf8')
      layout.unshift({ blockType: 'richText', content: toLexical(html) })
    }
    const doc = await payload.create({
      collection: 'pages',
      overrideAccess: true,
      context,
      data: {
        title: p.title,
        slug: p.slug,
        template: p.template ?? 'standard',
        hero: p.hero,
        layout,
        showContactBand: p.showContactBand ?? true,
        seo: p.seo,
      } as never,
    })
    pageIds.set(p.slug, doc.id)
  }
  log(`pages: ${pages.length}`)

  // ── Services and transactions ────────────────────────────────────────────
  const serviceIds = new Map<string, number | string>()
  for (const [i, s] of services.entries()) {
    const doc = await payload.create({
      collection: 'services',
      overrideAccess: true,
      context,
      data: { title: s.title, summary: s.summary, ctaLabel: s.ctaLabel, page: pageIds.get(s.page), order: (i + 1) * 10 } as never,
    })
    serviceIds.set(s.title, doc.id)
  }
  for (const [i, t] of transactions.entries()) {
    await payload.create({
      collection: 'transactions',
      overrideAccess: true,
      context,
      data: {
        client: t.client,
        year: t.year,
        practice: t.practice ? serviceIds.get(t.practice) : undefined,
        practiceLabel: t.practiceLabel,
        description: t.description,
        size: t.size,
        role: t.role,
        featured: true,
        order: (i + 1) * 10,
      } as never,
    })
  }
  log(`services: ${services.length}, transactions: ${transactions.length}`)

  // ── Team ───────────────────────────────────────────────────────────────────
  let order = 0
  for (const [group, people] of [['board', board], ['management', management]] as const) {
    for (const person of people) {
      order += 10
      await payload.create({
        collection: 'team-members',
        overrideAccess: true,
        context,
        data: {
          name: person.name,
          role: person.role,
          group,
          bio: person.bio,
          portraitPath: `${membersDir}${person.img}`,
          showOnHomepage: Boolean(person.home),
          order,
        } as never,
      })
    }
  }
  log(`team: ${board.length} board, ${management.length} management`)

  // ── Partners, reports, statements ────────────────────────────────────────
  for (const [i, p] of partners.entries()) {
    await payload.create({ collection: 'partners', overrideAccess: true, context, data: { name: p.name, logoPath: p.logoPath, order: (i + 1) * 10 } as never })
  }
  for (const [i, r] of corporateReports.entries()) {
    await payload.create({ collection: 'corporate-reports', overrideAccess: true, context, data: { title: r.title, path: r.path, order: (i + 1) * 10 } as never })
  }
  for (const s of staticStatements) {
    await payload.create({ collection: 'static-financial-statements', overrideAccess: true, context, data: s as never })
  }
  log(`partners: ${partners.length}, corporate reports: ${corporateReports.length}, statements: ${staticStatements.length}`)

  // ── Homepage last (its blocks read the lists above) ────────────────────────
  await setGlobal('homepage', homepage)
  log('homepage: 9 sections')

  log('done')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
