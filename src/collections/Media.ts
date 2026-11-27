import type { CollectionConfig } from 'payload'

import { contentCollection } from './_shared'

// Files uploaded through the CMS. Stored in the Supabase `website-cms` bucket by the
// storage adapter (src/lib/storage/supabaseStorage.ts), not on the server.
export const Media: CollectionConfig = contentCollection({
  slug: 'media',
  admin: { group: 'Content', defaultColumns: ['filename', 'alt', 'mimeType', 'updatedAt'] },
  upload: {
    // Plan §7: images and PDFs only, no SVG (can carry scripts).
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'application/pdf'],
    // Do not keep files on the server (Vercel's file system is temporary).
    disableLocalStorage: true,
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre', formatOptions: { format: 'webp', options: { quality: 80 } } },
      { name: 'card', width: 800, formatOptions: { format: 'webp', options: { quality: 82 } } },
      { name: 'hero', width: 1920, formatOptions: { format: 'webp', options: { quality: 82 } } },
    ],
    adminThumbnail: 'thumbnail',
    focalPoint: true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      admin: { description: 'Describe the image for screen readers. Required for images.' },
      validate: (value: unknown, { data }: { data?: { mimeType?: string } }) =>
        data?.mimeType?.startsWith('image/') && !value ? 'Alt text is required for images.' : true,
    },
    { name: 'caption', type: 'text' },
  ],
})
