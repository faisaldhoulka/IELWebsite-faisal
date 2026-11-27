import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PageBlocks } from '@/components/blocks/PageBlocks'
import { toButtons } from '@/components/blocks/shared'
import { OpenAccountForm } from '@/components/forms/OpenAccountForm'
import { headingsOf } from '@/components/RichText'
import { ContactBand, PageHero, SmartLink } from '@/components/ui'
import { getDocs, getPage, getPageSlugs } from '@/lib/cms'
import { mediaUrl } from '@/lib/links'
import { openGraph } from '@/lib/seo'
import type { Page } from '@/payload-types'

type Params = { slug: string[] }

// CMS pages: About, the service pages, Brokerage, Investor education, legal pages, …
// Coded routes (research, news, learn, contact, …) live in their own folders and win
// over this catch-all.

export async function generateStaticParams() {
  return (await getPageSlugs()).map((s) => ({ slug: s.split('/') }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  const page = await getPage(slug.join('/'))
  if (!page) return {}
  const title = page.seo?.title || page.title
  const description = page.seo?.description || page.hero?.intro || undefined
  const image = mediaUrl(page.seo?.image)
  return {
    title,
    description,
    alternates: { canonical: `/${page.slug}` },
    openGraph: openGraph({ title: `${title} | Integrated Equities Limited (IEL)`, description, url: `/${page.slug}`, image }),
  }
}

export default async function CmsPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const page = await getPage(slug.join('/'))
  if (!page) notFound()

  const hero = page.hero ?? {}
  const a = hero.aside
  const links = [
    a?.linkLabel && a.linkPath ? { label: a.linkLabel, href: a.linkPath } : null,
    a?.secondLinkLabel && a.secondLinkPath ? { label: a.secondLinkLabel, href: a.secondLinkPath } : null,
  ].filter((l): l is { label: string; href: string } => l !== null)
  const aside =
    a?.form === 'openAccount' ? (
      <div className="bg-white border border-line border-t-4 border-t-signal-red p-6 md:p-8">
        {a.title && <h2 className="m-0 font-serif font-medium text-[26px] text-pine">{a.title}</h2>}
        {a.text && <p className="mt-2 mb-6 text-[15px] text-muted-body">{a.text}</p>}
        <OpenAccountForm />
        {links.length > 0 && (
          <div className="mt-2 pt-5 border-t border-line flex flex-col gap-2 text-[15px]">
            {links.map((l) => (
              <SmartLink key={l.href} href={l.href} className="text-accent hover:text-accent-dark underline font-semibold">
                {l.label} →
              </SmartLink>
            ))}
          </div>
        )}
      </div>
    ) : a?.title ? (
      <div className="bg-white border border-line border-t-4 border-t-signal-green p-7 md:p-9 flex flex-col gap-3.5">
        <h2 className="m-0 font-serif font-medium text-[24px] md:text-[28px] leading-[1.2] text-pine">{a.title}</h2>
        {a.text && <p className="m-0 text-muted-body text-[15px]">{a.text}</p>}
        {links.map((l) => (
          <SmartLink key={l.href} href={l.href} className="self-start font-semibold text-[15px] text-accent hover:text-accent-dark underline">
            {l.label} →
          </SmartLink>
        ))}
      </div>
    ) : undefined

  const template = page.template ?? 'standard'
  const blocks = page.layout ?? []

  return (
    <>
      <PageHero eyebrow={hero.eyebrow} title={hero.title || page.title} intro={hero.intro} buttons={toButtons(hero.buttons)} aside={aside} />
      {template === 'standard' ? <PageBlocks blocks={blocks} /> : <DocumentBody page={page} withLegalNav={template === 'legal'} />}
      {page.showContactBand !== false && <ContactBand />}
    </>
  )
}

/** Legal and document pages: sticky sidebar (legal pages, "On this page") + text column. */
async function DocumentBody({ page, withLegalNav }: { page: Page; withLegalNav: boolean }) {
  const blocks = page.layout ?? []
  const toc = blocks.flatMap((b) => (b.blockType === 'richText' ? headingsOf(b.content) : []))
  const legalPages = withLegalNav
    ? await getDocs('pages', { where: { template: { equals: 'legal' } }, sort: 'title', depth: 0 })
    : []

  return (
    <section className="max-w-site mx-auto px-6 py-16 md:py-24">
      <div className="grid gap-12 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-24 self-start flex flex-col gap-8 lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto">
          {legalPages.length > 0 && (
            <nav aria-label="Legal pages">
              <ul className="m-0 p-0 list-none border-l border-line">
                {legalPages.map((p) => {
                  const current = p.slug === page.slug
                  return (
                    <li key={p.id}>
                      <Link
                        href={`/${p.slug}`}
                        aria-current={current ? 'page' : undefined}
                        className={`block -ml-px border-l-2 pl-4 py-1.5 text-[15px] no-underline ${
                          current ? 'border-accent text-pine font-semibold' : 'border-transparent text-muted-body hover:text-pine'
                        }`}
                      >
                        {p.title}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
          )}
          {toc.length > 1 && (
            <nav aria-label="On this page">
              <p className="m-0 mb-3 text-[13px] font-semibold tracking-[1.5px] uppercase text-wine">On this page</p>
              <ul className="m-0 p-0 list-none flex flex-col gap-2">
                {toc.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className="text-[15px] text-muted-body hover:text-pine no-underline">
                      {t.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </aside>
        <div className="min-w-0">
          <PageBlocks blocks={blocks} compact />
        </div>
      </div>
    </section>
  )
}
