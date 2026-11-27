import type { CollectionConfig, GlobalConfig } from 'payload'

import { anyone, staff } from '../access'
import { auditCollection, auditCollectionDelete, auditGlobal } from '../hooks/audit'
import { revalidateCollection, revalidateCollectionDelete, revalidateGlobal } from '../hooks/revalidate'

/**
 * Standard content collection: public read, staff write, audit log and publish-on-save.
 * `extraTags` lets a collection also refresh pages that embed it (e.g. the homepage).
 */
export function contentCollection(config: CollectionConfig, extraTags: string[] = []): CollectionConfig {
  return {
    ...config,
    access: {
      read: anyone,
      create: staff,
      update: staff,
      delete: staff,
      ...config.access,
    },
    hooks: {
      ...config.hooks,
      afterChange: [...(config.hooks?.afterChange ?? []), revalidateCollection(extraTags), auditCollection],
      afterDelete: [...(config.hooks?.afterDelete ?? []), revalidateCollectionDelete(extraTags), auditCollectionDelete],
    },
  }
}

/** Standard global: public read, staff write (unless overridden), audit log and publish-on-save. */
export function contentGlobal(config: GlobalConfig, extraTags: string[] = []): GlobalConfig {
  return {
    ...config,
    access: { read: anyone, update: staff, ...config.access },
    hooks: {
      ...config.hooks,
      afterChange: [...(config.hooks?.afterChange ?? []), revalidateGlobal(extraTags), auditGlobal],
    },
  }
}
