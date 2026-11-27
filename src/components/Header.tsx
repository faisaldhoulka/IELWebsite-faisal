'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import type { SiteLink } from '@/lib/links'
import { SmartLink } from './ui'

export type NavItem = SiteLink & { children: SiteLink[] }

type Props = {
  utilityText?: string | null
  utilityLinks: SiteLink[]
  clientLoginUrl?: string | null
  items: NavItem[]
  cta: SiteLink | null
}

const pathOf = (href: string) => href.split('#')[0] || '/'
const slugOf = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-')

/**
 * Utility bar + sticky main navigation (parity item 1): dropdowns open on hover, click
 * or Enter; Escape or tabbing away closes them. Below 1280px a ☰ menu with collapsible
 * groups. The section of the current page is highlighted.
 */
export function Header({ utilityText, utilityLinks, clientLoginUrl, items, cta }: Props) {
  const pathname = usePathname() || '/'
  const [open, setOpen] = useState<number | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navRef = useRef<HTMLUListElement>(null)

  const isCurrent = (href: string) => !href.includes('#') && pathOf(href) === pathname
  const groupActive = (it: NavItem) => it.children.some((l) => pathOf(l.href) === pathname)

  // Close menus on navigation.
  useEffect(() => {
    setOpen(null)
    setMobileOpen(false)
  }, [pathname])

  // Click outside / Escape close the desktop dropdowns.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpen(null)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen((current) => {
        if (current !== null) navRef.current?.querySelector<HTMLButtonElement>(`[data-dd="${current}"]`)?.focus()
        return null
      })
      setMobileOpen(false)
    }
    document.addEventListener('click', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const ctaLink = cta ?? { label: 'Discuss a mandate', href: '/#contact', newTab: false }

  return (
    <>
      <div className="bg-pine text-ondark-util text-[13px]">
        <div className="max-w-site mx-auto px-6 py-2.5 flex flex-wrap justify-between items-center gap-3">
          {utilityText && <span>{utilityText}</span>}
          <div className="flex flex-wrap gap-5">
            {utilityLinks.map((l) => (
              <SmartLink key={l.href} href={l.href} newTab={l.newTab} className="text-ondark-util no-underline hover:text-white">
                {l.label}
              </SmartLink>
            ))}
            {clientLoginUrl && (
              <a href={clientLoginUrl} className="text-white no-underline font-semibold" target="_blank" rel="noopener">
                Client login
              </a>
            )}
          </div>
        </div>
      </div>

      <header id="site-header" className="sticky top-0 z-50 border-b border-line bg-white">
        <nav aria-label="Main" className="max-w-site mx-auto px-6 h-[72px] flex items-center justify-between gap-4">
          <Link href="/" className="no-underline flex items-center gap-3 text-ink shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/Assets/IELTezi-logo-trimmed.webp" alt="IEL home" className="h-11 w-auto block" />
            <span className="hidden sm:inline text-sm text-muted border-l border-line-soft pl-3">Integrated Equities Limited</span>
          </Link>

          {/* Desktop menu */}
          <ul ref={navRef} className="hidden xl:flex items-center gap-0.5 whitespace-nowrap list-none m-0 p-0 text-[15px] font-medium">
            {items.map((it, i) =>
              it.children.length ? (
                <li
                  key={it.label}
                  className="relative group"
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen((o) => (o === i ? null : o))
                  }}
                >
                  <button
                    type="button"
                    data-dd={i}
                    className={`flex items-center gap-1 px-3 py-2.5 bg-transparent border-0 cursor-pointer font-sans text-[15px] font-medium hover:text-accent ${
                      groupActive(it) ? 'text-accent' : 'text-ink'
                    }`}
                    aria-expanded={open === i}
                    aria-controls={`dd-${slugOf(it.label)}`}
                    onClick={() => setOpen((o) => (o === i ? null : i))}
                  >
                    {it.label}
                    <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" className="transition-transform group-hover:rotate-180">
                      <path d="M2.5 4.5 6 8l3.5-3.5" />
                    </svg>
                  </button>
                  <div id={`dd-${slugOf(it.label)}`} className={`${open === i ? 'block' : 'hidden'} group-hover:block absolute left-0 top-full pt-2 z-50`}>
                    <ul className="list-none m-0 py-2 px-0 min-w-[250px] bg-white border border-line border-t-2 border-t-accent">
                      {it.children.map((l) => (
                        <li key={l.label + l.href}>
                          <SmartLink
                            href={l.href}
                            newTab={l.newTab}
                            aria-current={isCurrent(l.href) ? 'page' : undefined}
                            className={`block px-4 py-2.5 no-underline hover:bg-mist hover:text-accent ${
                              isCurrent(l.href) ? 'text-accent font-semibold' : 'text-ink font-normal'
                            }`}
                          >
                            {l.label}
                            {l.newTab && <span aria-hidden="true" className="text-muted"> ↗</span>}
                          </SmartLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ) : (
                <li key={it.label}>
                  <SmartLink href={it.href} newTab={it.newTab} className="block px-3 py-2.5 text-ink no-underline hover:text-accent">
                    {it.label}
                  </SmartLink>
                </li>
              ),
            )}
          </ul>

          <div className="flex items-center gap-3">
            <SmartLink
              href={ctaLink.href}
              newTab={ctaLink.newTab}
              className="hidden md:inline-block whitespace-nowrap bg-accent hover:bg-accent-dark text-white no-underline px-5 py-3 rounded font-semibold text-[15px]"
            >
              {ctaLink.label}
            </SmartLink>
            <button
              type="button"
              className="xl:hidden inline-flex items-center justify-center w-11 h-11 border border-line rounded bg-white text-ink cursor-pointer"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMobileOpen((o) => !o)}
            >
              <svg aria-hidden="true" width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M3 6h16M3 11h16M3 16h16" />
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile / tablet / small-laptop menu (below 1280px) */}
        <div id="mobile-nav" className={`xl:hidden ${mobileOpen ? '' : 'hidden'} border-t border-line bg-white max-h-[calc(100vh-72px)] overflow-y-auto`}>
          <ul className="list-none m-0 px-6 py-3 max-w-site mx-auto">
            {items.map((it) =>
              it.children.length ? (
                <li key={it.label} className="border-b border-line">
                  <details open={groupActive(it)}>
                    <summary className="flex justify-between items-center py-3.5 cursor-pointer font-semibold text-ink list-none">
                      {it.label}
                      <span aria-hidden="true" className="text-muted text-lg leading-none">+</span>
                    </summary>
                    <ul className="list-none m-0 pb-3 pl-3">
                      {it.children.map((l) => (
                        <li key={l.label + l.href}>
                          <SmartLink
                            href={l.href}
                            newTab={l.newTab}
                            onClick={() => setMobileOpen(false)}
                            aria-current={isCurrent(l.href) ? 'page' : undefined}
                            className={`block py-2.5 no-underline ${isCurrent(l.href) ? 'text-accent font-semibold' : 'text-muted-body'}`}
                          >
                            {l.label}
                            {l.newTab && <span aria-hidden="true"> ↗</span>}
                          </SmartLink>
                        </li>
                      ))}
                    </ul>
                  </details>
                </li>
              ) : (
                <li key={it.label} className="border-b border-line">
                  <SmartLink href={it.href} newTab={it.newTab} onClick={() => setMobileOpen(false)} className="block py-3.5 font-semibold text-ink no-underline">
                    {it.label}
                  </SmartLink>
                </li>
              ),
            )}
            <li className="pt-4 pb-2">
              <SmartLink
                href={ctaLink.href}
                newTab={ctaLink.newTab}
                onClick={() => setMobileOpen(false)}
                className="block text-center bg-accent hover:bg-accent-dark text-white no-underline px-5 py-3 rounded font-semibold"
              >
                {ctaLink.label}
              </SmartLink>
            </li>
          </ul>
        </div>
      </header>
    </>
  )
}
