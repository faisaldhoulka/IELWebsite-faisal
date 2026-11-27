import type { Footer as FooterData, SiteSetting } from '@/payload-types'
import { encodePath, mediaUrl, telHref, toSiteLinks } from '@/lib/links'
import { ComplaintsButton } from './ComplaintsButton'
import { RichText } from './RichText'
import { SmartLink } from './ui'

/** Site footer: offices and contact, link columns, ratings, complaints, vendor notice. */
export function Footer({ footer, settings }: { footer: FooterData; settings: SiteSetting }) {
  const year = new Date().getFullYear()
  const contact = settings.contact ?? {}
  const mainPhone = contact.phone ? { number: contact.phone, href: telHref(contact.phone, contact.phoneHref) } : null
  const phones = [
    ...(mainPhone ? [mainPhone] : []),
    ...(contact.otherPhones ?? []).map((p) => ({ number: p.number, href: telHref(p.number, p.href) })),
  ]
  const ratingReports = toSiteLinks(settings.ratings?.reports)
  const complaints = footer.complaints ?? {}
  const pdfHref = mediaUrl(complaints.pdf, complaints.pdfPath ? encodePath(complaints.pdfPath) : null)

  return (
    <footer className="bg-pine text-ondark text-sm">
      <div className="max-w-site mx-auto px-6 pt-16 pb-10 grid gap-10 [grid-template-columns:repeat(auto-fit,minmax(min(170px,100%),1fr))]">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <span className="font-serif text-2xl text-white font-semibold">IEL</span>
            <span>Integrated Equities Limited</span>
          </div>
          {(contact.addresses ?? []).map((a) => (
            <div key={a.id ?? a.city} className="flex flex-col gap-1">
              {a.city && <span className="text-white font-semibold">{a.city}</span>}
              <span>{a.address}</span>
            </div>
          ))}
          <div className="flex flex-col gap-1">
            {phones.map((p) => (
              <a key={p.number} href={p.href} className="text-ondark hover:text-white no-underline">
                {p.number}
              </a>
            ))}
            {contact.email && (
              <a href={`mailto:${contact.email}`} className="text-ondark hover:text-white no-underline">
                {contact.email}
              </a>
            )}
          </div>
        </div>
        {(footer.columns ?? []).map((col) => (
          <nav key={col.id ?? col.title} aria-label={col.title} className="flex flex-col gap-2">
            <span className="text-white font-semibold">{col.title}</span>
            {toSiteLinks(col.links).map((l) => (
              <SmartLink key={l.label + l.href} href={l.href} newTab={l.newTab} className="text-ondark hover:text-white">
                {l.label}
              </SmartLink>
            ))}
          </nav>
        ))}
      </div>

      {/* Regulatory strip: ratings, complaints, back-office vendor */}
      <div className="max-w-site mx-auto px-6 py-8 border-t border-pine-line grid gap-8 [grid-template-columns:repeat(auto-fit,minmax(min(320px,100%),1fr))]">
        {(settings.ratings?.text || ratingReports.length > 0) && (
          <div className="flex flex-col gap-2">
            <span className="text-white font-semibold">Credit ratings</span>
            {settings.ratings?.text && <p className="m-0">{settings.ratings.text}</p>}
            {ratingReports.length > 0 && (
              <div className="flex flex-wrap gap-x-5 gap-y-1">
                {ratingReports.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noopener" className="text-white underline hover:text-mint">
                    {l.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="flex flex-col gap-3 items-start">
          <span className="text-white font-semibold">{footer.investorComplaints?.title || 'Investor complaints'}</span>
          <ComplaintsButton
            label={complaints.buttonLabel || 'Complaints (SECP, PSX)'}
            title={complaints.title || 'Procedure for Complaint Handling'}
            body={complaints.body ? <RichText data={complaints.body} className="iel-prose text-[15px]" /> : undefined}
            pdfHref={pdfHref}
            portals={toSiteLinks(footer.investorComplaints?.links)}
            phone={mainPhone}
          />
        </div>
        {footer.vendorNotice?.title && (
          <div className="flex flex-col gap-2">
            <span className="text-white font-semibold">{footer.vendorNotice.title}</span>
            {footer.vendorNotice.text && <p className="m-0">{footer.vendorNotice.text}</p>}
          </div>
        )}
      </div>

      <div className="max-w-site mx-auto px-6 pt-5 pb-10 border-t border-pine-line flex flex-wrap justify-between gap-3 text-[13px]">
        <span>
          © {year} {footer.copyright}
        </span>
        <div className="flex flex-wrap gap-5">
          {toSiteLinks(footer.bottomLinks).map((l) => (
            <SmartLink key={l.href} href={l.href} newTab={l.newTab} className="text-ondark hover:text-white">
              {l.label}
            </SmartLink>
          ))}
        </div>
      </div>
    </footer>
  )
}
