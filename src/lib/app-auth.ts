import 'server-only'

import { cookies } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'

const APP_SESSION_COOKIE = 'app-session'
const APP_USER_COLLECTION = 'users' as const

export function createAppAuth(collection: typeof APP_USER_COLLECTION) {
  return {
    async login(email: string, password: string) {
      const payload = await getPayloadClient()
      const result = await payload.login({
        collection,
        data: { email, password },
        overrideAccess: false,
      })

      if (!result.token || !result.user || result.user.collection !== collection) {
        throw new Error('Não foi possível iniciar a sessão.')
      }

      const cookieStore = await cookies()
      cookieStore.set(APP_SESSION_COOKIE, result.token, {
        httpOnly: true,
        maxAge: result.exp
          ? Math.max(result.exp - Math.floor(Date.now() / 1000), 60)
          : 60 * 60 * 24 * 7,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      })

      return result.user
    },

    async logout() {
      const cookieStore = await cookies()
      cookieStore.delete(APP_SESSION_COOKIE)
    },

    async currentUser() {
      const token = (await cookies()).get(APP_SESSION_COOKIE)?.value
      if (!token) return null

      const payload = await getPayloadClient()
      const authHeaders = new Headers({ Authorization: `JWT ${token}` })
      const { user } = await payload.auth({ headers: authHeaders })

      if (!user || user.collection !== collection) return null
      return user
    },
  }
}

export const appAuth = createAppAuth(APP_USER_COLLECTION)
