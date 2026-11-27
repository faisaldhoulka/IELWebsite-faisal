'use client'

import { useId, useRef, useState, type ReactNode } from 'react'

/**
 * Accessible tabs (arrow keys, Home/End). Panels are rendered on the server and passed
 * in; inactive ones are hidden.
 */
export function Tabs({
  tabs,
  label,
  listClassName,
  tabClassName,
  vertical = false,
}: {
  tabs: { id: string; label: ReactNode; panel: ReactNode }[]
  label: string
  listClassName: string
  tabClassName: string
  vertical?: boolean
}) {
  const [active, setActive] = useState(0)
  const base = useId()
  const refs = useRef<(HTMLButtonElement | null)[]>([])

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const next = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: tabs.length - 1 }[e.key]
    if (next === undefined) return
    if (!vertical && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) return
    e.preventDefault()
    const n = (next + tabs.length) % tabs.length
    setActive(n)
    refs.current[n]?.focus()
  }

  return (
    <>
      <div role="tablist" aria-label={label} aria-orientation={vertical ? 'vertical' : 'horizontal'} className={listClassName}>
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el
            }}
            type="button"
            role="tab"
            id={`${base}-${t.id}-tab`}
            aria-controls={`${base}-${t.id}-panel`}
            aria-selected={i === active}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKey(e, i)}
            className={tabClassName}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div key={t.id} role="tabpanel" id={`${base}-${t.id}-panel`} aria-labelledby={`${base}-${t.id}-tab`} hidden={i !== active}>
          {t.panel}
        </div>
      ))}
    </>
  )
}
