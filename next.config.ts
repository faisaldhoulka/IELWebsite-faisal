import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const supabaseHost = 'bfxmfaakufrmzcxhtgfw.supabase.co'

// Security headers carried over from the old vercel.json (plan §5 item 15, §8).
const baseHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
]

const isDev = process.env.NODE_ENV !== 'production'
const supabaseOrigin = `https://${supabaseHost}`

/**
 * Content Security Policy (plan §8). Everything is served from this site except:
 * Supabase storage (PDFs, article images; admin uploads go straight to the bucket) and
 * Google Maps embeds on the Contact page. Next.js needs inline scripts/styles for its
 * runtime; 'unsafe-eval' only in development (React refresh).
 */
const csp = (opts: { admin?: boolean } = {}) =>
  [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob: ${supabaseOrigin}`,
    "font-src 'self' data:",
    `connect-src 'self' ${opts.admin ? supabaseOrigin : ''}${isDev ? ' ws: wss:' : ''}`.trim(),
    `frame-src ${opts.admin ? "'self' " : ''}https://www.google.com https://maps.google.com`,
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isDev ? [] : ['upgrade-insecure-requests']),
  ].join('; ')

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: supabaseHost, pathname: '/storage/v1/object/public/**' }],
  },
  async headers() {
    return [
      {
        source: '/((?!docs/|admin|api/cms).*)',
        headers: [...baseHeaders, { key: 'X-Frame-Options', value: 'DENY' }, { key: 'Content-Security-Policy', value: csp() }],
      },
      {
        // Admin: also talks to Supabase storage for direct uploads and previews uploaded files.
        source: '/(admin|api/cms)(.*)',
        headers: [...baseHeaders, { key: 'X-Frame-Options', value: 'DENY' }, { key: 'Content-Security-Policy', value: csp({ admin: true }) }],
      },
      {
        // PDFs under /docs may be framed by our own pages (complaint-procedure popup).
        source: '/docs/:path*',
        headers: [
          ...baseHeaders,
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
        ],
      },
      { source: '/admin/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
    ]
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
  turbopack: { root: path.resolve(dirname) },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
