import 'server-only'

import type { User } from '@/payload-types'
import { getPayloadClient } from '@/lib/payload'
import type {
  SerializedAppointment,
  SerializedLostReport,
  SerializedPet,
  SerializedUserRow,
} from '@/lib/petsos-types'

export async function loadSystemSnapshot(user: User & { collection: 'users' }) {
  const payload = await getPayloadClient()

  const [petsRes, appointmentsRes, lostRes, usersRes] = await Promise.all([
    payload.find({
      collection: 'pets',
      depth: 1,
      limit: 50,
      overrideAccess: false,
      sort: '-updatedAt',
      user,
    }),
    payload.find({
      collection: 'appointments',
      depth: 1,
      limit: 50,
      overrideAccess: false,
      sort: 'scheduledAt',
      user,
    }),
    payload.find({
      collection: 'lost-reports',
      depth: 1,
      limit: 50,
      overrideAccess: false,
      sort: '-occurredAt',
      user,
    }),
    payload.find({
      collection: 'users',
      depth: 0,
      limit: 50,
      overrideAccess: false,
      sort: '-createdAt',
      user,
    }),
  ])

  const pets: SerializedPet[] = petsRes.docs.map((p) => ({
    id: String(p.id),
    name: p.name,
    species: p.species,
    breed: p.breed ?? '',
    sex: p.sex ?? 'unknown',
    size: p.size ?? '',
    birthDate: p.birthDate ?? '',
    weight: typeof p.weight === 'number' ? p.weight : null,
    color: p.color ?? '',
    microchip: p.microchip ?? '',
    notes: p.notes ?? '',
    photoUrl: typeof p.photo === 'object' && p.photo?.url ? p.photo.url : null,
    guardianNames: (p.guardians ?? []).map((g) =>
      typeof g === 'object' && g !== null && 'name' in g ? String(g.name) : 'Responsável',
    ),
    vaccinations: (p.vaccinations ?? []).map((v) => ({
      vaccineName: v.vaccineName,
      appliedAt: v.appliedAt,
      nextDoseAt: v.nextDoseAt ?? null,
      batch: v.batch ?? null,
    })),
    documents: (p.documents ?? []).map((d) => ({
      title: d.title,
      category: d.category ?? 'exam',
      recordedAt: d.recordedAt ?? null,
      summary: d.summary ?? null,
    })),
  }))

  const appointments: SerializedAppointment[] = appointmentsRes.docs.map((a) => ({
    id: String(a.id),
    scheduledAt: a.scheduledAt,
    petId: typeof a.pet === 'object' && a.pet !== null ? String(a.pet.id) : String(a.pet),
    petName: typeof a.pet === 'object' && a.pet !== null ? a.pet.name : 'Paciente',
    tutorName:
      typeof a.tutor === 'object' && a.tutor !== null && 'name' in a.tutor
        ? String(a.tutor.name)
        : 'Tutor',
    reason: a.reason,
    serviceType: a.serviceType ?? 'consultation',
    status: a.status,
    anamnesis: a.anamnesis ?? '',
    physicalExam: a.physicalExam ?? '',
    clinicalNotes: a.clinicalNotes ?? '',
    diagnosis: a.diagnosis ?? '',
    prescription: a.prescription ?? '',
    examsRequested: a.examsRequested ?? '',
    examResults: a.examResults ?? '',
    procedures: a.procedures ?? '',
  }))

  const lostReports: SerializedLostReport[] = lostRes.docs.map((r) => {
    const ownerId =
      typeof r.owner === 'object' && r.owner !== null ? String(r.owner.id) : String(r.owner)
    return {
      id: String(r.id),
      isOwned: ownerId === String(user.id),
      animalName: r.animalName,
      situation: r.situation,
      species: r.species,
      breed: r.breed ?? '',
      color: r.color ?? '',
      size: r.size ?? '',
      city: r.city,
      neighborhood: r.neighborhood,
      approxReference: r.approxReference ?? '',
      contactPhone: r.contactPhone ?? '',
      occurredAt: r.occurredAt,
      description: r.description,
      status: r.status,
      photoUrl: typeof r.photo === 'object' && r.photo?.url ? r.photo.url : null,
    }
  })

  const userRows: SerializedUserRow[] = usersRes.docs.map((u) => ({
    id: String(u.id),
    name: u.name,
    email: u.email,
    role: u.role ?? 'tutor',
    status: u.status ?? 'active',
    createdAt: u.createdAt,
  }))

  return {
    counts: {
      appointments: appointmentsRes.totalDocs,
      lostReports: lostRes.totalDocs,
      pets: petsRes.totalDocs,
      users: usersRes.totalDocs,
    },
    pets,
    appointments,
    lostReports,
    userRows,
  }
}
