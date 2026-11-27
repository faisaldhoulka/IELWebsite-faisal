import type { Metadata } from 'next'
import { IBM_Plex_Sans, IBM_Plex_Serif } from 'next/font/google'
import type { ReactNode } from 'react'

import './globals.css'

// Self-hosted by next/font at build time (no request to Google from visitors' browsers).
const plexSans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-plex-sans', display: 'swap' })
const plexSerif = IBM_Plex_Serif({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-plex-serif', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://iel.net.pk'),
  title: { default: 'IEL | Financial and Transaction Advisory in Pakistan', template: '%s | IEL' },
  description:
    'Integrated Equities Limited (IEL) advises companies, sponsors and investors on IPOs, debt and sukuk, mergers and acquisitions, and fundraising, with its own PSX brokerage for execution.',
  icons: { icon: '/IEL Assets/partners/favicon.png' },
}

// Header and footer arrive in week 2 (plan §11).
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${plexSans.variable} ${plexSerif.variable}`}>
      <body className="font-sans text-ink bg-white leading-[1.55]">{children}</body>
    </html>
  )
}
