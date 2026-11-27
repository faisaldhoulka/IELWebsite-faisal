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
 * Homepage notices (Shareholder Agahi, fraud awareness), shown together when the homepage
 * opens, as on the old site. Closing any of them closes all; ticking "Don't show this
 * again" remembers it in this browser.
 */
export function Popups({ notices, dontShowAgainLabel }: { notices: PopupNotice[]; dontShowAgainLabel: string }) {
  const [open, setOpen] = useState(false)
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

  const close = () => {
    if (remember) {
      try {
        localStorage.setItem(STORAGE_KEY, 'true')
      } catch {
        /* ignore */
      }
    }
    setOpen(false)
  }

  if (!notices.length) return null

  return (
    <Dialog open={open} onClose={close} labelledBy="popup-title-0" className="w-[1080px]">
      <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(min(340px,100%),1fr))] items-start">
        {notices.map((n, i) => (
          <section key={n.title} className="relative bg-white text-ink p-7 md:p-8 flex flex-col gap-4 border-t-4 border-t-accent">
            <CloseButton onClick={close} />
            {n.eyebrow && <span className={`${EYEBROW} text-wine`}>{n.eyebrow}</span>}
            <h2 id={`popup-title-${i}`} className="m-0 pr-10 font-serif font-medium text-[24px] md:text-[28px] leading-[1.2] text-pine">
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
            {n.closeLabel && (
              <button
                type="button"
                onClick={close}
                className="self-start bg-accent hover:bg-accent-dark text-white border-0 rounded px-5 py-3 font-sans font-semibold text-[15px] cursor-pointer"
              >
                {n.closeLabel}
              </button>
            )}
          </section>
        ))}
      </div>
      <label className="mt-3 flex items-center gap-2 text-white text-[15px] cursor-pointer">
        <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="w-4 h-4 accent-accent" />
        {dontShowAgainLabel}
      </label>
    </Dialog>
  )
}
