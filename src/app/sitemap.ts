import type { MetadataRoute } from 'next'

import { getPageSlugs } from '@/lib/cms'
import { getBlogs } from '@/lib/supabase-data'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://iel.net.pk').replace(/\/$/, '')

// Pages built in code (live data); CMS pages and Learn articles are added below.
const CODED = ['/research', '/news', '/financial-statements', '/corporate-reports']

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getPageSlugs()
  let articles: string[] = []
  try {
    articles = (await getBlogs()).map((b) => `/learn/${encodeURIComponent(b.id)}`)
  } catch {
    // Supabase unavailable: the sitemap still lists every other page.
  }
  const paths = ['/', ...slugs.map((s) => `/${s}`), ...CODED, ...articles]
  return [...new Set(paths)].map((p) => ({ url: `${SITE_URL}${p === '/' ? '' : p}`, changeFrequency: 'weekly', priority: p === '/' ? 1 : 0.6 }))
}
