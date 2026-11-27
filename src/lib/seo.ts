import type { Metadata } from 'next'

/** Default link-preview image (src/app/og-image.png/route.tsx). */
export const DEFAULT_OG_IMAGE = {
  url: '/og-image.png',
  width: 1200,
  height: 630,
  alt: 'Integrated Equities Limited (IEL): financial and transaction advisory in Pakistan',
}

/**
 * Open Graph block for a page. A page's own `openGraph` replaces the site default
 * entirely in Next.js, so every page passes through here to keep an image.
 */
export function openGraph(og: NonNullable<Metadata['openGraph']> & { image?: string | null }): Metadata['openGraph'] {
  const { image, ...rest } = og
  return {
    type: 'website',
    siteName: 'Integrated Equities Limited',
    ...rest,
    images: image ? [image] : [DEFAULT_OG_IMAGE],
  }
}
