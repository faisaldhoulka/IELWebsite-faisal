import type { Metadata } from 'next'

import { openGraph } from '@/lib/seo'
import { ContactBand, PageHero, Unavailable } from '@/components/ui'
import { getNews } from '@/lib/supabase-data'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'News',
  description: 'Announcements, public notices and offer documents from Integrated Equities Limited (IEL).',
  alternates: { canonical: '/news' },
  openGraph: openGraph({ title: 'News | Integrated Equities Limited (IEL)', url: '/news' }),
}

export default async function NewsPage() {
  let news: Awaited<ReturnType<typeof getNews>> | null = null
  try {
    news = await getNews(20)
  } catch {
    news = null
  }

  return (
    <>
      <PageHero eyebrow="Newsroom" title="News" intro="Announcements, public notices and offer documents from Integrated Equities Limited." />
      <section className="max-w-site mx-auto px-6 py-16 md:py-24" aria-labelledby="news-heading">
        <div className="flex flex-col gap-3 mb-10">
          <span className="text-[13px] font-semibold tracking-[1.5px] uppercase text-wine">Announcements</span>
          <h2 id="news-heading" className="m-0 font-serif font-medium text-[30px] md:text-[40px] leading-[1.15] text-pine">
            Latest news
          </h2>
        </div>
        {!news ? (
          <Unavailable what="News items" />
        ) : news.length === 0 ? (
          <p className="m-0 border border-line bg-mist p-6 text-[15px] text-muted-body">No news available at the moment.</p>
        ) : (
          <ul className="list-none m-0 p-0 grid gap-px bg-line border border-line">
            {news.map((n, i) => (
              <li key={`${n.title}-${i}`} className="bg-white p-6 md:p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <p className="m-0 font-serif text-[20px] md:text-[22px] leading-[1.35] text-ink max-w-[820px]">{n.title}</p>
                {n.pdfUrl && (
                  <a href={n.pdfUrl} target="_blank" rel="noopener" className="shrink-0 font-semibold text-[15px] text-accent hover:text-accent-dark underline">
                    Download PDF →
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
      <ContactBand />
    </>
  )
}
