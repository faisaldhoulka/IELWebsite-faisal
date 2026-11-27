/**
 * One-off: copies the long-form text of the legal pages out of the rendered Astro build
 * (revamp-homepage branch, `scripts/local-build.sh` output) into scripts/seed-data/legal/*.html,
 * which the seed script converts to CMS rich text. Kept for the record; the HTML files
 * are the source of truth for the seed from now on.
 *
 *   npx tsx scripts/extract-legal-html.ts [path-to-astro-dist]
 */
import fs from 'node:fs'
import path from 'node:path'
import { JSDOM } from 'jsdom'

const dist = process.argv[2] || 'C:/dev/iel-build/dist'
const out = path.resolve('scripts/seed-data/legal')
fs.mkdirSync(out, { recursive: true })

const pages: Record<string, string> = {
  Privacy: 'privacy',
  Terms: 'terms',
  RiskDisclosure: 'risk-disclosure',
  Fraud: 'fraud-awareness',
  Regulatory: 'regulatory',
}

/** Strip presentation attributes; keep ids (TOC anchors), links and table structure. */
function clean(el: Element) {
  for (const node of [el, ...Array.from(el.querySelectorAll('*'))]) {
    for (const attr of Array.from(node.attributes)) {
      if (!['id', 'href', 'target', 'rel', 'colspan', 'rowspan', 'scope'].includes(attr.name)) node.removeAttribute(attr.name)
    }
  }
}

for (const [file, slug] of Object.entries(pages)) {
  const html = fs.readFileSync(path.join(dist, `${file}.html`), 'utf8')
  const doc = new JSDOM(html).window.document
  const main = doc.querySelector('main') ?? doc.body
  const parts: string[] = []

  // Regulatory: the registration facts above the prose become a simple table.
  const dl = main.querySelector('dl')
  if (slug === 'regulatory' && dl) {
    const rows = Array.from(dl.querySelectorAll('div')).map((d) => {
      const dt = d.querySelector('dt')?.textContent?.trim() ?? ''
      const dd = d.querySelector('dd')?.textContent?.trim() ?? ''
      return `<tr><th>${dt}</th><td>${dd}</td></tr>`
    })
    if (rows.length) parts.push(`<h2 id="registration">Registration details</h2><table><tbody>${rows.join('')}</tbody></table>`)
  }

  const proseBlocks = Array.from(main.querySelectorAll('.iel-prose'))
  if (!proseBlocks.length) throw new Error(`${file}: no .iel-prose found`)
  for (const prose of proseBlocks) {
    const copy = prose.cloneNode(true) as Element
    clean(copy)
    parts.push(copy.innerHTML.trim())
  }

  // Internal links: old .html addresses → new clean URLs.
  const urlMap: Record<string, string> = {
    'index.html': '/', 'About.html': '/about', 'Contact.html': '/contact', 'Privacy.html': '/privacy',
    'Terms.html': '/terms', 'RiskDisclosure.html': '/risk-disclosure', 'Fraud.html': '/fraud-awareness',
    'Regulatory.html': '/regulatory', 'Investor_education.html': '/investor-education',
    'OpenAccount.html': '/open-account', 'NewReport.html': '/financial-statements', 'Research.html': '/research',
    'News.html': '/news', 'Resources.html': '/learn', 'Reports.html': '/corporate-reports',
    'BrokerageService.html': '/brokerage', 'FinancialAdvisory.html': '/services/financial-advisory',
    'StrategyConsulting.html': '/services/strategy-consulting', 'RealStateAdvisory.html': '/services/real-estate-advisory',
    'FintechService.html': '/services/fintech',
  }
  let body = parts.join('\n')
  body = body.replace(/href="([^"#]+?)(#[^"]*)?"/g, (m, href: string, hash = '') => {
    if (urlMap[href]) return `href="${urlMap[href]}${hash}"`
    // Encode spaces etc. so the CMS link validator accepts the URL.
    if (/^(IEL Assets|docs|Assets)\//.test(href)) return `href="${encodeURI('/' + href)}${hash}"`
    return m
  })

  fs.writeFileSync(path.join(out, `${slug}.html`), body + '\n')
  console.log(`${file} → seed-data/legal/${slug}.html (${body.length} chars)`)
}
