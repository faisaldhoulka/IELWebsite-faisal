import { toSiteLink, type CmsLink } from '@/lib/links'
import { Button, type ButtonStyle } from '../ui'

type CmsButton = CmsLink & { style?: 'primary' | 'secondary' | null }

/** CMS button rows → resolved links with their style. */
export function toButtons(buttons: CmsButton[] | null | undefined) {
  return (buttons ?? []).flatMap((b) => {
    const link = toSiteLink(b)
    return link ? [{ link, style: (b.style ?? 'primary') as ButtonStyle }] : []
  })
}

/** "Trading with IEL" style band: title, text, buttons. Used on the homepage and pages. */
export function CtaBand({
  anchor,
  title,
  text,
  buttons,
}: {
  anchor?: string | null
  title: string
  text?: string | null
  buttons?: CmsButton[] | null
}) {
  return (
    <section id={anchor || undefined} className="border-y border-line bg-mist">
      <div className="max-w-site mx-auto px-6 py-12 flex flex-wrap justify-between items-center gap-6">
        <div className="flex flex-col gap-1.5 max-w-[640px]">
          <h2 className="m-0 font-serif font-normal text-[26px] text-pine">{title}</h2>
          {text && <p className="m-0 text-[15px] text-muted-body">{text}</p>}
        </div>
        <div className="flex flex-wrap gap-3">
          {toButtons(buttons).map((b) => (
            <Button key={b.link.href + b.link.label} link={b.link} style="secondary" className="!px-[22px] !py-[13px] !text-[15px]" />
          ))}
        </div>
      </div>
    </section>
  )
}

/** Shorten a bio for cards when no short version is stored. */
export function shorten(text: string | null | undefined, max = 180): string {
  const t = (text ?? '').replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  return t.slice(0, max).replace(/\s+\S*$/, '').replace(/[,;:]$/, '') + '…'
}
