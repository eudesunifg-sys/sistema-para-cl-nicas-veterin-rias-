import type { Access, CollectionConfig, Where } from 'payload'
import { getAppRole, isClinicStaffField } from '@/access/app-access'

const reportAccess: Access = ({ req }) => {
  if (req.user?.collection === 'admins') return true
  const role = getAppRole(req)
  if (role === 'administrator') return true
  if (req.user?.collection === 'users') return { owner: { equals: req.user.id } }
  return false
}

const publicOrOwnedRead: Access = ({ req }) => {
  if (req.user?.collection === 'admins') return true
  const role = getAppRole(req)
  if (role === 'administrator') return true

  if (req.user?.collection === 'users') {
    const visibleOrOwned: Where = {
      or: [{ owner: { equals: req.user.id } }, { status: { in: ['active', 'reunited'] } }],
    }
    return visibleOrOwned
  }

  const publicReports: Where = { status: { in: ['active', 'reunited'] } }
  return publicReports
}

export const LostReports: CollectionConfig = {
  slug: 'lost-reports',
  access: {
    create: ({ req }) => req.user?.collection === 'users',
    delete: reportAccess,
    read: publicOrOwnedRead,
    update: reportAccess,
  },
  admin: {
    defaultColumns: ['animalName', 'situation', 'city', 'occurredAt', 'status'],
    group: 'Proteção animal',
    useAsTitle: 'animalName',
  },
  hooks: {
    beforeChange: [
      ({ data, operation, originalDoc, req }) => {
        if (operation === 'create' && req.user?.collection === 'users') {
          data.owner = req.user.id
          data.status = 'active'
          data.flaggedCount = 0
        }
        if (operation === 'update' && req.user?.collection === 'users') {
          const role = getAppRole(req)
          const isStaff = role === 'administrator'
          if (!isStaff && data.status && data.status === 'under_review') {
            data.status = originalDoc?.status ?? 'active'
          }
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'owner', type: 'relationship', relationTo: 'users', required: true, index: true },
    { name: 'pet', type: 'relationship', relationTo: 'pets' },
    { name: 'animalName', type: 'text', required: true },
    {
      name: 'situation',
      type: 'select',
      required: true,
      options: [
        { label: 'Perdido', value: 'lost' },
        { label: 'Encontrado', value: 'found' },
      ],
      index: true,
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'species',
          type: 'select',
          required: true,
          options: [
            { label: 'Cão', value: 'dog' },
            { label: 'Gato', value: 'cat' },
            { label: 'Outro', value: 'other' },
          ],
        },
        { name: 'breed', type: 'text' },
        { name: 'color', type: 'text' },
        {
          name: 'size',
          type: 'select',
          options: [
            { label: 'Pequeno', value: 'small' },
            { label: 'Médio', value: 'medium' },
            { label: 'Grande', value: 'large' },
          ],
        },
      ],
    },
    { name: 'city', type: 'text', required: true, index: true },
    { name: 'neighborhood', type: 'text', required: true },
    { name: 'approxReference', type: 'text' },
    { name: 'contactPhone', type: 'text' },
    { name: 'occurredAt', type: 'date', required: true, index: true },
    { name: 'description', type: 'textarea', required: true },
    {
      name: 'flaggedCount',
      type: 'number',
      defaultValue: 0,
      min: 0,
      access: {
        create: isClinicStaffField,
        read: isClinicStaffField,
        update: isClinicStaffField,
      },
    },
    {
      name: 'flagReason',
      type: 'textarea',
      access: {
        create: isClinicStaffField,
        read: isClinicStaffField,
        update: isClinicStaffField,
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: [
        { label: 'Ativa', value: 'active' },
        { label: 'Reunido', value: 'reunited' },
        { label: 'Em revisão', value: 'under_review' },
        { label: 'Encerrada', value: 'closed' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
  versions: true,
}
