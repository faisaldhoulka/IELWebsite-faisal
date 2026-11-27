import type { Media, Page } from '@/payload-types'

/** The shape every CMS link field shares (see `linkFields` in src/fields). */
export type CmsLink = {
  label?: string | null
  type?: 'path' | 'page' | 'url' | 'file' | null
  path?: string | null
  page?: number | Page | null
  url?: string | null
  file?: number | Media | null
  newTab?: boolean | null
}

/** A link ready to render. */
export type SiteLink = { label: string; href: string; newTab: boolean }

/** Paths of files already in public/ contain spaces ("/IEL Assets/…"). */
export const encodePath = (p: string) => p.replace(/ /g, '%20')

export function mediaUrl(media: number | Media | null | undefined, fallbackPath?: string | null): string | null {
  if (media && typeof media === 'object' && media.url) return media.url
  return fallbackPath ? encodePath(fallbackPath) : null
}

export function linkHref(link: CmsLink | null | undefined): string | null {
  if (!link) return null
  switch (link.type ?? 'path') {
    case 'page':
      return link.page && typeof link.page === 'object' ? `/${link.page.slug}` : null
    case 'url':
      return link.url || null
    case 'file':
      return mediaUrl(link.file)
    default:
      return link.path ? encodePath(link.path) : null
  }
}

/** Resolve a CMS link; null when it has no label or nowhere to go. */
export function toSiteLink(link: CmsLink | null | undefined): SiteLink | null {
  const href = linkHref(link)
  if (!href || !link?.label) return null
  return { label: link.label, href, newTab: Boolean(link.newTab) || isExternal(href) }
}

export const toSiteLinks = (links: (CmsLink | null | undefined)[] | null | undefined): SiteLink[] =>
  (links ?? []).map(toSiteLink).filter((l): l is SiteLink => l !== null)

/** Other sites and files open in a new tab. */
export const isExternal = (href: string) => /^https?:\/\//i.test(href) || /\.pdf($|[?#])/i.test(href)

/** "tel:" target from a display number when no dial string is stored. */
export const telHref = (number: string, href?: string | null) => `tel:${href || number.replace(/[^\d+]/g, '')}`
