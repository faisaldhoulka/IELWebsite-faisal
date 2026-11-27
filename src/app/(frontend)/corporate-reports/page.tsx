import type { Metadata } from 'next'

import { Button, ContactBand, PageHero, SectionHeading } from '@/components/ui'
import { getDocs } from '@/lib/cms'
import { mediaUrl } from '@/lib/links'

export const metadata: Metadata = {
  title: 'Corporate Reports',
  description: 'Corporate reports from Integrated Equities Limited (IEL) research.',
  alternates: { canonical: '/corporate-reports' },
}

export default async function CorporateReportsPage() {
  const reports = await getDocs('corporate-reports', { depth: 1, sort: 'order' })

  return (
    <>
      <PageHero
        eyebrow="Research"
        title="Corporate Reports"
        intro="We dig deep so you don't have to. Clear, actionable insights that help you make confident investment moves."
      />
      <section className="max-w-site mx-auto px-6 py-16 md:py-24">
        <SectionHeading eyebrow="Downloads" title="Corporate Reports" />
        {reports.length === 0 ? (
          <p className="m-0 border border-line bg-mist p-6 text-[15px] text-muted-body">No corporate reports published yet.</p>
        ) : (
          <ul className="list-none m-0 p-0 grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr))]">
            {reports.map((r) => {
              const href = mediaUrl(r.file, r.path)
              if (!href) return null
              return (
                <li key={r.id} className="border border-line hover:border-line-dash hover:bg-mist">
                  <a href={href} target="_blank" rel="noopener" className="no-underline text-ink p-7 flex flex-col gap-2.5 h-full">
                    <span className="text-[13px] text-wine font-semibold">Corporate report · PDF</span>
                    <h3 className="m-0 font-serif font-normal text-[22px] leading-[1.3]">{r.title}</h3>
                    <span className="mt-2 text-sm font-semibold text-accent underline">Download PDF</span>
                  </a>
                </li>
              )
            })}
          </ul>
        )}
        <div className="mt-10">
          <Button link={{ label: 'All research', href: '/research', newTab: false }} style="secondary" />
        </div>
      </section>
      <ContactBand />
    </>
  )
}
