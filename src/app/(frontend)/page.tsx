import Image from 'next/image'
import Link from 'next/link'
import { Icon, Logo } from '@/components/petsos/Icon'

const benefits = [
  {
    icon: 'stethoscope' as const,
    title: 'Clínica e consultas',
    text: 'Agenda diária, semanal e mensal, fila de atendimento, vacinação e prontuário eletrônico completo.',
    accent: 'bg-[#62B9E8]/20 text-[#123F3E]',
  },
  {
    icon: 'paw' as const,
    title: 'Tudo sobre seu animal',
    text: 'Perfil completo com foto, peso, porte, microchip, documentos, exames e responsáveis vinculados.',
    accent: 'bg-[#F4B96A]/25 text-[#966A25]',
  },
  {
    icon: 'search' as const,
    title: 'Busca de pets perdidos',
    text: 'Central pública com filtros detalhados, mapa aproximado, correspondências e comunicação segura.',
    accent: 'bg-[#1C7774]/15 text-[#1C7774]',
  },
]

const roleCards = [
  {
    role: 'Tutor',
    icon: 'heart' as const,
    badge: 'Famílias e responsáveis',
    description:
      'Gerencia seus animais, acompanha consultas, acessa prontuários e participa da rede pública de busca.',
  },
  {
    role: 'Veterinário',
    icon: 'stethoscope' as const,
    badge: 'Corpo clínico',
    description:
      'Conduz anamnese, exame clínico, diagnóstico, prescrições, exames, vacinas e atualiza prontuários.',
  },
  {
    role: 'Administrador',
    icon: 'shield' as const,
    badge: 'Gestão integrada',
    description:
      'Acompanha indicadores reais, equipe, serviços, financeiro, estoque, auditoria e moderação de ocorrências.',
  },
]

export default function HomePage() {
  return (
    <main className="overflow-hidden bg-[#FBF7EF] text-[#123F3E]">
      <header className="relative z-20 border-b border-[#123F3E]/10 bg-[#FBF7EF]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-20 w-[min(1160px,calc(100%-32px))] items-center justify-between">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm font-semibold text-[#596B6E] md:flex">
            <a href="#sobre" className="hover:text-[#1C7774]">
              Conheça o PetSOS
            </a>
            <a href="#recursos" className="hover:text-[#1C7774]">
              Módulos
            </a>
            <a href="#perfis" className="hover:text-[#1C7774]">
              Perfis de acesso
            </a>
            <Link href="/animais-perdidos" className="hover:text-[#1C7774]">
              Busca pública
            </Link>
          </nav>
          <div className="flex items-center gap-2.5">
            <Link
              href="/login"
              className="hidden min-h-11 items-center rounded-xl px-4 text-sm font-bold text-[#123F3E] sm:flex"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="flex min-h-11 items-center rounded-[12px_12px_12px_4px] bg-[#F58228] px-5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(245,130,40,.24)]"
            >
              Criar conta
            </Link>
          </div>
        </div>
      </header>

      <section className="relative pb-24 pt-16 lg:pb-32 lg:pt-24">
        <div className="absolute -left-36 -top-32 size-96 rounded-full bg-[#F4B96A]/15" />
        <div className="mx-auto grid w-[min(1160px,calc(100%-32px))] items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative z-10">
            <p className="mb-5 flex items-center gap-2 text-[11px] font-extrabold tracking-[1.8px] text-[#123F3E] uppercase">
              <span className="grid size-7 place-items-center rounded-full bg-[#62B9E8]/20">
                <Icon name="heart" size={14} />
              </span>{' '}
              Cuidado que aproxima
            </p>
            <h1 className="max-w-[650px] text-[clamp(48px,7vw,78px)] leading-[0.98] font-black tracking-[-4px]">
              Mais cuidado.
              <br />
              <span className="relative text-[#123F3E] after:absolute after:-bottom-1 after:left-0 after:h-2 after:w-[82%] after:-rotate-1 after:rounded-full after:bg-[#F4B96A]">
                Menos complicação.
              </span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-[#6F7D80]">
              O PetSOS reúne a saúde do seu animal e uma rede de busca por pets perdidos em uma
              experiência simples, acolhedora e feita para o dia a dia.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/cadastro"
                className="flex min-h-14 items-center justify-center gap-2 rounded-[15px_15px_15px_5px] bg-[#F58228] px-7 font-bold text-white shadow-[0_12px_28px_rgba(245,130,40,.26)] transition hover:-translate-y-0.5"
              >
                Começar gratuitamente <Icon name="arrow" size={18} />
              </Link>
              <Link
                href="/animais-perdidos"
                className="flex min-h-14 items-center justify-center gap-2 rounded-[15px_15px_15px_5px] border border-[#123F3E]/25 bg-white/70 px-7 font-bold text-[#123F3E] transition hover:bg-white"
              >
                <Icon name="search" size={18} /> Central de pets perdidos
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-3 text-xs text-[#6F7D80]">
              <span className="grid size-8 place-items-center rounded-full bg-[#123F3E] font-bold text-white">
                +
              </span>
              <span>
                <strong className="block text-[#123F3E]">Faça parte dessa rede</strong>cadastre-se
                para começar
              </span>
            </div>
          </div>

          <div className="relative mx-auto h-[470px] w-full max-w-[600px] lg:h-[540px]">
            <div className="absolute left-0 top-7 size-40 rounded-full bg-[#F58228]" />
            <div className="absolute bottom-5 right-1 size-28 rounded-full bg-[#F4B96A]" />
            <div className="absolute inset-y-0 right-0 w-[88%] overflow-hidden rounded-[48%_48%_28px_28px] bg-[#F5E9D8] shadow-[0_24px_65px_rgba(24,66,62,.16)]">
              <Image
                src="/images/pets-hero.png"
                alt="Cachorro e gato juntos representando o cuidado PetSOS"
                fill
                priority
                unoptimized
                sizes="(max-width: 1024px) 90vw, 52vw"
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-12 left-1 flex items-center gap-3 rounded-[16px_16px_16px_5px] border border-[#123F3E]/10 bg-white/95 p-3.5 pr-5 shadow-[0_16px_40px_rgba(24,66,62,.16)]">
              <span className="grid size-10 place-items-center rounded-[12px_12px_12px_4px] bg-[#F58228] text-white">
                <Icon name="heart" size={19} />
              </span>
              <span className="text-xs">
                <strong className="block">Uma rede de cuidado</strong>
                <small className="text-[#6F7D80]">Clínica e comunidade juntas</small>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section id="sobre" className="bg-[#123F3E] py-20 text-white lg:py-24">
        <div className="mx-auto grid w-[min(1160px,calc(100%-32px))] gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
          <div>
            <p className="mb-4 text-[11px] font-extrabold tracking-[1.8px] text-[#F4B96A] uppercase">
              Um sistema, muitas formas de cuidar
            </p>
            <h2 className="text-4xl leading-tight font-black tracking-[-1.8px] lg:text-5xl">
              O PetSOS acompanha você nos momentos tranquilos e nos urgentes.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px_24px_24px_8px] bg-white/10 p-7">
              <Icon name="calendar" size={28} />
              <h3 className="mt-6 text-xl font-extrabold">No cuidado diário</h3>
              <p className="mt-3 text-sm leading-6 text-white/70">
                Acompanhe consultas e concentre as principais informações do seu animal.
              </p>
            </div>
            <div className="rounded-[24px_24px_24px_8px] bg-[#F4B96A] p-7 text-[#123F3E]">
              <Icon name="search" size={28} />
              <h3 className="mt-6 text-xl font-extrabold">Quando ele se perde</h3>
              <p className="mt-3 text-sm leading-6 text-[#123F3E]/70">
                Conte com uma rede pronta para compartilhar alertas e ajudar no reencontro.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="recursos" className="bg-[#F8F5F0] py-24 lg:py-28">
        <div className="mx-auto w-[min(1160px,calc(100%-32px))]">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-3 text-[11px] font-extrabold tracking-[1.8px] text-[#1C7774] uppercase">
              Tudo em um só lugar
            </p>
            <h2 className="text-4xl font-black tracking-[-1.7px] lg:text-5xl">
              Simples para você. Melhor para seu pet.
            </h2>
            <p className="mt-4 text-[#6F7D80]">
              Recursos organizados para você encontrar o que precisa sem perder tempo.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {benefits.map((benefit) => (
              <article
                key={benefit.title}
                className="rounded-[24px_24px_24px_8px] border border-[#123F3E]/10 bg-white p-8 transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(24,66,62,.09)]"
              >
                <span
                  className={`grid size-13 place-items-center rounded-[15px_15px_15px_5px] ${benefit.accent}`}
                >
                  <Icon name={benefit.icon} size={25} />
                </span>
                <h3 className="mt-7 text-xl font-extrabold">{benefit.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#6F7D80]">{benefit.text}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <div className="grid overflow-hidden rounded-[26px_26px_26px_9px] border border-[#123F3E]/10 bg-white sm:grid-cols-[0.95fr_1.05fr]">
              <div className="relative min-h-60 bg-[#F5E9D8]">
                <Image
                  src="/images/clinic-care.png"
                  alt="Veterinária examinando um cão com cuidado na clínica PetSOS"
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 28vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-between p-7">
                <div>
                  <span className="inline-flex rounded-lg bg-[#1C7774]/14 px-3 py-1 text-[10px] font-extrabold tracking-[1px] text-[#155F5D] uppercase">
                    Gestão veterinária
                  </span>
                  <h3 className="mt-4 text-2xl font-black tracking-[-0.8px]">
                    Prontuário completo e integrado
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#6F7D80]">
                    Anamnese, prescrições, vacinas, exames e histórico clínico organizados em um só
                    lugar.
                  </p>
                </div>
                <Link
                  href="/login"
                  className="mt-6 inline-flex items-center gap-2 text-xs font-extrabold text-[#1C7774]"
                >
                  Acessar o sistema <Icon name="arrow" size={15} />
                </Link>
              </div>
            </div>

            <div className="grid overflow-hidden rounded-[26px_26px_26px_9px] border border-[#123F3E]/10 bg-white sm:grid-cols-[0.95fr_1.05fr]">
              <div className="relative min-h-60 bg-[#F5E9D8]">
                <Image
                  src="/images/reunion-pets.png"
                  alt="Gato e cachorro juntos ao ar livre simbolizando proteção e reencontro"
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 28vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-between p-7">
                <div>
                  <span className="inline-flex rounded-lg bg-[#F4B96A]/30 px-3 py-1 text-[10px] font-extrabold tracking-[1px] text-[#966A25] uppercase">
                    Busca pública integrada
                  </span>
                  <h3 className="mt-4 text-2xl font-black tracking-[-0.8px]">
                    Perdidos, encontrados e correspondências
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#6F7D80]">
                    Filtros por espécie, cor, porte e região, localização aproximada para segurança
                    e contato direto para promover o reencontro.
                  </p>
                </div>
                <Link
                  href="/animais-perdidos"
                  className="mt-6 inline-flex items-center gap-2 text-xs font-extrabold text-[#123F3E]"
                >
                  Acessar central pública <Icon name="arrow" size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="perfis" className="bg-white py-24">
        <div className="mx-auto w-[min(1160px,calc(100%-32px))]">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-[11px] font-extrabold tracking-[1.8px] text-[#62B9E8] uppercase">
                Três perfis integrados
              </p>
              <h2 className="text-4xl font-black tracking-[-1.7px] lg:text-5xl">
                Uma experiência sob medida para cada papel.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-[#6F7D80]">
              Cada conta acessa somente os recursos correspondentes ao seu papel no PetSOS.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {roleCards.map((item) => (
              <article
                key={item.role}
                className="flex flex-col justify-between rounded-[22px_22px_22px_7px] border border-[#123F3E]/10 bg-[#F8F5F0] p-6"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="grid size-11 place-items-center rounded-[13px_13px_13px_4px] bg-[#1C7774] text-white">
                      <Icon name={item.icon} size={20} />
                    </span>
                    <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold text-[#596B6E]">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-black">{item.role}</h3>
                  <p className="mt-2.5 text-xs leading-5 text-[#6F7D80]">{item.description}</p>
                </div>
                <Link
                  href="/login"
                  className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-[#123F3E] hover:text-[#1C7774]"
                >
                  Acessar como {item.role.toLowerCase()} <Icon name="arrow" size={14} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="facil" className="bg-[#F5E9D8] py-24">
        <div className="mx-auto grid w-[min(1040px,calc(100%-32px))] items-center gap-14 lg:grid-cols-2">
          <div className="relative rounded-[28px_28px_28px_10px] bg-[#62B9E8] p-9 lg:p-12">
            <div className="absolute -right-5 -top-5 grid size-20 rotate-6 place-items-center rounded-[22px_22px_22px_7px] bg-[#F4B96A] text-[#966A25]">
              <Icon name="paw" size={38} />
            </div>
            <p className="text-sm font-bold text-white/80">
              Você não precisa entender de tecnologia.
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-[-1.7px] text-white">
              O PetSOS mostra o caminho.
            </h2>
            <div className="mt-8 grid gap-4">
              {[
                'Crie sua conta',
                'Cadastre as informações do seu pet',
                'Use a clínica ou a rede de busca quando precisar',
              ].map((step, index) => (
                <div
                  key={step}
                  className="flex items-center gap-4 rounded-xl bg-white/12 p-4 text-sm font-bold text-white"
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white text-[#123F3E]">
                    {index + 1}
                  </span>
                  {step}
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-[11px] font-extrabold tracking-[1.8px] text-[#1C7774] uppercase">
              Pronto para começar?
            </p>
            <h2 className="text-4xl font-black tracking-[-1.7px] lg:text-5xl">
              Crie seu espaço de cuidado no PetSOS.
            </h2>
            <p className="mt-5 text-base leading-7 text-[#6F7D80]">
              Seu acesso é pessoal e seguro. Depois do cadastro, você entra diretamente no sistema
              para acompanhar tudo.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/cadastro"
                className="flex min-h-13 items-center justify-center gap-2 rounded-[14px_14px_14px_5px] bg-[#1C7774] px-6 font-bold text-white"
              >
                Criar minha conta <Icon name="arrow" size={18} />
              </Link>
              <Link
                href="/login"
                className="flex min-h-13 items-center justify-center rounded-xl px-6 font-bold text-[#123F3E]"
              >
                Já tenho uma conta
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#123F3E] text-white">
        <div className="mx-auto flex min-h-28 w-[min(1160px,calc(100%-32px))] flex-col items-start justify-center gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <Logo light />
          <div className="flex flex-wrap gap-5 text-xs font-semibold text-white/75">
            <Link href="/animais-perdidos" className="hover:text-white">
              Busca de animais
            </Link>
            <Link href="/login" className="hover:text-white">
              Entrar
            </Link>
            <Link href="/cadastro" className="hover:text-white">
              Criar conta
            </Link>
          </div>
          <p className="text-xs text-white/55">Cuidado, proteção e reencontros.</p>
        </div>
      </footer>
    </main>
  )
}
