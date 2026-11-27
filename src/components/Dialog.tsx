'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Modal built on the native <dialog>: focus stays inside, Escape closes, the page
 * behind is inert. `open` is controlled by the parent.
 */
export function Dialog({
  open,
  onClose,
  labelledBy,
  className = '',
  children,
}: {
  open: boolean
  onClose: () => void
  labelledBy: string
  className?: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) d.showModal()
    if (!open && d.open) d.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onClose={onClose}
      // Click on the backdrop (outside the content) closes.
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className={`iel-dialog p-0 border-0 bg-transparent max-w-[calc(100vw-32px)] max-h-[calc(100vh-32px)] m-auto ${className}`}
    >
      {children}
    </dialog>
  )
}

/** × close button for dialogs. */
export function CloseButton({ onClick, label = 'Close' }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="absolute top-3 right-3 w-10 h-10 inline-flex items-center justify-center rounded border-0 bg-transparent text-muted hover:bg-mist hover:text-ink cursor-pointer text-2xl leading-none"
    >
      ×
    </button>
  )
}
