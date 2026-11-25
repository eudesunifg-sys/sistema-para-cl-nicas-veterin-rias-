'use server'

import type { AppRole } from '@/access/app-access'
import { appAuth } from '@/lib/app-auth'
import { getPayloadClient } from '@/lib/payload'

export type ActionResult = {
  ok: boolean
  message?: string
  error?: string
}

const VALID_SPECIES = new Set(['dog', 'cat', 'other'] as const)
const VALID_SEX = new Set(['female', 'male', 'unknown'] as const)
const VALID_SIZE = new Set(['small', 'medium', 'large'] as const)
const VALID_SERVICE = new Set([
  'consultation',
  'followup',
  'vaccination',
  'exam',
  'urgent',
] as const)
const VALID_APPOINTMENT_STATUS = new Set([
  'scheduled',
  'waiting',
  'in_progress',
  'completed',
  'cancelled',
] as const)

function textField(formData: FormData, key: string): string {
  const val = formData.get(key)
  return typeof val === 'string' ? val.trim() : ''
}

async function uploadOptionalPhoto(
  formData: FormData,
  fieldName: string,
  altText: string,
  user: NonNullable<Awaited<ReturnType<typeof appAuth.currentUser>>>,
): Promise<string | undefined> {
  const raw = formData.get(fieldName)
  if (!(raw instanceof File) || raw.size <= 0) return undefined
  if (raw.size > 6 * 1024 * 1024) {
    throw new Error('A imagem deve ter no máximo 6 MB.')
  }
  const bytes = Buffer.from(await raw.arrayBuffer())
  const payload = await getPayloadClient()
  const media = await payload.create({
    collection: 'media',
    draft: false,
    data: { alt: altText || 'Fotografia do animal no PetSOS' },
    file: {
      data: bytes,
      mimetype: raw.type || 'image/png',
      name: raw.name || 'pet-photo.png',
      size: raw.size,
    },
    overrideAccess: false,
    user,
  })
  return String(media.id)
}

export async function createPetAction(formData: FormData): Promise<ActionResult> {
  const user = await appAuth.currentUser()
  if (!user) return { ok: false, error: 'Sua sessão expirou. Faça login novamente.' }

  const name = textField(formData, 'name')
  const speciesRaw = textField(formData, 'species')
  const breed = textField(formData, 'breed')
  const sexRaw = textField(formData, 'sex')
  const sizeRaw = textField(formData, 'size')
  const birthDate = textField(formData, 'birthDate')
  const color = textField(formData, 'color')
  const weightRaw = textField(formData, 'weight')
  const microchip = textField(formData, 'microchip')
  const notes = textField(formData, 'notes')

  if (name.length < 2) return { ok: false, error: 'Informe o nome do animal.' }
  if (!VALID_SPECIES.has(speciesRaw as 'dog' | 'cat' | 'other')) {
    return { ok: false, error: 'Selecione uma espécie válida.' }
  }

  const weight = weightRaw ? Number(weightRaw.replace(',', '.')) : undefined
  if (weight !== undefined && (Number.isNaN(weight) || weight < 0 || weight > 150)) {
    return { ok: false, error: 'Informe um peso válido em kg.' }
  }

  try {
    const photoId = await uploadOptionalPhoto(formData, 'photo', `Foto de ${name}`, user)
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'pets',
      draft: false,
      data: {
        name,
        guardians: [user.id],
        species: speciesRaw as 'dog' | 'cat' | 'other',
        ...(photoId ? { photo: photoId } : {}),
        ...(breed ? { breed } : {}),
        ...(VALID_SEX.has(sexRaw as 'female' | 'male' | 'unknown')
          ? { sex: sexRaw as 'female' | 'male' | 'unknown' }
          : {}),
        ...(VALID_SIZE.has(sizeRaw as 'small' | 'medium' | 'large')
          ? { size: sizeRaw as 'small' | 'medium' | 'large' }
          : {}),
        ...(birthDate ? { birthDate: new Date(birthDate).toISOString() } : {}),
        ...(color ? { color } : {}),
        ...(weight !== undefined ? { weight } : {}),
        ...(microchip ? { microchip } : {}),
        ...(notes ? { notes } : {}),
      },
      overrideAccess: false,
      user,
    })
    return { ok: true, message: `${name} foi cadastrado com sucesso.` }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Não foi possível cadastrar o animal.',
    }
  }
}

export async function updatePetAction(formData: FormData): Promise<ActionResult> {
  const user = await appAuth.currentUser()
  if (!user) return { ok: false, error: 'Sua sessão expirou. Faça login novamente.' }

  const id = textField(formData, 'id')
  const name = textField(formData, 'name')
  const breed = textField(formData, 'breed')
  const color = textField(formData, 'color')
  const weightRaw = textField(formData, 'weight')
  const microchip = textField(formData, 'microchip')
  const notes = textField(formData, 'notes')
  const vaccineName = textField(formData, 'vaccineName')
  const vaccineDate = textField(formData, 'vaccineDate')
  const documentTitle = textField(formData, 'documentTitle')
  const documentSummary = textField(formData, 'documentSummary')

  if (!id) return { ok: false, error: 'Animal não identificado.' }

  try {
    const payload = await getPayloadClient()
    const existing = await payload.findByID({
      collection: 'pets',
      id,
      depth: 0,
      overrideAccess: false,
      user,
    })

    const weight = weightRaw ? Number(weightRaw.replace(',', '.')) : undefined
    const currentVaccinations = existing.vaccinations ?? []
    const currentDocuments = existing.documents ?? []

    await payload.update({
      collection: 'pets',
      id,
      draft: false,
      data: {
        ...(name.length >= 2 ? { name } : {}),
        breed: breed || null,
        color: color || null,
        microchip: microchip || null,
        notes: notes || null,
        ...(weight !== undefined && !Number.isNaN(weight) ? { weight } : {}),
        ...(vaccineName && vaccineDate
          ? {
              vaccinations: [
                ...currentVaccinations.map((v) => ({
                  vaccineName: v.vaccineName,
                  appliedAt: v.appliedAt,
                  nextDoseAt: v.nextDoseAt ?? null,
                  batch: v.batch ?? null,
                })),
                {
                  vaccineName,
                  appliedAt: new Date(vaccineDate).toISOString(),
                },
              ],
            }
          : {}),
        ...(documentTitle
          ? {
              documents: [
                ...currentDocuments.map((d) => ({
                  title: d.title,
                  category: d.category ?? 'exam',
                  recordedAt: d.recordedAt ?? null,
                  summary: d.summary ?? null,
                })),
                {
                  title: documentTitle,
                  category: 'exam',
                  recordedAt: new Date().toISOString(),
                  summary: documentSummary || null,
                },
              ],
            }
          : {}),
      },
      overrideAccess: false,
      user,
    })

    return { ok: true, message: 'Perfil do animal atualizado com sucesso.' }
  } catch {
    return { ok: false, error: 'Não foi possível atualizar os dados deste animal.' }
  }
}

export async function createAppointmentAction(formData: FormData): Promise<ActionResult> {
  const user = await appAuth.currentUser()
  if (!user) return { ok: false, error: 'Sua sessão expirou. Faça login novamente.' }

  const pet = textField(formData, 'pet')
  const scheduledAt = textField(formData, 'scheduledAt')
  const reason = textField(formData, 'reason')
  const serviceTypeRaw = textField(formData, 'serviceType') || 'consultation'
  const clinicalNotes = textField(formData, 'clinicalNotes')

  if (!pet) return { ok: false, error: 'Selecione um animal cadastrado.' }
  if (!scheduledAt) return { ok: false, error: 'Informe a data e o horário da consulta.' }
  if (reason.length < 3) return { ok: false, error: 'Descreva o motivo do atendimento.' }

  const serviceType = VALID_SERVICE.has(
    serviceTypeRaw as 'consultation' | 'followup' | 'vaccination' | 'exam' | 'urgent',
  )
    ? (serviceTypeRaw as 'consultation' | 'followup' | 'vaccination' | 'exam' | 'urgent')
    : 'consultation'

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'appointments',
      draft: false,
      data: {
        pet,
        tutor: user.id,
        scheduledAt: new Date(scheduledAt).toISOString(),
        reason,
        serviceType,
        status: 'scheduled',
        ...(clinicalNotes ? { clinicalNotes } : {}),
      },
      overrideAccess: false,
      user,
    })
    return { ok: true, message: 'Agendamento registrado com sucesso.' }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Não foi possível registrar a consulta.',
    }
  }
}

export async function updateClinicalRecordAction(formData: FormData): Promise<ActionResult> {
  const user = await appAuth.currentUser()
  if (!user) return { ok: false, error: 'Sua sessão expirou. Faça login novamente.' }

  const id = textField(formData, 'id')
  const statusRaw = textField(formData, 'status')
  const anamnesis = textField(formData, 'anamnesis')
  const physicalExam = textField(formData, 'physicalExam')
  const diagnosis = textField(formData, 'diagnosis')
  const prescription = textField(formData, 'prescription')
  const examsRequested = textField(formData, 'examsRequested')
  const examResults = textField(formData, 'examResults')
  const procedures = textField(formData, 'procedures')
  const clinicalNotes = textField(formData, 'clinicalNotes')

  if (!id) return { ok: false, error: 'Atendimento não identificado.' }

  try {
    const payload = await getPayloadClient()
    const role = (user.role ?? 'tutor') as AppRole
    const isStaff = role === 'veterinarian'

    if (!isStaff) {
      return {
        ok: false,
        error: 'Apenas médicos-veterinários podem alterar prontuários oficiais.',
      }
    }

    await payload.update({
      collection: 'appointments',
      id,
      draft: false,
      data: {
        ...(VALID_APPOINTMENT_STATUS.has(
          statusRaw as 'scheduled' | 'waiting' | 'in_progress' | 'completed' | 'cancelled',
        )
          ? {
              status: statusRaw as
                | 'scheduled'
                | 'waiting'
                | 'in_progress'
                | 'completed'
                | 'cancelled',
            }
          : {}),
        anamnesis: anamnesis || null,
        physicalExam: physicalExam || null,
        diagnosis: diagnosis || null,
        prescription: prescription || null,
        examsRequested: examsRequested || null,
        examResults: examResults || null,
        procedures: procedures || null,
        clinicalNotes: clinicalNotes || null,
      },
      overrideAccess: false,
      user,
    })
    return { ok: true, message: 'Prontuário e status atualizados com sucesso.' }
  } catch {
    return { ok: false, error: 'Não foi possível atualizar o prontuário.' }
  }
}

export async function createLostReportAction(formData: FormData): Promise<ActionResult> {
  const user = await appAuth.currentUser()
  if (!user) return { ok: false, error: 'Faça login para publicar uma ocorrência.' }

  const animalName = textField(formData, 'animalName')
  const situationRaw = textField(formData, 'situation')
  const speciesRaw = textField(formData, 'species')
  const breed = textField(formData, 'breed')
  const color = textField(formData, 'color')
  const sizeRaw = textField(formData, 'size')
  const city = textField(formData, 'city')
  const neighborhood = textField(formData, 'neighborhood')
  const approxReference = textField(formData, 'approxReference')
  const contactPhone = textField(formData, 'contactPhone')
  const occurredAt = textField(formData, 'occurredAt')
  const description = textField(formData, 'description')
  const pet = textField(formData, 'pet')

  if (animalName.length < 2) {
    return { ok: false, error: 'Informe o nome ou identificação do animal.' }
  }
  if (situationRaw !== 'lost' && situationRaw !== 'found') {
    return { ok: false, error: 'Selecione se o animal está perdido ou foi encontrado.' }
  }
  if (!VALID_SPECIES.has(speciesRaw as 'dog' | 'cat' | 'other')) {
    return { ok: false, error: 'Selecione a espécie.' }
  }
  if (!city || !neighborhood) {
    return { ok: false, error: 'Informe a cidade e o bairro aproximado.' }
  }
  if (!occurredAt) {
    return { ok: false, error: 'Informe a data da ocorrência.' }
  }
  if (description.length < 10) {
    return { ok: false, error: 'Descreva características e circunstâncias (mín. 10 caracteres).' }
  }

  try {
    const photoId = await uploadOptionalPhoto(
      formData,
      'photo',
      `Animal ${situationRaw === 'lost' ? 'perdido' : 'encontrado'}: ${animalName}`,
      user,
    )
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'lost-reports',
      draft: false,
      data: {
        owner: user.id,
        animalName,
        situation: situationRaw,
        species: speciesRaw as 'dog' | 'cat' | 'other',
        city,
        neighborhood,
        occurredAt: new Date(occurredAt).toISOString(),
        description,
        status: 'active',
        ...(photoId ? { photo: photoId } : {}),
        ...(pet ? { pet } : {}),
        ...(breed ? { breed } : {}),
        ...(color ? { color } : {}),
        ...(VALID_SIZE.has(sizeRaw as 'small' | 'medium' | 'large')
          ? { size: sizeRaw as 'small' | 'medium' | 'large' }
          : {}),
        ...(approxReference ? { approxReference } : {}),
        ...(contactPhone ? { contactPhone } : {}),
      },
      overrideAccess: false,
      user,
    })
    return { ok: true, message: 'Ocorrência publicada na Central de Busca do PetSOS.' }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Não foi possível publicar a ocorrência.',
    }
  }
}

export async function updateLostReportStatusAction(
  reportId: string,
  status: 'active' | 'reunited' | 'closed' | 'under_review',
): Promise<ActionResult> {
  const user = await appAuth.currentUser()
  if (!user) return { ok: false, error: 'Faça login para gerenciar ocorrências.' }

  try {
    const payload = await getPayloadClient()
    await payload.update({
      collection: 'lost-reports',
      id: reportId,
      draft: false,
      data: { status },
      overrideAccess: false,
      user,
    })
    const label =
      status === 'reunited'
        ? 'Que notícia boa! Ocorrência marcada como animal recuperado.'
        : status === 'closed'
          ? 'Ocorrência encerrada.'
          : 'Status da ocorrência atualizado.'
    return { ok: true, message: label }
  } catch {
    return { ok: false, error: 'Você não tem permissão para alterar esta ocorrência.' }
  }
}
