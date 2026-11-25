'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { logoutAction } from '@/app/(frontend)/auth-actions'
import type { AppRole } from '@/access/app-access'
import { Icon, type IconName, Logo } from '@/components/petsos/Icon'

type NavItem = {
  label: string
  href: string
  icon: IconName
}

const common: NavItem[] = [{ label: 'Visão geral', href: '/sistema', icon: 'home' }]

const menus: Record<AppRole, NavItem[]> = {
  tutor: [
    ...common,
    { label: 'Meus animais', href: '/sistema/animais', icon: 'paw' },
    { label: 'Consultas', href: '/sistema/consultas', icon: 'calendar' },
    { label: 'Prontuários', href: '/sistema/prontuarios', icon: 'file' },
    { label: 'Pets perdidos', href: '/sistema/ocorrencias', icon: 'search' },
    { label: 'Mensagens', href: '/sistema/mensagens', icon: 'message' },
    { label: 'Notificações', href: '/sistema/notificacoes', icon: 'shield' },
  ],
  veterinarian: [
    ...common,
    { label: 'Minha agenda', href: '/sistema/agenda', icon: 'calendar' },
    { label: 'Fila de atendimento', href: '/sistema/fila', icon: 'clock' },
    { label: 'Pacientes', href: '/sistema/pacientes', icon: 'paw' },
    { label: 'Prontuários', href: '/sistema/prontuarios', icon: 'file' },
    { label: 'Exames', href: '/sistema/exames', icon: 'syringe' },
    { label: 'Notificações', href: '/sistema/notificacoes', icon: 'bell' },
  ],
  administrator: [
    ...common,
    { label: 'Usuários', href: '/sistema/usuarios', icon: 'users' },
    { label: 'Equipe', href: '/sistema/equipe', icon: 'briefcase' },
    { label: 'Ocorrências', href: '/sistema/ocorrencias', icon: 'search' },
    { label: 'Relatórios', href: '/sistema/relatorios', icon: 'chart' },
    { label: 'Serviços', href: '/sistema/servicos', icon: 'stethoscope' },
    { label: 'Financeiro', href: '/sistema/financeiro', icon: 'file' },
    { label: 'Estoque', href: '/sistema/estoque', icon: 'box' },
    { label: 'Auditoria', href: '/sistema/auditoria', icon: 'shield' },
    { label: 'Configurações', href: '/sistema/configuracoes', icon: 'settings' },
  ],
}

const roleLabels: Record<AppRole, string> = {
  administrator: 'Administrador',
  tutor: 'Tutor',
  veterinarian: 'Veterinário',
}

export function AppShell({
  children,
  name,
  role,
}: {
  children: React.ReactNode
  name: string
  role: AppRole
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return (
    <div className="min-h-screen bg-[#FBF7EF] text-[#123F3E]">
      {open && (
        <button
          className="fixed inset-0 z-40 bg-[#123F3E]/45 lg:hidden"
          onClick={() => setOpen(false)}
          aria-label="Fechar menu"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[278px] flex-col border-r border-[#123F3E]/8 bg-white transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-22 items-center justify-between px-7">
          <Link href="/sistema" onClick={() => setOpen(false)}>
            <Logo />
          </Link>
          <button className="text-[#6F7D80] lg:hidden" onClick={() => setOpen(false)}>
            <Icon name="close" />
          </button>
        </div>

        <div className="mx-5 mb-6 rounded-2xl bg-[#F5E9D8]/65 p-3.5">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-[13px_13px_13px_5px] bg-[#1C7774] text-xs font-bold text-white">
              {initials || 'PS'}
            </span>
            <span className="min-w-0">
              <strong className="block truncate text-sm">{name}</strong>
              <small className="text-[11px] text-[#6F7D80]">{roleLabels[role]}</small>
            </span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4" aria-label="Menu do sistema">
          <p className="mb-2 px-3 text-[9px] font-extrabold tracking-[1.5px] text-[#9AA4A5] uppercase">
            Menu principal
          </p>
          <div className="grid gap-1">
            {menus[role].map((item) => {
              const active =
                item.href === '/sistema' ? pathname === '/sistema' : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex min-h-11 items-center gap-3 rounded-xl px-3.5 text-[13px] font-semibold transition ${
                    active
                      ? 'bg-[#1C7774] text-white shadow-[0_8px_20px_rgba(28,119,116,.2)]'
                      : 'text-[#596B6E] hover:bg-[#F5E9D8]/60 hover:text-[#123F3E]'
                  }`}
                >
                  <Icon name={item.icon} size={18} />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="border-t border-[#123F3E]/8 p-4">
          <Link
            href="/"
            className="mb-1 flex min-h-10 items-center gap-3 rounded-xl px-3.5 text-xs font-semibold text-[#6F7D80] hover:bg-[#F5E9D8]/60"
          >
            <Icon name="home" size={17} /> Site público
          </Link>
          <form action={logoutAction}>
            <button className="flex min-h-10 w-full items-center gap-3 rounded-xl px-3.5 text-xs font-semibold text-[#B55742] hover:bg-[#B55742]/8">
              <Icon name="arrow" size={17} /> Sair da conta
            </button>
          </form>
        </div>
      </aside>

      <div className="lg:pl-[278px]">
        <header className="sticky top-0 z-30 flex h-19 items-center justify-between border-b border-[#123F3E]/8 bg-white/95 px-5 backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-3">
            <button
              className="grid size-10 place-items-center rounded-xl border border-[#123F3E]/10 text-[#123F3E] lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Abrir menu"
            >
              <Icon name="menu" />
            </button>
            <div className="relative hidden w-[min(360px,32vw)] sm:block">
              <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[#7D898B]">
                <Icon name="search" size={17} />
              </span>
              <input
                className="h-10 w-full rounded-xl bg-[#F8F5F0] pl-10 pr-3 text-xs outline-none focus:ring-2 focus:ring-[#1C7774]/20"
                placeholder="Buscar no PetSOS..."
                aria-label="Buscar no sistema"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/animais-perdidos"
              className="hidden rounded-xl bg-[#62B9E8]/12 px-4 py-2.5 text-xs font-bold text-[#287BA8] md:block"
            >
              Central de busca
            </Link>
            <Link
              href="/sistema/notificacoes"
              className="relative grid size-10 place-items-center rounded-xl border border-[#123F3E]/10 text-[#596B6E]"
              aria-label="Notificações"
            >
              <Icon name="bell" size={18} />
              <span className="absolute right-2 top-2 size-2 rounded-full bg-[#F4B96A]" />
            </Link>
          </div>
        </header>
        {children}
      </div>
    </div>
  )
}
