'use client'

import { useState, type ReactNode } from 'react'

import type { SiteLink } from '@/lib/links'
import { CloseButton, Dialog } from './Dialog'

/**
 * Footer "Complaints (SECP, PSX)" button and pop-up (parity item 2): the complaint-handling
 * procedure (view or download the PDF), the PSX and SECP complaint portals and the phone line.
 */
export function ComplaintsButton({
  label,
  title,
  body,
  pdfHref,
  portals,
  phone,
}: {
  label: string
  title: string
  body?: ReactNode
  pdfHref: string | null
  portals: SiteLink[]
  phone?: { number: string; href: string } | null
}) {
  const [open, setOpen] = useState(false)
  const button = 'no-underline px-4 py-2.5 rounded font-semibold text-[15px] inline-block'
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="border border-pine-line bg-transparent text-white hover:bg-pine-line rounded px-4 py-2.5 font-sans font-semibold text-[14px] cursor-pointer"
      >
        {label}
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} labelledBy="complaints-title">
        <div className="relative bg-white text-ink w-[560px] max-w-full p-7 md:p-9 flex flex-col gap-4">
          <CloseButton onClick={() => setOpen(false)} />
          <h2 id="complaints-title" className="m-0 pr-10 font-serif font-medium text-[26px] leading-[1.2] text-pine">
            {title}
          </h2>
          {body}
          {pdfHref && (
            <div className="flex flex-wrap gap-3">
              <a href={pdfHref} download className={`${button} bg-accent hover:bg-accent-dark text-white`}>
                Download
              </a>
              <a href={pdfHref} target="_blank" rel="noopener" className={`${button} border border-ink text-ink hover:bg-mist`}>
                View in browser tab
              </a>
            </div>
          )}
          {portals.length > 0 && (
            <div className="flex flex-col gap-2 border-t border-line pt-4 text-[15px]">
              <span className="font-semibold">Investor complaints</span>
              {portals.map((p) => (
                <a key={p.href} href={p.href} target="_blank" rel="noopener" className="text-accent underline hover:text-accent-dark">
                  {p.label} ↗
                </a>
              ))}
            </div>
          )}
          {phone && (
            <p className="m-0 text-[15px] text-muted-body">
              For complaints and feedback, call{' '}
              <a href={phone.href} className="text-accent underline">
                {phone.number}
              </a>
              .
            </p>
          )}
        </div>
      </Dialog>
    </>
  )
}
