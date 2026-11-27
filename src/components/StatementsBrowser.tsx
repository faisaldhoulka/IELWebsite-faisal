'use client'

import { useState } from 'react'

import type { StatementsByTab, StatementYear } from '@/lib/supabase-data'
import { Tabs } from './Tabs'

const PDF_ICON = (
  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
  </svg>
)

/**
 * Financial statements (parity item 10): one tab per statement type; each tab groups
 * documents by financial year (July–June), newest first, with the newest year open and
 * a search box that filters by title or year label.
 */
export function StatementsBrowser({ data }: { data: StatementsByTab }) {
  return (
    <Tabs
      label="Statement type"
      listClassName="flex w-fit max-w-full overflow-x-auto border border-accent rounded"
      tabClassName="px-5 py-3 text-sm font-semibold font-sans whitespace-nowrap cursor-pointer border-0 border-l border-solid border-accent first:border-l-0 bg-white text-accent hover:bg-mist aria-selected:bg-accent aria-selected:text-white"
      tabs={Object.entries(data).map(([tab, years]) => ({
        id: tab.replace(/\W+/g, '-').toLowerCase(),
        label: tab,
        panel: <TabPanel tab={tab} years={years} />,
      }))}
    />
  )
}

function TabPanel({ tab, years }: { tab: string; years: StatementYear[] }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<Record<number, boolean>>(() => (years[0] ? { [years[0].fyStart]: true } : {}))
  const q = query.trim().toLowerCase()
  const inputId = `fs-search-${tab.replace(/\W+/g, '-').toLowerCase()}`

  const visible = years
    .map((y) => {
      const labelMatches = q && y.label.toLowerCase().includes(q)
      return { ...y, items: !q || labelMatches ? y.items : y.items.filter((it) => it.title.toLowerCase().includes(q)) }
    })
    .filter((y) => y.items.length > 0)

  return (
    <div className="mt-10">
      <div className="mb-6 flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm font-medium text-ink">
          Search statements
        </label>
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Title or year, e.g. 2024-25"
          className="h-[46px] w-full sm:w-[360px] border border-line rounded px-3 text-[15px] text-ink font-sans bg-white focus:outline-none focus:border-accent"
        />
      </div>
      {visible.map((y) => {
        const isOpen = q ? true : Boolean(open[y.fyStart])
        const panelId = `${inputId}-fy-${y.fyStart}`
        return (
          <div key={y.fyStart} className="mb-4 border border-line bg-white">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpen((o) => ({ ...o, [y.fyStart]: !isOpen }))}
              className="w-full flex justify-between items-center gap-4 px-5 py-4 md:px-6 bg-white hover:bg-mist border-0 text-left font-sans text-ink cursor-pointer"
            >
              <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="font-serif font-medium text-[22px] text-pine">{y.label}</span>
                <span className="text-[13px] text-wine font-semibold">
                  {y.items.length} document{y.items.length === 1 ? '' : 's'}
                </span>
              </span>
              <svg
                className={`w-5 h-5 shrink-0 text-accent transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div id={panelId} className="overflow-x-auto border-t border-line" hidden={!isOpen}>
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr>
                    <th scope="col" className="bg-mist px-5 md:px-6 py-3 text-[13px] font-semibold text-ink">
                      Description
                    </th>
                    <th scope="col" className="bg-mist px-5 md:px-6 py-3 text-[13px] font-semibold text-ink text-right">
                      PDF
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {y.items.map((it, i) => (
                    <tr key={`${it.title}-${i}`} className="border-t border-line hover:bg-mist">
                      <td className="px-5 md:px-6 py-4 text-[15px] text-ink align-top">{it.title}</td>
                      <td className="px-5 md:px-6 py-4 align-top text-right whitespace-nowrap">
                        {it.pdfUrl ? (
                          <a
                            href={it.pdfUrl}
                            target="_blank"
                            rel="noopener"
                            aria-label={`View PDF: ${it.title}`}
                            className="inline-flex items-center gap-1.5 text-accent hover:text-accent-dark font-semibold text-[15px] underline"
                          >
                            {PDF_ICON}
                            <span>View PDF</span>
                          </a>
                        ) : (
                          <span className="text-muted text-[15px]">Not available</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}
      {visible.length === 0 && (
        <p className="m-0 border border-line bg-mist p-6 text-[15px] text-muted-body">
          {years.length ? 'No documents match your search.' : 'No documents published yet.'}
        </p>
      )}
    </div>
  )
}
