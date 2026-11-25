import { DashboardView } from '@/components/petsos/DashboardView'
import type { AppRole } from '@/access/app-access'
import { appAuth } from '@/lib/app-auth'
import { loadSystemSnapshot } from '@/lib/petsos-queries'

export default async function SystemPage() {
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

  return (
    <DashboardView
      firstName={(user.name || 'Tutor').split(' ')[0]}
      role={role}
      counts={snapshot.counts}
      pets={snapshot.pets}
      appointments={snapshot.appointments}
      lostReports={snapshot.lostReports}
      userRows={snapshot.userRows}
    />
  )
}
