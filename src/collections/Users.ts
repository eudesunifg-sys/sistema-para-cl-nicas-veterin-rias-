import type { Access, CollectionConfig } from 'payload'

const isAppUserOrAdmin: Access = ({ req }) =>
  req.user?.collection === 'users' || req.user?.collection === 'admins'

const isOwnProfile: Access = ({ req }) => {
  if (req.user?.collection === 'admins') return true
  if (req.user?.collection !== 'users') return false
  if ((req.user as { role?: string }).role === 'administrator') return true

  return {
    id: {
      equals: req.user.id,
    },
  }
}

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    create: () => true,
    delete: ({ req }) =>
      req.user?.collection === 'admins' ||
      (req.user?.collection === 'users' &&
        (req.user as { role?: string }).role === 'administrator'),
    read: isOwnProfile,
    update: isOwnProfile,
    unlock: isAppUserOrAdmin,
  },
  admin: {
    defaultColumns: ['name', 'email', 'role', 'status', 'createdAt'],
    group: 'Pessoas',
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'tutor',
      options: [
        { label: 'Tutor', value: 'tutor' },
        { label: 'Veterinário', value: 'veterinarian' },
        { label: 'Administrador', value: 'administrator' },
      ],
      access: {
        create: ({ req }) =>
          req.user?.collection === 'admins' ||
          (req.user?.collection === 'users' &&
            (req.user as { role?: string }).role === 'administrator'),
        update: ({ req }) =>
          req.user?.collection === 'admins' ||
          (req.user?.collection === 'users' &&
            (req.user as { role?: string }).role === 'administrator'),
      },
      admin: {
        position: 'sidebar',
      },
      saveToJWT: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Ativo', value: 'active' },
        { label: 'Inativo', value: 'inactive' },
      ],
      access: {
        create: ({ req }) =>
          req.user?.collection === 'admins' ||
          (req.user?.collection === 'users' &&
            (req.user as { role?: string }).role === 'administrator'),
        update: ({ req }) =>
          req.user?.collection === 'admins' ||
          (req.user?.collection === 'users' &&
            (req.user as { role?: string }).role === 'administrator'),
      },
      admin: {
        position: 'sidebar',
      },
      saveToJWT: true,
    },
  ],
  versions: false,
}
