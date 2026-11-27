export type FormState =
  | { status: 'idle' | 'sending' | 'sent' }
  | { status: 'error'; message?: string; errors?: Record<string, string | undefined> }

/** POST JSON to one of our form routes (/api/forms/*) and map the reply to a form state. */
export async function postForm(url: string, body: Record<string, unknown>): Promise<FormState> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; errors?: Record<string, string> }
    if (res.ok && data.ok) return { status: 'sent' }
    if (res.status === 422 && data.errors) return { status: 'error', errors: data.errors, message: Object.values(data.errors).filter(Boolean).join('. ') }
    if (res.status === 429) return { status: 'error', message: data.error }
    return { status: 'error' }
  } catch {
    return { status: 'error' }
  }
}
