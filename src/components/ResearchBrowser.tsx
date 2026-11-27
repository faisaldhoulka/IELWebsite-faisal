'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

export type ResearchItem = {
  id: string
  name: string
  shortDesc: string
  reportType: string
  sectorName: string
  createdAt: string | null
  pdfUrl: string | null
  downloadUrl: string | null
}

const FREQS = ['All', 'Daily', 'Weekly', 'Market-wide'] as const
const norm = (v: string) => v.trim().toLowerCase().replace(/[\s_]+/g, '-')

function formatDate(value: string | null) {
  if (!value) return ''
  const d = new Date(value)
  return isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'Asia/Karachi' })
}

/**
 * Research library (parity item 7): sector tabs (alphabetical, first selected), report
 * type filter, search across all sectors (a search clears the tab), view and download.
 */
export function ResearchBrowser({ sectors, reports }: { sectors: string[]; reports: ResearchItem[] }) {
  const [sector, setSector] = useState(sectors[0] ?? '')
  const [freq, setFreq] = useState<(typeof FREQS)[number]>('All')
  const [input, setInput] = useState('')
  const [query, setQuery] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  // Live search once typing pauses.
  useEffect(() => {
    const t = setTimeout(() => setQuery(input), 200)
    return () => clearTimeout(t)
  }, [input])

  const q = query.trim().toLowerCase()
  const searching = q.length > 0

  const items = useMemo(() => {
    const f = norm(freq)
    return reports.filter((r) => {
      if (searching) {
        const text = [r.name, r.shortDesc, r.reportType, r.sectorName].join(' ').toLowerCase()
        if (!q.split(/\s+/).every((w) => text.includes(w))) return false
      }
      if (f !== 'all' && norm(r.reportType) !== f) return false
      // Market-wide reports ignore the sector tab; a search spans all sectors.
      if (searching || f === 'market-wide') return true
      return r.sectorName === sector
    })
  }, [reports, q, searching, freq, sector])

  const latest = useMemo(
    () =>
      reports
        .filter((r) => r.sectorName === sector)
        .sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
        .slice(0, 5),
    [reports, sector],
  )

  const clearSearch = () => {
    setInput('')
    setQuery('')
  }

  return (
    <>
      <form
        role="search"
        className="w-full max-w-[560px] flex flex-col gap-1.5 mb-12"
        onSubmit={(e) => {
          e.preventDefault()
          setQuery(input)
          listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }}
      >
        <label htmlFor="research-search" className="text-sm font-medium text-ink">
          Search reports
        </label>
        <div className="flex flex-wrap gap-3">
          <input
            id="research-search"
            type="search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Try “fertilizer” or “FFC”"
            className="h-[46px] min-w-0 flex-1 basis-[220px] border border-line rounded px-3 text-[15px] text-ink font-sans bg-white focus:outline-none focus:border-accent"
          />
          <button type="submit" className="h-[46px] bg-accent hover:bg-accent-dark text-white border-0 px-[22px] rounded font-semibold text-[15px] font-sans cursor-pointer">
            Search
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-3 mb-8">
        <span className="text-[13px] font-semibold tracking-[1.5px] uppercase text-wine">Library</span>
        <h2 className="m-0 font-serif font-medium text-[30px] md:text-[40px] leading-[1.15] text-pine">Research reports</h2>
      </div>

      {/* Sector tabs */}
      <div className="border-b border-line overflow-x-auto">
        <div className="flex gap-7 min-w-max" role="group" aria-label="Sector">
          {sectors.length === 0 && <span className="pb-3 text-[15px] text-muted">Sectors could not be loaded.</span>}
          {sectors.map((s) => {
            const active = !searching && s === sector
            return (
              <button
                key={s}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setSector(s)
                  clearSearch()
                }}
                className={`pb-3 -mb-px border-0 border-b-2 border-solid bg-transparent px-0 font-sans font-semibold text-[15px] cursor-pointer whitespace-nowrap ${
                  active ? 'text-accent border-accent' : 'text-muted border-transparent hover:text-ink'
                }`}
              >
                {s}
              </button>
            )
          })}
        </div>
      </div>

      {/* Report type */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span id="freq-label" className="text-sm font-medium text-muted-body">
          Report type
        </span>
        <div role="group" aria-labelledby="freq-label" className="inline-flex flex-wrap border border-accent rounded overflow-hidden">
          {FREQS.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={f === freq}
              onClick={() => setFreq(f)}
              className={`px-4 py-2.5 border-0 border-l border-solid border-accent first:border-l-0 text-sm font-semibold font-sans cursor-pointer transition-colors ${
                f === freq ? 'bg-accent text-white' : 'bg-white text-accent hover:bg-mist'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">
        <div ref={listRef} className="flex flex-col gap-4 min-w-0 scroll-mt-28" aria-live="polite">
          {searching && (
            <div className="flex flex-wrap items-center justify-between gap-3 text-[15px] text-muted-body">
              <span>
                {items.length} result{items.length === 1 ? '' : 's'} for “{query.trim()}” across all sectors
              </span>
              <button type="button" onClick={clearSearch} className="bg-transparent border-0 p-0 font-semibold font-sans text-[15px] text-accent hover:text-accent-dark underline cursor-pointer">
                Clear search
              </button>
            </div>
          )}
          {items.length === 0 ? (
            <p className="m-0 border border-line bg-mist p-6 text-[15px] text-muted-body">
              {searching ? 'No reports match your search' : 'No research documents found'}
            </p>
          ) : (
            items.map((r) => (
              <article key={r.id} className="border border-line bg-white hover:border-line-dash p-6 md:p-7 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div className="min-w-0 flex flex-col gap-2">
                  <span className="text-[13px] text-wine font-semibold">{[r.reportType, r.sectorName, formatDate(r.createdAt)].filter(Boolean).join(' · ')}</span>
                  <h3 className="m-0 font-serif font-normal text-[22px] leading-[1.3] text-ink">{r.name}</h3>
                  {r.shortDesc && <p className="m-0 text-[15px] text-muted-body">{r.shortDesc}</p>}
                </div>
                {r.pdfUrl && (
                  <div className="flex flex-wrap gap-3 shrink-0">
                    <a href={r.pdfUrl} target="_blank" rel="noopener" className="border border-ink text-ink hover:bg-mist no-underline px-[21px] py-[12px] rounded font-semibold text-[15px]">
                      Read report
                    </a>
                    <a href={r.downloadUrl ?? r.pdfUrl} download className="bg-accent hover:bg-accent-dark text-white no-underline px-[22px] py-[13px] rounded font-semibold text-[15px]">
                      Download PDF
                    </a>
                  </div>
                )}
              </article>
            ))
          )}
        </div>

        <aside className="border border-line p-6" aria-labelledby="latest-heading">
          <h3 id="latest-heading" className="m-0 text-[13px] font-semibold tracking-[1.5px] uppercase text-wine">
            Latest in this sector
          </h3>
          <ol className="list-none m-0 mt-3 p-0">
            {latest.length === 0 && <li className="text-[15px] text-muted py-3">No reports yet</li>}
            {latest.map((r, i) => (
              <li key={r.id} className={`flex gap-3 py-3 ${i < latest.length - 1 ? 'border-b border-line' : ''}`}>
                <span className="font-serif text-[15px] font-semibold text-wine">{i + 1}</span>
                {r.pdfUrl ? (
                  <a href={r.pdfUrl} target="_blank" rel="noopener" className="text-[15px] leading-[1.45] text-ink no-underline hover:text-accent hover:underline">
                    {r.name}
                  </a>
                ) : (
                  <span className="text-[15px] leading-[1.45] text-ink">{r.name}</span>
                )}
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </>
  )
}
