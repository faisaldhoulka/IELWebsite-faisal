'use client'

import { useRowLabel } from '@payloadcms/ui'

/**
 * Admin array rows show their own text ("About", "Sahulat (Easy) Account", a question…)
 * instead of "Item 01". `fields` are tried in order; the row number is the fallback.
 */
export function RowLabel({ fields = ['title', 'label', 'name'], fallback = 'Item' }: { fields?: string[]; fallback?: string }) {
  const { data, rowNumber } = useRowLabel<Record<string, unknown>>()
  for (const f of fields) {
    const v = data?.[f]
    if (typeof v === 'string' && v.trim()) return <span>{v.length > 80 ? `${v.slice(0, 80)}…` : v}</span>
  }
  return <span>{`${fallback} ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`}</span>
}
