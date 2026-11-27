import 'server-only'

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Read-only access to the existing IEL Supabase project (plan §6).
 * Server only: the anon key never reaches the browser. Nothing here writes to Supabase.
 */
let client: SupabaseClient | null = null

export const SUPABASE_URL = (process.env.SUPABASE_URL || '').replace(/\/$/, '')

export function supabase(): SupabaseClient {
  if (!client) {
    const key = process.env.SUPABASE_ANON_KEY
    if (!SUPABASE_URL || !key) throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be set')
    client = createClient(SUPABASE_URL, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }
  return client
}

/** Cache lifetime for Supabase data (seconds); other systems change it, so it is time-based. */
export const SUPABASE_REVALIDATE = 60

/** Turn a stored storage path or URL into a full public URL (same rule as the old research script). */
export function storageUrl(pathOrUrl: string | null | undefined): string | null {
  if (!pathOrUrl) return null
  const v = String(pathOrUrl).trim()
  if (/^https?:\/\//i.test(v)) return v
  return `${SUPABASE_URL}/storage/v1/object/public/${v.replace(/^\/+/, '')}`
}

/** Same as storageUrl, but asks Supabase to send the file as a download. */
export function downloadUrl(pathOrUrl: string | null | undefined, filename?: string): string | null {
  const url = storageUrl(pathOrUrl)
  if (!url) return null
  try {
    const u = new URL(url)
    if (u.hostname.endsWith('.supabase.co') && u.pathname.includes('/storage/v1/object/')) {
      u.searchParams.set('download', filename || '')
      return u.toString()
    }
  } catch {
    /* not a URL: return as is */
  }
  return url
}
