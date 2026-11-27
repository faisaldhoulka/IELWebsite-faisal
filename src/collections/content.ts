import type { CollectionConfig } from 'payload'

import { pageBlocks } from '../blocks/page'
import { buttonsField } from '../blocks/shared'
import { orderField, seoField, slugField } from '../fields'
import { cmsTag } from '../hooks/revalidate'
import { contentCollection } from './_shared'

// Content collections (plan §4). All: public read, staff write, change log, publish-on-save.
// Lists shown on the homepage also refresh the homepage tag when they change.
const HOME = [cmsTag('homepage')]

export const Pages: CollectionConfig = contentCollection({
  slug: 'pages',
  admin: { group: 'Content', useAsTitle: 'title', defaultColumns: ['title', 'slug', 'updatedAt'] },
  // Version history on pages (decision 5); content is live on save (no drafts).
  versions: { maxPerDoc: 25 },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      name: 'template',
      type: 'select',
      defaultValue: 'standard',
      options: [
        { label: 'Standard', value: 'standard' },
        { label: 'Legal (sidebar: legal pages + contents)', value: 'legal' },
        { label: 'Document (sidebar: contents only)', value: 'document' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text' },
        { name: 'title', type: 'text', admin: { description: 'Leave empty to use the page title.' } },
        { name: 'intro', type: 'textarea' },
        buttonsField('buttons', 3),
        {
          name: 'aside',
          type: 'group',
          label: 'Side card (optional)',
          fields: [
            {
              name: 'form',
              type: 'select',
              defaultValue: 'none',
              options: [
                { label: 'No form', value: 'none' },
                { label: 'Open-account sign-up (name and mobile)', value: 'openAccount' },
              ],
              admin: { description: 'Show a form inside the side card.' },
            },
            { name: 'title', type: 'text' },
            { name: 'text', type: 'textarea' },
            { name: 'linkLabel', type: 'text' },
            { name: 'linkPath', type: 'text' },
            { name: 'secondLinkLabel', type: 'text' },
            { name: 'secondLinkPath', type: 'text' },
          ],
        },
      ],
    },
    { name: 'layout', type: 'blocks', blocks: pageBlocks },
    { name: 'showContactBand', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    seoField,
  ],
})

export const TeamMembers: CollectionConfig = contentCollection(
  {
    slug: 'team-members',
    labels: { singular: 'Team member', plural: 'Team' },
    admin: { group: 'Content', useAsTitle: 'name', defaultColumns: ['name', 'role', 'group', 'order'] },
    defaultSort: 'order',
    fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'role', type: 'text', required: true },
      {
        name: 'group',
        type: 'select',
        defaultValue: 'management',
        options: [
          { label: 'Key management', value: 'management' },
          { label: 'Board of directors', value: 'board' },
        ],
      },
      { name: 'bio', type: 'textarea', admin: { description: 'Full bio (About page, "Read bio").' } },
      { name: 'shortBio', type: 'textarea', admin: { description: 'Optional two-line version for homepage cards; the full bio is shortened if empty.' } },
      { name: 'portrait', type: 'upload', relationTo: 'media' },
      { name: 'portraitPath', type: 'text', admin: { description: 'Existing photo on the site, e.g. /IEL Assets/Members/x.png (used if no upload).' } },
      { name: 'showOnHomepage', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
      orderField,
    ],
  },
  HOME,
)

export const Transactions: CollectionConfig = contentCollection(
  {
    slug: 'transactions',
    admin: { group: 'Content', useAsTitle: 'client', defaultColumns: ['client', 'year', 'practice', 'featured'] },
    defaultSort: 'order',
    fields: [
      { name: 'client', type: 'text', required: true },
      { name: 'year', type: 'text', required: true },
      { name: 'practice', type: 'relationship', relationTo: 'services' },
      { name: 'practiceLabel', type: 'text', admin: { description: 'Shown instead of the service name, e.g. "Block execution".' } },
      { name: 'description', type: 'text', required: true },
      { name: 'size', type: 'text', admin: { description: 'e.g. PKR 2.5 bn or 12 m shares' } },
      { name: 'role', type: 'text', admin: { description: 'IEL role, e.g. Lead advisor' } },
      { name: 'logo', type: 'upload', relationTo: 'media' },
      { name: 'featured', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar', description: 'Show on the homepage' } },
      orderField,
    ],
  },
  HOME,
)

export const Services: CollectionConfig = contentCollection(
  {
    slug: 'services',
    labels: { singular: 'Service', plural: 'Services' },
    admin: { group: 'Content', useAsTitle: 'title', defaultColumns: ['title', 'order'] },
    defaultSort: 'order',
    fields: [
      { name: 'title', type: 'text', required: true },
      { name: 'summary', type: 'textarea', required: true },
      { name: 'ctaLabel', type: 'text', defaultValue: 'Talk to us' },
      { name: 'page', type: 'relationship', relationTo: 'pages', admin: { description: 'Service page with more detail (optional).' } },
      orderField,
    ],
  },
  HOME,
)

export const Partners: CollectionConfig = contentCollection(
  {
    slug: 'partners',
    labels: { singular: 'Associated company', plural: 'Associated companies' },
    admin: { group: 'Content', useAsTitle: 'name', defaultColumns: ['name', 'order'] },
    defaultSort: 'order',
    fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'logo', type: 'upload', relationTo: 'media' },
      { name: 'logoPath', type: 'text', admin: { description: 'Existing logo on the site, e.g. /IEL Assets/company_2.png (used if no upload).' } },
      { name: 'url', type: 'text' },
      orderField,
    ],
  },
  HOME,
)

export const CorporateReports: CollectionConfig = contentCollection({
  slug: 'corporate-reports',
  admin: { group: 'Reports', useAsTitle: 'title', defaultColumns: ['title', 'date'] },
  defaultSort: '-date',
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'date', type: 'date' },
    { name: 'file', type: 'upload', relationTo: 'media' },
    { name: 'path', type: 'text', admin: { description: 'Existing PDF on the site (used if no upload).' } },
    orderField,
  ],
})

// The statements that were hard-coded in STATIC_STATEMENTS. Merged with the Supabase
// `finanicial_statements` rows on the Financial statements page (plan §5 item 10).
export const StaticFinancialStatements: CollectionConfig = contentCollection({
  slug: 'static-financial-statements',
  labels: { singular: 'Financial statement', plural: 'Financial statements (site)' },
  admin: {
    group: 'Reports',
    useAsTitle: 'title',
    defaultColumns: ['title', 'tab', 'date'],
    description: 'Statements kept on this site. Statements published through the IEL app admin panel are added automatically.',
  },
  defaultSort: '-date',
  fields: [
    {
      name: 'tab',
      type: 'select',
      required: true,
      options: [
        { label: 'Audited Financials 30 June', value: 'Audited Financials 30 June' },
        { label: 'Half Yearly 31 Dec', value: 'Half Yearly 31 Dec' },
        { label: 'Quarter Ended 30 Sept', value: 'Quarter Ended 30 Sept' },
        { label: 'Quarter Ended 31 March', value: 'Quarter Ended 31 March' },
        { label: 'LCB', value: 'LCB' },
      ],
    },
    { name: 'title', type: 'text', required: true },
    { name: 'date', type: 'date', admin: { description: 'Used for sorting and financial-year grouping. Read from the title if empty.' } },
    { name: 'file', type: 'upload', relationTo: 'media' },
    { name: 'path', type: 'text', admin: { description: 'Existing PDF on the site (used if no upload).' } },
  ],
})

export const Announcements: CollectionConfig = contentCollection(
  {
    slug: 'announcements',
    labels: { singular: 'Announcement / disclosure', plural: 'Announcements' },
    admin: { group: 'Content', useAsTitle: 'title', defaultColumns: ['title', 'date', 'showOnHomepageUntil'] },
    defaultSort: '-date',
    fields: [
      { name: 'title', type: 'text', required: true },
      { name: 'date', type: 'date', required: true },
      { name: 'summary', type: 'textarea' },
      { name: 'body', type: 'richText' },
      { name: 'file', type: 'upload', relationTo: 'media' },
      { name: 'showOnHomepageUntil', type: 'date', admin: { position: 'sidebar' } },
    ],
  },
  HOME,
)
