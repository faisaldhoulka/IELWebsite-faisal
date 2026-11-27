import { RichText as LexicalRichText, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'

import { headingId } from '@/lib/slug'

type Node = { type: string; children?: Node[]; text?: string; tag?: string }

/** Plain text of a node (for heading ids and the contents list). */
export function nodeText(node: Node): string {
  if (typeof node.text === 'string') return node.text
  return (node.children ?? []).map(nodeText).join('')
}

/** Headings of a rich-text value: [{ id, text }] for an "On this page" list. */
export function headingsOf(data: unknown, tag = 'h2'): { id: string; text: string }[] {
  const root = (data as { root?: Node } | null)?.root
  return (root?.children ?? [])
    .filter((n) => n.type === 'heading' && n.tag === tag)
    .map((n) => {
      const text = nodeText(n).trim()
      return { id: headingId(text), text }
    })
    .filter((h) => h.text)
}

const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  // Headings get an id from their text, so links like /risk-disclosure#1-basic-risks… work.
  heading: ({ node, nodesToJSX }) => {
    const Tag = (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tag) ? node.tag : 'h2') as 'h2'
    const id = headingId(nodeText(node as unknown as Node))
    return <Tag id={id || undefined}>{nodesToJSX({ nodes: node.children })}</Tag>
  },
  // Wide tables scroll inside their own box on phones instead of widening the page.
  table: ({ node, nodesToJSX }) => (
    <div className="table-wrap">
      <table>
        <tbody>{nodesToJSX({ nodes: node.children })}</tbody>
      </table>
    </div>
  ),
  // Cells without the editor's inline styles; .iel-prose styles them.
  tablecell: ({ node, nodesToJSX }) => {
    const Tag = (node.headerState ?? 0) > 0 ? 'th' : 'td'
    return (
      <Tag
        colSpan={node.colSpan && node.colSpan > 1 ? node.colSpan : undefined}
        rowSpan={node.rowSpan && node.rowSpan > 1 ? node.rowSpan : undefined}
      >
        {nodesToJSX({ nodes: node.children })}
      </Tag>
    )
  },
})

/** CMS rich text in the site's long-form style (`.iel-prose`). */
export function RichText({ data, className = 'iel-prose' }: { data: unknown; className?: string }) {
  if (!data || typeof data !== 'object' || !('root' in data)) return null
  return (
    <LexicalRichText data={data as never} converters={converters} className={className} disableIndent disableTextAlign />
  )
}
