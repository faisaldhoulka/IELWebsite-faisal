import type { Metadata } from 'next'

import { ResearchBrowser, type ResearchItem } from '@/components/ResearchBrowser'
import { ContactBand, PageHero, Unavailable } from '@/components/ui'
import { getResearch, getSectors } from '@/lib/supabase-data'
import { downloadUrl } from '@/lib/supabase-data/client'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Research',
  description: "Access IEL's research reports covering sector analysis, market insights, and investment intelligence for Pakistan's capital markets.",
  alternates: { canonical: '/research' },
}

/** Same file-name rule as the old download button: the report title, made file-safe. */
const fileName = (title: string) => {
  const name = title.trim().replace(/[\\/:*?"<>|]+/g, '').replace(/\s+/g, '-') || 'document'
  return /\.pdf$/i.test(name) ? name : `${name}.pdf`
}

export default async function ResearchPage() {
  let sectors: string[] = []
  let reports: ResearchItem[] | null = null
  try {
    const [s, r] = await Promise.all([getSectors(), getResearch()])
    sectors = s.map((x) => x.name)
    reports = r.map((x) => ({ ...x, downloadUrl: downloadUrl(x.pdfUrl, fileName(x.name)) }))
  } catch {
    reports = null
  }

  return (
    <>
      <PageHero
        eyebrow="Research"
        title="Research"
        intro="Economic, market, sector and company research on Pakistan's capital markets, from the team that informs our advice."
      />
      <section className="max-w-site mx-auto px-6 py-16 md:py-24" aria-label="Research reports">
        {reports ? <ResearchBrowser sectors={sectors} reports={reports} /> : <Unavailable what="Research reports" />}
      </section>
      <ContactBand />
    </>
  )
}
