'use client'

import { useState } from 'react'
import { Icon } from '@/components/petsos/Icon'

export function LostDetailActions({
  animalName,
  situation,
}: {
  animalName: string
  situation: 'lost' | 'found'
}) {
  const [panel, setPanel] = useState<'none' | 'contact' | 'report'>('none')
  const [sentMessage, setSentMessage] = useState(false)
  const [sentReport, setSentReport] = useState(false)

  return (
    <div className="mt-7 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => {
            setPanel(panel === 'contact' ? 'none' : 'contact')
            setSentMessage(false)
          }}
          className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-[14px_14px_14px_5px] bg-[#1C7774] px-5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(28,119,116,.22)]"
        >
          <Icon name="message" size={18} />
          {situation === 'lost'
            ? 'Avistei ou encontrei este animal'
            : 'Sou o tutor / Tenho informações'}
        </button>
        <button
          type="button"
          onClick={() => {
            setPanel(panel === 'report' ? 'none' : 'report')
            setSentReport(false)
          }}
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#123F3E]/15 px-4 text-xs font-bold text-[#596B6E] hover:border-[#C9634C]/40 hover:text-[#9A3F2B]"
        >
          <Icon name="flag" size={16} /> Denunciar publicação
        </button>
      </div>

      {panel === 'contact' && (
        <div className="rounded-2xl border border-[#1C7774]/25 bg-[#F8F5F0] p-5">
          {sentMessage ? (
            <div className="flex items-start gap-3 text-sm text-[#155F5D]">
              <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-[#1C7774] text-white">
                <Icon name="check" size={15} />
              </span>
              <div>
                <strong className="block font-extrabold">
                  Mensagem registrada para {animalName}
                </strong>
                <p className="mt-1 text-xs leading-5 text-[#596B6E]">
                  O responsável pela publicação receberá seu relato e contato na Central de
                  Comunicação do PetSOS.
                </p>
              </div>
            </div>
          ) : (
            <form
              className="grid gap-3"
              onSubmit={(e) => {
                e.preventDefault()
                setSentMessage(true)
              }}
            >
              <h3 className="text-sm font-extrabold">Enviar mensagem segura ao responsável</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  required
                  placeholder="Seu nome"
                  className="h-11 rounded-xl border border-[#123F3E]/12 bg-white px-3.5 text-xs outline-none focus:border-[#1C7774]"
                />
                <input
                  required
                  placeholder="Seu telefone ou WhatsApp"
                  className="h-11 rounded-xl border border-[#123F3E]/12 bg-white px-3.5 text-xs outline-none focus:border-[#1C7774]"
                />
              </div>
              <textarea
                required
                rows={3}
                placeholder="Conte onde e quando viu o animal, estado aparente e ponto de referência..."
                className="rounded-xl border border-[#123F3E]/12 bg-white p-3.5 text-xs outline-none focus:border-[#1C7774]"
              />
              <button className="min-h-11 rounded-xl bg-[#123F3E] px-5 text-xs font-bold text-white">
                Enviar relato agora
              </button>
            </form>
          )}
        </div>
      )}

      {panel === 'report' && (
        <div className="rounded-2xl border border-[#C9634C]/25 bg-[#FFF6F4] p-5">
          {sentReport ? (
            <p className="text-xs font-semibold leading-5 text-[#9A3F2B]">
              Denúncia encaminhada à equipe de moderação administrativa do PetSOS. Obrigado por
              ajudar a manter a rede segura.
            </p>
          ) : (
            <form
              className="grid gap-3"
              onSubmit={(e) => {
                e.preventDefault()
                setSentReport(true)
              }}
            >
              <h3 className="text-sm font-extrabold text-[#9A3F2B]">Denunciar esta publicação</h3>
              <select
                required
                className="h-11 rounded-xl border border-[#C9634C]/25 bg-white px-3.5 text-xs outline-none"
              >
                <option value="">Selecione o motivo</option>
                <option value="scam">Pedido indevido de dinheiro / tentativa de golpe</option>
                <option value="fake">Informações falsas ou imagem enganosa</option>
                <option value="duplicate">Publicação duplicada ou já encerrada</option>
                <option value="other">Outro motivo</option>
              </select>
              <textarea
                required
                rows={2}
                placeholder="Descreva brevemente o problema para nossa moderação..."
                className="rounded-xl border border-[#C9634C]/25 bg-white p-3 text-xs outline-none"
              />
              <button className="min-h-10 rounded-xl bg-[#C9634C] px-4 text-xs font-bold text-white">
                Confirmar denúncia
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
