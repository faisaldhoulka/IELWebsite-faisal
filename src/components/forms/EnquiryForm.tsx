'use client'

import { useEffect, useRef, useState } from 'react'

import { postForm, type FormState } from './post'

const input = 'h-[46px] border-0 rounded px-3 text-[15px] text-ink font-sans bg-white'

/**
 * Homepage "Start a conversation" form (parity item 3). Sends the same fields as the
 * Contact page (name, email, subject, comments) through /api/forms/contact.
 * Service cards with data-mandate preselect the mandate type.
 */
export function EnquiryForm({ mandates, submitLabel, email }: { mandates: string[]; submitLabel: string; email?: string | null }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [mandate, setMandate] = useState(mandates[0] ?? '')
  const [state, setState] = useState<FormState>({ status: 'idle' })

  // Service cards (links to #contact with data-mandate) choose the mandate type.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>('[data-mandate]')
      if (card?.dataset.mandate) setMandate(card.dataset.mandate)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }
    const d = Object.fromEntries(new FormData(form)) as Record<string, string>
    const company = (d.company || '').trim()
    setState({ status: 'sending' })
    const result = await postForm('/api/forms/contact', {
      name: d.name,
      email: d.email,
      subject: `Mandate enquiry: ${d.mandate}${company ? ` (${company})` : ''}`,
      comments: `${company ? `Company: ${company}\n` : ''}Mandate: ${d.mandate}\n\n${(d.description || '').trim()}`,
      website: d.website,
    })
    setState(result)
    if (result.status === 'sent') form.reset()
  }

  const message =
    state.status === 'sending'
      ? 'Sending…'
      : state.status === 'sent'
        ? 'Thank you. Your enquiry has been sent.'
        : state.status === 'error'
          ? state.message || `Sorry, the enquiry could not be sent. Please email ${email || 'info@iel.net.pk'}.`
          : ''

  return (
    <form ref={formRef} onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4" noValidate>
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Name
        <input name="name" type="text" required autoComplete="name" className={input} />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Company
        <input name="company" type="text" autoComplete="organization" className={input} />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Email
        <input name="email" type="email" required autoComplete="email" className={input} />
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Type of mandate
        <select name="mandate" value={mandate} onChange={(e) => setMandate(e.target.value)} className={input}>
          {mandates.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-medium sm:col-span-2">
        Brief description
        <textarea name="description" rows={4} required className="border-0 rounded p-3 text-[15px] text-ink font-sans bg-white" />
      </label>
      {/* Honeypot: hidden from people, filled by bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <button
        type="submit"
        disabled={state.status === 'sending'}
        className="sm:col-span-2 h-[50px] border-0 rounded bg-wine hover:brightness-110 text-white text-base font-semibold font-sans cursor-pointer disabled:opacity-60"
      >
        {submitLabel}
      </button>
      <p className="sm:col-span-2 m-0 text-[15px] min-h-[1.5em]" role="status" aria-live="polite">
        {message}
      </p>
    </form>
  )
}
