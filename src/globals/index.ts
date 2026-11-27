import type { GlobalConfig } from 'payload'

import { adminOnly } from '../access'
import { homepageBlocks } from '../blocks/homepage'
import { linkFields, seoField, seoGroup } from '../fields'
import { contentGlobal } from '../collections/_shared'

// Header/footer/settings appear on every page, so they also refresh the `layout` tag.
const LAYOUT = ['cms:layout']

export const SiteSettings: GlobalConfig = contentGlobal(
  {
    slug: 'site-settings',
    label: 'Site settings',
    admin: { group: 'Settings' },
    access: { update: adminOnly }, // plan §4: settings are admin-only
    fields: [
      {
        name: 'utilityBar',
        type: 'group',
        fields: [
          { name: 'text', type: 'text', defaultValue: 'PSX TREC holder · VIS entity rating A- / A-2' },
          { name: 'links', type: 'array', maxRows: 4, fields: linkFields },
        ],
      },
      {
        name: 'contact',
        type: 'group',
        fields: [
          { name: 'phone', type: 'text' },
          { name: 'phoneHref', type: 'text', admin: { description: 'Dial string, e.g. +924235741714' } },
          { name: 'email', type: 'email' },
          { name: 'addresses', type: 'array', fields: [{ name: 'city', type: 'text' }, { name: 'address', type: 'textarea' }] },
        ],
      },
      { name: 'clientLoginUrl', type: 'text', admin: { description: 'Client login link in the utility bar.' } },
      { name: 'bookingUrl', type: 'text', defaultValue: 'https://meetings.hubspot.com/jessica-brennan', admin: { description: 'Book a consultation (HubSpot).' } },
      { name: 'social', type: 'array', fields: [{ name: 'network', type: 'text', required: true }, { name: 'url', type: 'text', required: true }] },
      seoGroup('defaultSeo', 'Default SEO'),
    ],
  },
  LAYOUT,
)

export const Navigation: GlobalConfig = contentGlobal(
  {
    slug: 'navigation',
    label: 'Header menu',
    admin: { group: 'Settings' },
    fields: [
      {
        name: 'items',
        type: 'array',
        admin: { description: 'Top-level menu. An item with sub-links becomes a dropdown.' },
        fields: [
          ...linkFields,
          { name: 'children', type: 'array', label: 'Dropdown links', fields: linkFields },
        ],
      },
      { name: 'cta', type: 'group', label: 'Header button', fields: linkFields },
    ],
  },
  LAYOUT,
)

export const Footer: GlobalConfig = contentGlobal(
  {
    slug: 'footer',
    admin: { group: 'Settings' },
    fields: [
      { name: 'about', type: 'textarea' },
      { name: 'columns', type: 'array', fields: [{ name: 'title', type: 'text', required: true }, { name: 'links', type: 'array', fields: linkFields }] },
      { name: 'regulatoryLines', type: 'array', fields: [{ name: 'text', type: 'text', required: true }] },
      {
        name: 'complaints',
        type: 'group',
        label: 'Complaints popup',
        fields: [
          { name: 'buttonLabel', type: 'text', defaultValue: 'Complaints (SECP, PSX)' },
          { name: 'title', type: 'text' },
          { name: 'body', type: 'richText' },
          { name: 'pdfPath', type: 'text', defaultValue: '/docs/Procedure-for-Complaint-Handling-MUFAP.pdf' },
          { name: 'pdf', type: 'upload', relationTo: 'media', admin: { description: 'Upload to replace the PDF above.' } },
        ],
      },
      { name: 'copyright', type: 'text', defaultValue: 'Integrated Equities Limited. All rights reserved.' },
      { name: 'bottomLinks', type: 'array', fields: linkFields },
    ],
  },
  LAYOUT,
)

export const Homepage: GlobalConfig = contentGlobal({
  slug: 'homepage',
  admin: { group: 'Content' },
  versions: { max: 25 }, // decision 5: version history on the homepage
  fields: [
    { name: 'sections', type: 'blocks', blocks: homepageBlocks },
    seoField,
  ],
})

// Shared "Open your account in minutes" steps, shown on the service pages and Open Account.
export const AccountOpening: GlobalConfig = contentGlobal(
  {
    slug: 'account-opening',
    label: 'Account opening steps',
    admin: { group: 'Content' },
    fields: [
      {
        name: 'accounts',
        type: 'array',
        minRows: 1,
        fields: [
          { name: 'name', type: 'text', required: true },
          {
            name: 'steps',
            type: 'array',
            minRows: 1,
            maxRows: 6,
            fields: [
              { name: 'title', type: 'text', required: true },
              { name: 'text', type: 'textarea', required: true },
            ],
          },
        ],
      },
      { name: 'buttonLabel', type: 'text', defaultValue: 'Get started' },
      { name: 'buttonPath', type: 'text', defaultValue: '/open-account' },
    ],
  },
  ['cms:pages'],
)
