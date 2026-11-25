import { redirect } from 'next/navigation'
import type { AppRole } from '@/access/app-access'
import { AppShell } from '@/components/petsos/AppShell'
import { appAuth } from '@/lib/app-auth'

export default async function SystemLayout({ children }: { children: React.ReactNode }) {
  let user
  try {
    user = await appAuth.currentUser()
  } catch (error) {
    // Payload backend not connected (outside Figma Make environment)
    // Redirect to login - user can't authenticate without backend
    redirect('/login')
  }

  if (!user) redirect('/login')

  const role = (user.role ?? 'tutor') as AppRole

  return (
    <AppShell name={user.name || 'Usuário PetSOS'} role={role}>
      {children}
    </AppShell>
  )
}
