'use server'

import { redirect } from 'next/navigation'
import { appAuth } from '@/lib/app-auth'
import { getPayloadClient } from '@/lib/payload'

export type AuthState = {
  error: string | null
}

const initialState: AuthState = { error: null }

function isDuplicateEmailError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error)
  return /duplicate|already exists|email.*taken|unique/i.test(message)
}

function requiredText(formData: FormData, field: string) {
  const value = formData.get(field)
  return typeof value === 'string' ? value.trim() : ''
}

export async function loginAction(
  _previousState: AuthState = initialState,
  formData: FormData,
): Promise<AuthState> {
  const email = requiredText(formData, 'email').toLowerCase()
  const password = requiredText(formData, 'password')

  if (!email || !password) {
    return { error: 'Preencha seu email e sua senha.' }
  }

  try {
    await appAuth.login(email, password)
  } catch {
    return { error: 'Email ou senha incorretos.' }
  }

  redirect('/sistema')
}

export async function signupAction(
  _previousState: AuthState = initialState,
  formData: FormData,
): Promise<AuthState> {
  const name = requiredText(formData, 'name')
  const email = requiredText(formData, 'email').toLowerCase()
  const phone = requiredText(formData, 'phone')
  const password = requiredText(formData, 'password')
  const confirmation = requiredText(formData, 'confirmation')

  if (name.length < 2) return { error: 'Informe seu nome completo.' }
  if (!email.includes('@')) return { error: 'Informe um email válido.' }
  if (password.length < 8) return { error: 'A senha deve ter pelo menos 8 caracteres.' }
  if (password !== confirmation) return { error: 'As senhas não coincidem.' }

  try {
    const payload = await getPayloadClient()
    await payload.create({
      collection: 'users',
      draft: false,
      data: {
        email,
        name,
        password,
        role: 'tutor',
        status: 'active',
        ...(phone ? { phone } : {}),
      },
      overrideAccess: false,
    })
    await appAuth.login(email, password)
  } catch (error) {
    if (isDuplicateEmailError(error)) {
      return { error: 'Não foi possível criar a conta. Verifique se o email já está cadastrado.' }
    }
    return { error: 'Não foi possível criar a conta. Tente novamente mais tarde.' }
  }

  redirect('/sistema')
}

export async function logoutAction() {
  await appAuth.logout()
  redirect('/')
}
