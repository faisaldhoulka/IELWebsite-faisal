'use client'

import { useEffect, useState, type ReactNode } from 'react'

import type { SiteLink } from '@/lib/links'
import { CloseButton, Dialog } from './Dialog'
import { EYEBROW } from './ui'

export type PopupNotice = {
  eyebrow?: string | null
  title: string
  body: ReactNode
  links: SiteLink[]
  images: { src: string; alt: string }[]
  closeLabel?: string | null
}

// Same key as the old site, so visitors who already ticked "Don't show this again" stay opted out.
const STORAGE_KEY = 'dualPopupDismissed'

/**
 * Homepage notices (Shareholder Agahi, fraud awareness), shown one after the other when the
 * homepage opens. Closing a notice shows the next; Escape closes all. Ticking "Don’t show this
 * again" remembers it in this browser.
 */
export function Popups({ notices, dontShowAgainLabel }: { notices: PopupNotice[]; dontShowAgainLabel: string }) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const [remember, setRemember] = useState(false)

  useEffect(() => {
    let dismissed = false
    try {
      dismissed = localStorage.getItem(STORAGE_KEY) === 'true'
    } catch {
      /* storage blocked: show the notices */
    }
    if (!dismissed && notices.length) setOpen(true)
  }, [notices.length])

  // Escape, a click on the backdrop or the last notice's button closes everything.
  const finish = () => {
    if (remember) {
      try {
        localStorage.setItem(STORAGE_KEY, 'true')
      } catch {
        /* ignore */
      }
    }
    setOpen(false)
  }
  const isLast = index >= notices.length - 1
  const next = () => (isLast ? finish() : setIndex((i) => i + 1))

  if (!notices.length) return null
  const n = notices[Math.min(index, notices.length - 1)]

  return (
    <Dialog open={open} onClose={finish} labelledBy="popup-title" className="w-[640px]">
      <section key={index} className="relative bg-white text-ink p-7 md:p-9 flex flex-col gap-4 border-t-4 border-t-accent">
        <CloseButton onClick={next} label={isLast ? 'Close' : 'Close and show the next notice'} />
        {notices.length > 1 && (
          <span className="text-[13px] text-muted font-semibold">
            Notice {index + 1} of {notices.length}
          </span>
        )}
        {n.eyebrow && <span className={`${EYEBROW} text-wine`}>{n.eyebrow}</span>}
        <h2 id="popup-title" className="m-0 pr-10 font-serif font-medium text-[24px] md:text-[28px] leading-[1.2] text-pine">
          {n.title}
        </h2>
            {n.body}
            {n.links.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {n.links.map((l, j) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener"
                    className={`no-underline px-5 py-3 rounded font-semibold text-[15px] ${
                      j === 0 ? 'bg-accent hover:bg-accent-dark text-white' : 'border border-ink text-ink hover:bg-mist'
                    }`}
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            )}
            {n.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {n.images.map((img) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={img.src} src={img.src} alt={img.alt} className="w-full h-24 object-contain bg-white p-1 border border-line" loading="lazy" />
                ))}
              </div>
            )}
        <div className="mt-2 pt-5 border-t border-line flex flex-wrap items-center justify-between gap-4">
          <label className="flex items-center gap-2 text-[15px] text-muted-body cursor-pointer">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-4 h-4 accent-accent" />
            {dontShowAgainLabel}
          </label>
          <button
            type="button"
            onClick={next}
            className="bg-accent hover:bg-accent-dark text-white border-0 rounded px-5 py-3 font-sans font-semibold text-[15px] cursor-pointer"
          >
            {n.closeLabel || (isLast ? 'Close' : 'Next notice →')}
          </button>
        </div>
      </section>
    </Dialog>
  )
}
