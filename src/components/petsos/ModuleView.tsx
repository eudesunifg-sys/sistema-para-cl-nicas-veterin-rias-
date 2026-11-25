'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState, useTransition } from 'react'
import type { AppRole } from '@/access/app-access'
import {
  createAppointmentAction,
  createLostReportAction,
  createPetAction,
  updateClinicalRecordAction,
  updateLostReportStatusAction,
  updatePetAction,
} from '@/app/(frontend)/sistema/system-actions'
import { Icon, type IconName } from '@/components/petsos/Icon'
import type {
  SerializedAppointment,
  SerializedLostReport,
  SerializedPet,
  SerializedUserRow,
} from '@/lib/petsos-types'

type SectionConfig = {
  title: string
  eyebrow: string
  description: string
  action: string
  icon: IconName
}

const sections: Record<string, SectionConfig> = {
  agenda: {
    action: 'Novo agendamento',
    description: 'Agenda da clínica com visualização diária, semanal e mensal.',
    eyebrow: 'Gestão veterinária',
    icon: 'calendar',
    title: 'Agenda clínica',
  },
  animais: {
    action: 'Cadastrar animal',
    description: 'Listagem, cadastro completo, perfil, vacinação, exames e responsáveis.',
    eyebrow: 'Gestão de animais',
    icon: 'paw',
    title: 'Meus animais',
  },
  auditoria: {
    action: 'Atualizar registros',
    description: 'Histórico cronológico de atividades operacionais e conformidade.',
    eyebrow: 'Governança & segurança',
    icon: 'shield',
    title: 'Histórico de atividades e auditoria',
  },
  configuracoes: {
    action: 'Salvar configurações',
    description: 'Dados institucionais, horários de funcionamento e parâmetros da clínica.',
    eyebrow: 'Administração',
    icon: 'settings',
    title: 'Configurações da clínica',
  },
  consultas: {
    action: 'Agendar consulta',
    description: 'Gerencie agendamentos, retornos, vacinações e detalhes das consultas.',
    eyebrow: 'Cuidado veterinário',
    icon: 'calendar',
    title: 'Consultas e agendamentos',
  },
  equipe: {
    action: 'Convidar profissional',
    description: 'Gerenciamento de médicos-veterinários, especialidades e escalas.',
    eyebrow: 'Corpo clínico',
    icon: 'briefcase',
    title: 'Veterinários',
  },
  estoque: {
    action: 'Registrar insumo',
    description: 'Controle de vacinas, medicamentos, materiais clínicos e estoque mínimo.',
    eyebrow: 'Operação',
    icon: 'box',
    title: 'Gerenciamento de estoque',
  },
  exames: {
    action: 'Solicitar exame',
    description: 'Solicitações laboratoriais, exames de imagem e resultados por paciente.',
    eyebrow: 'Diagnóstico',
    icon: 'syringe',
    title: 'Solicitação e resultados de exames',
  },
  fila: {
    action: 'Novo atendimento',
    description: 'Acompanhamento de pacientes aguardando triagem, em consultório e finalizados.',
    eyebrow: 'Fluxo clínico',
    icon: 'clock',
    title: 'Fila de atendimento',
  },
  financeiro: {
    action: 'Novo lançamento',
    description: 'Receitas de consultas, procedimentos, exames e despesas operacionais.',
    eyebrow: 'Administração',
    icon: 'chart',
    title: 'Controle financeiro',
  },
  mensagens: {
    action: 'Iniciar conversa',
    description: 'Comunicação entre tutores, clínica e pessoas que encontraram animais.',
    eyebrow: 'Comunicação',
    icon: 'message',
    title: 'Lista de conversas e chat',
  },
  notificacoes: {
    action: 'Preferências',
    description: 'Avisos de consultas, vacinas, exames e possíveis correspondências de animais.',
    eyebrow: 'Central de notificações',
    icon: 'bell',
    title: 'Notificações e preferências',
  },
  ocorrencias: {
    action: 'Publicar ocorrência',
    description: 'Gerencie publicações de animais perdidos e encontrados, mapa e correspondências.',
    eyebrow: 'Proteção animal',
    icon: 'search',
    title: 'Busca de animais perdidos e encontrados',
  },
  pacientes: {
    action: 'Cadastrar paciente',
    description: 'Lista de pacientes da clínica com acesso ao perfil e prontuário completo.',
    eyebrow: 'Clínica veterinária',
    icon: 'paw',
    title: 'Lista de pacientes',
  },
  prontuarios: {
    action: 'Registrar atendimento',
    description:
      'Anamnese, exame clínico, diagnóstico, prescrição, vacinação, procedimentos e alta.',
    eyebrow: 'Prontuário eletrônico',
    icon: 'file',
    title: 'Prontuário eletrônico completo',
  },
  relatorios: {
    action: 'Exportar resumo',
    description: 'Indicadores reais da clínica, atendimentos realizados e rede de reencontros.',
    eyebrow: 'Gestão por indicadores',
    icon: 'chart',
    title: 'Relatórios e indicadores',
  },
  servicos: {
    action: 'Novo serviço',
    description: 'Cadastro e organização dos serviços veterinários, vacinas e exames oferecidos.',
    eyebrow: 'Catálogo clínico',
    icon: 'stethoscope',
    title: 'Serviços da clínica',
  },
  usuarios: {
    action: 'Gerenciar acessos',
    description: 'Tutores, veterinários e administradores cadastrados.',
    eyebrow: 'Administração',
    icon: 'users',
    title: 'Gerenciamento de usuários',
  },
}

const speciesMap: Record<string, string> = { dog: 'Cão', cat: 'Gato', other: 'Outro' }
const sizeMap: Record<string, string> = { small: 'Pequeno', medium: 'Médio', large: 'Grande' }
const sexMap: Record<string, string> = {
  female: 'Fêmea',
  male: 'Macho',
  unknown: 'Não informado',
}
const statusMap: Record<string, { label: string; cls: string }> = {
  scheduled: { label: 'Agendada', cls: 'bg-[#62B9E8]/18 text-[#287BA8]' },
  waiting: { label: 'Aguardando', cls: 'bg-[#F4B96A]/25 text-[#966A25]' },
  in_progress: { label: 'Em atendimento', cls: 'bg-[#1C7774]/16 text-[#155F5D]' },
  completed: { label: 'Finalizada', cls: 'bg-[#123F3E]/10 text-[#123F3E]' },
  cancelled: { label: 'Cancelada', cls: 'bg-[#C9634C]/15 text-[#9A3F2B]' },
}

export function ModuleView({
  appointments,
  lostReports,
  pets,
  role,
  section,
  userRows,
}: {
  appointments: SerializedAppointment[]
  lostReports: SerializedLostReport[]
  pets: SerializedPet[]
  role: AppRole
  section: string
  userRows: SerializedUserRow[]
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)
  const [search, setSearch] = useState('')

  // Modals & local UI state
  const [showPetForm, setShowPetForm] = useState(false)
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null)
  const [petProfileTab, setPetProfileTab] = useState<
    'info' | 'historico' | 'vacinas' | 'documentos' | 'responsaveis'
  >('info')

  const [showAppointmentForm, setShowAppointmentForm] = useState(false)
  const [calendarScale, setCalendarScale] = useState<'diaria' | 'semanal' | 'mensal'>('semanal')
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(
    appointments[0]?.id ?? null,
  )

  const [lostFormMode, setLostFormMode] = useState<'none' | 'lost' | 'found'>('none')
  const [lostTab, setLostTab] = useState<'todas' | 'minhas' | 'correspondencias' | 'mapa'>('todas')

  // Notifications & Messages state
  const [notifTab, setNotifTab] = useState<'central' | 'preferencias'>('central')
  const [chatMessage, setChatMessage] = useState('')
  const [chatLog, setChatLog] = useState<Array<{ sender: string; text: string; time: string }>>([])

  // Admin session-local catalog items (starts empty - no fake items!)
  const [localEntries, setLocalEntries] = useState<
    Array<{ id: string; col1: string; col2: string; col3: string }>
  >([])
  const [showLocalModal, setShowLocalModal] = useState(false)

  const config = sections[section] ?? sections.prontuarios
  const selectedPet = useMemo(
    () => pets.find((p) => p.id === selectedPetId) ?? null,
    [pets, selectedPetId],
  )
  const selectedAppointment = useMemo(
    () => appointments.find((a) => a.id === selectedAppointmentId) ?? appointments[0] ?? null,
    [appointments, selectedAppointmentId],
  )

  const filteredPets = useMemo(
    () =>
      pets.filter(
        (p) =>
          !search ||
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.breed.toLowerCase().includes(search.toLowerCase()),
      ),
    [pets, search],
  )

  const matches = useMemo(() => {
    const lost = lostReports.filter((r) => r.situation === 'lost')
    const found = lostReports.filter((r) => r.situation === 'found')
    return lost.flatMap((l) =>
      found
        .filter((f) => f.species === l.species && f.city.toLowerCase() === l.city.toLowerCase())
        .map((f) => ({ lost: l, found: f })),
    )
  }, [lostReports])

  function handleCreatePet(formData: FormData) {
    setFeedback(null)
    startTransition(async () => {
      const res = await createPetAction(formData)
      if (res.ok) {
        setShowPetForm(false)
        setFeedback({ kind: 'ok', text: res.message || 'Animal cadastrado!' })
        router.refresh()
      } else {
        setFeedback({ kind: 'err', text: res.error || 'Erro ao cadastrar animal.' })
      }
    })
  }

  function handleUpdatePet(formData: FormData) {
    setFeedback(null)
    startTransition(async () => {
      const res = await updatePetAction(formData)
      if (res.ok) {
        setFeedback({ kind: 'ok', text: res.message || 'Dados atualizados!' })
        router.refresh()
      } else {
        setFeedback({ kind: 'err', text: res.error || 'Erro ao atualizar.' })
      }
    })
  }

  function handleCreateAppointment(formData: FormData) {
    setFeedback(null)
    startTransition(async () => {
      const res = await createAppointmentAction(formData)
      if (res.ok) {
        setShowAppointmentForm(false)
        setFeedback({ kind: 'ok', text: res.message || 'Consulta agendada!' })
        router.refresh()
      } else {
        setFeedback({ kind: 'err', text: res.error || 'Erro ao agendar.' })
      }
    })
  }

  function handleUpdateClinical(formData: FormData) {
    setFeedback(null)
    startTransition(async () => {
      const res = await updateClinicalRecordAction(formData)
      if (res.ok) {
        setFeedback({ kind: 'ok', text: res.message || 'Prontuário salvo!' })
        router.refresh()
      } else {
        setFeedback({ kind: 'err', text: res.error || 'Não foi possível salvar.' })
      }
    })
  }

  function handleCreateLostReport(formData: FormData) {
    setFeedback(null)
    startTransition(async () => {
      const res = await createLostReportAction(formData)
      if (res.ok) {
        setLostFormMode('none')
        setFeedback({ kind: 'ok', text: res.message || 'Ocorrência publicada!' })
        router.refresh()
      } else {
        setFeedback({ kind: 'err', text: res.error || 'Erro ao publicar.' })
      }
    })
  }

  function handleReportStatus(
    id: string,
    status: 'active' | 'reunited' | 'closed' | 'under_review',
  ) {
    setFeedback(null)
    startTransition(async () => {
      const res = await updateLostReportStatusAction(id, status)
      if (res.ok) {
        setFeedback({ kind: 'ok', text: res.message || 'Status atualizado.' })
        router.refresh()
      } else {
        setFeedback({ kind: 'err', text: res.error || 'Permissão insuficiente.' })
      }
    })
  }

  return (
    <main className="px-5 py-8 md:px-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[1320px]">
        {/* Header */}
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-[10px] font-extrabold tracking-[1.7px] text-[#1C7774] uppercase">
              {config.eyebrow}
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-[-1.3px] md:text-4xl">
              {config.title}
            </h1>
            <p className="mt-2 text-sm text-[#6F7D80]">{config.description}</p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {(section === 'animais' || section === 'pacientes') && (
              <button
                type="button"
                onClick={() => setShowPetForm(!showPetForm)}
                className="flex min-h-11 items-center gap-2 rounded-[13px_13px_13px_5px] bg-[#1C7774] px-5 text-xs font-bold text-white shadow-[0_10px_25px_rgba(28,119,116,.2)]"
              >
                <Icon name="plus" size={16} /> Cadastrar animal
              </button>
            )}
            {(section === 'consultas' || section === 'agenda' || section === 'fila') && (
              <button
                type="button"
                onClick={() => setShowAppointmentForm(!showAppointmentForm)}
                className="flex min-h-11 items-center gap-2 rounded-[13px_13px_13px_5px] bg-[#1C7774] px-5 text-xs font-bold text-white shadow-[0_10px_25px_rgba(28,119,116,.2)]"
              >
                <Icon name="plus" size={16} /> Novo agendamento
              </button>
            )}
            {section === 'ocorrencias' && (
              <>
                <button
                  type="button"
                  onClick={() => setLostFormMode(lostFormMode === 'lost' ? 'none' : 'lost')}
                  className="flex min-h-11 items-center gap-2 rounded-[13px_13px_13px_5px] bg-[#C9634C] px-4 text-xs font-bold text-white"
                >
                  <Icon name="plus" size={16} /> Animal desaparecido
                </button>
                <button
                  type="button"
                  onClick={() => setLostFormMode(lostFormMode === 'found' ? 'none' : 'found')}
                  className="flex min-h-11 items-center gap-2 rounded-[13px_13px_13px_5px] bg-[#1C7774] px-4 text-xs font-bold text-white"
                >
                  <Icon name="paw" size={16} /> Animal encontrado
                </button>
              </>
            )}
            {(section === 'servicos' || section === 'financeiro' || section === 'estoque') && (
              <button
                type="button"
                onClick={() => setShowLocalModal(!showLocalModal)}
                className="flex min-h-11 items-center gap-2 rounded-[13px_13px_13px_5px] bg-[#1C7774] px-5 text-xs font-bold text-white"
              >
                <Icon name="plus" size={16} /> {config.action}
              </button>
            )}
          </div>
        </div>

        {/* Feedback Banner */}
        {feedback && (
          <div
            role="alert"
            className={`mt-6 flex items-center justify-between rounded-2xl border px-5 py-3.5 text-xs font-bold ${
              feedback.kind === 'ok'
                ? 'border-[#1C7774]/30 bg-[#1C7774]/12 text-[#155F5D]'
                : 'border-[#C9634C]/30 bg-[#C9634C]/12 text-[#9A3F2B]'
            }`}
          >
            <span>{feedback.text}</span>
            <button type="button" onClick={() => setFeedback(null)}>
              <Icon name="close" size={15} />
            </button>
          </div>
        )}

        {/* ==================== 1. GESTÃO DE ANIMAIS / PACIENTES / CADASTROS ==================== */}
        {(section === 'animais' || section === 'pacientes' || section === 'cadastros') && (
          <div className="mt-8 space-y-6">
            {showPetForm && (
              <form
                action={handleCreatePet}
                className="rounded-[24px_24px_24px_8px] border border-[#1C7774]/30 bg-white p-6 shadow-md md:p-8"
              >
                <div className="flex items-center justify-between border-b border-[#123F3E]/8 pb-4">
                  <div>
                    <h2 className="text-xl font-black">Cadastro completo de animal</h2>
                    <p className="text-xs text-[#6F7D80]">
                      Preencha os dados físicos e anexe uma fotografia opcional.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPetForm(false)}
                    className="text-xs font-bold text-[#6F7D80]"
                  >
                    Cancelar
                  </button>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <label className="auth-label">
                    Nome do animal *
                    <input
                      name="name"
                      required
                      className="auth-input"
                      placeholder="Ex.: Thor, Luna"
                    />
                  </label>
                  <label className="auth-label">
                    Espécie *
                    <select name="species" required className="auth-input">
                      <option value="dog">Cão</option>
                      <option value="cat">Gato</option>
                      <option value="other">Outro</option>
                    </select>
                  </label>
                  <label className="auth-label">
                    Raça
                    <input name="breed" className="auth-input" placeholder="Ex.: SRD, Persa" />
                  </label>
                  <label className="auth-label">
                    Sexo
                    <select name="sex" className="auth-input">
                      <option value="female">Fêmea</option>
                      <option value="male">Macho</option>
                      <option value="unknown">Não informado</option>
                    </select>
                  </label>
                  <label className="auth-label">
                    Data de nascimento / idade estimada
                    <input name="birthDate" type="date" className="auth-input" />
                  </label>
                  <label className="auth-label">
                    Porte
                    <select name="size" className="auth-input">
                      <option value="small">Pequeno</option>
                      <option value="medium">Médio</option>
                      <option value="large">Grande</option>
                    </select>
                  </label>
                  <label className="auth-label">
                    Cor e sinais particulares
                    <input
                      name="color"
                      className="auth-input"
                      placeholder="Ex.: Caramelo com peito branco"
                    />
                  </label>
                  <label className="auth-label">
                    Peso (kg)
                    <input
                      name="weight"
                      type="number"
                      step="0.1"
                      min="0"
                      className="auth-input"
                      placeholder="Ex.: 8.4"
                    />
                  </label>
                  <label className="auth-label">
                    Fotografia do animal
                    <input
                      name="photo"
                      type="file"
                      accept="image/*"
                      className="auth-input py-2.5"
                    />
                  </label>
                  <label className="auth-label sm:col-span-2 lg:col-span-3">
                    Alergias / observações clínicas
                    <input
                      name="notes"
                      className="auth-input"
                      placeholder="Temperamento, medicações de uso contínuo, microchip..."
                    />
                  </label>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    disabled={pending}
                    className="min-h-12 rounded-[13px_13px_13px_5px] bg-[#1C7774] px-6 text-xs font-bold text-white disabled:opacity-60"
                  >
                    {pending ? 'Salvando...' : 'Salvar animal no PetSOS'}
                  </button>
                </div>
              </form>
            )}

            <div className="flex flex-col justify-between gap-3 rounded-2xl border border-[#123F3E]/8 bg-white p-4 sm:flex-row sm:items-center">
              <label className="flex min-h-10 flex-1 items-center gap-2 rounded-xl bg-[#F8F5F0] px-3.5">
                <Icon name="search" size={16} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filtrar animais por nome ou raça..."
                  className="w-full bg-transparent text-xs outline-none"
                />
              </label>
              <span className="text-xs font-bold text-[#6F7D80]">
                {filteredPets.length} {filteredPets.length === 1 ? 'animal' : 'animais'}
              </span>
            </div>

            {filteredPets.length === 0 ? (
              <div className="grid min-h-72 place-items-center rounded-[22px_22px_22px_7px] border border-dashed border-[#123F3E]/18 bg-white p-8 text-center">
                <div>
                  <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#1C7774]/14 text-[#155F5D]">
                    <Icon name="paw" size={26} />
                  </span>
                  <h3 className="mt-4 text-base font-extrabold">Nenhum animal cadastrado</h3>
                  <p className="mx-auto mt-1.5 max-w-md text-xs leading-5 text-[#6F7D80]">
                    Clique em &ldquo;Cadastrar animal&rdquo; acima para criar o perfil completo com
                    histórico clínico, vacinas, exames e responsáveis.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="space-y-3">
                  {filteredPets.map((pet) => {
                    const active = selectedPet?.id === pet.id
                    return (
                      <button
                        key={pet.id}
                        type="button"
                        onClick={() => setSelectedPetId(pet.id)}
                        className={`flex w-full items-center gap-4 rounded-[20px_20px_20px_7px] border p-4 text-left transition ${
                          active
                            ? 'border-[#1C7774] bg-white shadow-md'
                            : 'border-[#123F3E]/8 bg-white hover:border-[#1C7774]/40'
                        }`}
                      >
                        <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-[#F5E9D8]">
                          {pet.photoUrl ? (
                            <Image
                              src={pet.photoUrl}
                              alt={pet.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          ) : (
                            <span className="grid size-full place-items-center text-[#1C7774]">
                              <Icon name="paw" size={26} />
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <strong className="truncate text-base font-black">{pet.name}</strong>
                            <span className="rounded-md bg-[#F8F5F0] px-2 py-0.5 text-[10px] font-bold text-[#596B6E]">
                              {speciesMap[pet.species] ?? pet.species}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-[#6F7D80]">
                            {[
                              pet.breed || 'SRD',
                              sexMap[pet.sex] ?? '',
                              pet.weight ? `${pet.weight} kg` : '',
                            ]
                              .filter(Boolean)
                              .join(' · ')}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {selectedPet ? (
                  <section className="rounded-[24px_24px_24px_8px] border border-[#123F3E]/8 bg-white p-6">
                    <div className="flex items-center justify-between border-b border-[#123F3E]/8 pb-4">
                      <div>
                        <span className="text-[10px] font-extrabold text-[#1C7774] uppercase">
                          Perfil completo do animal
                        </span>
                        <h2 className="text-2xl font-black">{selectedPet.name}</h2>
                      </div>
                      {selectedPet.size && (
                        <span className="rounded-xl bg-[#F5E9D8] px-3 py-1.5 text-xs font-bold">
                          Porte {sizeMap[selectedPet.size] ?? selectedPet.size}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {(
                        [
                          ['info', 'Dados & Edição'],
                          ['historico', 'Histórico Clínico'],
                          ['vacinas', 'Vacinação'],
                          ['documentos', 'Documentos & Exames'],
                          ['responsaveis', 'Responsáveis'],
                        ] as const
                      ).map(([k, label]) => (
                        <button
                          key={k}
                          type="button"
                          onClick={() => setPetProfileTab(k)}
                          className={`rounded-lg px-3 py-1.5 text-[11px] font-bold ${
                            petProfileTab === k
                              ? 'bg-[#123F3E] text-white'
                              : 'bg-[#F8F5F0] text-[#596B6E]'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    {petProfileTab === 'info' && (
                      <form action={handleUpdatePet} className="mt-5 grid gap-3 sm:grid-cols-2">
                        <input type="hidden" name="id" value={selectedPet.id} />
                        <label className="auth-label">
                          Nome
                          <input
                            name="name"
                            defaultValue={selectedPet.name}
                            className="auth-input"
                          />
                        </label>
                        <label className="auth-label">
                          Raça
                          <input
                            name="breed"
                            defaultValue={selectedPet.breed}
                            className="auth-input"
                          />
                        </label>
                        <label className="auth-label">
                          Cor
                          <input
                            name="color"
                            defaultValue={selectedPet.color}
                            className="auth-input"
                          />
                        </label>
                        <label className="auth-label">
                          Peso (kg)
                          <input
                            name="weight"
                            type="number"
                            step="0.1"
                            defaultValue={selectedPet.weight ?? ''}
                            className="auth-input"
                          />
                        </label>
                        <label className="auth-label sm:col-span-2">
                          Observações clínicas
                          <input
                            name="notes"
                            defaultValue={selectedPet.notes}
                            className="auth-input"
                          />
                        </label>
                        <div className="sm:col-span-2 flex justify-end pt-2">
                          <button
                            disabled={pending}
                            className="min-h-10 rounded-xl bg-[#1C7774] px-5 text-xs font-bold text-white"
                          >
                            Salvar alterações
                          </button>
                        </div>
                      </form>
                    )}

                    {petProfileTab === 'historico' && (
                      <div className="mt-5 space-y-2.5">
                        {appointments.filter((a) => a.petId === selectedPet.id).length === 0 ? (
                          <p className="rounded-xl bg-[#F8F5F0] p-5 text-center text-xs text-[#6F7D80]">
                            Nenhum atendimento clínico registrado para {selectedPet.name}.
                          </p>
                        ) : (
                          appointments
                            .filter((a) => a.petId === selectedPet.id)
                            .map((apt) => (
                              <div key={apt.id} className="rounded-xl bg-[#F8F5F0] p-4 text-xs">
                                <strong>{apt.reason}</strong>
                                <p className="mt-1 text-[#6F7D80]">
                                  {apt.diagnosis || apt.clinicalNotes || 'Consulta registrada'}
                                </p>
                              </div>
                            ))
                        )}
                      </div>
                    )}

                    {petProfileTab === 'vacinas' && (
                      <div className="mt-5 space-y-4">
                        {selectedPet.vaccinations.length === 0 ? (
                          <p className="rounded-xl bg-[#F8F5F0] p-4 text-xs text-[#6F7D80]">
                            Nenhuma dose registrada na carteira digital ainda.
                          </p>
                        ) : (
                          selectedPet.vaccinations.map((v, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between rounded-xl bg-[#F8F5F0] p-3.5 text-xs"
                            >
                              <strong>{v.vaccineName}</strong>
                              <span className="text-[#6F7D80]">
                                {new Intl.DateTimeFormat('pt-BR').format(new Date(v.appliedAt))}
                              </span>
                            </div>
                          ))
                        )}
                        <form
                          action={handleUpdatePet}
                          className="grid gap-2.5 rounded-xl border border-[#123F3E]/10 p-4 sm:grid-cols-[1fr_150px_auto]"
                        >
                          <input type="hidden" name="id" value={selectedPet.id} />
                          <input type="hidden" name="name" value={selectedPet.name} />
                          <input
                            name="vaccineName"
                            required
                            placeholder="Vacina (ex.: V10, Antirrábica)"
                            className="h-10 rounded-lg bg-[#F8F5F0] px-3 text-xs outline-none"
                          />
                          <input
                            name="vaccineDate"
                            type="date"
                            required
                            className="h-10 rounded-lg bg-[#F8F5F0] px-3 text-xs outline-none"
                          />
                          <button
                            disabled={pending}
                            className="h-10 rounded-lg bg-[#1C7774] px-4 text-xs font-bold text-white"
                          >
                            + Dose
                          </button>
                        </form>
                      </div>
                    )}

                    {petProfileTab === 'documentos' && (
                      <div className="mt-5 space-y-4">
                        {selectedPet.documents.length === 0 ? (
                          <p className="rounded-xl bg-[#F8F5F0] p-4 text-xs text-[#6F7D80]">
                            Nenhum documento ou resultado de exame vinculado.
                          </p>
                        ) : (
                          selectedPet.documents.map((d, i) => (
                            <div key={i} className="rounded-xl bg-[#F8F5F0] p-3.5 text-xs">
                              <strong>{d.title}</strong>
                              {d.summary && <p className="mt-1 text-[#6F7D80]">{d.summary}</p>}
                            </div>
                          ))
                        )}
                        <form
                          action={handleUpdatePet}
                          className="grid gap-2.5 rounded-xl border border-[#123F3E]/10 p-4"
                        >
                          <input type="hidden" name="id" value={selectedPet.id} />
                          <input type="hidden" name="name" value={selectedPet.name} />
                          <input
                            name="documentTitle"
                            required
                            placeholder="Título do exame ou documento (ex.: Hemograma completo)"
                            className="h-10 rounded-lg bg-[#F8F5F0] px-3 text-xs outline-none"
                          />
                          <input
                            name="documentSummary"
                            placeholder="Resumo / observação do laudo"
                            className="h-10 rounded-lg bg-[#F8F5F0] px-3 text-xs outline-none"
                          />
                          <button
                            disabled={pending}
                            className="h-10 justify-self-end rounded-lg bg-[#123F3E] px-4 text-xs font-bold text-white"
                          >
                            Anexar registro
                          </button>
                        </form>
                      </div>
                    )}

                    {petProfileTab === 'responsaveis' && (
                      <div className="mt-5 space-y-2.5">
                        {selectedPet.guardianNames.map((gName, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between rounded-xl bg-[#F8F5F0] p-4 text-xs"
                          >
                            <span className="font-bold">{gName}</span>
                            <span className="rounded-md bg-[#1C7774]/14 px-2.5 py-1 text-[10px] font-bold text-[#155F5D]">
                              Tutor principal
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                ) : (
                  <div className="grid place-items-center rounded-[24px_24px_24px_8px] border border-dashed border-[#123F3E]/15 bg-white p-8 text-center text-xs text-[#6F7D80]">
                    Selecione um animal à esquerda para abrir seu Perfil Completo, Carteira Vacinal,
                    Documentos, Histórico Clínico e Responsáveis.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ==================== 2. AGENDA, CONSULTAS, FILA, PRONTUÁRIOS E EXAMES ==================== */}
        {(section === 'consultas' ||
          section === 'agenda' ||
          section === 'fila' ||
          section === 'prontuarios' ||
          section === 'exames') && (
          <div className="mt-8 space-y-6">
            {showAppointmentForm && (
              <form
                action={handleCreateAppointment}
                className="rounded-[24px_24px_24px_8px] border border-[#1C7774]/30 bg-white p-6 shadow-md"
              >
                <h2 className="text-xl font-black">Novo agendamento veterinário</h2>
                {pets.length === 0 ? (
                  <p className="mt-4 rounded-xl bg-[#F4B96A]/20 p-4 text-xs font-semibold text-[#7A5A24]">
                    Cadastre pelo menos um animal em{' '}
                    <Link href="/sistema/animais" className="underline">
                      Meus animais
                    </Link>{' '}
                    antes de agendar uma consulta.
                  </p>
                ) : (
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <label className="auth-label">
                      Animal *
                      <select name="pet" required className="auth-input">
                        {pets.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="auth-label">
                      Tipo de atendimento
                      <select name="serviceType" className="auth-input">
                        <option value="consultation">Consulta clínica</option>
                        <option value="vaccination">Vacinação</option>
                        <option value="exam">Exame / Check-up</option>
                        <option value="followup">Retorno</option>
                        <option value="urgent">Urgência / Triagem</option>
                      </select>
                    </label>
                    <label className="auth-label">
                      Data e horário *
                      <input
                        name="scheduledAt"
                        type="datetime-local"
                        required
                        className="auth-input"
                      />
                    </label>
                    <label className="auth-label">
                      Motivo principal *
                      <input
                        name="reason"
                        required
                        placeholder="Ex.: Check-up anual, vacina V10"
                        className="auth-input"
                      />
                    </label>
                    <div className="sm:col-span-2 lg:col-span-4 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowAppointmentForm(false)}
                        className="min-h-11 rounded-xl border border-[#123F3E]/15 px-4 text-xs font-bold"
                      >
                        Cancelar
                      </button>
                      <button
                        disabled={pending}
                        className="min-h-11 rounded-xl bg-[#1C7774] px-6 text-xs font-bold text-white"
                      >
                        Confirmar agendamento
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}

            {(section === 'agenda' || section === 'consultas') && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#123F3E]/8 bg-white p-3.5">
                <div className="flex gap-1 rounded-xl bg-[#F8F5F0] p-1">
                  {(['diaria', 'semanal', 'mensal'] as const).map((scale) => (
                    <button
                      key={scale}
                      type="button"
                      onClick={() => setCalendarScale(scale)}
                      className={`rounded-lg px-4 py-1.5 text-xs font-bold capitalize ${
                        calendarScale === scale
                          ? 'bg-white text-[#123F3E] shadow-sm'
                          : 'text-[#6F7D80]'
                      }`}
                    >
                      Agenda {scale}
                    </button>
                  ))}
                </div>
                <span className="text-xs font-bold text-[#6F7D80]">
                  {appointments.length} atendimento(s) registrado(s)
                </span>
              </div>
            )}

            {section === 'fila' && (
              <div className="grid gap-4 md:grid-cols-3">
                {(
                  [
                    ['scheduled', 'Agendados / Recepção'],
                    ['waiting', 'Aguardando Triagem'],
                    ['in_progress', 'Em Atendimento'],
                  ] as const
                ).map(([st, label]) => {
                  const items = appointments.filter((a) => a.status === st)
                  return (
                    <div
                      key={st}
                      className="rounded-[22px_22px_22px_7px] border border-[#123F3E]/8 bg-white p-5"
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-sm font-black">{label}</strong>
                        <span className="rounded-full bg-[#F8F5F0] px-2.5 py-0.5 text-xs font-bold">
                          {items.length}
                        </span>
                      </div>
                      {items.length === 0 ? (
                        <p className="mt-4 rounded-xl bg-[#F8F5F0] p-5 text-center text-xs text-[#6F7D80]">
                          Nenhum paciente nesta etapa
                        </p>
                      ) : (
                        <div className="mt-4 space-y-2.5">
                          {items.map((item) => (
                            <div key={item.id} className="rounded-xl bg-[#F8F5F0] p-3.5 text-xs">
                              <strong className="block font-extrabold">{item.petName}</strong>
                              <span className="text-[#6F7D80]">{item.reason}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
              <section className="rounded-[24px_24px_24px_8px] border border-[#123F3E]/8 bg-white p-6">
                <h2 className="text-lg font-black">
                  {section === 'exames' ? 'Pacientes e exames' : 'Consultas e atendimentos'}
                </h2>
                {appointments.length === 0 ? (
                  <p className="mt-5 rounded-2xl bg-[#F8F5F0] p-6 text-center text-xs text-[#6F7D80]">
                    Nenhum atendimento registrado ainda. Agende uma consulta para visualizar e
                    preencher o prontuário eletrônico completo.
                  </p>
                ) : (
                  <div className="mt-4 space-y-2.5">
                    {appointments.map((apt) => {
                      const badge = statusMap[apt.status] ?? statusMap.scheduled
                      return (
                        <button
                          key={apt.id}
                          type="button"
                          onClick={() => setSelectedAppointmentId(apt.id)}
                          className={`w-full rounded-2xl border p-4 text-left text-xs transition ${
                            selectedAppointment?.id === apt.id
                              ? 'border-[#1C7774] bg-[#F8F5F0]'
                              : 'border-[#123F3E]/8 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <strong className="text-sm font-black">{apt.petName}</strong>
                            <span
                              className={`rounded-lg px-2 py-0.5 text-[10px] font-bold ${badge.cls}`}
                            >
                              {badge.label}
                            </span>
                          </div>
                          <p className="mt-1 font-semibold text-[#596B6E]">{apt.reason}</p>
                          <p className="mt-1 text-[11px] text-[#7D898B]">
                            {new Intl.DateTimeFormat('pt-BR', {
                              dateStyle: 'short',
                              timeStyle: 'short',
                            }).format(new Date(apt.scheduledAt))}
                          </p>
                        </button>
                      )
                    })}
                  </div>
                )}
              </section>

              <section className="rounded-[24px_24px_24px_8px] border border-[#123F3E]/8 bg-white p-6">
                <span className="text-[10px] font-extrabold tracking-[1.4px] text-[#1C7774] uppercase">
                  Prontuário Eletrônico Completo
                </span>
                <h2 className="mt-1 text-xl font-black">
                  {selectedAppointment
                    ? `${selectedAppointment.petName} · ${selectedAppointment.reason}`
                    : 'Estrutura de Atendimento Clínico'}
                </h2>
                <form action={handleUpdateClinical} className="mt-5 grid gap-3.5 sm:grid-cols-2">
                  <input type="hidden" name="id" value={selectedAppointment?.id ?? ''} />
                  <label className="auth-label sm:col-span-2">
                    Status do atendimento / fila
                    <select
                      name="status"
                      defaultValue={selectedAppointment?.status ?? 'scheduled'}
                      className="auth-input"
                    >
                      <option value="scheduled">Agendada</option>
                      <option value="waiting">Aguardando na fila</option>
                      <option value="in_progress">Em atendimento no consultório</option>
                      <option value="completed">Atendimento finalizado</option>
                      <option value="cancelled">Cancelada</option>
                    </select>
                  </label>
                  <label className="auth-label">
                    Anamnese
                    <textarea
                      name="anamnesis"
                      rows={2}
                      defaultValue={selectedAppointment?.anamnesis ?? ''}
                      placeholder="Queixa principal, histórico alimentar e evolução..."
                      className="mt-1.5 w-full rounded-xl border border-[#dce8e5] p-3 text-xs outline-none focus:border-[#1C7774]"
                    />
                  </label>
                  <label className="auth-label">
                    Exame clínico
                    <textarea
                      name="physicalExam"
                      rows={2}
                      defaultValue={selectedAppointment?.physicalExam ?? ''}
                      placeholder="FC, FR, temperatura, mucosas, hidratação..."
                      className="mt-1.5 w-full rounded-xl border border-[#dce8e5] p-3 text-xs outline-none focus:border-[#1C7774]"
                    />
                  </label>
                  <label className="auth-label">
                    Diagnóstico
                    <textarea
                      name="diagnosis"
                      rows={2}
                      defaultValue={selectedAppointment?.diagnosis ?? ''}
                      placeholder="Hipóteses diagnósticas ou conclusão..."
                      className="mt-1.5 w-full rounded-xl border border-[#dce8e5] p-3 text-xs outline-none focus:border-[#1C7774]"
                    />
                  </label>
                  <label className="auth-label">
                    Prescrição veterinária
                    <textarea
                      name="prescription"
                      rows={2}
                      defaultValue={selectedAppointment?.prescription ?? ''}
                      placeholder="Medicamentos, doses, frequência e orientações..."
                      className="mt-1.5 w-full rounded-xl border border-[#dce8e5] p-3 text-xs outline-none focus:border-[#1C7774]"
                    />
                  </label>
                  <label className="auth-label">
                    Solicitação e resultados de exames
                    <input
                      name="examsRequested"
                      defaultValue={selectedAppointment?.examsRequested ?? ''}
                      placeholder="Hemograma, perfil renal, ultrassom..."
                      className="auth-input"
                    />
                  </label>
                  <label className="auth-label">
                    Vacinação e procedimentos realizados
                    <input
                      name="procedures"
                      defaultValue={selectedAppointment?.procedures ?? ''}
                      placeholder="Aplicação vacinal, curativo, fluidoterapia..."
                      className="auth-input"
                    />
                  </label>
                  {selectedAppointment && (
                    <div className="sm:col-span-2 flex justify-end pt-2">
                      <button
                        disabled={pending}
                        className="min-h-11 rounded-xl bg-[#1C7774] px-6 text-xs font-bold text-white"
                      >
                        Salvar e atualizar atendimento
                      </button>
                    </div>
                  )}
                </form>
              </section>
            </div>
          </div>
        )}

        {/* ==================== 3. OCORRÊNCIAS DE ANIMAIS PERDIDOS E ENCONTRADOS ==================== */}
        {section === 'ocorrencias' && (
          <div className="mt-8 space-y-6">
            {lostFormMode !== 'none' && (
              <form
                action={handleCreateLostReport}
                className="rounded-[24px_24px_24px_8px] border border-[#123F3E]/12 bg-white p-6 shadow-md md:p-8"
              >
                <input type="hidden" name="situation" value={lostFormMode} />
                <div className="flex items-center justify-between border-b border-[#123F3E]/8 pb-4">
                  <div>
                    <span
                      className={`inline-flex rounded-md px-2.5 py-1 text-[10px] font-extrabold text-white ${
                        lostFormMode === 'lost' ? 'bg-[#C9634C]' : 'bg-[#1C7774]'
                      }`}
                    >
                      {lostFormMode === 'lost' ? 'ANIMAL DESAPARECIDO' : 'ANIMAL ENCONTRADO'}
                    </span>
                    <h2 className="mt-2 text-xl font-black">
                      {lostFormMode === 'lost'
                        ? 'Cadastrar animal desaparecido'
                        : 'Cadastrar animal encontrado'}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLostFormMode('none')}
                    className="text-xs font-bold text-[#6F7D80]"
                  >
                    Fechar
                  </button>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <label className="auth-label">
                    Nome ou identificação *
                    <input
                      name="animalName"
                      required
                      className="auth-input"
                      placeholder={
                        lostFormMode === 'lost' ? 'Ex.: Pipoca' : 'Ex.: Cão caramelo com coleira'
                      }
                    />
                  </label>
                  <label className="auth-label">
                    Espécie *
                    <select name="species" required className="auth-input">
                      <option value="dog">Cão</option>
                      <option value="cat">Gato</option>
                      <option value="other">Outro</option>
                    </select>
                  </label>
                  <label className="auth-label">
                    Porte
                    <select name="size" className="auth-input">
                      <option value="small">Pequeno</option>
                      <option value="medium">Médio</option>
                      <option value="large">Grande</option>
                    </select>
                  </label>
                  <label className="auth-label">
                    Raça
                    <input name="breed" className="auth-input" placeholder="Ex.: SRD" />
                  </label>
                  <label className="auth-label">
                    Cor predominante
                    <input name="color" className="auth-input" placeholder="Ex.: Preto e branco" />
                  </label>
                  <label className="auth-label">
                    Data da ocorrência *
                    <input name="occurredAt" type="date" required className="auth-input" />
                  </label>
                  <label className="auth-label">
                    Cidade *
                    <input
                      name="city"
                      required
                      className="auth-input"
                      placeholder="Ex.: São Paulo"
                    />
                  </label>
                  <label className="auth-label">
                    Bairro aproximado *
                    <input
                      name="neighborhood"
                      required
                      className="auth-input"
                      placeholder="Ex.: Centro"
                    />
                  </label>
                  <label className="auth-label">
                    Fotografia
                    <input
                      name="photo"
                      type="file"
                      accept="image/*"
                      className="auth-input py-2.5"
                    />
                  </label>
                  <label className="auth-label sm:col-span-2 lg:col-span-3">
                    Descrição detalhada e ponto de referência *
                    <textarea
                      name="description"
                      required
                      rows={3}
                      placeholder="Descreva coleira, comportamento, onde foi visto pela última vez..."
                      className="mt-1.5 w-full rounded-xl border border-[#dce8e5] p-3 text-xs outline-none focus:border-[#1C7774]"
                    />
                  </label>
                </div>
                <div className="mt-5 flex justify-end">
                  <button
                    disabled={pending}
                    className="min-h-11 rounded-xl bg-[#1C7774] px-6 text-xs font-bold text-white"
                  >
                    {pending ? 'Publicando...' : 'Publicar na Central PetSOS'}
                  </button>
                </div>
              </form>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#123F3E]/8 bg-white p-3.5">
              <div className="flex flex-wrap gap-1 rounded-xl bg-[#F8F5F0] p-1">
                {(
                  [
                    ['todas', 'Todas as ocorrências'],
                    ['minhas', 'Minhas publicações'],
                    ['correspondencias', `Correspondências (${matches.length})`],
                    ['mapa', 'Mapa de ocorrências'],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setLostTab(key)}
                    className={`rounded-lg px-3.5 py-1.5 text-xs font-bold ${
                      lostTab === key ? 'bg-white text-[#123F3E] shadow-sm' : 'text-[#6F7D80]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <Link href="/animais-perdidos" className="text-xs font-extrabold text-[#287BA8]">
                Ver Central Pública →
              </Link>
            </div>

            {lostTab === 'mapa' ? (
              <div className="relative grid min-h-[380px] place-items-center overflow-hidden rounded-[22px_22px_22px_7px] bg-[#DDEBE7] p-8 text-center">
                <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(#8fb5aa_1px,transparent_1px),linear-gradient(90deg,#8fb5aa_1px,transparent_1px)] [background-size:40px_40px]" />
                <div className="relative max-w-md rounded-2xl bg-white p-6 shadow-xl">
                  <Icon name="map" size={28} />
                  <h3 className="mt-3 text-base font-black">
                    {lostReports.length === 0
                      ? 'Nenhuma ocorrência ativa no mapa'
                      : `${lostReports.length} ponto(s) aproximado(s)`}
                  </h3>
                  <p className="mt-1.5 text-xs leading-5 text-[#6F7D80]">
                    Os marcadores exibem apenas o bairro aproximado para proteger tutores contra
                    golpes.
                  </p>
                </div>
              </div>
            ) : lostTab === 'correspondencias' ? (
              matches.length === 0 ? (
                <div className="rounded-[22px_22px_22px_7px] border border-dashed border-[#123F3E]/18 bg-white p-10 text-center text-xs text-[#6F7D80]">
                  Nenhuma correspondência automática encontrada ainda entre animais perdidos e
                  encontrados.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {matches.map(({ lost, found }) => (
                    <div
                      key={`${lost.id}-${found.id}`}
                      className="rounded-2xl border border-[#1C7774]/30 bg-white p-5"
                    >
                      <span className="rounded-md bg-[#1C7774]/14 px-2.5 py-1 text-[10px] font-extrabold text-[#155F5D]">
                        POSSÍVEL CORRESPONDÊNCIA EM {lost.city.toUpperCase()}
                      </span>
                      <p className="mt-3 text-sm font-black">
                        {lost.animalName} (Perdido) ↔ {found.animalName} (Encontrado)
                      </p>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {(lostTab === 'minhas' ? lostReports.filter((r) => r.isOwned) : lostReports).map(
                  (rep) => (
                    <article
                      key={rep.id}
                      className="overflow-hidden rounded-[22px_22px_22px_7px] border border-[#123F3E]/8 bg-white"
                    >
                      <div className="relative h-48 bg-[#F5E9D8]">
                        {rep.photoUrl ? (
                          <Image
                            src={rep.photoUrl}
                            alt={rep.animalName}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover"
                          />
                        ) : (
                          <span className="grid size-full place-items-center text-[#1C7774]">
                            <Icon name="paw" size={44} />
                          </span>
                        )}
                        <span
                          className={`absolute left-3 top-3 rounded-lg px-2.5 py-1 text-[10px] font-extrabold text-white ${
                            rep.situation === 'lost' ? 'bg-[#C9634C]' : 'bg-[#1C7774]'
                          }`}
                        >
                          {rep.situation === 'lost' ? 'PERDIDO' : 'ENCONTRADO'}
                        </span>
                        {rep.status === 'reunited' && (
                          <span className="absolute right-3 top-3 rounded-lg bg-[#123F3E] px-2.5 py-1 text-[10px] font-extrabold text-[#F4B96A]">
                            RECUPERADO
                          </span>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-black">{rep.animalName}</h3>
                        <p className="mt-1 text-xs text-[#6F7D80]">
                          {rep.neighborhood}, {rep.city}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2 border-t border-[#123F3E]/8 pt-3">
                          <Link
                            href={`/animais-perdidos/${rep.id}`}
                            className="rounded-lg bg-[#F8F5F0] px-3 py-1.5 text-[11px] font-bold"
                          >
                            Detalhes
                          </Link>
                          {(rep.isOwned || role === 'administrator') && rep.status === 'active' && (
                            <button
                              type="button"
                              disabled={pending}
                              onClick={() => handleReportStatus(rep.id, 'reunited')}
                              className="rounded-lg bg-[#1C7774] px-3 py-1.5 text-[11px] font-bold text-white"
                            >
                              Marcar como recuperado
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  ),
                )}
                {(lostTab === 'minhas' ? lostReports.filter((r) => r.isOwned) : lostReports)
                  .length === 0 && (
                  <div className="sm:col-span-2 lg:col-span-3 rounded-[22px_22px_22px_7px] border border-dashed border-[#123F3E]/18 bg-white p-10 text-center text-xs text-[#6F7D80]">
                    Nenhuma ocorrência publicada nesta visualização. Utilize os botões acima para
                    cadastrar um animal desaparecido ou encontrado.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ==================== 5. COMUNICAÇÃO E NOTIFICAÇÕES ==================== */}
        {section === 'mensagens' && (
          <div className="mt-8 grid min-h-[500px] overflow-hidden rounded-[24px_24px_24px_8px] border border-[#123F3E]/8 bg-white lg:grid-cols-[290px_1fr]">
            <aside className="border-b border-[#123F3E]/8 bg-[#F8F5F0] p-5 lg:border-b-0 lg:border-r">
              <h2 className="text-sm font-black">Conversas</h2>
              <div className="mt-4 rounded-xl bg-white p-3.5 text-xs">
                <strong className="block font-extrabold">Atendimento Clínica PetSOS</strong>
                <span className="text-[11px] text-[#6F7D80]">Canal direto de suporte</span>
              </div>
            </aside>
            <section className="flex flex-col justify-between p-6">
              <div className="space-y-3">
                {chatLog.length === 0 ? (
                  <div className="py-16 text-center text-xs text-[#6F7D80]">
                    Nenhuma mensagem enviada nesta conversa ainda. Escreva abaixo para iniciar o
                    atendimento ou falar sobre uma ocorrência.
                  </div>
                ) : (
                  chatLog.map((msg, idx) => (
                    <div
                      key={idx}
                      className="ml-auto max-w-md rounded-2xl bg-[#1C7774] p-3.5 text-xs text-white"
                    >
                      <p>{msg.text}</p>
                      <small className="mt-1 block text-[10px] text-white/75">{msg.time}</small>
                    </div>
                  ))
                )}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!chatMessage.trim()) return
                  setChatLog((prev) => [
                    ...prev,
                    {
                      sender: 'Você',
                      text: chatMessage.trim(),
                      time: new Intl.DateTimeFormat('pt-BR', { timeStyle: 'short' }).format(
                        new Date(),
                      ),
                    },
                  ])
                  setChatMessage('')
                }}
                className="mt-4 flex gap-2"
              >
                <input
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Escreva sua mensagem para a clínica..."
                  className="h-12 flex-1 rounded-xl bg-[#F8F5F0] px-4 text-xs outline-none"
                />
                <button className="min-h-12 rounded-xl bg-[#1C7774] px-5 text-xs font-bold text-white">
                  Enviar
                </button>
              </form>
            </section>
          </div>
        )}

        {section === 'notificacoes' && (
          <div className="mt-8 space-y-5">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setNotifTab('central')}
                className={`rounded-xl px-4 py-2 text-xs font-bold ${
                  notifTab === 'central' ? 'bg-[#123F3E] text-white' : 'bg-white'
                }`}
              >
                Central de notificações
              </button>
              <button
                type="button"
                onClick={() => setNotifTab('preferencias')}
                className={`rounded-xl px-4 py-2 text-xs font-bold ${
                  notifTab === 'preferencias' ? 'bg-[#123F3E] text-white' : 'bg-white'
                }`}
              >
                Preferências de alertas
              </button>
            </div>

            {notifTab === 'central' ? (
              <div className="rounded-[24px_24px_24px_8px] border border-[#123F3E]/8 bg-white p-6">
                {appointments.length === 0 && matches.length === 0 ? (
                  <p className="py-10 text-center text-xs text-[#6F7D80]">
                    Nenhum aviso pendente de consultas, vacinas, exames ou correspondências no
                    momento.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {appointments.map((a) => (
                      <div
                        key={a.id}
                        className="flex items-center justify-between rounded-xl bg-[#F8F5F0] p-4 text-xs"
                      >
                        <span>
                          <strong>Lembrete clínico:</strong> {a.petName} — {a.reason}
                        </span>
                        <span className="font-bold text-[#287BA8]">
                          {new Intl.DateTimeFormat('pt-BR').format(new Date(a.scheduledAt))}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setFeedback({
                    kind: 'ok',
                    text: 'Preferências de notificações atualizadas com sucesso.',
                  })
                }}
                className="rounded-[24px_24px_24px_8px] border border-[#123F3E]/8 bg-white p-6 space-y-3 text-xs"
              >
                {[
                  'Avisos de consultas agendadas e retornos',
                  'Lembretes de vacinas e controle antiparasitário',
                  'Liberação de resultados de exames no prontuário',
                  'Notificações de possíveis correspondências de animais perdidos',
                ].map((label) => (
                  <label
                    key={label}
                    className="flex items-center justify-between rounded-xl bg-[#F8F5F0] p-4 font-semibold"
                  >
                    <span>{label}</span>
                    <input type="checkbox" defaultChecked className="size-4 accent-[#1C7774]" />
                  </label>
                ))}
                <div className="flex justify-end pt-2">
                  <button className="min-h-11 rounded-xl bg-[#1C7774] px-6 text-xs font-bold text-white">
                    Salvar preferências
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ==================== 6. ADMINISTRAÇÃO COMPLETA ==================== */}
        {(section === 'usuarios' ||
          section === 'equipe' ||
          section === 'servicos' ||
          section === 'relatorios' ||
          section === 'financeiro' ||
          section === 'estoque' ||
          section === 'auditoria' ||
          section === 'configuracoes') && (
          <div className="mt-8 space-y-6">
            {showLocalModal && (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const fd = new FormData(e.currentTarget)
                  setLocalEntries((prev) => [
                    ...prev,
                    {
                      id: String(Date.now()),
                      col1: String(fd.get('col1') || ''),
                      col2: String(fd.get('col2') || ''),
                      col3: String(fd.get('col3') || ''),
                    },
                  ])
                  setShowLocalModal(false)
                  setFeedback({ kind: 'ok', text: 'Registro adicionado com sucesso.' })
                }}
                className="rounded-[24px_24px_24px_8px] border border-[#1C7774]/30 bg-white p-6"
              >
                <h2 className="text-lg font-black">{config.action}</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <input
                    name="col1"
                    required
                    placeholder="Descrição / Nome"
                    className="auth-input"
                  />
                  <input
                    name="col2"
                    required
                    placeholder="Categoria / Tipo"
                    className="auth-input"
                  />
                  <input
                    name="col3"
                    required
                    placeholder="Valor / Quantidade"
                    className="auth-input"
                  />
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowLocalModal(false)}
                    className="min-h-10 rounded-xl border border-[#123F3E]/15 px-4 text-xs font-bold"
                  >
                    Cancelar
                  </button>
                  <button className="min-h-10 rounded-xl bg-[#1C7774] px-5 text-xs font-bold text-white">
                    Salvar
                  </button>
                </div>
              </form>
            )}

            {section === 'configuracoes' ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setFeedback({ kind: 'ok', text: 'Configurações da clínica salvas.' })
                }}
                className="grid gap-4 rounded-[24px_24px_24px_8px] border border-[#123F3E]/8 bg-white p-7 sm:grid-cols-2"
              >
                <label className="auth-label">
                  Nome da unidade clínica
                  <input defaultValue="Clínica Veterinária PetSOS" className="auth-input" />
                </label>
                <label className="auth-label">
                  Horário de atendimento
                  <input defaultValue="Segunda a Sábado, 08h às 20h" className="auth-input" />
                </label>
                <label className="auth-label">
                  Raio padrão de correspondências (km)
                  <input type="number" defaultValue={10} className="auth-input" />
                </label>
                <label className="auth-label">
                  Intervalo padrão de agenda (minutos)
                  <input type="number" defaultValue={30} className="auth-input" />
                </label>
                <div className="sm:col-span-2 flex justify-end pt-2">
                  <button className="min-h-11 rounded-xl bg-[#1C7774] px-6 text-xs font-bold text-white">
                    Salvar alterações
                  </button>
                </div>
              </form>
            ) : section === 'usuarios' || section === 'equipe' ? (
              <div className="overflow-hidden rounded-[24px_24px_24px_8px] border border-[#123F3E]/8 bg-white p-6">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#123F3E]/10 text-[10px] font-extrabold text-[#6F7D80] uppercase">
                      <th className="py-3 pr-4">Nome</th>
                      <th className="py-3 pr-4">Email</th>
                      <th className="py-3 pr-4">Perfil</th>
                      <th className="py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(section === 'equipe'
                      ? userRows.filter((u) => u.role !== 'tutor')
                      : userRows
                    ).map((u) => (
                      <tr key={u.id} className="border-b border-[#123F3E]/6">
                        <td className="py-3.5 pr-4 font-bold">{u.name}</td>
                        <td className="py-3.5 pr-4 text-[#6F7D80]">{u.email}</td>
                        <td className="py-3.5 pr-4 capitalize">{u.role}</td>
                        <td className="py-3.5">
                          <span className="rounded-md bg-[#1C7774]/14 px-2 py-0.5 text-[10px] font-bold text-[#155F5D]">
                            {u.status === 'active' ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {(section === 'equipe' ? userRows.filter((u) => u.role !== 'tutor') : userRows)
                      .length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-10 text-center text-[#6F7D80]">
                          Nenhum membro de equipe cadastrado com perfil clínico/recepção no banco.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : section === 'relatorios' ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: 'Contas reais ativas', val: userRows.length },
                  { label: 'Animais acompanhados', val: pets.length },
                  { label: 'Consultas totais', val: appointments.length },
                  {
                    label: 'Animais recuperados',
                    val: lostReports.filter((r) => r.status === 'reunited').length,
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[22px_22px_22px_7px] border border-[#123F3E]/8 bg-white p-6"
                  >
                    <strong className="block text-3xl font-black text-[#1C7774]">{stat.val}</strong>
                    <span className="mt-1 block text-xs font-semibold text-[#6F7D80]">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            ) : section === 'auditoria' ? (
              <div className="rounded-[24px_24px_24px_8px] border border-[#123F3E]/8 bg-white p-6">
                <h2 className="text-base font-black">Trilha de auditoria real</h2>
                <div className="mt-4 space-y-2.5 text-xs">
                  {userRows.map((u) => (
                    <div
                      key={`audit-u-${u.id}`}
                      className="flex items-center justify-between rounded-xl bg-[#F8F5F0] p-3.5"
                    >
                      <span>
                        Conta criada: <strong>{u.name}</strong> ({u.role})
                      </span>
                      <span className="text-[#6F7D80]">
                        {new Intl.DateTimeFormat('pt-BR', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        }).format(new Date(u.createdAt))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-[24px_24px_24px_8px] border border-[#123F3E]/8 bg-white p-6">
                {localEntries.length === 0 ? (
                  <p className="py-10 text-center text-xs text-[#6F7D80]">
                    Nenhum item fictício exibido em {config.title.toLowerCase()}. Clique em &ldquo;
                    {config.action}&rdquo; para registrar itens.
                  </p>
                ) : (
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#123F3E]/10 text-[10px] font-extrabold text-[#6F7D80] uppercase">
                        <th className="py-2.5">Descrição</th>
                        <th className="py-2.5">Categoria</th>
                        <th className="py-2.5">Detalhe</th>
                      </tr>
                    </thead>
                    <tbody>
                      {localEntries.map((row) => (
                        <tr key={row.id} className="border-b border-[#123F3E]/6">
                          <td className="py-3 font-bold">{row.col1}</td>
                          <td className="py-3 text-[#6F7D80]">{row.col2}</td>
                          <td className="py-3 font-semibold text-[#155F5D]">{row.col3}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
