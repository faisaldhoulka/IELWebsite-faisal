'use client'

import { useState } from 'react'

import { postForm, type FormState } from './post'

const input =
  'w-full h-[46px] border border-line rounded px-3 text-[15px] text-ink font-sans bg-white aria-[invalid=true]:border-signal-red'
const label = 'text-sm font-medium text-ink'
const fieldError = 'm-0 text-sm text-signal-red min-h-[1.25em]'

type Field = 'name' | 'email' | 'subject' | 'comments'
const EMAIL = /\S+@\S+\.\S+/

/** Contact page form (parity item 4): name, email, subject, comments → /api/forms/contact. */
export function ContactForm({ title, intro }: { title?: string | null; intro?: string | null }) {
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [state, setState] = useState<FormState>({ status: 'idle' })

  function validate(d: Record<string, string>) {
    const e: Partial<Record<Field, string>> = {}
    if (!d.name?.trim()) e.name = 'Name is required'
    if (!d.email?.trim()) e.email = 'Email is required'
    else if (!EMAIL.test(d.email)) e.email = 'Valid email is required'
    if (!d.subject?.trim()) e.subject = 'Subject is required'
    if (!d.comments?.trim()) e.comments = 'Comments are required'
    return e
  }

  async function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault()
    const form = ev.currentTarget
    const d = Object.fromEntries(new FormData(form)) as Record<string, string>
    const e = validate(d)
    setErrors(e)
    if (Object.keys(e).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(e)[0]}"]`)?.focus()
      return
    }
    setState({ status: 'sending' })
    const result = await postForm('/api/forms/contact', d)
    if (result.status === 'error' && result.errors) setErrors(result.errors as Partial<Record<Field, string>>)
    setState(result)
    if (result.status === 'sent') form.reset()
  }

  const field = (name: Field, text: string, type: string, placeholder: string, autoComplete?: string) => (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={`cf-${name}`} className={label}>
        {text}
      </label>
      {name === 'comments' ? (
        <textarea
          id={`cf-${name}`}
          name={name}
          rows={6}
          placeholder={placeholder}
          required
          aria-invalid={Boolean(errors[name])}
          aria-describedby={`cf-${name}-error`}
          className="w-full border border-line rounded p-3 text-[15px] text-ink font-sans bg-white aria-[invalid=true]:border-signal-red"
        />
      ) : (
        <input
          id={`cf-${name}`}
          name={name}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required
          aria-invalid={Boolean(errors[name])}
          aria-describedby={`cf-${name}-error`}
          className={input}
        />
      )}
      <p id={`cf-${name}-error`} className={fieldError}>
        {errors[name]}
      </p>
    </div>
  )

  return (
    <div className="bg-mist border border-line p-6 md:p-9 self-start">
      {title && <h2 className="m-0 font-serif font-medium text-[26px] text-pine">{title}</h2>}
      {intro && <p className="mt-2 mb-6 text-[15px] text-muted-body">{intro}</p>}
      <form onSubmit={onSubmit} className="flex flex-col gap-3" noValidate>
        {field('name', 'Name', 'text', 'e.g. Neha', 'name')}
        {field('email', 'Email address', 'email', 'e.g. neha@gmail.com', 'email')}
        {field('subject', 'Subject', 'text', 'e.g. Finance')}
        {field('comments', 'Comments', 'text', 'e.g. Hi, I want to get information…')}
        <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
          <label>
            Website
            <input name="website" type="text" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <button
          type="submit"
          disabled={state.status === 'sending'}
          className="bg-accent hover:bg-accent-dark text-white border-0 px-[22px] py-[13px] rounded font-semibold text-[15px] font-sans cursor-pointer disabled:opacity-60"
        >
          {state.status === 'sending' ? 'Sending…' : 'Submit'}
        </button>
        <div role="status" aria-live="polite" className="min-h-[1.5em]">
          {state.status === 'sent' && <p className="m-0 text-[15px] text-accent font-semibold">Thank you! Your message has been sent.</p>}
          {state.status === 'error' && !state.errors && (
            <p className="m-0 text-[15px] text-signal-red">{state.message || 'Your message could not be sent right now. Please try again or call us.'}</p>
          )}
        </div>
      </form>
    </div>
  )
}
