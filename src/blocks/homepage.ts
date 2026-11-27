import type { Block } from 'payload'

import { anchorField, buttonsField, sectionHeading, sectionLinkField } from './shared'

// Homepage sections, matching the dark-green design (plan §4). Each block can be hidden
// and reordered by editors. Lists (services, transactions, team, partners) come from
// their own collections so they are edited in one place.

const hidden = { name: 'hidden', type: 'checkbox', label: 'Hide this section', admin: { position: 'sidebar' } } as const

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Hero' },
  fields: [
    hidden,
    anchorField,
    { name: 'eyebrow', type: 'text' },
    { name: 'title', type: 'textarea', required: true },
    { name: 'intro', type: 'textarea' },
    buttonsField('buttons', 2),
    {
      name: 'stats',
      type: 'array',
      maxRows: 4,
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
  ],
}

export const ServicesBlock: Block = {
  slug: 'services',
  labels: { singular: 'Advisory services', plural: 'Advisory services' },
  fields: [
    hidden,
    anchorField,
    ...sectionHeading,
    {
      name: 'cardsLinkToContact',
      type: 'checkbox',
      defaultValue: true,
      label: 'Cards jump to the enquiry form and preselect the mandate type',
    },
  ],
}

export const TransactionsBlock: Block = {
  slug: 'transactions',
  labels: { singular: 'Transactions', plural: 'Transactions' },
  fields: [
    hidden,
    anchorField,
    ...sectionHeading,
    sectionLinkField,
    { name: 'limit', type: 'number', defaultValue: 4, min: 1, max: 12, admin: { description: 'Shows featured transactions first.' } },
  ],
}

export const ProcessBlock: Block = {
  slug: 'process',
  labels: { singular: 'Process steps', plural: 'Process steps' },
  fields: [
    hidden,
    anchorField,
    ...sectionHeading,
    {
      name: 'steps',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'text', type: 'textarea', required: true },
        {
          name: 'color',
          type: 'select',
          defaultValue: 'green',
          options: [
            { label: 'Logo green', value: 'green' },
            { label: 'Maroon', value: 'wine' },
            { label: 'Coral', value: 'red' },
            { label: 'Dark green', value: 'pine' },
          ],
        },
      ],
    },
  ],
}

export const TeamBlock: Block = {
  slug: 'team',
  labels: { singular: 'Leadership', plural: 'Leadership' },
  fields: [
    hidden,
    anchorField,
    ...sectionHeading,
    sectionLinkField,
    { name: 'limit', type: 'number', defaultValue: 3, min: 1, max: 12, admin: { description: 'Team members marked "show on homepage".' } },
  ],
}

export const InsightsBlock: Block = {
  slug: 'insights',
  labels: { singular: 'Insights', plural: 'Insights' },
  fields: [
    hidden,
    anchorField,
    ...sectionHeading,
    sectionLinkField,
    {
      name: 'items',
      type: 'array',
      maxRows: 6,
      fields: [
        { name: 'tag', type: 'text' },
        { name: 'title', type: 'text', required: true },
        { name: 'text', type: 'textarea' },
        { name: 'href', type: 'text', defaultValue: '/research' },
      ],
    },
  ],
}

export const CtaBandBlock: Block = {
  slug: 'ctaBand',
  labels: { singular: 'Call-to-action band', plural: 'Call-to-action bands' },
  fields: [
    hidden,
    anchorField,
    { name: 'title', type: 'text', required: true },
    { name: 'text', type: 'textarea' },
    buttonsField('buttons', 3),
  ],
}

export const PartnersBlock: Block = {
  slug: 'partners',
  labels: { singular: 'Associated companies', plural: 'Associated companies' },
  fields: [hidden, anchorField, { name: 'title', type: 'text', required: true, defaultValue: 'Associated companies' }],
}

export const ContactBlock: Block = {
  slug: 'contact',
  labels: { singular: 'Enquiry form', plural: 'Enquiry form' },
  fields: [
    hidden,
    anchorField,
    { name: 'title', type: 'text', required: true },
    { name: 'text', type: 'textarea' },
    { name: 'showContactDetails', type: 'checkbox', defaultValue: true, label: 'Show phone and email from Site settings' },
    { name: 'submitLabel', type: 'text', defaultValue: 'Send enquiry' },
  ],
}

export const homepageBlocks: Block[] = [
  HeroBlock,
  ServicesBlock,
  TransactionsBlock,
  ProcessBlock,
  TeamBlock,
  InsightsBlock,
  CtaBandBlock,
  PartnersBlock,
  ContactBlock,
]
