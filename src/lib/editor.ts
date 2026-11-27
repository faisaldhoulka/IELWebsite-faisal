import { EXPERIMENTAL_TableFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

/**
 * The CMS rich-text editor. Shared by payload.config.ts and the seed script so HTML is
 * converted with exactly the features editors get. Tables are needed for the Regulatory
 * page and the Open Account rates.
 */
export const editor = lexicalEditor({
  features: ({ defaultFeatures }) => [...defaultFeatures, EXPERIMENTAL_TableFeature()],
})
