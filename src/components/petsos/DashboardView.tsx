import Image from 'next/image'
import Link from 'next/link'
import type { AppRole } from '@/access/app-access'
import { Icon, type IconName } from '@/components/petsos/Icon'
import type {
  SerializedAppointment,
  SerializedLostReport,
  SerializedPet,
  SerializedUserRow,
} from '@/lib/petsos-types'

type Counts = {
  appointments: number
  lostReports: number
  pets: number
  users: number
}

const statusBadges: Record<string, { label: string; cls: string }> = {
  scheduled: { label: 'Agendada', cls: 'bg-[#62B9E8]/18 text-[#287BA8]' },
  waiting: { label: 'Aguardando', cls: 'bg-[#F4B96A]/25 text-[#966A25]' },
  in_progress: { label: 'Em atendimento', cls: 'bg-[#1C7774]/16 text-[#155F5D]' },
  completed: { label: 'Finalizada', cls: 'bg-[#123F3E]/10 text-[#123F3E]' },
  cancelled: { label: 'Cancelada', cls: 'bg-[#C9634C]/15 text-[#9A3F2B]' },
}

const speciesLabel: Record<string, string> = { dog: 'Cão', cat: 'Gato', other: 'Outro' }

function KpiCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string
  value: number
  icon: IconName
  tone: 'mint' | 'blue' | 'yellow' | 'dark'
}) {
  const tones = {
    mint: 'bg-[#1C7774]/14 text-[#155F5D]',
    blue: 'bg-[#62B9E8]/18 text-[#287BA8]',
    yellow: 'bg-[#F4B96A]/25 text-[#966A25]',
    dark: 'bg-[#123F3E]/10 text-[#123F3E]',
  }
  return (
    <article className="rounded-[20px_20px_20px_7px] border border-[#123F3E]/8 bg-white p-5 shadow-[0_10px_30px_rgba(39,60,66,.04)]">
      <div className="flex items-start justify-between">
        <span
          className={`grid size-11 place-items-center rounded-[13px_13px_13px_5px] ${tones[tone]}`}
        >
          <Icon name={icon} size={21} />
        </span>
        <span className="rounded-md bg-[#F8F5F0] px-2 py-0.5 text-[9px] font-extrabold text-[#6F7D80]">
          BANCO REAL
        </span>
      </div>
      <strong className="mt-5 block text-3xl font-black">{value}</strong>
      <p className="mt-1 text-xs font-semibold text-[#6F7D80]">{label}</p>
    </article>
  )
}

export function DashboardView({
  appointments,
  counts,
  firstName,
  lostReports,
  pets,
  role,
  userRows,
}: {
  appointments: SerializedAppointment[]
  counts: Counts
  firstName: string
  lostReports: SerializedLostReport[]
  pets: SerializedPet[]
  role: AppRole
  userRows: SerializedUserRow[]
}) {
  const waitingQueue = appointments.filter(
    (a) => a.status === 'waiting' || a.status === 'in_progress',
  )
  const pendingConsults = appointments.filter((a) => a.status === 'scheduled')
  const completedRecords = appointments.filter((a) => a.status === 'completed')

  return (
    <main className="px-5 py-8 md:px-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-[1320px]">
        {role === 'tutor' && (
          <>
            <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
              <div>
                <p className="text-[10px] font-extrabold tracking-[1.7px] text-[#1C7774] uppercase">
                  Dashboard do Tutor
                </p>
                <h1 className="mt-2 text-3xl font-black tracking-[-1.4px] md:text-4xl">
                  Olá, {firstName}. Tudo pronto para cuidar hoje?
                </h1>
                <p className="mt-2 text-sm text-[#6F7D80]">
                  Resumo dos animais cadastrados, próximas consultas, avisos, histórico clínico e
                  acesso rápido à busca de animais.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/sistema/animais"
                  className="flex min-h-11 items-center gap-2 rounded-[13px_13px_13px_5px] bg-[#1C7774] px-5 text-sm font-bold text-white shadow-[0_10px_25px_rgba(28,119,116,.2)]"
                >
                  <Icon name="plus" size={17} /> Cadastrar animal
                </Link>
                <Link
                  href="/sistema/consultas"
                  className="flex min-h-11 items-center gap-2 rounded-xl border border-[#123F3E]/12 bg-white px-5 text-sm font-bold"
                >
                  <Icon name="calendar" size={17} /> Agendar consulta
                </Link>
                <Link
                  href="/sistema/ocorrencias"
                  className="flex min-h-11 items-center gap-2 rounded-xl bg-[#F4B96A]/30 px-5 text-sm font-bold text-[#7A5A24]"
                >
                  <Icon name="search" size={17} /> Busca de animais
                </Link>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <KpiCard
                label="Meus animais cadastrados"
                value={counts.pets}
                icon="paw"
                tone="mint"
              />
              <KpiCard
                label="Próximas consultas"
                value={pendingConsults.length}
                icon="calendar"
                tone="blue"
              />
              <KpiCard
                label="Histórico de atendimentos"
                value={completedRecords.length}
                icon="file"
                tone="dark"
              />
              <KpiCard
                label="Ocorrências na rede"
                value={counts.lostReports}
                icon="search"
                tone="yellow"
              />
            </div>

            <div className="mt-6 grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
              <section className="rounded-[22px_22px_22px_8px] border border-[#123F3E]/8 bg-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-extrabold tracking-[1.4px] text-[#1C7774] uppercase">
                      Meus companheiros
                    </p>
                    <h2 className="mt-1 text-xl font-extrabold">Animais cadastrados</h2>
                  </div>
                  <Link href="/sistema/animais" className="text-xs font-bold text-[#287BA8]">
                    Gerenciar todos →
                  </Link>
                </div>

                {pets.length === 0 ? (
                  <div className="mt-5 grid min-h-48 place-items-center rounded-2xl bg-[#F8F5F0] p-7 text-center">
                    <div>
                      <span className="mx-auto grid size-12 place-items-center rounded-full bg-[#1C7774]/14 text-[#155F5D]">
                        <Icon name="paw" size={22} />
                      </span>
                      <h3 className="mt-4 text-sm font-extrabold">
                        Nenhum animal cadastrado ainda
                      </h3>
                      <p className="mt-1.5 max-w-sm text-xs leading-5 text-[#7D898B]">
                        Cadastre seu cão ou gato para acompanhar vacinas, exames, prontuários e
                        agendar consultas.
                      </p>
                      <Link
                        href="/sistema/animais"
                        className="mt-4 inline-flex rounded-xl bg-[#1C7774] px-4 py-2 text-xs font-bold text-white"
                      >
                        + Cadastrar primeiro pet
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {pets.slice(0, 4).map((pet) => (
                      <Link
                        key={pet.id}
                        href="/sistema/animais"
                        className="flex items-center gap-3.5 rounded-2xl border border-[#123F3E]/8 bg-[#F8F5F0] p-4 transition hover:bg-[#F5E9D8]/60"
                      >
                        <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-[#F5E9D8]">
                          {pet.photoUrl ? (
                            <Image
                              src={pet.photoUrl}
                              alt={pet.name}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          ) : (
                            <span className="grid size-full place-items-center text-[#1C7774]">
                              <Icon name="paw" size={22} />
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <strong className="block truncate text-sm font-black">{pet.name}</strong>
                          <span className="text-xs text-[#6F7D80]">
                            {speciesLabel[pet.species] ?? pet.species}
                            {pet.breed ? ` · ${pet.breed}` : ''}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>

              <section className="relative overflow-hidden rounded-[22px_22px_22px_8px] bg-[#123F3E] p-7 text-white">
                <div className="absolute -bottom-16 -right-12 size-52 rounded-full bg-[#1C7774]/30" />
                <span className="relative grid size-12 place-items-center rounded-[14px_14px_14px_5px] bg-[#F4B96A] text-[#123F3E]">
                  <Icon name="heart" size={23} />
                </span>
                <p className="relative mt-7 text-[9px] font-extrabold tracking-[1.4px] text-[#F4B96A] uppercase">
                  Cuidado centralizado
                </p>
                <h2 className="relative mt-2 text-2xl font-black">
                  Histórico, vacinas e documentos dos seus animais.
                </h2>
                <p className="relative mt-3 text-xs leading-5 text-white/70">
                  Consulte as informações cadastradas e acompanhe os cuidados veterinários de cada
                  animal vinculado à sua conta.
                </p>
                <Link
                  href="/sistema/animais"
                  className="relative mt-6 inline-flex items-center gap-2 rounded-xl bg-[#F58228] px-4 py-2.5 text-xs font-bold text-white"
                >
                  Ver meus animais <Icon name="arrow" size={15} />
                </Link>
              </section>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              <section className="rounded-[22px_22px_22px_8px] border border-[#123F3E]/8 bg-white p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black">Próximas consultas e histórico</h2>
                  <Link href="/sistema/consultas" className="text-xs font-bold text-[#287BA8]">
                    Ver agenda →
                  </Link>
                </div>
                {appointments.length === 0 ? (
                  <p className="mt-4 rounded-2xl bg-[#F8F5F0] p-6 text-center text-xs text-[#6F7D80]">
                    Nenhuma consulta agendada ou registrada no momento.
                  </p>
                ) : (
                  <div className="mt-4 space-y-2.5">
                    {appointments.slice(0, 4).map((apt) => {
                      const badge = statusBadges[apt.status] ?? statusBadges.scheduled
                      return (
                        <div
                          key={apt.id}
                          className="flex items-center justify-between rounded-xl bg-[#F8F5F0] p-3.5 text-xs"
                        >
                          <div>
                            <strong className="block font-extrabold">
                              {apt.petName} · {apt.reason}
                            </strong>
                            <span className="text-[#6F7D80]">
                              {new Intl.DateTimeFormat('pt-BR', {
                                dateStyle: 'short',
                                timeStyle: 'short',
                              }).format(new Date(apt.scheduledAt))}
                            </span>
                          </div>
                          <span
                            className={`rounded-lg px-2.5 py-1 text-[10px] font-extrabold ${badge.cls}`}
                          >
                            {badge.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </section>

              <section className="rounded-[22px_22px_22px_8px] border border-[#123F3E]/8 bg-white p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black">Notificações e busca de animais</h2>
                  <Link href="/animais-perdidos" className="text-xs font-bold text-[#1C7774]">
                    Central pública →
                  </Link>
                </div>
                {lostReports.length === 0 ? (
                  <p className="mt-4 rounded-2xl bg-[#F8F5F0] p-6 text-center text-xs text-[#6F7D80]">
                    Nenhum alerta ou aviso pendente. Você pode publicar ocorrências de animais
                    perdidos ou encontrados em /sistema/ocorrencias.
                  </p>
                ) : (
                  <div className="mt-4 space-y-2.5">
                    {lostReports.slice(0, 3).map((rep) => (
                      <Link
                        key={rep.id}
                        href={`/animais-perdidos/${rep.id}`}
                        className="flex items-center justify-between rounded-xl bg-[#F8F5F0] p-3.5 text-xs"
                      >
                        <div>
                          <strong className="block font-extrabold">{rep.animalName}</strong>
                          <span className="text-[#6F7D80]">
                            {rep.neighborhood}, {rep.city}
                          </span>
                        </div>
                        <span
                          className={`rounded-lg px-2.5 py-1 text-[10px] font-extrabold text-white ${
                            rep.situation === 'lost' ? 'bg-[#C9634C]' : 'bg-[#1C7774]'
                          }`}
                        >
                          {rep.situation === 'lost' ? 'PERDIDO' : 'ENCONTRADO'}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </>
        )}

        {role === 'veterinarian' && (
          <>
            <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
              <div>
                <p className="text-[10px] font-extrabold tracking-[1.7px] text-[#1C7774] uppercase">
                  Dashboard Veterinário
                </p>
                <h1 className="mt-2 text-3xl font-black tracking-[-1.4px] md:text-4xl">
                  Rotina Clínica & Prontuários
                </h1>
                <p className="mt-2 text-sm text-[#6F7D80]">
                  Agenda do dia, pacientes aguardando, consultas pendentes e últimos prontuários.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/sistema/prontuarios"
                  className="flex min-h-11 items-center gap-2 rounded-[13px_13px_13px_5px] bg-[#1C7774] px-5 text-sm font-bold text-white"
                >
                  <Icon name="file" size={17} /> Abrir prontuários
                </Link>
                <Link
                  href="/sistema/agenda"
                  className="flex min-h-11 items-center gap-2 rounded-xl bg-[#123F3E] px-5 text-sm font-bold text-white"
                >
                  <Icon name="calendar" size={17} /> Ver agenda
                </Link>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <KpiCard
                label="Agenda registrada"
                value={counts.appointments}
                icon="calendar"
                tone="mint"
              />
              <KpiCard
                label="Pacientes aguardando"
                value={waitingQueue.length}
                icon="clock"
                tone="yellow"
              />
              <KpiCard
                label="Consultas pendentes"
                value={pendingConsults.length}
                icon="stethoscope"
                tone="blue"
              />
              <KpiCard label="Pacientes cadastrados" value={counts.pets} icon="paw" tone="dark" />
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-[1.3fr_.7fr]">
              <section className="rounded-[22px_22px_22px_8px] border border-[#123F3E]/8 bg-white p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black">Fila clínica e agenda do dia</h2>
                  <Link href="/sistema/fila" className="text-xs font-bold text-[#287BA8]">
                    Gerenciar fila →
                  </Link>
                </div>
                {appointments.length === 0 ? (
                  <p className="mt-5 rounded-2xl bg-[#F8F5F0] p-8 text-center text-xs text-[#6F7D80]">
                    Nenhum paciente aguardando ou agendado no momento.
                  </p>
                ) : (
                  <div className="mt-4 space-y-2.5">
                    {appointments.slice(0, 6).map((apt) => {
                      const badge = statusBadges[apt.status] ?? statusBadges.scheduled
                      return (
                        <div
                          key={apt.id}
                          className="flex items-center justify-between rounded-xl bg-[#F8F5F0] p-4 text-xs"
                        >
                          <div>
                            <strong className="block font-extrabold">
                              {apt.petName} — {apt.reason}
                            </strong>
                            <span className="text-[#6F7D80]">Tutor: {apt.tutorName}</span>
                          </div>
                          <span
                            className={`rounded-lg px-2.5 py-1 text-[10px] font-extrabold ${badge.cls}`}
                          >
                            {badge.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </section>

              <section className="rounded-[22px_22px_22px_8px] bg-[#123F3E] p-6 text-white">
                <span className="inline-flex rounded-lg bg-[#62B9E8]/25 px-2.5 py-1 text-[10px] font-extrabold text-[#62B9E8] uppercase">
                  Rotina clínica
                </span>
                <h2 className="mt-4 text-xl font-black">Prontuários, exames e atendimentos.</h2>
                <p className="mt-2 text-xs leading-5 text-white/70">
                  Acesse os registros clínicos e atualize cada etapa do atendimento veterinário.
                </p>
                <div className="mt-5 grid gap-2 text-xs font-bold">
                  <Link
                    href="/sistema/prontuarios"
                    className="flex items-center justify-between rounded-xl bg-white/10 p-3.5"
                  >
                    Abrir prontuários <Icon name="arrow" size={14} />
                  </Link>
                  <Link
                    href="/sistema/exames"
                    className="flex items-center justify-between rounded-xl bg-white/10 p-3.5"
                  >
                    Solicitações e laudos de exames <Icon name="syringe" size={14} />
                  </Link>
                </div>
              </section>
            </div>
          </>
        )}

        {role === 'administrator' && (
          <>
            <div className="flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
              <div>
                <p className="text-[10px] font-extrabold tracking-[1.7px] text-[#1C7774] uppercase">
                  Dashboard do Administrador
                </p>
                <h1 className="mt-2 text-3xl font-black tracking-[-1.4px] md:text-4xl">
                  Indicadores da Clínica & Governança
                </h1>
                <p className="mt-2 text-sm text-[#6F7D80]">
                  Usuários, equipe, animais cadastrados, consultas, moderação de ocorrências,
                  relatórios, financeiro, estoque e auditoria.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/sistema/relatorios"
                  className="flex min-h-11 items-center gap-2 rounded-[13px_13px_13px_5px] bg-[#1C7774] px-5 text-sm font-bold text-white"
                >
                  <Icon name="chart" size={17} /> Relatórios e indicadores
                </Link>
                <Link
                  href="/sistema/configuracoes"
                  className="flex min-h-11 items-center gap-2 rounded-xl border border-[#123F3E]/12 bg-white px-5 text-sm font-bold"
                >
                  <Icon name="settings" size={17} /> Configurações da clínica
                </Link>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <KpiCard label="Usuários visíveis" value={counts.users} icon="users" tone="mint" />
              <KpiCard label="Animais cadastrados" value={counts.pets} icon="paw" tone="blue" />
              <KpiCard
                label="Consultas registradas"
                value={counts.appointments}
                icon="stethoscope"
                tone="yellow"
              />
              <KpiCard
                label="Ocorrências na rede"
                value={counts.lostReports}
                icon="search"
                tone="dark"
              />
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              <section className="rounded-[22px_22px_22px_8px] border border-[#123F3E]/8 bg-white p-6 lg:col-span-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-black">Contas cadastradas no sistema</h2>
                  <Link href="/sistema/usuarios" className="text-xs font-bold text-[#1C7774]">
                    Gerenciar usuários →
                  </Link>
                </div>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#123F3E]/10 text-[10px] font-extrabold text-[#6F7D80] uppercase">
                        <th className="py-2.5 pr-3">Nome</th>
                        <th className="py-2.5 pr-3">Email</th>
                        <th className="py-2.5 pr-3">Perfil</th>
                        <th className="py-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userRows.map((u) => (
                        <tr key={u.id} className="border-b border-[#123F3E]/6">
                          <td className="py-3 pr-3 font-bold">{u.name}</td>
                          <td className="py-3 pr-3 text-[#6F7D80]">{u.email}</td>
                          <td className="py-3 pr-3 capitalize">{u.role}</td>
                          <td className="py-3">
                            <span className="rounded-md bg-[#1C7774]/14 px-2 py-0.5 text-[10px] font-bold text-[#155F5D]">
                              {u.status === 'active' ? 'Ativo' : 'Inativo'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="rounded-[22px_22px_22px_8px] bg-[#123F3E] p-6 text-white">
                <h2 className="text-lg font-black">Módulos Administrativos</h2>
                <div className="mt-4 grid gap-2 text-xs font-bold">
                  {[
                    { label: 'Equipe veterinária', href: '/sistema/equipe' },
                    { label: 'Moderação de Ocorrências', href: '/sistema/ocorrencias' },
                    { label: 'Catálogo de Serviços', href: '/sistema/servicos' },
                    { label: 'Controle Financeiro', href: '/sistema/financeiro' },
                    { label: 'Gerenciamento de Estoque', href: '/sistema/estoque' },
                    { label: 'Histórico & Auditoria', href: '/sistema/auditoria' },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center justify-between rounded-xl bg-white/10 px-3.5 py-2.5 hover:bg-white/15"
                    >
                      {item.label} <Icon name="arrow" size={14} />
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
