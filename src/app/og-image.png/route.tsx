import { ImageResponse } from 'next/og'

// GET /og-image.png: the link-preview image (1200×630) used when a page is shared,
// unless the page sets its own image in the CMS (SEO → image). Rendered once at build;
// no external fonts or requests.
export const dynamic = 'force-static'

const STRIPE = ['#8FD6AE', '#19A560', '#59B986', '#DF4531', '#732E30']

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#265140',
          color: '#FFFFFF',
          padding: '72px 80px',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div style={{ display: 'flex', width: 160, height: 8 }}>
          {STRIPE.map((c) => (
            <div key={c} style={{ flex: 1, background: c }} />
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 30, letterSpacing: 4, color: '#8FD6AE', fontFamily: 'sans-serif' }}>INTEGRATED EQUITIES LIMITED</div>
          <div style={{ fontSize: 64, lineHeight: 1.12, maxWidth: 980 }}>Advice on listings, capital raising and corporate transactions in Pakistan.</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 26, color: '#C9DDD2', fontFamily: 'sans-serif' }}>
          <span>iel.net.pk</span>
          <span>PSX TREC holder · Lahore and Karachi</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
