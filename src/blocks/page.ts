import type { Block } from 'payload'

import { linkFields } from '../fields'
import { anchorField, buttonsField, sectionHeading } from './shared'
import { CtaBandBlock } from './homepage'

// Body blocks for text pages (About, services, legal pages, …), plan §4.

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: { singular: 'Text', plural: 'Text' },
  fields: [anchorField, { name: 'content', type: 'richText', required: true }],
}

export const CardGridBlock: Block = {
  slug: 'cardGrid',
  labels: { singular: 'Card grid', plural: 'Card grids' },
  fields: [
    anchorField,
    ...sectionHeading.map((f) => ('name' in f && f.name === 'title' ? { ...f, required: false } : f)),
    {
      name: 'background',
      type: 'select',
      defaultValue: 'white',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Light green', value: 'mist' },
        { label: 'Dark green', value: 'pine' },
      ],
    },
    {
      name: 'cards',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'text', type: 'textarea' },
        { name: 'image', type: 'upload', relationTo: 'media' },
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
    { name: 'title', type: 'text' },
    {
      name: 'files',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'label', type: 'text', required: true },
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
    { name: 'group', type: 'select', options: [{ label: 'Leadership', value: 'leadership' }, { label: 'Board', value: 'board' }, { label: 'All', value: 'all' }], defaultValue: 'all' },
  ],
}

export const ButtonsBlock: Block = {
  slug: 'buttons',
  labels: { singular: 'Buttons', plural: 'Buttons' },
  fields: [buttonsField('buttons', 3)],
}

export const pageBlocks: Block[] = [RichTextBlock, CardGridBlock, FileListBlock, TeamListBlock, CtaBandBlock, ButtonsBlock]
