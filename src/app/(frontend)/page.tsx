// Temporary week-1 page: proves the design tokens, fonts and the server-side data
// layer work end to end. Replaced by the dark-green homepage in week 2.
import { getNews } from '@/lib/supabase-data'

export const revalidate = 60

export default async function Home() {
  let news: Awaited<ReturnType<typeof getNews>> = []
  let failed = false
  try {
    news = await getNews(5)
  } catch {
    failed = true
  }

  return (
    <main className="max-w-site mx-auto px-6 py-16 flex flex-col gap-8">
      <div className="brand-stripe w-16">
        <span className="bg-brand-green" />
        <span className="bg-brand-dark" />
        <span className="bg-brand-light" />
        <span className="bg-brand-maroon" />
        <span className="bg-brand-coral" />
      </div>
      <span className="text-[13px] font-semibold tracking-[1.5px] uppercase text-wine">Rebuild in progress</span>
      <h1 className="m-0 font-serif font-medium text-[40px] md:text-[56px] leading-[1.1] text-pine">
        IEL website on Next.js and Payload CMS
      </h1>
      <p className="m-0 text-muted-body max-w-[600px]">
        Latest news below is read on the server from the existing Supabase project; the browser never talks to Supabase.
      </p>
      <ul className="list-none m-0 p-0 grid gap-px bg-line border border-line">
        {failed && <li className="bg-white p-6 text-[15px]">News could not be loaded.</li>}
        {news.map((n, i) => (
          <li key={i} className="bg-white p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="m-0 font-serif text-[20px] text-ink">{n.title}</p>
            {n.pdfUrl && (
              <a href={n.pdfUrl} target="_blank" rel="noopener" className="shrink-0 font-semibold text-[15px] text-accent underline">
                Download PDF →
              </a>
            )}
          </li>
        ))}
      </ul>
      <a href="/admin" className="text-accent underline font-semibold">Open the CMS →</a>
    </main>
  )
}
