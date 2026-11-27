import type { CollectionConfig } from 'payload'

import { adminOnly } from '../access'

// Written only by hooks (src/hooks/audit.ts); read-only for admins in the panel.
export const AuditLog: CollectionConfig = {
  slug: 'audit-log',
  labels: { singular: 'Change', plural: 'Change log' },
  admin: {
    group: 'Admin',
    useAsTitle: 'itemTitle',
    defaultColumns: ['createdAt', 'userEmail', 'action', 'target', 'itemTitle'],
  },
  access: {
    read: adminOnly,
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  defaultSort: '-createdAt',
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users' },
    { name: 'userEmail', type: 'text' },
    { name: 'action', type: 'select', required: true, options: ['create', 'update', 'delete'] },
    { name: 'target', type: 'text', required: true, admin: { description: 'Collection or global changed' } },
    { name: 'itemId', type: 'text' },
    { name: 'itemTitle', type: 'text' },
  ],
}
