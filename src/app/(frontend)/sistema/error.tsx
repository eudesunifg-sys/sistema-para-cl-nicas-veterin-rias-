'use client'

import { useRouter } from 'next/navigation'
import { logoutAction } from '@/app/(frontend)/auth-actions'
import { Icon } from '@/components/petsos/Icon'

export default function SystemError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  return (
    <main className="grid min-h-screen place-items-center bg-[#F8F5F0] p-6 text-[#123F3E]">
      <div className="w-full max-w-md rounded-[26px_26px_26px_9px] border border-[#123F3E]/10 bg-white p-8 text-center shadow-lg">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#F4B96A]/25 text-[#966A25]">
          <Icon name="shield" size={26} />
        </span>
        <h1 className="mt-5 text-2xl font-black">Algo saiu do esperado</h1>
        <p className="mt-2 text-sm leading-6 text-[#6F7D80]">
          Não conseguimos carregar esta tela agora. Você pode tentar novamente ou encerrar sua
          sessão com segurança.
        </p>
        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => {
              reset()
              router.refresh()
            }}
            className="min-h-11 rounded-xl bg-[#1C7774] px-5 text-sm font-bold text-white"
          >
            Tentar novamente
          </button>
          <form action={logoutAction}>
            <button className="min-h-11 w-full rounded-xl border border-[#123F3E]/15 px-5 text-sm font-bold text-[#123F3E]">
              Sair da conta
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
