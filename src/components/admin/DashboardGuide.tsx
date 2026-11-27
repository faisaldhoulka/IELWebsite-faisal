/**
 * Shown at the top of the admin dashboard: where to change each part of the website.
 * Saved changes are live on the website straight away.
 */
const ROWS: [string, string, string][] = [
  ['Homepage sections, headline and figures', 'Homepage', '/admin/globals/homepage'],
  ['Homepage notices (Shareholder Agahi, fraud warning)', 'Homepage pop-ups', '/admin/globals/popups'],
  ['Advisory service cards', 'Services', '/admin/collections/services'],
  ['Selected transactions', 'Transactions', '/admin/collections/transactions'],
  ['About, service, legal, Contact, Open Account, Resources pages', 'Pages', '/admin/collections/pages'],
  ['Board and management (About page, homepage leaders)', 'Team', '/admin/collections/team-members'],
  ['Account types, steps and FAQs', 'Account opening steps', '/admin/globals/account-opening'],
  ['Financial statements kept on this site', 'Financial statements (site)', '/admin/collections/static-financial-statements'],
  ['Corporate reports', 'Corporate reports', '/admin/collections/corporate-reports'],
  ['Header menu and the top button', 'Header menu', '/admin/globals/navigation'],
  ['Footer links, complaints, vendor notice', 'Footer', '/admin/globals/footer'],
  ['Phone numbers, addresses, ratings, links', 'Site settings (admins)', '/admin/globals/site-settings'],
  ['Images and PDFs', 'Media', '/admin/collections/media'],
]

export function DashboardGuide() {
  return (
    <div style={{ marginBottom: 32, border: '1px solid var(--theme-elevation-150)', borderTop: '4px solid #13804A', padding: '20px 24px', borderRadius: 4 }}>
      <h2 style={{ margin: '0 0 6px', fontSize: 20 }}>Where to change what</h2>
      <p style={{ margin: '0 0 14px', color: 'var(--theme-elevation-600)' }}>
        Saved changes appear on the website straight away. News, research, articles and the statements published through the IEL app are managed
        in the IEL app, not here.
      </p>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <tbody>
          {ROWS.map(([what, where, href]) => (
            <tr key={href} style={{ borderTop: '1px solid var(--theme-elevation-100)' }}>
              <td style={{ padding: '7px 12px 7px 0' }}>{what}</td>
              <td style={{ padding: '7px 0', whiteSpace: 'nowrap' }}>
                <a href={href}>{where}</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
