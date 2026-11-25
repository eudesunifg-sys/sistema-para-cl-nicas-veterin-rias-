import type { Access, FieldAccess, PayloadRequest } from 'payload'

export type AppRole = 'tutor' | 'veterinarian' | 'administrator'

export function getAppRole(req: PayloadRequest): AppRole | null {
  if (req.user?.collection !== 'users') return null
  return (req.user as { role?: AppRole }).role ?? 'tutor'
}

export const isCmsAdmin: Access = ({ req }) => req.user?.collection === 'admins'

export const isClinicStaff: Access = ({ req }) => {
  if (req.user?.collection === 'admins') return true
  return getAppRole(req) === 'veterinarian'
}

export const isClinicStaffField: FieldAccess = ({ req }) => {
  if (req.user?.collection === 'admins') return true
  return getAppRole(req) === 'veterinarian'
}

export const isAppAdministrator: Access = ({ req }) => {
  if (req.user?.collection === 'admins') return true
  return getAppRole(req) === 'administrator'
}

export function staffOrOwner(ownerField: string): Access {
  return ({ req }) => {
    if (req.user?.collection === 'admins') return true

    const role = getAppRole(req)
    if (role === 'veterinarian' || role === 'administrator') {
      return true
    }

    if (req.user?.collection !== 'users') return false
    return { [ownerField]: { equals: req.user.id } }
  }
}
