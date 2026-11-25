import Image from 'next/image'
import Link from 'next/link'
import { connection } from 'next/server'
import type { Where } from 'payload'
import { Icon, Logo } from '@/components/petsos/Icon'
import { getPayloadClient } from '@/lib/payload'

export default async function LostAnimalsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  await connection()
  const filters = await searchParams
  const species = typeof filters.species === 'string' ? filters.species : ''
  const situation = typeof filters.situation === 'string' ? filters.situation : ''
  const city = typeof filters.city === 'string' ? filters.city.trim() : ''
  const breed = typeof filters.breed === 'string' ? filters.breed.trim() : ''
  const color = typeof filters.color === 'string' ? filters.color.trim() : ''
  const size = typeof filters.size === 'string' ? filters.size : ''
  const dateFrom = typeof filters.dateFrom === 'string' ? filters.dateFrom : ''
  const q = typeof filters.q === 'string' ? filters.q.trim() : ''

  const and: Where[] = []
  if (species) and.push({ species: { equals: species } })
  if (situation) and.push({ situation: { equals: situation } })
  if (size) and.push({ size: { equals: size } })
  if (breed) and.push({ breed: { contains: breed } })
  if (color) and.push({ color: { contains: color } })
  if (dateFrom) and.push({ occurredAt: { greater_than_equal: new Date(dateFrom).toISOString() } })
  if (city) {
    and.push({
      or: [{ city: { contains: city } }, { neighborhood: { contains: city } }],
    })
  }
  if (q) {
    and.push({
      or: [{ animalName: { contains: q } }, { description: { contains: q } }],
    })
  }

  // Filter only active/reunited reports for public view (per LostReports.access.read)
  and.push({ status: { in: ['active', 'reunited'] } })

  let result
  try {
    const payload = await getPayloadClient()
    result = await payload.find({
      collection: 'lost-reports',
      depth: 1,
      limit: 24,
      overrideAccess: false,
      sort: '-occurredAt',
      where: and.length ? { and } : {},
    })
  } catch (error) {
    // Payload backend not connected (outside Figma Make environment)
    // Return empty results for the UI to display appropriate empty state
    result = { docs: [], totalDocs: 0 }
  }

  const lostDocs = result.docs.filter((doc) => doc.situation === 'lost')
  const foundDocs = result.docs.filter((doc) => doc.situation === 'found')
  const suggestedMatches = lostDocs.flatMap((lost) =>
    foundDocs
      .filter(
        (found) =>
          found.species === lost.species && found.city.toLowerCase() === lost.city.toLowerCase(),
      )
      .slice(0, 1)
      .map((found) => ({ lost, found })),
  )

  const speciesLabels: Record<string, string> = { dog: 'Cão', cat: 'Gato', other: 'Outro' }
  const sizeLabels: Record<string, string> = {
    small: 'Pequeno',
    medium: 'Médio',
    large: 'Grande',
  }

  return (
    <main className="min-h-screen bg-[#F8F5F0] text-[#123F3E]">
      <header className="border-b border-[#123F3E]/8 bg-white">
        <div className="mx-auto flex h-20 w-[min(1180px,calc(100%-32px))] items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-6 text-xs font-bold text-[#596B6E] md:flex">
            <Link href="/" className="hover:text-[#1C7774]">
              Início institucional
            </Link>
            <Link href="/sistema/ocorrencias" className="hover:text-[#1C7774]">
              Minhas ocorrências
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/login" className="px-4 py-2 text-sm font-bold">
              Entrar
            </Link>
            <Link
              href="/sistema/ocorrencias"
              className="rounded-[12px_12px_12px_4px] bg-[#1C7774] px-5 py-3 text-sm font-bold text-white"
            >
              Publicar alerta
            </Link>
          </div>
        </div>
      </header>

      <section className="bg-[#123F3E] py-16 text-white">
        <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-[10px] font-extrabold tracking-[1.7px] text-[#F4B96A] uppercase">
                Central pública de busca · Perdidos e encontrados
              </p>
              <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-[-1.8px] md:text-5xl">
                Ajude um animal a voltar para casa.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/70">
                Pesquise por espécie, raça, cor, porte, localização aproximada e data. Tutores e
                pessoas que encontraram animais podem publicar e se comunicar com segurança.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Link
                href="/sistema/ocorrencias"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#C9634C] px-4 text-xs font-bold text-white"
              >
                <Icon name="plus" size={15} /> Cadastrar desaparecido
              </Link>
              <Link
                href="/sistema/ocorrencias"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#1C7774] px-4 text-xs font-bold text-white"
              >
                <Icon name="paw" size={15} /> Cadastrar encontrado
              </Link>
            </div>
          </div>

          <form className="mt-9 grid gap-3 rounded-[22px_22px_22px_8px] bg-white p-4 text-[#123F3E] shadow-xl">
            <div className="grid gap-3 md:grid-cols-[1.2fr_1fr_.8fr_.8fr]">
              <label className="flex min-h-12 items-center gap-2 rounded-xl bg-[#F8F5F0] px-4">
                <Icon name="search" size={17} />
                <input
                  name="q"
                  defaultValue={q}
                  className="w-full bg-transparent text-sm outline-none"
                  placeholder="Nome do animal ou característica..."
                />
              </label>
              <label className="flex min-h-12 items-center gap-2 rounded-xl bg-[#F8F5F0] px-4">
                <Icon name="location" size={17} />
                <input
                  name="city"
                  defaultValue={city}
                  className="w-full bg-transparent text-sm outline-none"
                  placeholder="Cidade ou bairro aproximado"
                />
              </label>
              <select
                name="situation"
                defaultValue={situation}
                className="min-h-12 rounded-xl bg-[#F8F5F0] px-4 text-sm outline-none"
              >
                <option value="">Perdidos e encontrados</option>
                <option value="lost">PERDIDOS</option>
                <option value="found">ENCONTRADOS</option>
              </select>
              <select
                name="species"
                defaultValue={species}
                className="min-h-12 rounded-xl bg-[#F8F5F0] px-4 text-sm outline-none"
              >
                <option value="">Todas as espécies</option>
                <option value="dog">Cães</option>
                <option value="cat">Gatos</option>
                <option value="other">Outros</option>
              </select>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-[1fr_1fr_.8fr_.9fr_auto]">
              <input
                name="breed"
                defaultValue={breed}
                placeholder="Raça (ex.: SRD, Poodle)"
                className="min-h-11 rounded-xl bg-[#F8F5F0] px-4 text-xs outline-none"
              />
              <input
                name="color"
                defaultValue={color}
                placeholder="Cor / pelagem (ex.: caramelo)"
                className="min-h-11 rounded-xl bg-[#F8F5F0] px-4 text-xs outline-none"
              />
              <select
                name="size"
                defaultValue={size}
                className="min-h-11 rounded-xl bg-[#F8F5F0] px-4 text-xs outline-none"
              >
                <option value="">Qualquer porte</option>
                <option value="small">Pequeno</option>
                <option value="medium">Médio</option>
                <option value="large">Grande</option>
              </select>
              <input
                type="date"
                name="dateFrom"
                defaultValue={dateFrom}
                aria-label="Data inicial da ocorrência"
                className="min-h-11 rounded-xl bg-[#F8F5F0] px-4 text-xs outline-none"
              />
              <div className="flex gap-2">
                <button className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#1C7774] px-5 text-xs font-bold text-white">
                  <Icon name="filter" size={15} /> Filtrar
                </button>
                {(species || situation || city || breed || color || size || dateFrom || q) && (
                  <Link
                    href="/animais-perdidos"
                    className="flex min-h-11 items-center rounded-xl border border-[#123F3E]/12 px-3 text-xs font-bold text-[#6F7D80]"
                  >
                    Limpar
                  </Link>
                )}
              </div>
            </div>
          </form>
        </div>
      </section>

      <section className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-8 py-12 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-extrabold tracking-[1.5px] text-[#1C7774] uppercase">
                Ocorrências verificáveis
              </p>
              <h2 className="mt-2 text-2xl font-black">
                {result.totalDocs} {result.totalDocs === 1 ? 'publicação' : 'publicações'}
              </h2>
            </div>
          </div>

          {result.docs.length === 0 ? (
            <div className="mt-6 grid min-h-80 place-items-center rounded-[22px_22px_22px_7px] border border-dashed border-[#123F3E]/18 bg-white p-8 text-center">
              <div>
                <span className="mx-auto grid size-15 place-items-center rounded-full bg-[#1C7774]/12 text-[#155F5D]">
                  <Icon name="search" size={27} />
                </span>
                <h3 className="mt-5 text-lg font-extrabold">Nenhuma ocorrência encontrada</h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#7D898B]">
                  Tente outros filtros ou publique um alerta caso esteja procurando um animal.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {result.docs.map((report) => {
                const photo =
                  typeof report.photo === 'object' && report.photo?.url ? report.photo.url : null
                return (
                  <Link
                    key={report.id}
                    href={`/animais-perdidos/${report.id}`}
                    className="overflow-hidden rounded-[20px_20px_20px_7px] border border-[#123F3E]/8 bg-white"
                  >
                    <div className="relative h-52 bg-[#F5E9D8]">
                      {photo ? (
                        <Image
                          src={photo}
                          alt={`Foto de ${report.animalName}`}
                          fill
                          sizes="(max-width: 640px) 100vw, 50vw"
                          className="object-cover"
                        />
                      ) : (
                        <span className="absolute inset-0 grid place-items-center text-[#1C7774]">
                          <Icon name="paw" size={48} />
                        </span>
                      )}
                      <span
                        className={`absolute left-3 top-3 rounded-lg px-3 py-1.5 text-[9px] font-extrabold tracking-[.8px] text-white ${report.situation === 'lost' ? 'bg-[#C9634C]' : 'bg-[#1C7774]'}`}
                      >
                        {report.situation === 'lost' ? 'PERDIDO' : 'ENCONTRADO'}
                      </span>
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg font-extrabold">{report.animalName}</h3>
                        <span className="rounded-md bg-[#F8F5F0] px-2 py-1 text-[10px] font-bold text-[#596B6E]">
                          {speciesLabels[report.species] ?? report.species}
                          {report.size ? ` · ${sizeLabels[report.size] ?? report.size}` : ''}
                        </span>
                      </div>
                      {(report.breed || report.color) && (
                        <p className="mt-1 text-xs text-[#6F7D80]">
                          {[report.breed, report.color].filter(Boolean).join(' · ')}
                        </p>
                      )}
                      <p className="mt-2 flex items-center gap-2 text-xs text-[#6F7D80]">
                        <Icon name="location" size={15} /> {report.neighborhood}, {report.city}
                      </p>
                      <div className="mt-4 flex items-center justify-between border-t border-[#123F3E]/8 pt-3 text-[11px]">
                        <span className="font-bold text-[#9AA4A5]">
                          {new Intl.DateTimeFormat('pt-BR').format(new Date(report.occurredAt))}
                        </span>
                        <span className="font-extrabold text-[#1C7774]">Ver detalhes →</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        <aside className="space-y-5">
          <div className="relative min-h-[300px] overflow-hidden rounded-[22px_22px_22px_7px] bg-[#DDEBE7] p-6">
            <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(#8fb5aa_1px,transparent_1px),linear-gradient(90deg,#8fb5aa_1px,transparent_1px)] [background-size:36px_36px]" />
            <div className="relative rounded-2xl bg-white p-5 shadow-lg">
              <span className="grid size-10 place-items-center rounded-xl bg-[#62B9E8]/15 text-[#287BA8]">
                <Icon name="map" size={20} />
              </span>
              <h3 className="mt-4 text-sm font-extrabold">Mapa de ocorrências aproximadas</h3>
              <p className="mt-2 text-xs leading-5 text-[#7D898B]">
                {result.docs.length === 0
                  ? 'Nenhum pino ativo no momento. Os locais são sempre exibidos por bairro/região aproximada para segurança dos tutores.'
                  : `${result.docs.length} ocorrência(s) mapeada(s) por bairro aproximado na busca atual.`}
              </p>
              {result.docs.slice(0, 3).map((pin) => (
                <div
                  key={pin.id}
                  className="mt-3 flex items-center justify-between rounded-xl bg-[#F8F5F0] px-3 py-2 text-[11px]"
                >
                  <span className="font-bold">{pin.animalName}</span>
                  <span className="text-[#6F7D80]">{pin.neighborhood}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[22px_22px_22px_7px] border border-[#123F3E]/8 bg-white p-6">
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-xl bg-[#F4B96A]/25 text-[#966A25]">
                <Icon name="sparkles" size={18} />
              </span>
              <div>
                <h3 className="text-sm font-extrabold">Possíveis correspondências</h3>
                <p className="text-[11px] text-[#7D898B]">Cruzamento por espécie e cidade</p>
              </div>
            </div>
            {suggestedMatches.length === 0 ? (
              <p className="mt-4 rounded-xl bg-[#F8F5F0] p-3.5 text-xs leading-5 text-[#6F7D80]">
                Quando houver animais perdidos e encontrados com características compatíveis na
                mesma região, o sistema destaca os pares automaticamente aqui.
              </p>
            ) : (
              <div className="mt-4 space-y-2.5">
                {suggestedMatches.map(({ lost, found }) => (
                  <div
                    key={`${lost.id}-${found.id}`}
                    className="rounded-xl border border-[#1C7774]/25 bg-[#1C7774]/8 p-3 text-xs"
                  >
                    <strong className="block text-[#155F5D]">Compatibilidade em {lost.city}</strong>
                    <span className="text-[#596B6E]">
                      Perdido: {lost.animalName} ↔ Encontrado: {found.animalName}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </section>
    </main>
  )
}
