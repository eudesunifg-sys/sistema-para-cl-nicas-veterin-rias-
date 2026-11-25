'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import type { AuthState } from '@/app/(frontend)/auth-actions'
import { Icon, Logo } from '@/components/petsos/Icon'

type AuthAction = (state: AuthState, formData: FormData) => Promise<AuthState>

export function AuthForm({ action, mode }: { action: AuthAction; mode: 'login' | 'signup' }) {
  const [state, formAction, pending] = useActionState(action, { error: null })
  const isLogin = mode === 'login'

  return (
    <main className="min-h-screen bg-[#F5E9D8] lg:grid lg:grid-cols-[0.9fr_1.1fr]">
      <section className="relative hidden overflow-hidden bg-[#123F3E] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-24 top-12 size-80 rounded-full bg-[#62B9E8]/30" />
        <div className="absolute -bottom-32 -left-20 size-96 rounded-full bg-[#F4B96A]" />
        <Link href="/" className="relative z-10 w-fit">
          <Logo light />
        </Link>
        <div className="relative z-10 max-w-md">
          <span className="mb-7 grid size-14 place-items-center rounded-[18px_18px_18px_6px] bg-white/15">
            <Icon name="heart" size={27} />
          </span>
          <h2 className="text-5xl leading-[1.04] font-black tracking-[-2px]">
            Cuidado que acompanha cada fase.
          </h2>
          <p className="mt-6 text-base leading-7 text-white/75">
            Consultas, informações do seu animal e uma rede para ajudar pets perdidos — tudo em um
            só lugar.
          </p>
        </div>
        <p className="relative z-10 text-xs text-white/60">
          PetSOS · Cuidado, proteção e reencontros
        </p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-12 inline-flex lg:hidden">
            <Logo />
          </Link>
          <p className="mb-3 text-[11px] font-extrabold tracking-[1.8px] text-[#1C7774] uppercase">
            {isLogin ? 'Boas-vindas de volta' : 'Comece agora'}
          </p>
          <h1 className="text-4xl font-black tracking-[-1.5px] text-[#123F3E]">
            {isLogin ? 'Entre na sua conta' : 'Crie sua conta'}
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#6F7D80]">
            {isLogin
              ? 'Acesse seus pets, consultas e alertas.'
              : 'Leva menos de dois minutos para fazer parte.'}
          </p>

          <form action={formAction} className="mt-9 grid gap-4">
            {!isLogin && (
              <>
                <label className="auth-label">
                  Nome completo
                  <input
                    className="auth-input"
                    name="name"
                    required
                    autoComplete="name"
                    placeholder="Como podemos chamar você?"
                  />
                </label>
                <label className="auth-label">
                  Telefone <span>(opcional)</span>
                  <input
                    className="auth-input"
                    name="phone"
                    autoComplete="tel"
                    placeholder="(11) 99999-9999"
                  />
                </label>
              </>
            )}
            <label className="auth-label">
              Email
              <input
                className="auth-input"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="voce@email.com"
              />
            </label>
            <label className="auth-label">
              Senha
              <input
                className="auth-input"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                placeholder="Mínimo de 8 caracteres"
              />
            </label>
            {isLogin && (
              <Link
                href="/recuperar-senha"
                className="-mt-2 justify-self-end text-xs font-bold text-[#287BA8]"
              >
                Esqueci minha senha
              </Link>
            )}
            {!isLogin && (
              <label className="auth-label">
                Confirme a senha
                <input
                  className="auth-input"
                  name="confirmation"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Digite a senha novamente"
                />
              </label>
            )}
            {state.error && (
              <p
                role="alert"
                className="rounded-xl border border-[#C9634C]/25 bg-[#C9634C]/10 px-4 py-3 text-sm font-medium text-[#9A3F2B]"
              >
                {state.error}
              </p>
            )}
            <button
              disabled={pending}
              className="mt-2 flex min-h-13 items-center justify-center gap-2 rounded-[14px_14px_14px_5px] bg-[#1C7774] px-6 font-bold text-white shadow-[0_10px_25px_rgba(28,119,116,.24)] transition hover:-translate-y-0.5 disabled:opacity-60"
            >
              {pending ? 'Aguarde...' : isLogin ? 'Entrar no PetSOS' : 'Criar minha conta'}{' '}
              <Icon name="arrow" size={18} />
            </button>
          </form>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-[#123F3E]/10 pt-5 text-xs font-semibold text-[#596B6E]">
            <Link href="/verificar-conta" className="hover:text-[#1C7774]">
              Verificar conta
            </Link>
            <span>·</span>
            <Link href="/primeiro-acesso" className="hover:text-[#1C7774]">
              Primeiro acesso
            </Link>
          </div>

          <p className="mt-7 text-center text-sm text-[#6F7D80]">
            {isLogin ? 'Ainda não tem uma conta?' : 'Já possui cadastro?'}{' '}
            <Link
              className="font-bold text-[#123F3E] underline decoration-[#F4B96A] decoration-2 underline-offset-4"
              href={isLogin ? '/cadastro' : '/login'}
            >
              {isLogin ? 'Cadastre-se' : 'Faça login'}
            </Link>
          </p>
          <Link
            href="/"
            className="mt-9 flex items-center justify-center gap-2 text-xs font-semibold text-[#6F7D80]"
          >
            ← Voltar para a apresentação
          </Link>
        </div>
      </section>
    </main>
  )
}
