import type { Access, CollectionConfig } from 'payload'
import { getAppRole, isClinicStaff, isClinicStaffField, staffOrOwner } from '@/access/app-access'

const canCreateAppointment: Access = ({ req }) => {
  if (req.user?.collection === 'admins') return true
  const role = getAppRole(req)
  return role === 'tutor' || role === 'administrator'
}

export const Appointments: CollectionConfig = {
  slug: 'appointments',
  access: {
    create: canCreateAppointment,
    delete: isClinicStaff,
    read: staffOrOwner('tutor'),
    update: isClinicStaff,
  },
  admin: {
    defaultColumns: ['scheduledAt', 'pet', 'tutor', 'veterinarian', 'status'],
    group: 'Clínica',
    useAsTitle: 'reason',
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation === 'create' && req.user?.collection === 'users') {
          const role = getAppRole(req)
          if (role === 'tutor') {
            data.tutor = req.user.id
            data.status = 'scheduled'
            if (data.pet) {
              const petId = typeof data.pet === 'object' ? data.pet.id : data.pet
              const owned = await req.payload.count({
                collection: 'pets',
                overrideAccess: false,
                req,
                user: req.user,
                where: {
                  and: [{ id: { equals: petId } }, { guardians: { equals: req.user.id } }],
                },
              })
              if (owned.totalDocs === 0) {
                throw new Error('Selecione um animal vinculado à sua conta.')
              }
            }
          }
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'scheduledAt', type: 'date', required: true, index: true },
    {
      name: 'pet',
      type: 'relationship',
      relationTo: 'pets',
      required: true,
      filterOptions: ({ user }) => {
        if (!user || user.collection !== 'users') return true
        const role = (user as { role?: string }).role ?? 'tutor'
        if (role !== 'tutor') return true
        return { guardians: { equals: user.id } }
      },
    },
    { name: 'tutor', type: 'relationship', relationTo: 'users', required: true, index: true },
    { name: 'veterinarian', type: 'relationship', relationTo: 'users' },
    { name: 'reason', type: 'text', required: true },
    {
      name: 'serviceType',
      type: 'select',
      defaultValue: 'consultation',
      options: [
        { label: 'Consulta clínica', value: 'consultation' },
        { label: 'Retorno', value: 'followup' },
        { label: 'Vacinação', value: 'vaccination' },
        { label: 'Exame / Check-up', value: 'exam' },
        { label: 'Urgência / Triagem', value: 'urgent' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'scheduled',
      access: {
        create: isClinicStaffField,
        update: isClinicStaffField,
      },
      options: [
        { label: 'Agendada', value: 'scheduled' },
        { label: 'Aguardando', value: 'waiting' },
        { label: 'Em atendimento', value: 'in_progress' },
        { label: 'Finalizada', value: 'completed' },
        { label: 'Cancelada', value: 'cancelled' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'anamnesis', type: 'textarea', access: { update: isClinicStaffField } },
    { name: 'physicalExam', type: 'textarea', access: { update: isClinicStaffField } },
    { name: 'clinicalNotes', type: 'textarea' },
    { name: 'diagnosis', type: 'textarea', access: { update: isClinicStaffField } },
    { name: 'prescription', type: 'textarea', access: { update: isClinicStaffField } },
    { name: 'examsRequested', type: 'textarea', access: { update: isClinicStaffField } },
    { name: 'examResults', type: 'textarea', access: { update: isClinicStaffField } },
    { name: 'procedures', type: 'textarea', access: { update: isClinicStaffField } },
  ],
  versions: true,
}
