import Link from 'next/link'

import { ContactForm } from '@/components/forms/ContactForm'
import { RichText } from '@/components/RichText'
import { ServiceIndex } from '@/components/ServiceIndex'
import { Tabs } from '@/components/Tabs'
import { Button, EYEBROW, SectionHeading, SmartLink, Unavailable } from '@/components/ui'
import { getDocs, getGlobal } from '@/lib/cms'
import { mediaUrl, telHref, toSiteLink } from '@/lib/links'
import { getBlogs } from '@/lib/supabase-data'
import type { Page } from '@/payload-types'
import { CtaBand, toButtons } from './shared'

export type PageBlock = NonNullable<Page['layout']>[number]
type Block<T extends PageBlock['blockType']> = Extract<PageBlock, { blockType: T }>

/** Page body blocks. `compact` = inside the legal/document column (no full-width bands). */
export function PageBlocks({ blocks, compact = false }: { blocks: PageBlock[]; compact?: boolean }) {
  return (
    <>
      {blocks.map((b) => {
        switch (b.blockType) {
          case 'richText':
            return <RichTextSection key={b.id} block={b} compact={compact} />
          case 'cardGrid':
            return <CardGrid key={b.id} block={b} />
          case 'logoGrid':
            return <LogoGrid key={b.id} block={b} />
          case 'faq':
            return <Faq key={b.id} block={b} />
          case 'fileList':
            return <FileList key={b.id} block={b} compact={compact} />
          case 'teamList':
            return <TeamList key={b.id} block={b} />
          case 'accountOpening':
            return <AccountOpening key={b.id} block={b} />
          case 'ctaBand':
            return <CtaBand key={b.id} anchor={b.anchor} title={b.title} text={b.text} buttons={b.buttons} />
          case 'buttons':
            return <Buttons key={b.id} block={b} compact={compact} />
          case 'contactForm':
            return <ContactDetails key={b.id} block={b} />
          case 'offices':
            return <Offices key={b.id} block={b} />
          case 'articles':
            return <Articles key={b.id} block={b} />
          default:
            return null
        }
      })}
    </>
  )
}

const SECTION = 'max-w-site mx-auto px-6 py-16 md:py-24'

function RichTextSection({ block, compact }: { block: Block<'richText'>; compact: boolean }) {
  if (compact) return <RichText data={block.content} />
  const heading = block.eyebrow || block.title
  return (
    <section
      id={block.anchor || undefined}
      className={`${SECTION} ${heading ? 'grid gap-10 md:gap-16 [grid-template-columns:repeat(auto-fit,minmax(min(320px,100%),1fr))]' : ''}`}
    >
      {heading && (
        <div className="flex flex-col gap-3">
          {block.eyebrow && <span className={`${EYEBROW} text-wine`}>{block.eyebrow}</span>}
          {block.title && <h2 className="m-0 font-serif font-medium text-[30px] md:text-[40px] leading-[1.15] text-pine">{block.title}</h2>}
        </div>
      )}
      <RichText data={block.content} />
    </section>
  )
}

const BG = {
  white: { section: '', card: 'bg-white', grid: 'grid-lines border border-line', num: 'text-wine', title: 'text-ink', text: 'text-muted-body' },
  mist: { section: 'bg-mist border-y border-line', card: 'bg-white', grid: 'grid-lines border border-line', num: 'text-wine', title: 'text-ink', text: 'text-muted-body' },
  pine: { section: 'bg-pine text-white', card: 'bg-pine', grid: 'grid-lines-dark border border-pine-line', num: 'text-mint', title: 'text-white', text: 'text-ondark' },
} as const

/**
 * Style of the "What we do" lists on the service pages and Brokerage:
 * 'index' = typographic index (current, ServiceIndex.tsx);
 * 'grid'  = the previous numbered card grid (the generic card grid below).
 * The previous design is also tagged in git as `design/what-we-do-grid`.
 */
const WHAT_WE_DO_STYLE: 'index' | 'grid' = 'index'

function CardGrid({ block }: { block: Block<'cardGrid'> }) {
  const bg = BG[block.background ?? 'white']
  const cards = block.cards ?? []

  // "What we do" lists (numbered, light background, plain text cards): typographic index.
  const isServiceList = block.numbered && block.background !== 'pine' && !cards.some((c) => c.value || c.image || c.imagePath)
  if (WHAT_WE_DO_STYLE === 'index' && isServiceList && cards.length > 1) {
    return (
      <section id={block.anchor || undefined}>
        <div className={SECTION}>
          <SectionHeading eyebrow={block.eyebrow} title={block.title} intro={block.intro} />
          <ServiceIndex items={cards.map((c) => ({ title: c.title, text: c.text }))} />
        </div>
      </section>
    )
  }

  return (
    <section id={block.anchor || undefined} className={bg.section}>
      <div className={SECTION}>
        <SectionHeading eyebrow={block.eyebrow} title={block.title} intro={block.intro} dark={block.background === 'pine'} />
        <ul
          className={`list-none m-0 p-0 grid gap-px ${bg.grid} ${
            cards.length === 2
              ? '[grid-template-columns:repeat(auto-fit,minmax(min(320px,100%),1fr))]'
              : '[grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr))]'
          }`}
        >
          {cards.map((c, i) => {
            const img = mediaUrl(c.image, c.imagePath)
            const link = toSiteLink(c.link)
            return (
              <li key={c.id ?? c.title} className={`${bg.card} p-7 md:p-9 flex flex-col gap-3.5`}>
                {img && (
                  <div className="h-[72px] flex items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`${c.title} logo`} className="max-h-12 w-auto" loading="lazy" />
                  </div>
                )}
                {block.numbered && <span className={`text-[13px] font-semibold ${bg.num}`}>{String(i + 1).padStart(2, '0')}</span>}
                {c.value ? (
                  <>
                    <span className={`font-serif text-[28px] md:text-[32px] leading-tight ${block.background === 'pine' ? 'text-white' : 'text-pine'}`}>{c.value}</span>
                    <h3 className={`m-0 text-[15px] font-semibold ${bg.title}`}>{c.title}</h3>
                  </>
                ) : (
                  <h3 className={`m-0 font-serif ${img ? 'font-medium text-2xl text-pine' : `font-normal text-[22px] leading-[1.3] ${bg.title}`}`}>{c.title}</h3>
                )}
                {c.text && <p className={`m-0 text-[15px] ${bg.text}`}>{c.text}</p>}
                {link && (
                  <SmartLink href={link.href} newTab={link.newTab} className="self-start mt-auto font-semibold text-[15px] text-accent hover:text-accent-dark underline">
                    {link.label} →
                  </SmartLink>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

function LogoGrid({ block }: { block: Block<'logoGrid'> }) {
  const dark = (block.background ?? 'pine') === 'pine'
  return (
    <section id={block.anchor || undefined} className={dark ? 'bg-pine text-white' : block.background === 'mist' ? 'bg-mist border-y border-line' : ''}>
      <div className={SECTION}>
        <SectionHeading eyebrow={block.eyebrow} title={block.title} intro={block.intro} dark={dark} />
        <ul className="list-none m-0 p-0 grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(180px,100%),1fr))]">
          {(block.logos ?? []).map((l) => {
            const src = mediaUrl(l.image, l.imagePath)
            const img = src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt={l.name} className="max-h-full max-w-full w-auto object-contain" loading="lazy" />
            ) : (
              <span className="text-muted">{l.name}</span>
            )
            return (
              <li key={l.id ?? l.name} className={`h-[120px] bg-white border ${dark ? 'border-pine-line' : 'border-line'} flex items-center justify-center p-4`}>
                {l.url ? (
                  <a href={l.url} target="_blank" rel="noopener" className="flex items-center justify-center h-full w-full">
                    {img}
                  </a>
                ) : (
                  img
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

function Faq({ block }: { block: Block<'faq'> }) {
  return (
    <section id={block.anchor || undefined} className={`${SECTION} grid gap-10 md:grid-cols-[1fr_2fr]`}>
      <div className="flex flex-col gap-3">
        {block.eyebrow && <span className={`${EYEBROW} text-wine`}>{block.eyebrow}</span>}
        <h2 className="m-0 font-serif font-medium text-[30px] md:text-[40px] leading-[1.15] text-pine">{block.title}</h2>
        {block.intro && <p className="m-0 text-muted-body">{block.intro}</p>}
        {block.showContactLink !== false && (
          <p className="m-0 text-muted-body">
            Something else on your mind?{' '}
            <SmartLink href="/contact" className="text-accent hover:text-accent-dark underline font-semibold">
              Contact us
            </SmartLink>
            .
          </p>
        )}
      </div>
      <div className="border-t border-line">
        {(block.items ?? []).map((f) => (
          <details key={f.id ?? f.question} className="group border-b border-line">
            <summary className="cursor-pointer list-none flex justify-between items-start gap-4 py-5 font-serif text-[19px] text-ink">
              {f.question}
              <span className="text-wine font-sans text-xl leading-none group-open:rotate-45 transition-transform" aria-hidden="true">
                +
              </span>
            </summary>
            <p className="m-0 pb-5 text-muted-body text-[15px] max-w-[680px] whitespace-pre-line">{f.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

function FileList({ block, compact }: { block: Block<'fileList'>; compact: boolean }) {
  if (block.style === 'cards') {
    return (
      <section id={block.anchor || undefined} className={`${SECTION} scroll-mt-24`}>
        <SectionHeading eyebrow={block.eyebrow} title={block.title} intro={block.intro} />
        <ul className="list-none m-0 p-0 grid gap-px grid-lines border border-line [grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr))]">
          {(block.files ?? []).map((f) => {
            const href = mediaUrl(f.file, f.path)
            if (!href) return null
            return (
              <li key={f.id ?? f.label} className="bg-white p-7 flex flex-col gap-2.5">
                <span className="text-[13px] text-wine font-semibold">PDF form</span>
                <h3 className="m-0 font-serif font-normal text-[22px] leading-[1.3]">{f.label}</h3>
                {f.text && <p className="m-0 text-[15px] text-muted-body">{f.text}</p>}
                <a href={href} download target="_blank" rel="noopener" className="mt-3 self-start font-semibold text-[15px] text-accent hover:text-accent-dark underline">
                  Download <span className="sr-only">{f.label} </span>PDF →
                </a>
              </li>
            )
          })}
        </ul>
      </section>
    )
  }
  const list = (
    <div id={block.anchor || undefined} className="scroll-mt-24">
      {block.title && <h2 className="m-0 mb-5 font-serif font-medium text-[24px] md:text-[28px] text-pine">{block.title}</h2>}
      <ul className="list-none m-0 p-0 grid gap-px bg-line border border-line">
        {(block.files ?? []).map((f) => {
          const href = mediaUrl(f.file, f.path)
          if (!href) return null
          return (
            <li key={f.id ?? f.label} className="bg-white hover:bg-mist">
              <a href={href} target="_blank" rel="noopener" className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 md:px-7 py-5 no-underline text-ink">
                <span className="text-[16px] md:text-[17px] font-medium [overflow-wrap:anywhere] min-w-0">{f.label}</span>
                <span className="text-sm font-semibold text-accent hover:text-accent-dark underline shrink-0">Download PDF</span>
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
  return compact ? list : <section className="max-w-site mx-auto px-6 pt-16 md:pt-20 last:pb-16 md:last:pb-24">{list}</section>
}

async function TeamList({ block }: { block: Block<'teamList'> }) {
  const all = await getDocs('team-members', { depth: 1 })
  const GROUPS = { board: 'Board of Directors', management: 'Key Management' } as const
  const groups = (block.groups ?? []).map((g) => ({ id: g, title: GROUPS[g], people: all.filter((p) => (p.group ?? 'management') === g) }))
  return (
    <section id={block.anchor || undefined} className="bg-mist border-b border-line">
      <div className={SECTION}>
        <SectionHeading eyebrow={block.eyebrow} title={block.title} intro={block.intro} />
        {groups.length > 1 && (
          <nav aria-label="Team sections" className="flex flex-wrap gap-3 mb-12">
            {groups.map((g) => (
              <a key={g.id} href={`#${g.id}`} className="border border-ink text-ink hover:bg-white no-underline px-[22px] py-[13px] rounded font-semibold text-[15px]">
                {g.title}
              </a>
            ))}
          </nav>
        )}
        {groups.map((g, gi) => (
          <div key={g.id} id={g.id} className={`scroll-mt-24 ${gi > 0 ? 'mt-16 md:mt-20' : ''}`}>
            <h3 className="m-0 mb-8 pb-4 border-b border-line-strong font-serif font-medium text-[26px] md:text-[30px] text-pine">{g.title}</h3>
            <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(260px,100%),1fr))]">
              {g.people.map((p) => {
                const src = mediaUrl(p.portrait, p.portraitPath)
                return (
                  <article key={p.id} className="bg-white border border-line flex flex-col">
                    {src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={src} alt={p.name} className="w-full h-72 object-cover object-top bg-placeholder" loading="lazy" />
                    ) : (
                      <div className="h-72 bg-placeholder" aria-hidden="true" />
                    )}
                    <div className="p-6 flex flex-col gap-1.5">
                      <h4 className="m-0 font-serif font-normal text-[22px] leading-[1.25] text-ink">{p.name}</h4>
                      <span className="text-sm text-wine font-semibold">{p.role}</span>
                      {p.bio && (
                        <details className="group mt-3 border-t border-line pt-3">
                          <summary className="cursor-pointer list-none text-sm font-semibold text-accent hover:text-accent-dark">
                            <span className="group-open:hidden">Read bio +</span>
                            <span className="hidden group-open:inline">Hide bio −</span>
                          </summary>
                          <p className="mt-3 mb-0 text-sm text-muted-body leading-[1.6]">{p.bio}</p>
                        </details>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

const STEP_COLORS = ['border-signal-green', 'border-wine', 'border-signal-red', 'border-pine', 'border-brand-light', 'border-brand-maroon']

/** The shared account-opening steps (global `account-opening`). */
export async function AccountOpening({ block }: { block: Block<'accountOpening'> }) {
  const data = await getGlobal('account-opening')
  const accounts = data.accounts ?? []
  if (!accounts.length) return null

  const steps = (acc: (typeof accounts)[number], Heading: 'h3' | 'h4') => (
    <ol className="list-none m-0 p-0 grid gap-8 [grid-template-columns:repeat(auto-fit,minmax(min(220px,100%),1fr))]">
      {(acc.steps ?? []).map((st, j) => (
        <li key={st.id ?? st.title} className={`border-t-4 ${STEP_COLORS[j % STEP_COLORS.length]} pt-5 flex flex-col gap-2`}>
          <span className="text-[13px] text-wine font-semibold">Step {j + 1}</span>
          <Heading className="m-0 font-serif font-normal text-[20px] md:text-[22px] text-ink">{st.title}</Heading>
          <p className="m-0 text-muted-body text-[15px]">{st.text}</p>
        </li>
      ))}
    </ol>
  )

  if (block.style === 'tabs') {
    return (
      <section id={block.anchor || undefined} className="bg-mist border-y border-line scroll-mt-24">
        <div className={SECTION}>
          <SectionHeading eyebrow={block.eyebrow} title={block.title} intro={block.intro} />
          <Tabs
            label="Account types"
            listClassName="flex flex-wrap gap-px bg-line border border-line mb-12 w-fit max-w-full"
            tabClassName="bg-white text-ink aria-selected:bg-accent aria-selected:text-white border-0 px-5 py-3 font-sans font-semibold text-[15px] cursor-pointer grow"
            tabs={accounts.map((acc) => ({
              id: acc.id ?? acc.name,
              label: acc.name,
              panel: (
                <>
                  <h3 className="m-0 mb-8 font-serif font-medium text-[26px] md:text-[30px] text-pine">{acc.name}</h3>
                  {steps(acc, 'h4')}
                  {(acc.faqs ?? []).length > 0 && (
                    <div className="mt-14 grid gap-10 [grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr))] md:[grid-template-columns:1fr_2fr]">
                      <div className="flex flex-col gap-4 items-start">
                        <span className={`${EYEBROW} text-wine`}>FAQs</span>
                        {data.faqTitle && <h4 className="m-0 font-serif font-medium text-[24px] leading-[1.25] text-pine">{data.faqTitle}</h4>}
                        <Link href="/contact" className="border border-ink text-ink hover:bg-white no-underline px-[22px] py-[13px] rounded font-semibold text-[15px]">
                          Contact us
                        </Link>
                      </div>
                      <div className="border-t border-line">
                        {(acc.faqs ?? []).map((f) => (
                          <details key={f.id ?? f.question} className="group border-b border-line">
                            <summary className="list-none cursor-pointer py-5 flex justify-between items-start gap-6 font-semibold text-[16px] text-ink hover:text-accent">
                              <span>{f.question}</span>
                              <span aria-hidden="true" className="text-wine text-xl leading-none transition-transform group-open:rotate-45">
                                +
                              </span>
                            </summary>
                            <p className="m-0 pb-6 pr-8 text-[15px] text-muted-body">{f.answer}</p>
                          </details>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ),
            }))}
          />
          {block.showButton !== false && (
            <div className="mt-10">
              <Button
                link={{ label: data.buttonLabel || 'Get started', href: data.buttonPath || '/open-account', newTab: false }}
                className="!px-[22px] !py-[13px] !text-[15px]"
              />
            </div>
          )}
        </div>
      </section>
    )
  }

  return (
    <section id={block.anchor || undefined} className="bg-mist border-t border-line">
      <div className={SECTION}>
        <SectionHeading eyebrow={block.eyebrow} title={block.title} intro={block.intro} />
        <div className="border-t border-line-strong">
          {accounts.map((acc, i) => (
            <details key={acc.id ?? acc.name} className="group border-b border-line-strong" open={i === 0}>
              <summary className="cursor-pointer list-none flex justify-between items-center gap-4 py-5 font-serif text-[22px] text-pine">
                {acc.name}
                <span className="text-wine font-sans text-xl leading-none group-open:rotate-45 transition-transform" aria-hidden="true">
                  +
                </span>
              </summary>
              <ol className="list-none m-0 p-0 pb-8 grid gap-8 [grid-template-columns:repeat(auto-fit,minmax(min(220px,100%),1fr))]">
                {(acc.steps ?? []).map((st, j) => (
                  <li key={st.id ?? st.title} className={`border-t-4 ${STEP_COLORS[j % STEP_COLORS.length]} pt-5 flex flex-col gap-2`}>
                    <span className="text-[13px] text-wine font-semibold">Step {j + 1}</span>
                    <h3 className="m-0 font-serif font-normal text-[20px]">{st.title}</h3>
                    <p className="m-0 text-muted-body text-[15px]">{st.text}</p>
                  </li>
                ))}
              </ol>
            </details>
          ))}
        </div>
        {block.showButton !== false && (
          <div className="mt-10">
            <Button
              link={{ label: data.buttonLabel || 'Get started', href: data.buttonPath || '/open-account', newTab: false }}
              className="!px-[22px] !py-[13px] !text-[15px]"
            />
          </div>
        )}
      </div>
    </section>
  )
}

function Buttons({ block, compact }: { block: Block<'buttons'>; compact: boolean }) {
  const row = (
    <div className="flex flex-wrap gap-3.5">
      {toButtons(block.buttons).map((b) => (
        <Button key={b.link.href} link={b.link} style={b.style} />
      ))}
    </div>
  )
  return compact ? <div className="mt-10">{row}</div> : <section className="max-w-site mx-auto px-6 py-10">{row}</section>
}

/** Contact page: details list, complaints box and the message form. */
function ContactDetails({ block }: { block: Block<'contactForm'> }) {
  const c = block.complaints ?? {}
  return (
    <section
      id={block.anchor || undefined}
      className={`${SECTION} grid gap-14 [grid-template-columns:repeat(auto-fit,minmax(min(320px,100%),1fr))]`}
    >
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-3">
          {block.eyebrow && <span className={`${EYEBROW} text-wine`}>{block.eyebrow}</span>}
          <h2 className="m-0 font-serif font-medium text-[30px] md:text-[40px] leading-[1.15] text-pine">{block.title}</h2>
          {block.intro && <p className="m-0 text-muted-body text-base max-w-[480px]">{block.intro}</p>}
        </div>
        {(block.details ?? []).length > 0 && (
          <dl className="m-0 grid gap-px bg-line border border-line">
            {(block.details ?? []).map((d) => (
              <div key={d.id ?? d.label} className="bg-white p-5 md:p-6 flex flex-col gap-1">
                <dt className="text-sm text-muted">{d.label}</dt>
                <dd className="m-0 font-serif text-[20px] md:text-[22px] text-pine break-words">
                  {d.href ? (
                    <a href={d.href} className="text-pine no-underline hover:text-accent hover:underline">
                      {d.value}
                    </a>
                  ) : (
                    d.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        )}
        {c.title && (
          <div className="border border-line border-t-4 border-t-wine p-6 md:p-7 flex flex-col gap-4">
            <h3 className="m-0 font-serif font-medium text-[22px] text-ink">{c.title}</h3>
            {(c.text || c.email) && (
              <p className="m-0 text-[15px] text-muted-body">
                {c.text}{' '}
                {c.email && (
                  <a href={`mailto:${c.email}`} className="text-accent hover:text-accent-dark underline">
                    {c.email}
                  </a>
                )}
                {c.email && '.'}
              </p>
            )}
            {c.personName && (
              <div className="flex flex-col gap-1 text-[15px] text-muted-body">
                {c.personLabel && <span className="text-sm font-semibold text-ink">{c.personLabel}</span>}
                <span className="font-semibold text-ink">{c.personName}</span>
                {c.personRole && <span className="text-wine font-semibold text-sm">{c.personRole}</span>}
                {c.phone && (
                  <span>
                    Cell:{' '}
                    <a href={telHref(c.phone, c.phoneHref)} className="text-accent hover:text-accent-dark underline">
                      {c.phone}
                    </a>
                  </span>
                )}
                {c.email && (
                  <span>
                    Email:{' '}
                    <a href={`mailto:${c.email}`} className="text-accent hover:text-accent-dark underline">
                      {c.email}
                    </a>
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <ContactForm title={block.formTitle} intro={block.formIntro} />
    </section>
  )
}

/** Office list with a map per office (tabs). */
function Offices({ block }: { block: Block<'offices'> }) {
  const offices = block.offices ?? []
  if (!offices.length) return null
  return (
    <section id={block.anchor || undefined} className="bg-mist border-t border-line">
      <div className={SECTION}>
        <SectionHeading eyebrow={block.eyebrow} title={block.title} intro={block.intro} />
        <div className="grid gap-px grid-lines border border-line [grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr))] md:[grid-template-columns:minmax(260px,1fr)_2fr]">
          <Tabs
            label="Office locations"
            vertical
            listClassName="bg-white flex flex-col"
            tabClassName="text-left bg-white hover:bg-mist aria-selected:bg-mist border-0 border-b border-line border-l-4 border-l-transparent aria-selected:border-l-accent p-6 font-sans cursor-pointer flex flex-col gap-1.5"
            tabs={offices.map((o) => ({
              id: o.id ?? o.name,
              label: (
                <>
                  <span className="font-serif text-[20px] text-pine">{o.name}</span>
                  {o.address && <span className="text-sm text-muted-body">{o.address}</span>}
                </>
              ),
              panel: (
                <div className="bg-white h-[320px] md:h-[400px]">
                  {o.mapUrl ? (
                    <iframe
                      src={o.mapUrl}
                      title={`Map of the IEL ${o.name}`}
                      className="w-full h-full block border-0"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center p-6 text-muted-body">{o.address}</div>
                  )}
                </div>
              ),
            }))}
          />
        </div>
      </div>
    </section>
  )
}

/** Latest Learn articles from Supabase (`blogs`), newest first. */
async function Articles({ block }: { block: Block<'articles'> }) {
  let blogs: Awaited<ReturnType<typeof getBlogs>> | null = null
  try {
    blogs = await getBlogs()
  } catch {
    blogs = null
  }
  const list = blogs ? (block.limit ? blogs.slice(0, block.limit) : blogs) : []
  return (
    <section id={block.anchor || undefined} className="bg-mist border-y border-line">
      <div className={SECTION}>
        <SectionHeading eyebrow={block.eyebrow} title={block.title} intro={block.intro} />
        {!blogs ? (
          <Unavailable what="Articles" />
        ) : list.length === 0 ? (
          <p className="m-0 border border-line bg-white p-6 text-[15px] text-muted-body">No articles published yet.</p>
        ) : (
          <div className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(min(300px,100%),1fr))]">
            {list.map((b) => (
              <Link key={b.id} href={`/learn/${encodeURIComponent(b.id)}`} className="group bg-white border border-line hover:border-line-dash no-underline text-ink flex flex-col">
                {b.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={b.image} alt="" className="w-full h-[200px] object-cover bg-placeholder" loading="lazy" />
                ) : (
                  <div className="h-[200px] bg-placeholder" aria-hidden="true" />
                )}
                <div className="p-6 flex flex-col gap-2.5 grow">
                  <h3 className="m-0 font-serif font-normal text-[22px] leading-[1.3]">{b.title}</h3>
                  {b.excerpt && <p className="m-0 text-[15px] text-muted-body">{b.excerpt}</p>}
                  <span className="mt-auto pt-2 text-sm font-semibold text-accent group-hover:underline">Read article →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
