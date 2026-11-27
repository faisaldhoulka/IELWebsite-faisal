import { revalidateTag } from 'next/cache'
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

/**
 * Publish-on-save (plan §4): after a CMS change, drop the cached data for the
 * affected tags so the public pages show it on the next request.
 * Public pages fetch CMS data with `cmsTag(slug)` tags (see src/lib/cms.ts).
 */
export const cmsTag = (slug: string) => `cms:${slug}`

function safeRevalidate(tags: string[]) {
  for (const tag of tags) {
    try {
      // 'max' = stale-while-revalidate semantics in Next 16.
      revalidateTag(tag, 'max')
    } catch {
      // Outside a Next.js request (e.g. the seed script) there is no cache to revalidate.
    }
  }
}

export const revalidateCollection =
  (extraTags: string[] = []): CollectionAfterChangeHook =>
  ({ collection, doc, req }) => {
    if (!req.context?.disableRevalidate) safeRevalidate([cmsTag(collection.slug), ...extraTags])
    return doc
  }

export const revalidateCollectionDelete =
  (extraTags: string[] = []): CollectionAfterDeleteHook =>
  ({ collection, doc, req }) => {
    if (!req.context?.disableRevalidate) safeRevalidate([cmsTag(collection.slug), ...extraTags])
    return doc
  }

export const revalidateGlobal =
  (extraTags: string[] = []): GlobalAfterChangeHook =>
  ({ global, doc, req }) => {
    if (!req.context?.disableRevalidate) safeRevalidate([cmsTag(global.slug), ...extraTags])
    return doc
  }
