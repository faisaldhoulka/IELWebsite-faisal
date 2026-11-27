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
    admin: { group: 'Settings', description: 'Utility bar, phone numbers, email, addresses, credit ratings, client login and booking links, default search-engine text. Admins only.' },
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
          {
            name: 'otherPhones',
            type: 'array',
            label: 'Other phone numbers',
            admin: { description: 'Shown under the main number in the footer.' },
            fields: [
              { name: 'number', type: 'text', required: true },
              { name: 'href', type: 'text', admin: { description: 'Dial string, e.g. +924235692606' } },
            ],
          },
          { name: 'email', type: 'email' },
          { name: 'addresses', type: 'array', fields: [{ name: 'city', type: 'text' }, { name: 'address', type: 'textarea' }] },
        ],
      },
      {
        name: 'ratings',
        type: 'group',
        label: 'Credit ratings',
        admin: { description: 'Rating statement and links to the full rating reports.' },
        fields: [
          { name: 'text', type: 'textarea' },
          { name: 'reports', type: 'array', label: 'Rating reports', fields: linkFields },
        ],
      },
      { name: 'clientLoginUrl', type: 'text', admin: { description: 'Client login link in the utility bar.' } },
      { name: 'bookingUrl', type: 'text', defaultValue: 'https://meetings.hubspot.com/jessica-brennan', admin: { hidden: true, description: 'Not used: the "Book a consultation" link is edited in Header menu.' } },
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
    admin: { group: 'Settings', description: 'The main menu and the button at the top right of every page.' },
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
    admin: { group: 'Settings', description: 'Footer link columns, complaints pop-up, investor complaint links, back-office vendor notice and copyright line.' },
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
      {
        name: 'investorComplaints',
        type: 'group',
        label: 'Investor complaint links',
        fields: [
          { name: 'title', type: 'text', defaultValue: 'Investor complaints' },
          { name: 'links', type: 'array', fields: linkFields },
        ],
      },
      {
        name: 'vendorNotice',
        type: 'group',
        label: 'Back-office vendor notice',
        fields: [
          { name: 'title', type: 'text' },
          { name: 'text', type: 'textarea' },
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
  admin: {
    group: 'Content',
    description: 'The homepage sections, in order. Drag to reorder; tick "Hide this section" to hide one. Lists (services, transactions, team, associated companies) are edited in their own collections.',
    preview: () => `${process.env.NEXT_PUBLIC_SITE_URL || ''}/`,
  },
  versions: { max: 25 }, // decision 5: version history on the homepage
  fields: [
    { name: 'sections', type: 'blocks', blocks: homepageBlocks },
    seoField,
  ],
})

// Notices shown together in one overlay when the homepage opens (as on the old site:
// the Shareholder Agahi notice and the fraud-awareness notice). A visitor who ticks
// "Don't show this again" never sees them again in that browser.
export const Popups: GlobalConfig = contentGlobal({
  slug: 'popups',
  label: 'Homepage pop-ups',
  admin: { group: 'Content', description: 'Notices shown one after the other when someone opens the homepage.' },
  fields: [
    { name: 'enabled', type: 'checkbox', defaultValue: true, admin: { description: 'Untick to stop showing the pop-ups.' } },
    { name: 'dontShowAgainLabel', type: 'text', defaultValue: 'Don’t show this again' },
    {
      name: 'notices',
      type: 'array',
      admin: { description: 'Shown one after the other, in this order.' },
      fields: [
        { name: 'eyebrow', type: 'text' },
        { name: 'title', type: 'text', required: true },
        { name: 'body', type: 'richText' },
        { name: 'links', type: 'array', label: 'Buttons', maxRows: 3, fields: linkFields },
        {
          name: 'images',
          type: 'array',
          maxRows: 4,
          fields: [
            { name: 'path', type: 'text', admin: { description: 'Existing image on the site.' } },
            { name: 'image', type: 'upload', relationTo: 'media', admin: { description: 'Upload to replace the image above.' } },
            { name: 'alt', type: 'text' },
          ],
        },
        { name: 'closeLabel', type: 'text', admin: { description: 'Text of the button that closes the pop-up, e.g. "I understand – proceed to website". Leave empty for just the × button.' } },
      ],
    },
  ],
})

// Shared "Open your account in minutes" steps, shown on the service pages and Open Account.
export const AccountOpening: GlobalConfig = contentGlobal(
  {
    slug: 'account-opening',
    label: 'Account opening steps',
    admin: { group: 'Content', description: 'Account types with their steps and FAQs, shared by the service pages, Brokerage and Open Account.' },
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
          {
            name: 'faqs',
            type: 'array',
            label: 'FAQs',
            admin: { description: 'Shown on pages that use the "Tabs" style (Open Account).' },
            fields: [
              { name: 'question', type: 'text', required: true },
              { name: 'answer', type: 'textarea', required: true },
            ],
          },
        ],
      },
      { name: 'faqTitle', type: 'text', defaultValue: 'The questions everyone asks (and the straight answers you deserve)' },
      { name: 'buttonLabel', type: 'text', defaultValue: 'Get started' },
      { name: 'buttonPath', type: 'text', defaultValue: '/open-account' },
    ],
  },
  ['cms:pages'],
)
