import Link from 'next/link'
import type { ReactNode } from 'react'

import { isExternal, type SiteLink } from '@/lib/links'

// Small building blocks of the dark-green design (ported from the Astro components:
// BrandStripe, SectionHeading, PageHero, ContactBand).

/** Thin stripe in the IEL logo's colours. */
export function BrandStripe({ className = '' }: { className?: string }) {
  return (
    <div className={`brand-stripe ${className}`} aria-hidden="true">
      <span className="bg-brand-dark" />
      <span className="bg-brand-green" />
      <span className="bg-brand-light" />
      <span className="bg-brand-coral" />
      <span className="bg-brand-maroon" />
    </div>
  )
}

/** Internal links use next/link; other sites and files open in a new tab. */
export function SmartLink({
  href,
  newTab,
  className,
  children,
  ...rest
}: { href: string; newTab?: boolean; className?: string; children: ReactNode } & Record<string, unknown>) {
  const blank = newTab ?? isExternal(href)
  if (blank || /^(https?:|mailto:|tel:)/.test(href) || /\.pdf/i.test(href)) {
    return (
      <a href={href} className={className} {...(blank ? { target: '_blank', rel: 'noopener' } : {})} {...rest}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={className} {...rest}>
      {children}
    </Link>
  )
}

export type ButtonStyle = 'primary' | 'secondary' | 'light' | 'outline-light'

const BUTTON: Record<ButtonStyle, string> = {
  primary: 'bg-accent hover:bg-accent-dark text-white px-[26px] py-[15px]',
  secondary: 'border border-ink text-ink hover:bg-white px-[25px] py-[14px]',
  light: 'bg-white text-accent hover:bg-mist px-[22px] py-[13px] text-[15px]',
  'outline-light': 'border border-white text-white hover:bg-accent-dark px-[22px] py-[13px] text-[15px]',
}

export function Button({ link, style = 'primary', className = '' }: { link: SiteLink; style?: ButtonStyle; className?: string }) {
  return (
    <SmartLink href={link.href} newTab={link.newTab} className={`no-underline rounded font-semibold text-base inline-block ${BUTTON[style]} ${className}`}>
      {link.label}
    </SmartLink>
  )
}

export const EYEBROW = 'text-[13px] font-semibold tracking-[1.5px] uppercase'

/** Section header: eyebrow + serif h2, with an intro or "link →" on the right. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  link,
  dark = false,
}: {
  eyebrow?: string | null
  title?: string | null
  intro?: string | null
  link?: SiteLink | null
  dark?: boolean
}) {
  if (!eyebrow && !title && !intro && !link) return null
  return (
    <div className="flex flex-wrap justify-between items-end gap-6 mb-10 md:mb-12">
      <div className="flex flex-col gap-3 max-w-[640px]">
        {eyebrow && <span className={`${EYEBROW} ${dark ? 'text-mint' : 'text-wine'}`}>{eyebrow}</span>}
        {title && (
          <h2 className={`m-0 font-serif font-medium text-[30px] md:text-[40px] leading-[1.15] ${dark ? 'text-white' : 'text-pine'}`}>{title}</h2>
        )}
      </div>
      {intro && <p className={`m-0 max-w-[420px] text-base ${dark ? 'text-ondark' : 'text-muted-body'}`}>{intro}</p>}
      {link && (
        <SmartLink
          href={link.href}
          newTab={link.newTab}
          className={`font-semibold text-[15px] underline ${dark ? 'text-white' : 'text-accent hover:text-accent-dark'}`}
        >
          {link.label} →
        </SmartLink>
      )}
    </div>
  )
}

/** Inner-page hero: light band, wine eyebrow, serif title, optional buttons and side card. */
export function PageHero({
  eyebrow,
  title,
  intro,
  buttons = [],
  aside,
}: {
  eyebrow?: string | null
  title: string
  intro?: string | null
  buttons?: { link: SiteLink; style: ButtonStyle }[]
  aside?: ReactNode
}) {
  return (
    <section className="bg-mist border-b border-line">
      <div
        className={`max-w-site mx-auto px-6 pt-14 pb-12 md:pt-20 md:pb-16 ${
          aside ? 'grid gap-12 items-end [grid-template-columns:repeat(auto-fit,minmax(min(320px,100%),1fr))]' : ''
        }`}
      >
        <div className="flex flex-col gap-5 max-w-[760px]">
          <BrandStripe className="w-16" />
          {eyebrow && <span className={`${EYEBROW} text-wine`}>{eyebrow}</span>}
          <h1 className="m-0 font-serif font-medium text-[36px] md:text-[48px] leading-[1.12] text-pine">{title}</h1>
          {intro && <p className="m-0 text-[17px] md:text-[19px] text-muted-body max-w-[640px]">{intro}</p>}
          {buttons.length > 0 && (
            <div className="flex flex-wrap gap-3.5 mt-2">
              {buttons.map((b) => (
                <Button key={b.link.label + b.link.href} link={b.link} style={b.style} />
              ))}
            </div>
          )}
        </div>
        {aside && <div>{aside}</div>}
      </div>
    </section>
  )
}

/** "Start a conversation" band above the footer on inner pages. */
export function ContactBand() {
  return (
    <section className="bg-accent text-white">
      <div className="max-w-site mx-auto px-6 py-14 md:py-16 flex flex-wrap justify-between items-center gap-8">
        <div className="flex flex-col gap-2 max-w-[640px]">
          <h2 className="m-0 font-serif font-medium text-[28px] md:text-[34px] leading-[1.15]">Start a conversation</h2>
          <p className="m-0 text-[16px] text-ondark-soft">Tell us what you are working on. Every enquiry is confidential.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button link={{ label: 'Discuss a mandate', href: '/#contact', newTab: false }} style="light" />
          <Button link={{ label: 'Contact us', href: '/contact', newTab: false }} style="outline-light" />
        </div>
      </div>
    </section>
  )
}

/** Shown when live data (Supabase) can't be loaded and nothing is cached. */
export function Unavailable({ what }: { what: string }) {
  return (
    <p className="m-0 border border-line bg-mist p-6 text-[15px] text-muted-body">
      {what} are temporarily unavailable. Please try again in a few minutes.
    </p>
  )
}
