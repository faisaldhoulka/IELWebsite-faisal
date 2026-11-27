import type { Metadata } from 'next'

import { HomeSections } from '@/components/blocks/HomeSections'
import { Popups, type PopupNotice } from '@/components/Popups'
import { RichText } from '@/components/RichText'
import { getGlobal } from '@/lib/cms'
import { mediaUrl, toSiteLinks } from '@/lib/links'

export async function generateMetadata(): Promise<Metadata> {
  const home = await getGlobal('homepage', 1)
  return {
    title: { absolute: home.seo?.title || 'IEL | Financial and Transaction Advisory in Pakistan' },
    description: home.seo?.description || undefined,
    alternates: { canonical: '/' },
    openGraph: { title: 'Integrated Equities Limited (IEL)', description: home.seo?.description || undefined, url: '/' },
  }
}

export default async function Home() {
  const [home, popups] = await Promise.all([getGlobal('homepage'), getGlobal('popups')])

  const notices: PopupNotice[] = popups.enabled
    ? (popups.notices ?? []).map((n) => ({
        eyebrow: n.eyebrow,
        title: n.title,
        body: n.body ? <RichText data={n.body} /> : null,
        links: toSiteLinks(n.links),
        images: (n.images ?? []).flatMap((img) => {
          const src = mediaUrl(img.image, img.path)
          return src ? [{ src, alt: img.alt ?? '' }] : []
        }),
        closeLabel: n.closeLabel,
      }))
    : []

  return (
    <>
      <HomeSections sections={home.sections ?? []} />
      <Popups notices={notices} dontShowAgainLabel={popups.dontShowAgainLabel || 'Don’t show this again'} />
    </>
  )
}
