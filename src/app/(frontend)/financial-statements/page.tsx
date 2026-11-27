import type { Metadata } from 'next'

import { StatementsBrowser } from '@/components/StatementsBrowser'
import { ContactBand, PageHero } from '@/components/ui'
import { getDocs } from '@/lib/cms'
import { mediaUrl } from '@/lib/links'
import { getSupabaseStatements, groupStatements, type StatementInput } from '@/lib/supabase-data'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Financial Statements',
  description:
    'Audited annual accounts, half-yearly and quarterly statements, and monthly liquid capital balance (LCB) filings of Integrated Equities Limited (IEL).',
  alternates: { canonical: '/financial-statements' },
}

export default async function FinancialStatementsPage() {
  // Statements kept on this site (CMS) + statements published through the IEL app (Supabase).
  const site = await getDocs('static-financial-statements', { depth: 1, sort: '-date' })
  const rows: StatementInput[] = site.map((s) => ({
    tab: s.tab,
    title: s.title,
    pdfUrl: mediaUrl(s.file, s.path),
    date: s.date ?? null,
  }))
  let supabaseFailed = false
  try {
    rows.push(...(await getSupabaseStatements()))
  } catch {
    supabaseFailed = true
  }

  return (
    <>
      <PageHero
        eyebrow="Investor relations"
        title="Financial statements"
        intro="Audited annual accounts, half-yearly and quarterly statements, and monthly liquid capital balance (LCB) filings, grouped by financial year (July to June)."
      />
      <section className="max-w-site mx-auto px-6 py-16 md:py-24">
        <h2 className="sr-only">Statements by type</h2>
        {supabaseFailed && (
          <p className="m-0 mb-8 border border-line border-l-4 border-l-signal-red bg-white p-5 text-[15px] text-ink">
            The most recent statements could not be loaded right now. Please try again in a few minutes.
          </p>
        )}
        <StatementsBrowser data={groupStatements(rows)} />
      </section>
      <ContactBand />
    </>
  )
}
