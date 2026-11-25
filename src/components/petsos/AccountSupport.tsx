'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Icon, Logo } from '@/components/petsos/Icon'

type Mode = 'first-access' | 'recover' | 'verify'

const content = {
  'first-access': {
    eyebrow: 'Primeiro acesso',
    title: 'Vamos preparar seu espaço.',
    description: 'Revise seus dados e escolha como deseja receber as notificações do PetSOS.',
    button: 'Concluir configuração',
  },
  recover: {
    eyebrow: 'Recuperação de acesso',
    title: 'Esqueceu sua senha?',
    description: 'Informe o email da sua conta para receber as instruções de redefinição.',
    button: 'Enviar instruções',
  },
  verify: {
    eyebrow: 'Verificação de conta',
    title: 'Confirme seu email.',
    description: 'Digite o código de verificação enviado para o endereço cadastrado.',
    button: 'Verificar conta',
  },
}

export function AccountSupport({ mode }: { mode: Mode }) {
  const [recoverStep, setRecoverStep] = useState<'request' | 'reset'>('request')
  const [complete, setComplete] = useState(false)
  const [resetError, setResetError] = useState<string | null>(null)
  const view = content[mode]

  return (
    <main className="grid min-h-screen place-items-center bg-[#F5E9D8] p-5">
      <div className="w-full max-w-lg rounded-[28px_28px_28px_10px] border border-[#123F3E]/8 bg-white p-7 shadow-[0_24px_70px_rgba(39,60,66,.12)] sm:p-10">
        <Link href="/" className="inline-flex">
          <Logo />
        </Link>
        {complete ? (
          <div className="py-12 text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#1C7774]/14 text-[#155F5D]">
              <Icon name="check" size={30} />
            </span>
            <h1 className="mt-6 text-2xl font-black">Etapa concluída</h1>
            <p className="mt-3 text-sm leading-6 text-[#6F7D80]">
              Esta interface está pronta. O envio automático de emails será ativado quando um
              provedor de email for conectado.
            </p>
            <Link
              href={mode === 'first-access' ? '/sistema' : '/login'}
              className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#1C7774] px-6 text-sm font-bold text-white"
            >
              Continuar <Icon name="arrow" size={17} />
            </Link>
          </div>
        ) : (
          <>
            <p className="mt-10 text-[10px] font-extrabold tracking-[1.7px] text-[#1C7774] uppercase">
              {view.eyebrow}
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-[-1.2px]">
              {mode === 'recover' && recoverStep === 'reset' ? 'Redefinir sua senha' : view.title}
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#6F7D80]">
              {mode === 'recover' && recoverStep === 'reset'
                ? 'Defina uma nova senha segura com pelo menos 8 caracteres para recuperar o acesso.'
                : view.description}
            </p>
            <form
              className="mt-8 grid gap-4"
              onSubmit={(event) => {
                event.preventDefault()
                if (mode === 'recover' && recoverStep === 'request') {
                  setRecoverStep('reset')
                  return
                }
                if (mode === 'recover' && recoverStep === 'reset') {
                  const data = new FormData(event.currentTarget)
                  const p1 = String(data.get('newPassword') || '')
                  const p2 = String(data.get('confirmNewPassword') || '')
                  if (p1.length < 8) {
                    setResetError('A nova senha deve ter no mínimo 8 caracteres.')
                    return
                  }
                  if (p1 !== p2) {
                    setResetError('As senhas digitadas não coincidem.')
                    return
                  }
                  setResetError(null)
                }
                setComplete(true)
              }}
            >
              {mode === 'recover' && recoverStep === 'request' && (
                <label className="auth-label">
                  Email
                  <input
                    className="auth-input"
                    type="email"
                    required
                    placeholder="voce@email.com"
                  />
                </label>
              )}
              {mode === 'recover' && recoverStep === 'reset' && (
                <>
                  <label className="auth-label">
                    Código recebido
                    <input
                      className="auth-input tracking-[4px]"
                      name="token"
                      required
                      maxLength={6}
                      placeholder="000000"
                    />
                  </label>
                  <label className="auth-label">
                    Nova senha
                    <input
                      className="auth-input"
                      name="newPassword"
                      type="password"
                      required
                      minLength={8}
                      placeholder="Mínimo de 8 caracteres"
                    />
                  </label>
                  <label className="auth-label">
                    Confirmar nova senha
                    <input
                      className="auth-input"
                      name="confirmNewPassword"
                      type="password"
                      required
                      minLength={8}
                      placeholder="Repita a nova senha"
                    />
                  </label>
                  {resetError && (
                    <p
                      role="alert"
                      className="rounded-xl bg-[#C9634C]/10 px-4 py-3 text-xs font-semibold text-[#9A3F2B]"
                    >
                      {resetError}
                    </p>
                  )}
                </>
              )}
              {mode === 'verify' && (
                <label className="auth-label">
                  Código de verificação
                  <input
                    className="auth-input text-center text-lg tracking-[7px]"
                    required
                    maxLength={6}
                    placeholder="000000"
                  />
                </label>
              )}
              {mode === 'first-access' && (
                <>
                  <label className="auth-label">
                    Como prefere ser chamado?
                    <input className="auth-input" required placeholder="Seu nome" />
                  </label>
                  <fieldset className="rounded-2xl border border-[#123F3E]/10 p-4">
                    <legend className="px-2 text-xs font-bold">Notificações</legend>
                    <label className="flex items-center gap-3 py-2 text-sm text-[#596B6E]">
                      <input type="checkbox" defaultChecked /> Lembretes de consultas e vacinas
                    </label>
                    <label className="flex items-center gap-3 py-2 text-sm text-[#596B6E]">
                      <input type="checkbox" defaultChecked /> Possíveis correspondências de animais
                    </label>
                  </fieldset>
                </>
              )}
              <button className="mt-2 flex min-h-13 items-center justify-center gap-2 rounded-[14px_14px_14px_5px] bg-[#1C7774] px-6 font-bold text-white">
                {mode === 'recover' && recoverStep === 'request'
                  ? 'Continuar para redefinição'
                  : mode === 'recover' && recoverStep === 'reset'
                    ? 'Salvar nova senha'
                    : view.button}{' '}
                <Icon name="arrow" size={17} />
              </button>
            </form>
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs font-semibold text-[#596B6E]">
              <Link href="/login" className="hover:text-[#1C7774]">
                Login
              </Link>
              <Link href="/verificar-conta" className="hover:text-[#1C7774]">
                Verificar conta
              </Link>
              <Link href="/primeiro-acesso" className="hover:text-[#1C7774]">
                Primeiro acesso
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
