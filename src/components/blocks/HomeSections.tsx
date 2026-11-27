import { EnquiryForm } from '@/components/forms/EnquiryForm'
import { BrandStripe, Button, EYEBROW, SectionHeading, SmartLink } from '@/components/ui'
import { getDocs, getGlobal } from '@/lib/cms'
import { mediaUrl, telHref, toSiteLink } from '@/lib/links'
import type { Homepage, Service } from '@/payload-types'
import { CtaBand, shorten, toButtons } from './shared'

type Section = NonNullable<Homepage['sections']>[number]
type Block<T extends Section['blockType']> = Extract<Section, { blockType: T }>

const H2 = 'm-0 font-serif font-medium text-[32px] md:text-[40px] leading-[1.15] text-pine'

/** Renders the homepage sections in the order editors set; hidden ones are skipped. */
export async function HomeSections({ sections }: { sections: Section[] }) {
  // Lists used by several sections, loaded once.
  const [services, settings] = await Promise.all([getDocs('services', { depth: 1 }), getGlobal('site-settings')])
  const visible = sections.filter((s) => !s.hidden)
  return (
    <>
      {visible.map((s) => {
        switch (s.blockType) {
          case 'hero':
            return <Hero key={s.id} block={s} />
          case 'services':
            return <Services key={s.id} block={s} services={services} />
          case 'transactions':
            return <Transactions key={s.id} block={s} />
          case 'process':
            return <Process key={s.id} block={s} />
          case 'team':
            return <Team key={s.id} block={s} />
          case 'insights':
            return <Insights key={s.id} block={s} />
          case 'ctaBand':
            return <CtaBand key={s.id} anchor={s.anchor} title={s.title} text={s.text} buttons={s.buttons} />
          case 'partners':
            return <Partners key={s.id} block={s} />
          case 'contact':
            return <Contact key={s.id} block={s} mandates={services.map((x) => x.title)} settings={settings} />
          default:
            return null
        }
      })}
    </>
  )
}

function Hero({ block }: { block: Block<'hero'> }) {
  return (
    <section id={block.anchor || undefined} className="bg-mist border-b border-line">
      <div className="max-w-site mx-auto px-6 pt-16 pb-14 md:pt-24 md:pb-[88px] grid gap-14 items-end [grid-template-columns:repeat(auto-fit,minmax(min(320px,100%),1fr))]">
        <div className="flex flex-col gap-6">
          <BrandStripe className="w-16" />
          {block.eyebrow && <span className={`${EYEBROW} text-wine`}>{block.eyebrow}</span>}
          <h1 className="m-0 font-serif font-medium text-[40px] md:text-[56px] leading-[1.1] text-pine">{block.title}</h1>
          {block.intro && <p className="m-0 text-[17px] md:text-[19px] text-muted-body max-w-[600px]">{block.intro}</p>}
          <div className="flex flex-wrap gap-3.5 mt-2">
            {toButtons(block.buttons).map((b) => (
              <Button key={b.link.href} link={b.link} style={b.style} />
            ))}
          </div>
        </div>
        {block.stats && block.stats.length > 0 && (
          <dl className="m-0 grid grid-cols-2 gap-px bg-line-strong border border-line-strong border-t-4 border-t-signal-red">
            {block.stats.map((st) => (
              <div key={st.id ?? st.label} className="bg-white p-5 md:p-7 flex flex-col-reverse">
                <dt className="text-sm text-muted">{st.label}</dt>
                <dd className="m-0 font-serif text-[28px] md:text-[36px] text-pine">{st.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  )
}

function Services({ block, services }: { block: Block<'services'>; services: Service[] }) {
  return (
    <section id={block.anchor || undefined} className="max-w-site mx-auto px-6 py-16 md:py-24">
      <SectionHeading eyebrow={block.eyebrow} title={block.title} intro={block.intro} />
      <div className="grid gap-px grid-lines border border-line [grid-template-columns:repeat(auto-fit,minmax(min(340px,100%),1fr))]">
        {services.map((s, i) => {
          const page = s.page && typeof s.page === 'object' ? `/${s.page.slug}` : null
          const toContact = block.cardsLinkToContact !== false || !page
          return (
            <SmartLink
              key={s.id}
              href={toContact ? '#contact' : page!}
              {...(toContact ? { 'data-mandate': s.title } : {})}
              className="group bg-white hover:bg-mist p-7 md:p-9 no-underline text-ink flex flex-col gap-3.5"
            >
              <span className="text-[13px] text-wine font-semibold">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="m-0 font-serif font-medium text-2xl">{s.title}</h3>
              <p className="m-0 text-muted-body text-[15px]">{s.summary}</p>
              <span className="text-sm font-semibold text-accent group-hover:underline">{s.ctaLabel || 'Talk to us'} →</span>
            </SmartLink>
          )
        })}
      </div>
    </section>
  )
}

async function Transactions({ block }: { block: Block<'transactions'> }) {
  const all = await getDocs('transactions', { depth: 1, sort: 'order' })
  const list = [...all.filter((t) => t.featured), ...all.filter((t) => !t.featured)].slice(0, block.limit ?? 4)
  if (!list.length) return null
  return (
    <section id={block.anchor || undefined} className="bg-pine text-white">
      <div className="max-w-site mx-auto px-6 py-16 md:py-24">
        <SectionHeading eyebrow={block.eyebrow} title={block.title} intro={block.intro} link={toSiteLink(block.sectionLink)} dark />
        <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(260px,100%),1fr))]">
          {list.map((t) => {
            const practice = t.practiceLabel || (t.practice && typeof t.practice === 'object' ? t.practice.title : '')
            return (
              <article key={t.id} className="border border-pine-line p-7 flex flex-col gap-2.5">
                <span className="text-[13px] text-mint font-semibold">{[t.year, practice].filter(Boolean).join(' · ')}</span>
                <h3 className="m-0 font-serif font-normal text-[22px]">{t.client}</h3>
                <span className="text-[15px] text-ondark">{t.description}</span>
                {t.size && <span className="font-serif text-[28px] mt-2">{t.size}</span>}
                {t.role && <span className="text-[13px] text-ondark border-t border-pine-line pt-3">IEL role: {t.role}</span>}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const STEP_COLOR: Record<string, string> = {
  green: 'border-signal-green',
  wine: 'border-wine',
  red: 'border-signal-red',
  pine: 'border-pine',
}

function Process({ block }: { block: Block<'process'> }) {
  return (
    <section id={block.anchor || undefined} className="max-w-site mx-auto px-6 py-16 md:py-24">
      <SectionHeading eyebrow={block.eyebrow} title={block.title} intro={block.intro} />
      <ol className="list-none m-0 p-0 grid gap-8 [grid-template-columns:repeat(auto-fit,minmax(min(240px,100%),1fr))]">
        {(block.steps ?? []).map((st) => (
          <li key={st.id ?? st.name} className={`border-t-4 ${STEP_COLOR[st.color ?? 'green']} pt-5 flex flex-col gap-2`}>
            <h3 className="m-0 font-serif font-normal text-[22px]">{st.name}</h3>
            <p className="m-0 text-muted-body text-[15px]">{st.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

async function Team({ block }: { block: Block<'team'> }) {
  const people = (await getDocs('team-members', { where: { showOnHomepage: { equals: true } }, depth: 1 })).slice(0, block.limit ?? 3)
  if (!people.length) return null
  return (
    <section id={block.anchor || undefined} className="bg-mist border-y border-line">
      <div className="max-w-site mx-auto px-6 py-16 md:py-24">
        <SectionHeading eyebrow={block.eyebrow} title={block.title} intro={block.intro} link={toSiteLink(block.sectionLink)} />
        <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(260px,100%),1fr))]">
          {people.map((m) => {
            const src = mediaUrl(m.portrait, m.portraitPath)
            return (
              <article key={m.id} className="bg-white border border-line flex flex-col">
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt={m.name} className="w-full h-72 object-cover object-top bg-placeholder" loading="lazy" />
                ) : (
                  <div className="h-72 bg-placeholder" aria-hidden="true" />
                )}
                <div className="p-6 flex flex-col gap-1.5">
                  <h3 className="m-0 font-serif font-normal text-[22px]">{m.name}</h3>
                  <span className="text-sm text-wine font-semibold">{m.role}</span>
                  <p className="mt-1.5 mb-0 text-sm text-muted-body">{m.shortBio || shorten(m.bio)}</p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Insights({ block }: { block: Block<'insights'> }) {
  return (
    <section id={block.anchor || undefined} className="max-w-site mx-auto px-6 py-16 md:py-24">
      <SectionHeading eyebrow={block.eyebrow} title={block.title} intro={block.intro} link={toSiteLink(block.sectionLink)} />
      <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr))]">
        {(block.items ?? []).map((n) => (
          <SmartLink
            key={n.id ?? n.title}
            href={n.href || '/research'}
            className="no-underline text-ink border border-line hover:border-line-dash hover:bg-mist p-7 flex flex-col gap-2.5"
          >
            {n.tag && <span className="text-[13px] text-wine font-semibold">{n.tag}</span>}
            <span className="font-serif text-[22px] leading-[1.3]">{n.title}</span>
            {n.text && <span className="text-sm text-muted-body">{n.text}</span>}
          </SmartLink>
        ))}
      </div>
    </section>
  )
}

async function Partners({ block }: { block: Block<'partners'> }) {
  const partners = await getDocs('partners', { depth: 1 })
  if (!partners.length) return null
  return (
    <section id={block.anchor || undefined} className="max-w-site mx-auto px-6 py-[72px] flex flex-col gap-7">
      <h2 className={`m-0 ${EYEBROW} text-wine`}>{block.title}</h2>
      <ul className="list-none m-0 p-0 grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(200px,100%),1fr))]">
        {partners.map((p) => {
          const src = mediaUrl(p.logo, p.logoPath)
          return (
            <li key={p.id} className="h-[88px] border border-line flex items-center justify-center">
              <SmartLink href={p.url || '/about#Associated_Company'} className="flex items-center justify-center h-full w-full">
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt={p.name} className="max-h-12 w-auto" loading="lazy" />
                ) : (
                  <span className="text-muted">{p.name}</span>
                )}
              </SmartLink>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function Contact({
  block,
  mandates,
  settings,
}: {
  block: Block<'contact'>
  mandates: string[]
  settings: Awaited<ReturnType<typeof getGlobal<'site-settings'>>>
}) {
  const c = settings.contact ?? {}
  return (
    <section id={block.anchor || undefined} className="bg-accent text-white">
      <div className="max-w-site mx-auto px-6 py-16 md:py-24 grid gap-14 [grid-template-columns:repeat(auto-fit,minmax(min(320px,100%),1fr))]">
        <div className="flex flex-col gap-4">
          <h2 className="m-0 font-serif font-medium text-[32px] md:text-[40px] leading-[1.15]">{block.title}</h2>
          {block.text && <p className="m-0 text-[17px] text-ondark-soft">{block.text}</p>}
          {block.showContactDetails !== false && (
            <div className="mt-4 flex flex-col gap-1.5 text-[15px] text-ondark-soft">
              {c.phone && (
                <a href={telHref(c.phone, c.phoneHref)} className="text-ondark-soft no-underline hover:text-white">
                  {c.phone}
                </a>
              )}
              {c.email && (
                <a href={`mailto:${c.email}`} className="text-ondark-soft no-underline hover:text-white">
                  {c.email}
                </a>
              )}
            </div>
          )}
        </div>
        <EnquiryForm mandates={mandates.length ? mandates : ['General enquiry']} submitLabel={block.submitLabel || 'Send enquiry'} email={c.email} />
      </div>
    </section>
  )
}

