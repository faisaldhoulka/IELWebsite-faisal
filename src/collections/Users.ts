import type { CollectionConfig } from 'payload'

import { adminOnly, adminOnlyField, adminOrSelf } from '../access'
import { auditCollection, auditCollectionDelete } from '../hooks/audit'

// Named IEL staff only: no public sign-up (create is admin-only).
export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Admin',
  },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000, // 15 minutes
    tokenExpiration: 8 * 60 * 60, // 8 hours
    cookies: { sameSite: 'Lax', secure: process.env.NODE_ENV === 'production' },
  },
  access: {
    // Admin panel access for staff roles only.
    admin: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
    read: adminOrSelf,
    create: adminOnly,
    update: adminOrSelf,
    delete: adminOnly,
  },
  hooks: {
    // The very first account (created on /admin/create-first-user) is always an admin,
    // otherwise nobody could manage users.
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data
        const { totalDocs } = await req.payload.count({ collection: 'users', overrideAccess: true, req })
        return totalDocs === 0 ? { ...data, role: 'admin' } : data
      },
    ],
    afterChange: [auditCollection],
    afterDelete: [auditCollectionDelete],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      saveToJWT: true,
      options: [
        { label: 'Admin (everything, incl. users and settings)', value: 'admin' },
        { label: 'Editor (content only)', value: 'editor' },
      ],
      access: { create: adminOnlyField, update: adminOnlyField },
    },
  ],
}
