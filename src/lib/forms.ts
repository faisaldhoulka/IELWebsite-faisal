import 'server-only'

/**
 * Form relay (plan §5a, decision 4): the browser posts to our own routes; the server
 * validates, drops bots (honeypot), rate-limits per IP, then forwards the same JSON
 * the old pages sent to the existing ielapis endpoints. ielapis itself is unchanged.
 */

const API_BASE = (process.env.CONTACT_API_BASE || 'https://ielapis.u2ventures.io/api/contact').replace(/\/$/, '')

export const ENDPOINTS = {
  contact: `${API_BASE}/contactus/`,
  openAccount: `${API_BASE}/free-account/`,
} as const

// ── Rate limit ───────────────────────────────────────────────────────────────
// In-memory, per server instance: a first line of defence against bursts.
// (Serverless instances don't share memory; that's acceptable for this volume.)
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5
const hits = new Map<string, number[]>()

export function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) hits.clear() // keep memory bounded
  return recent.length > MAX_PER_WINDOW
}

export function clientIp(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

// ── Validation ───────────────────────────────────────────────────────────────

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const EMAIL = /\S+@\S+\.\S+/ // same rule as the old Contact page

export type ContactInput = { name: string; email: string; subject: string; comments: string }
export type OpenAccountInput = { name: string; phone: string }

export function validateContact(body: Record<string, unknown>) {
  const v: ContactInput = {
    name: str(body.name, 200),
    email: str(body.email, 200),
    subject: str(body.subject, 300),
    comments: str(body.comments, 5000),
  }
  const errors: Partial<Record<keyof ContactInput, string>> = {}
  if (!v.name) errors.name = 'Name is required'
  if (!v.email) errors.email = 'Email is required'
  else if (!EMAIL.test(v.email)) errors.email = 'Valid email is required'
  if (!v.subject) errors.subject = 'Subject is required'
  if (!v.comments) errors.comments = 'Comments are required'
  return { value: v, errors }
}

export function validateOpenAccount(body: Record<string, unknown>) {
  const v: OpenAccountInput = { name: str(body.name, 200), phone: str(body.phone, 40) }
  const errors: Partial<Record<keyof OpenAccountInput, string>> = {}
  if (!v.name) errors.name = 'Name is required'
  if (!v.phone) errors.phone = 'Phone number is required'
  else if (!/^[+\d][\d\s()-]{6,}$/.test(v.phone)) errors.phone = 'Enter a valid phone number'
  return { value: v, errors }
}

// ── Relay ────────────────────────────────────────────────────────────────────

export async function relay(url: string, payload: unknown): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15_000),
      cache: 'no-store',
    })
    return res.ok
  } catch {
    return false
  }
}

/** Shared handler: parse JSON, honeypot, rate limit, validate, relay. */
export async function handleForm<T>(
  req: Request,
  validate: (b: Record<string, unknown>) => { value: T; errors: Record<string, string | undefined> },
  url: string,
): Promise<Response> {
  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return Response.json({ ok: false, error: 'Invalid request' }, { status: 400 })
  }
  // Honeypot: real visitors never see or fill the `website` field. Pretend success.
  if (typeof body.website === 'string' && body.website.trim()) return Response.json({ ok: true })

  if (rateLimited(clientIp(req))) {
    return Response.json({ ok: false, error: 'Too many submissions. Please try again later.' }, { status: 429 })
  }

  const { value, errors } = validate(body)
  if (Object.values(errors).some(Boolean)) return Response.json({ ok: false, errors }, { status: 422 })

  const ok = await relay(url, value)
  return ok
    ? Response.json({ ok: true })
    : Response.json({ ok: false, error: 'Could not send right now.' }, { status: 502 })
}
