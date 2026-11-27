import type { Access, FieldAccess } from 'payload'

// Roles (plan §4): `admin` can do everything, `editor` manages content only.
type MaybeUser = { role?: string | null } | null | undefined

export const isAdminUser = (user: MaybeUser): boolean => user?.role === 'admin'
export const isStaffUser = (user: MaybeUser): boolean =>
  user?.role === 'admin' || user?.role === 'editor'

export const anyone: Access = () => true
export const staff: Access = ({ req: { user } }) => isStaffUser(user)
export const adminOnly: Access = ({ req: { user } }) => isAdminUser(user)
export const adminOnlyField: FieldAccess = ({ req: { user } }) => isAdminUser(user)

/** Users may read/update themselves; admins may read/update anyone. */
export const adminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (isAdminUser(user)) return true
  return { id: { equals: user.id } }
}
