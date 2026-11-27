import 'server-only'

import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload, type CollectionSlug, type Where } from 'payload'

import { cmsTag } from '@/hooks/revalidate'
import type { Config, Page } from '@/payload-types'

/**
 * CMS reads for public pages, via Payload's Local API (no HTTP hop).
 * Cached under `cms:<slug>` tags; Payload hooks revalidate them on save, so
 * edits are live immediately (plan §4 "Publishing").
 */
export const payload = () => getPayload({ config })

type GlobalSlug = keyof Config['globals']

export const getGlobal = <T extends GlobalSlug>(slug: T, depth = 2) =>
  unstable_cache(
    async () => (await payload()).findGlobal({ slug, depth }) as Promise<Config['globals'][T]>,
    ['cms', 'global', slug, String(depth)],
    { tags: [cmsTag(slug), 'cms:layout'] },
  )()

type DocsOptions = { where?: Where; sort?: string; limit?: number; depth?: number }

/** All documents of a collection (lists are small: team, services, statements, …). */
export const getDocs = <T extends CollectionSlug>(collection: T, opts: DocsOptions = {}) =>
  unstable_cache(
    async () => {
      const res = await (await payload()).find({
        collection,
        where: opts.where,
        sort: opts.sort ?? 'order',
        limit: opts.limit ?? 500,
        depth: opts.depth ?? 1,
        pagination: false,
      })
      return res.docs as Config['collections'][T][]
    },
    ['cms', 'docs', collection, JSON.stringify(opts)],
    { tags: [cmsTag(collection)] },
  )()

export const getPage = (slug: string) =>
  unstable_cache(
    async (): Promise<Page | null> => {
      const res = await (await payload()).find({
        collection: 'pages',
        where: { slug: { equals: slug } },
        depth: 2,
        limit: 1,
        pagination: false,
      })
      return res.docs[0] ?? null
    },
    ['cms', 'page', slug],
    // Pages render shared lists (team, partners, account-opening steps) too.
    { tags: [cmsTag('pages'), cmsTag('team-members'), cmsTag('account-opening'), cmsTag('media')] },
  )()

/** Slugs of all CMS pages (for the sitemap and static params). */
export const getPageSlugs = () =>
  unstable_cache(
    async () => {
      const res = await (await payload()).find({ collection: 'pages', depth: 0, limit: 500, pagination: false, select: { slug: true } })
      return res.docs.map((d) => d.slug as string)
    },
    ['cms', 'page-slugs'],
    { tags: [cmsTag('pages')] },
  )()
