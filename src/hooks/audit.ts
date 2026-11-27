import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

/**
 * Change log (plan §4): records who changed what and when in the `audit-log` collection.
 * Writes use overrideAccess because audit-log is read-only for everyone in the admin.
 */
type Action = 'create' | 'update' | 'delete'

async function write(
  req: Parameters<CollectionAfterChangeHook>[0]['req'],
  entry: { target: string; itemId?: string; itemTitle?: string; action: Action },
) {
  if (req.context?.disableAudit) return
  try {
    await req.payload.create({
      collection: 'audit-log',
      overrideAccess: true,
      req,
      data: {
        ...entry,
        user: req.user && req.user.collection === 'users' ? req.user.id : undefined,
        userEmail: req.user && 'email' in req.user ? String(req.user.email) : 'system',
      },
    })
  } catch (err) {
    req.payload.logger.error({ err, msg: 'audit-log write failed' })
  }
}

const titleOf = (doc: Record<string, unknown>) =>
  String(doc.title ?? doc.name ?? doc.label ?? doc.email ?? doc.filename ?? doc.client ?? doc.id ?? '')

export const auditCollection: CollectionAfterChangeHook = async ({ collection, doc, operation, req }) => {
  await write(req, {
    target: collection.slug,
    itemId: String(doc.id),
    itemTitle: titleOf(doc),
    action: operation === 'create' ? 'create' : 'update',
  })
  return doc
}

export const auditCollectionDelete: CollectionAfterDeleteHook = async ({ collection, doc, req }) => {
  await write(req, { target: collection.slug, itemId: String(doc.id), itemTitle: titleOf(doc), action: 'delete' })
  return doc
}

export const auditGlobal: GlobalAfterChangeHook = async ({ global, doc, req }) => {
  await write(req, { target: `global:${global.slug}`, action: 'update' })
  return doc
}
