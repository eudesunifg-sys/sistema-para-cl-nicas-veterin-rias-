import { notFound } from 'next/navigation'
import type { AppRole } from '@/access/app-access'
import { ModuleView } from '@/components/petsos/ModuleView'
import { appAuth } from '@/lib/app-auth'
import { loadSystemSnapshot } from '@/lib/petsos-queries'

const allowedByRole: Record<AppRole, Set<string>> = {
  tutor: new Set([
    'animais',
    'consultas',
    'prontuarios',
    'ocorrencias',
    'mensagens',
    'notificacoes',
  ]),
  veterinarian: new Set(['agenda', 'fila', 'pacientes', 'prontuarios', 'exames', 'notificacoes']),
  administrator: new Set([
    'usuarios',
    'equipe',
    'ocorrencias',
    'relatorios',
    'servicos',
    'financeiro',
    'estoque',
    'auditoria',
    'configuracoes',
  ]),
}

export default async function SystemSectionPage({
  params,
}: {
  params: Promise<{ section: string }>
}) {
  const { section } = await params
  let user
  try {
    user = await appAuth.currentUser()
  } catch (error) {
    // Payload backend not connected (outside Figma Make environment)
    return null
  }
  if (!user) return null

  let snapshot
  try {
    snapshot = await loadSystemSnapshot(user)
  } catch (error) {
    // Payload backend not connected (outside Figma Make environment)
    return null
  }

  const role = (user.role ?? 'tutor') as AppRole

  if (!allowedByRole[role].has(section)) notFound()

  return (
    <ModuleView
      role={role}
      section={section}
      pets={snapshot.pets}
      appointments={snapshot.appointments}
      lostReports={snapshot.lostReports}
      userRows={snapshot.userRows}
    />
  )
}
