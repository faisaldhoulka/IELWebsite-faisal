import type { Field } from 'payload'

/** Manual sort order used by list collections (lower comes first). */
export const orderField: Field = {
  name: 'order',
  type: 'number',
  defaultValue: 100,
  admin: { position: 'sidebar', description: 'Lower numbers show first.' },
}

/** URL-safe slug, required and unique. */
export const slugField = (description = 'Used in the page address, e.g. "about" → /about'): Field => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: { position: 'sidebar', description },
  validate: (value: unknown) =>
    typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/.test(value)
      ? true
      : 'Use lowercase letters, numbers and dashes (e.g. financial-advisory).',
})

/** A link that points at a CMS page, an internal path, an external URL or an uploaded file. */
export const linkFields: Field[] = [
  { name: 'label', type: 'text', required: true },
  {
    name: 'type',
    type: 'radio',
    defaultValue: 'path',
    options: [
      { label: 'Site path', value: 'path' },
      { label: 'CMS page', value: 'page' },
      { label: 'External URL', value: 'url' },
      { label: 'File (PDF)', value: 'file' },
    ],
    admin: { layout: 'horizontal' },
  },
  {
    name: 'path',
    type: 'text',
    admin: { condition: (_, s) => s?.type === 'path', description: 'e.g. /research or /about#team' },
  },
  { name: 'page', type: 'relationship', relationTo: 'pages', admin: { condition: (_, s) => s?.type === 'page' } },
  { name: 'url', type: 'text', admin: { condition: (_, s) => s?.type === 'url' } },
  { name: 'file', type: 'upload', relationTo: 'media', admin: { condition: (_, s) => s?.type === 'file' } },
  { name: 'newTab', type: 'checkbox', label: 'Open in a new tab' },
]

/** SEO group for pages. */
export const seoGroup = (name = 'seo', label = 'SEO'): Field => ({
  name,
  label,
  type: 'group',
  fields: [
    { name: 'title', type: 'text', admin: { description: 'Browser tab / Google title. Leave empty to use the page title.' } },
    { name: 'description', type: 'textarea', maxLength: 300 },
    { name: 'image', type: 'upload', relationTo: 'media', admin: { description: 'Social sharing image (1200×630).' } },
  ],
})

export const seoField: Field = seoGroup()
