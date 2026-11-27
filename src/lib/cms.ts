import 'server-only'

import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

import { cmsTag } from '@/hooks/revalidate'

/**
 * CMS reads for public pages, via Payload's Local API (no HTTP hop).
 * Cached under `cms:<slug>` tags; Payload hooks revalidate them on save, so
 * edits are live immediately (plan §4 "Publishing").
 */
export const payload = () => getPayload({ config })

export const getGlobal = <T extends 'homepage' | 'navigation' | 'footer' | 'site-settings'>(slug: T, depth = 2) =>
  unstable_cache(
    async () => (await payload()).findGlobal({ slug, depth }),
    ['cms', 'global', slug, String(depth)],
    { tags: [cmsTag(slug), 'cms:layout'] },
  )()
