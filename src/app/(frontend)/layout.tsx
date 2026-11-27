import type { Metadata } from 'next'
import { IBM_Plex_Sans, IBM_Plex_Serif } from 'next/font/google'
import type { ReactNode } from 'react'

import { Footer } from '@/components/Footer'
import { Header, type NavItem } from '@/components/Header'
import { getGlobal } from '@/lib/cms'
import { toSiteLink, toSiteLinks } from '@/lib/links'
import { openGraph } from '@/lib/seo'
import './globals.css'

// Self-hosted by next/font at build time (no request to Google from visitors' browsers).
const plexSans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-plex-sans', display: 'swap' })
const plexSerif = IBM_Plex_Serif({ subsets: ['latin'], weight: ['300', '400', '500', '600'], variable: '--font-plex-serif', display: 'swap' })

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://iel.net.pk'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getGlobal('site-settings', 1)
  const title = settings.defaultSeo?.title || 'IEL | Financial and Transaction Advisory in Pakistan'
  const description = settings.defaultSeo?.description || undefined
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: '%s | IEL' },
    description,
    icons: { icon: '/IEL Assets/partners/favicon.png' },
    openGraph: openGraph({ title, description }),
  }
}

/** Structured data for search engines: the firm, its offices and contact details (from Site settings). */
function organisationJsonLd(settings: Awaited<ReturnType<typeof getGlobal<'site-settings'>>>) {
  const c = settings.contact ?? {}
  const phones = [c.phone, ...(c.otherPhones ?? []).map((p) => p.number)].filter(Boolean)
  return {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: 'Integrated Equities Limited',
    alternateName: 'IEL',
    url: SITE_URL,
    logo: `${SITE_URL}/Assets/IELTezi-logo-trimmed.webp`,
    image: `${SITE_URL}/og-image.png`,
    description: settings.defaultSeo?.description || undefined,
    email: c.email || undefined,
    telephone: phones[0] || undefined,
    address: (c.addresses ?? []).map((a) => ({
      '@type': 'PostalAddress',
      streetAddress: a.address,
      addressLocality: a.city,
      addressCountry: 'PK',
    })),
    sameAs: (settings.social ?? []).map((s) => s.url).filter(Boolean),
  }
}

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [navigation, settings, footer] = await Promise.all([getGlobal('navigation'), getGlobal('site-settings'), getGlobal('footer')])

  const items: NavItem[] = (navigation.items ?? []).flatMap((it) => {
    const link = toSiteLink(it)
    const children = toSiteLinks(it.children)
    if (!link && !children.length) return []
    return [{ ...(link ?? { label: it.label, href: children[0].href, newTab: false }), children }]
  })

  return (
    <html lang="en" className={`${plexSans.variable} ${plexSerif.variable}`}>
      <body className="font-sans text-ink bg-white leading-[1.55]">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:bg-white focus:px-4 focus:py-2 focus:rounded">
          Skip to content
        </a>
        <Header
          utilityText={settings.utilityBar?.text}
          utilityLinks={toSiteLinks(settings.utilityBar?.links)}
          clientLoginUrl={settings.clientLoginUrl}
          items={items}
          cta={toSiteLink(navigation.cta)}
        />
        <main id="main">{children}</main>
        <Footer footer={footer} settings={settings} />
        <script
          type="application/ld+json"
          // JSON from our own CMS settings; "<" escaped so text can't close the script tag.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationJsonLd(settings)).replace(/</g, '\\u003c') }}
        />
      </body>
    </html>
  )
}
