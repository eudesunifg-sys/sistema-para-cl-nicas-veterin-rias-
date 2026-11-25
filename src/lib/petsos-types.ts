export type SerializedPet = {
  id: string
  name: string
  species: 'dog' | 'cat' | 'other'
  breed: string
  sex: string
  size: string
  birthDate: string
  weight: number | null
  color: string
  microchip: string
  notes: string
  photoUrl: string | null
  guardianNames: string[]
  vaccinations: Array<{
    vaccineName: string
    appliedAt: string
    nextDoseAt: string | null
    batch: string | null
  }>
  documents: Array<{
    title: string
    category: string
    recordedAt: string | null
    summary: string | null
  }>
}

export type SerializedAppointment = {
  id: string
  scheduledAt: string
  petId: string
  petName: string
  tutorName: string
  reason: string
  serviceType: string
  status: 'scheduled' | 'waiting' | 'in_progress' | 'completed' | 'cancelled'
  anamnesis: string
  physicalExam: string
  clinicalNotes: string
  diagnosis: string
  prescription: string
  examsRequested: string
  examResults: string
  procedures: string
}

export type SerializedLostReport = {
  id: string
  isOwned: boolean
  animalName: string
  situation: 'lost' | 'found'
  species: 'dog' | 'cat' | 'other'
  breed: string
  color: string
  size: string
  city: string
  neighborhood: string
  approxReference: string
  contactPhone: string
  occurredAt: string
  description: string
  status: 'active' | 'reunited' | 'under_review' | 'closed'
  photoUrl: string | null
}

export type SerializedUserRow = {
  id: string
  name: string
  email: string
  role: string
  status: string
  createdAt: string
}
