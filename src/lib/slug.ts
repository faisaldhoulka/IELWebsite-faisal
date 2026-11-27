/**
 * Heading ids for rich text: CMS rich text doesn't store custom ids, so headings get an id
 * made from their text ("1. Basic Risks Involved…" → "1-basic-risks-involved…"). The page
 * renderer and the "On this page" contents list both use this, and links can rely on it.
 */
export function headingId(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}
