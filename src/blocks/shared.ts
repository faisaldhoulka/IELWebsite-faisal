import type { Field } from 'payload'

import { linkFields } from '../fields'

/** Section heading used by most blocks: eyebrow + title + optional intro. */
export const sectionHeading: Field[] = [
  { name: 'eyebrow', type: 'text' },
  { name: 'title', type: 'text', required: true },
  { name: 'intro', type: 'textarea' },
]

/** Anchor id so menus can jump to a section, e.g. "transactions" → /#transactions. */
export const anchorField: Field = {
  name: 'anchor',
  type: 'text',
  admin: { description: 'Optional section id for links like /#transactions (letters, numbers, dashes).' },
  validate: (v: unknown) =>
    !v || (typeof v === 'string' && /^[A-Za-z][A-Za-z0-9_-]*$/.test(v)) ? true : 'Letters, numbers, dashes only.',
}

/** Up to `max` link buttons. */
export const buttonsField = (name = 'buttons', max = 2): Field => ({
  name,
  type: 'array',
  maxRows: max,
  fields: [
    ...linkFields,
    {
      name: 'style',
      type: 'select',
      defaultValue: 'primary',
      options: [
        { label: 'Primary (filled)', value: 'primary' },
        { label: 'Secondary (outline)', value: 'secondary' },
      ],
    },
  ],
})

/** "All transactions →" style link at the top right of a section. */
export const sectionLinkField: Field = {
  name: 'sectionLink',
  type: 'group',
  fields: linkFields.map((f) => ('name' in f && f.name === 'label' ? { ...f, required: false } : f)) as Field[],
}
