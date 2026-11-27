import type { Block, Field } from 'payload'

import { linkFields } from '../fields'
import { anchorField, buttonsField, sectionHeading } from './shared'
import { CtaBandBlock } from './homepage'

// Body blocks for text pages (About, services, legal pages, …), plan §4.

const background: Field = {
  name: 'background',
  type: 'select',
  defaultValue: 'white',
  options: [
    { label: 'White', value: 'white' },
    { label: 'Light green', value: 'mist' },
    { label: 'Dark green', value: 'pine' },
  ],
}

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: { singular: 'Text', plural: 'Text' },
  fields: [
    anchorField,
    { name: 'eyebrow', type: 'text', admin: { description: 'Optional heading shown beside the text.' } },
    { name: 'title', type: 'text' },
    { name: 'content', type: 'richText', required: true },
  ],
}

export const CardGridBlock: Block = {
  slug: 'cardGrid',
  labels: { singular: 'Card grid', plural: 'Card grids' },
  fields: [
    anchorField,
    ...sectionHeading.map((f) => ('name' in f && f.name === 'title' ? { ...f, required: false } : f)),
    background,
    { name: 'numbered', type: 'checkbox', defaultValue: false, label: 'Number the cards (01, 02, …)' },
    {
      name: 'cards',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'value', type: 'text', admin: { description: 'Optional large figure above the title, e.g. "0.15%".' } },
        { name: 'title', type: 'text', required: true },
        { name: 'text', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'imagePath', type: 'text', admin: { description: 'Existing image on the site (used if no upload).' } },
        { name: 'link', type: 'group', fields: linkFields.map((f) => ('name' in f && f.name === 'label' ? { ...f, required: false } : f)) },
      ],
    },
  ],
}

export const FileListBlock: Block = {
  slug: 'fileList',
  labels: { singular: 'File list (PDFs)', plural: 'File lists' },
  fields: [
    anchorField,
    ...sectionHeading.map((f) => ('name' in f && f.name === 'title' ? { ...f, required: false } : f)),
    {
      name: 'style',
      type: 'select',
      defaultValue: 'list',
      options: [
        { label: 'List', value: 'list' },
        { label: 'Cards (with a short description)', value: 'cards' },
      ],
    },
    {
      name: 'files',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'text', type: 'textarea', admin: { description: 'Short description (cards style).' } },
        { name: 'date', type: 'date' },
        { name: 'file', type: 'upload', relationTo: 'media', admin: { description: 'Upload a new PDF, or use the path below for an existing one.' } },
        { name: 'path', type: 'text', admin: { description: 'Existing file on the site, e.g. /IEL Assets/PDF/x.pdf' } },
      ],
    },
  ],
}

export const TeamListBlock: Block = {
  slug: 'teamList',
  labels: { singular: 'Team list', plural: 'Team lists' },
  fields: [
    anchorField,
    ...sectionHeading.map((f) => ('name' in f && f.name === 'title' ? { ...f, required: false } : f)),
    {
      name: 'groups',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['board', 'management'],
      options: [
        { label: 'Board of directors', value: 'board' },
        { label: 'Key management', value: 'management' },
      ],
      admin: { description: 'Each group is shown as its own list, in this order.' },
    },
  ],
}

export const LogoGridBlock: Block = {
  slug: 'logoGrid',
  labels: { singular: 'Logo grid', plural: 'Logo grids' },
  fields: [
    anchorField,
    ...sectionHeading.map((f) => ('name' in f && f.name === 'title' ? { ...f, required: false } : f)),
    background,
    {
      name: 'logos',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'name', type: 'text', required: true, admin: { description: 'Used as the alt text.' } },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'imagePath', type: 'text', admin: { description: 'Existing image on the site (used if no upload).' } },
        { name: 'url', type: 'text' },
      ],
    },
  ],
}

export const FaqBlock: Block = {
  slug: 'faq',
  labels: { singular: 'FAQs', plural: 'FAQs' },
  fields: [
    anchorField,
    ...sectionHeading,
    { name: 'showContactLink', type: 'checkbox', defaultValue: true, label: 'Show "Something else on your mind? Contact us."' },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
  ],
}

// Renders the shared account-opening steps (global `account-opening`), edited in one place.
export const AccountOpeningBlock: Block = {
  slug: 'accountOpening',
  labels: { singular: 'Account opening steps', plural: 'Account opening steps' },
  fields: [
    anchorField,
    ...sectionHeading,
    {
      name: 'style',
      type: 'select',
      defaultValue: 'accordion',
      options: [
        { label: 'Accordion (steps only)', value: 'accordion' },
        { label: 'Tabs (steps and FAQs per account type)', value: 'tabs' },
      ],
    },
    { name: 'showButton', type: 'checkbox', defaultValue: true, label: 'Show the "Get started" button' },
  ],
}

// Contact page: contact details, complaints contact and the message form (→ /api/forms/contact).
export const ContactFormBlock: Block = {
  slug: 'contactForm',
  labels: { singular: 'Contact details and form', plural: 'Contact details and form' },
  fields: [
    anchorField,
    ...sectionHeading,
    {
      name: 'details',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
        { name: 'href', type: 'text', admin: { description: 'Optional link, e.g. mailto:support@iel.net.pk or tel:+924235741714' } },
      ],
    },
    {
      name: 'complaints',
      type: 'group',
      label: 'Complaints box',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'text', type: 'textarea' },
        { name: 'email', type: 'email' },
        { name: 'personLabel', type: 'text', defaultValue: 'Contact person for complaints' },
        { name: 'personName', type: 'text' },
        { name: 'personRole', type: 'text' },
        { name: 'phone', type: 'text' },
        { name: 'phoneHref', type: 'text', admin: { description: 'Dial string, e.g. +923450091263' } },
      ],
    },
    { name: 'formTitle', type: 'text', defaultValue: 'Send us a message' },
    { name: 'formIntro', type: 'text', defaultValue: 'All fields are required.' },
  ],
}

// Office locations with a map per office.
export const OfficesBlock: Block = {
  slug: 'offices',
  labels: { singular: 'Office locations', plural: 'Office locations' },
  fields: [
    anchorField,
    ...sectionHeading,
    {
      name: 'offices',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'address', type: 'textarea' },
        { name: 'mapUrl', type: 'text', admin: { description: 'Google Maps "Embed a map" link (https://www.google.com/maps/embed?…).' } },
      ],
    },
  ],
}

// Latest Learn articles, read live from the `blogs` table in Supabase.
export const ArticlesBlock: Block = {
  slug: 'articles',
  labels: { singular: 'Latest articles', plural: 'Latest articles' },
  fields: [anchorField, ...sectionHeading, { name: 'limit', type: 'number', min: 1, max: 60, admin: { description: 'Leave empty to show all.' } }],
}

export const ButtonsBlock: Block = {
  slug: 'buttons',
  labels: { singular: 'Buttons', plural: 'Buttons' },
  fields: [buttonsField('buttons', 3)],
}

export const pageBlocks: Block[] = [
  RichTextBlock,
  CardGridBlock,
  LogoGridBlock,
  FaqBlock,
  FileListBlock,
  TeamListBlock,
  AccountOpeningBlock,
  ContactFormBlock,
  OfficesBlock,
  ArticlesBlock,
  CtaBandBlock,
  ButtonsBlock,
]
