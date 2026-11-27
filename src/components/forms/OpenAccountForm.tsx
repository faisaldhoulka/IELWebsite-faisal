'use client'

import { useState } from 'react'

import { postForm, type FormState } from './post'

const input = 'w-full h-[46px] border border-line rounded px-3 text-[15px] text-ink font-sans bg-white'

/** Open Account quick sign-up (parity item 5): name and mobile → /api/forms/open-account. */
export function OpenAccountForm() {
  const [state, setState] = useState<FormState>({ status: 'idle' })

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }
    const d = Object.fromEntries(new FormData(form)) as Record<string, string>
    setState({ status: 'sending' })
    const result = await postForm('/api/forms/open-account', { name: d.name?.trim(), phone: d.phone?.trim(), website: d.website })
    setState(result)
  }

  if (state.status === 'sent') {
    return (
      <p className="m-0 text-[15px] text-muted-body" role="status">
        Your phone number has been successfully submitted. Our team will be in touch.
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="oa-name" className="text-sm font-medium text-ink">
          Name
        </label>
        <input type="text" id="oa-name" name="name" autoComplete="name" placeholder="Enter name" required className={input} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="oa-phone" className="text-sm font-medium text-ink">
          Mobile number
        </label>
        <input type="tel" id="oa-phone" name="phone" autoComplete="tel" inputMode="tel" placeholder="+92 - 3119899898" required className={input} />
      </div>
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
        Submit
      </button>
      <p className="m-0 text-[15px] min-h-[1.5em]" role="status" aria-live="polite">
        {state.status === 'sending' && 'Sending…'}
        {state.status === 'error' && (state.message || 'Error submitting phone number. Please try again.')}
      </p>
    </form>
  )
}
