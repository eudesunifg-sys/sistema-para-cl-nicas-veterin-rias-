import type { CollectionConfig } from 'payload'
import { staffOrOwner } from '@/access/app-access'

export const Pets: CollectionConfig = {
  slug: 'pets',
  access: {
    create: ({ req }) => req.user?.collection === 'users' || req.user?.collection === 'admins',
    delete: staffOrOwner('guardians'),
    read: staffOrOwner('guardians'),
    update: staffOrOwner('guardians'),
  },
  admin: {
    defaultColumns: ['name', 'species', 'breed', 'guardians', 'updatedAt'],
    group: 'Clínica',
    useAsTitle: 'name',
  },
  hooks: {
    beforeChange: [
      ({ data, operation, req }) => {
        if (operation === 'create' && req.user?.collection === 'users') {
          const role = (req.user as { role?: string }).role ?? 'tutor'
          if (role === 'tutor') data.guardians = [req.user.id]
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'guardians',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      required: true,
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
        {
          name: 'sex',
          type: 'select',
          options: [
            { label: 'Fêmea', value: 'female' },
            { label: 'Macho', value: 'male' },
            { label: 'Não informado', value: 'unknown' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'birthDate', type: 'date' },
        {
          name: 'size',
          type: 'select',
          options: [
            { label: 'Pequeno', value: 'small' },
            { label: 'Médio', value: 'medium' },
            { label: 'Grande', value: 'large' },
          ],
        },
        { name: 'weight', type: 'number', min: 0 },
      ],
    },
    { name: 'color', type: 'text' },
    { name: 'microchip', type: 'text', index: true },
    { name: 'notes', type: 'textarea' },
    {
      name: 'vaccinations',
      type: 'array',
      fields: [
        { name: 'vaccineName', type: 'text', required: true },
        { name: 'appliedAt', type: 'date', required: true },
        { name: 'nextDoseAt', type: 'date' },
        { name: 'batch', type: 'text' },
      ],
    },
    {
      name: 'documents',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'category',
          type: 'select',
          defaultValue: 'exam',
          options: [
            { label: 'Exame laboratorial', value: 'exam' },
            { label: 'Imagem / Laudo', value: 'imaging' },
            { label: 'Receita / Atestado', value: 'prescription' },
            { label: 'Carteira vacinal', value: 'vaccine' },
          ],
        },
        { name: 'recordedAt', type: 'date' },
        { name: 'summary', type: 'textarea' },
      ],
    },
  ],
  versions: true,
}
