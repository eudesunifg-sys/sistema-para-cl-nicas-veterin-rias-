import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { connection } from 'next/server'
import { Icon, Logo } from '@/components/petsos/Icon'
import { LostDetailActions } from '@/components/petsos/LostDetailActions'
import { getPayloadClient } from '@/lib/payload'

export default async function LostAnimalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await connection()
  const { id } = await params

  let report
  try {
    const payload = await getPayloadClient()
    report = await payload.find({
      collection: 'lost-reports',
      where: { id: { equals: id } },
      depth: 1,
      limit: 1,
      overrideAccess: false,
    }).then((res) => res.docs[0] ?? null)
  } catch {
    // Payload backend not connected (outside Figma Make environment)
    // Show the not-found page gracefully
    notFound()
  }

  if (!report) notFound()
  const photo = typeof report.photo === 'object' && report.photo?.url ? report.photo.url : null
  const speciesLabels: Record<string, string> = { dog: 'Cão', cat: 'Gato', other: 'Outro' }
  const sizeLabels: Record<string, string> = {
    small: 'Pequeno',
    medium: 'Médio',
    large: 'Grande',
  }

  return (
    <main className="min-h-screen bg-[#F8F5F0] text-[#123F3E]">
      <header className="border-b border-[#123F3E]/8 bg-white">
        <div className="mx-auto flex h-20 w-[min(1080px,calc(100%-32px))] items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <Link href="/animais-perdidos" className="text-sm font-bold text-[#287BA8]">
            ← Voltar para a busca
          </Link>
        </div>
      </header>
      <div className="mx-auto grid w-[min(1080px,calc(100%-32px))] gap-8 py-12 lg:grid-cols-[1fr_.85fr]">
        <div className="relative min-h-[440px] overflow-hidden rounded-[26px_26px_26px_9px] bg-[#F5E9D8]">
          {photo ? (
            <Image
              src={photo}
              alt={`Foto de ${report.animalName}`}
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
          ) : (
            <span className="absolute inset-0 grid place-items-center text-[#1C7774]">
              <Icon name="paw" size={90} />
            </span>
          )}
        </div>
        <section className="rounded-[26px_26px_26px_9px] bg-white p-7 md:p-9">
          <span
            className={`inline-flex rounded-lg px-3 py-1.5 text-[9px] font-extrabold tracking-[.8px] text-white ${report.situation === 'lost' ? 'bg-[#C9634C]' : 'bg-[#1C7774]'}`}
          >
            {report.situation === 'lost' ? 'ANIMAL PERDIDO' : 'ANIMAL ENCONTRADO'}
          </span>
          <h1 className="mt-5 text-4xl font-black tracking-[-1.5px]">{report.animalName}</h1>
          <div className="mt-5 flex items-start gap-3 rounded-2xl bg-[#F8F5F0] p-4">
            <Icon name="location" size={20} />
            <div>
              <small className="text-[9px] font-extrabold tracking-[1px] text-[#9AA4A5] uppercase">
                Local aproximado
              </small>
              <p className="mt-1 text-sm font-bold">
                {report.neighborhood}, {report.city}
              </p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <small className="text-[#9AA4A5]">Espécie</small>
              <strong className="mt-1 block">
                {speciesLabels[report.species] ?? report.species}
              </strong>
            </div>
            <div>
              <small className="text-[#9AA4A5]">Cor</small>
              <strong className="mt-1 block">{report.color || 'Não informada'}</strong>
            </div>
            <div>
              <small className="text-[#9AA4A5]">Raça</small>
              <strong className="mt-1 block">{report.breed || 'Não informada'}</strong>
            </div>
            <div>
              <small className="text-[#9AA4A5]">Porte / Data</small>
              <strong className="mt-1 block">
                {report.size ? `${sizeLabels[report.size] ?? report.size} · ` : ''}
                {new Intl.DateTimeFormat('pt-BR').format(new Date(report.occurredAt))}
              </strong>
            </div>
          </div>
          <div className="mt-7 border-t border-[#123F3E]/8 pt-6">
            <h2 className="text-sm font-extrabold">Sobre a ocorrência</h2>
            <p className="mt-3 text-sm leading-6 text-[#6F7D80]">{report.description}</p>
          </div>
          <LostDetailActions animalName={report.animalName} situation={report.situation} />
        </section>
      </div>
    </main>
  )
}
