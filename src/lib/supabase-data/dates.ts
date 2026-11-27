// Date rules for financial statements, ported from the old NewReport script.
// All dates are handled in UTC so the server's time zone can't move a document
// into the wrong financial year.

const MONTHS: Record<string, number> = {
  jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2, apr: 3, april: 3, may: 4,
  jun: 5, june: 5, jul: 6, july: 6, aug: 7, august: 7, sep: 8, sept: 8, september: 8,
  oct: 9, october: 9, nov: 10, november: 10, dec: 11, december: 11,
}

/**
 * Titles look like "IEL Audited Financial Statements June 30 2020", "LCB July 2020",
 * "FS IEL Period Ended Sept 30, 2020". Returns null if there is no 20xx year.
 */
export function parseDateFromTitle(title: string | null | undefined): Date | null {
  if (!title) return null
  const text = title.toLowerCase()
  const yearMatch = text.match(/(20\d{2})/)
  if (!yearMatch) return null
  const year = parseInt(yearMatch[1], 10)

  // First month name found, in the same key order as the old script.
  let month = 0
  for (const key of Object.keys(MONTHS)) {
    if (new RegExp(`\\b${key}\\b`).test(text)) {
      month = MONTHS[key]
      break
    }
  }

  let day = 1
  for (const d of text.match(/\b(\d{1,2})(?:st|nd|rd|th)?\b/g) ?? []) {
    const num = parseInt(d, 10)
    if (num >= 1 && num <= 31 && d !== yearMatch[1]) {
      day = num
      break
    }
  }
  return new Date(Date.UTC(year, month, day))
}

/** "2026-07-01" → UTC date; null if not a valid yyyy-mm-dd. */
export function parseIsoDate(value: string | null | undefined): Date | null {
  if (!value) return null
  const [y, m, d] = String(value).slice(0, 10).split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(Date.UTC(y, m - 1, d))
}

/** A real date wins; otherwise read it from the title. */
export function statementDate(date: string | null | undefined, title: string): Date | null {
  return parseIsoDate(date) ?? parseDateFromTitle(title)
}

/** Calendar year in which the financial year (1 July – 30 June) of `date` starts. */
export function fiscalYearStart(date: Date): number {
  return date.getUTCMonth() >= 6 ? date.getUTCFullYear() : date.getUTCFullYear() - 1
}

/** 2026 → "FY 2026-27" */
export function fiscalYearLabel(startYear: number): string {
  return `FY ${startYear}-${String((startYear + 1) % 100).padStart(2, '0')}`
}
