import type { Adapter } from '@payloadcms/plugin-cloud-storage/types'
import { getStorageFilePath, resolveSignedURLKey } from '@payloadcms/plugin-cloud-storage/utilities'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { APIError, Forbidden, type CollectionSlug, type PayloadHandler } from 'payload'
import { assertClientUploadAccess, assertClientUploadAllowed, assertClientUploadFileSize } from 'payload/internal'

import { isStaffUser } from '../../access'

/**
 * Payload storage adapter for the Supabase `website-cms` bucket (plan §7).
 *
 * Writes sign in as the dedicated `cms-uploader` Supabase user, whose storage policies
 * allow it to write to `website-cms` only. Supabase's S3 access keys are deliberately
 * not used: they unlock every bucket in the shared IEL project.
 * Reads use the bucket's public URLs.
 *
 * Large files (plan §7, Vercel's ~4.5 MB request limit): the admin uploads straight from
 * the browser to the bucket. Our server only hands out a short-lived signed upload URL
 * for one object key (see `generateSignedUploadURL`), and Payload's signed upload
 * receipt ties the saved document to that key.
 */

export const BUCKET = 'website-cms'
/** Admin endpoint (under /api/cms) that returns a signed upload URL. */
export const SIGNED_UPLOAD_PATH = '/supabase-website-cms-signed-upload'

let clientPromise: Promise<SupabaseClient> | null = null

function env(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Missing environment variable ${name}`)
  return v
}

/** One signed-in client per server instance; supabase-js refreshes the session itself. */
async function uploaderClient(): Promise<SupabaseClient> {
  if (!clientPromise) {
    clientPromise = (async () => {
      const client = createClient(env('SUPABASE_URL'), env('SUPABASE_ANON_KEY'), {
        auth: { persistSession: false, autoRefreshToken: true },
      })
      const { error } = await client.auth.signInWithPassword({
        email: env('SUPABASE_CMS_EMAIL'),
        password: env('SUPABASE_CMS_PASSWORD'),
      })
      if (error) throw new Error(`cms-uploader sign-in failed: ${error.message}`)
      return client
    })().catch((err) => {
      clientPromise = null // retry on the next upload
      throw err
    })
  }
  return clientPromise
}

const objectPath = (prefix: string | undefined, filename: string) =>
  [prefix, filename].filter(Boolean).join('/').replace(/^\/+/, '')

export function publicUrl(path: string): string {
  const base = env('SUPABASE_URL').replace(/\/$/, '')
  return `${base}/storage/v1/object/public/${BUCKET}/${path.split('/').map(encodeURIComponent).join('/')}`
}

export const supabaseStorageAdapter: Adapter = ({ collection, prefix }) => ({
  name: 'supabase-website-cms',
  // Browser-to-bucket uploads; the saved document must carry a receipt for the signed key.
  clientUploads: true,
  requiresClientUploadReceipt: true,

  async handleUpload({ file, storageFilePath }) {
    const client = await uploaderClient()
    const path = storageFilePath || objectPath(prefix, file.filename)
    const { error } = await client.storage.from(BUCKET).upload(path, file.buffer, {
      contentType: file.mimeType,
      cacheControl: '31536000',
      upsert: true,
    })
    if (error) throw new Error(`Upload to ${BUCKET} failed: ${error.message}`)
  },

  async handleDelete({ doc, filename, storageFilePath }) {
    const client = await uploaderClient()
    const path = storageFilePath || objectPath(doc.prefix ?? prefix, filename)
    const { error } = await client.storage.from(BUCKET).remove([path])
    if (error) throw new Error(`Delete from ${BUCKET} failed: ${error.message}`)
  },

  // `prefix` here already includes the per-upload `_objectKey` folder (folded in by the plugin).
  generateURL({ filename, prefix: docPrefix }) {
    return publicUrl(objectPath(docPrefix ?? prefix, filename))
  },

  // Files are served straight from the public bucket URL (disablePayloadAccessControl).
  // This handler is used when Payload itself needs the bytes (for example to read the
  // dimensions of an image the browser just uploaded) and for /api/cms/media/file/*.
  async staticHandler(req, { doc, params }) {
    const path = await getStorageFilePath({
      clientUploadContext: params.clientUploadContext,
      collection,
      collectionPrefix: prefix,
      doc: doc as never,
      filename: params.filename,
      req,
    })
    return Response.redirect(publicUrl(path), 302)
  },
})

const toMB = (bytes: number) => (bytes / 1024 / 1024).toFixed(1)

/**
 * POST /api/cms/supabase-website-cms-signed-upload
 * Body: { collectionSlug, docPrefix, filename, filesize, mimeType }.
 * Staff only. Checks type and size against the collection's rules, reserves a unique key
 * under the collection prefix, and returns a signed upload URL (valid ~2 hours, one object).
 */
export const generateSignedUploadURL =
  (collections: Record<string, { prefix?: string }>): PayloadHandler =>
  async (req) => {
    if (!req.json) throw new APIError('Content-Type expected to be application/json', 400)
    const { collectionSlug, docPrefix, filename, filesize, mimeType } = (await req.json()) as {
      collectionSlug: CollectionSlug
      docPrefix?: string
      filename: string
      filesize: number
      mimeType: string
    }

    await assertClientUploadAccess({ collectionSlug, req })
    if (!isStaffUser(req.user as never)) throw new Forbidden()
    const options = collections[collectionSlug]
    if (!options) throw new APIError(`Uploads for ${collectionSlug} are not stored in ${BUCKET}`, 400)

    assertClientUploadAllowed({ collection: req.payload.collections[collectionSlug]?.config, filename, mimeType })
    const limit = req.payload.config.upload.limits?.fileSize
    assertClientUploadFileSize(filesize)
    if (limit && limit !== Infinity && filesize > limit) {
      throw new APIError(`This file is ${toMB(filesize)} MB; the limit is ${toMB(limit)} MB.`, 400)
    }

    const { clientUploadContext, fileKey, sanitizedDocPrefix, sanitizedFilename } = await resolveSignedURLKey({
      collectionPrefix: options.prefix ?? '',
      collectionSlug,
      docPrefix,
      filename,
      req,
    })

    const client = await uploaderClient()
    const { data, error } = await client.storage.from(BUCKET).createSignedUploadUrl(fileKey)
    if (error || !data) throw new APIError(`Could not prepare the upload: ${error?.message ?? 'no URL returned'}`, 502)

    return Response.json({
      clientUploadContext,
      docPrefix: sanitizedDocPrefix,
      filename: sanitizedFilename,
      url: data.signedUrl,
      headers: { 'Content-Type': mimeType || 'application/octet-stream', 'cache-control': 'max-age=31536000', 'x-upsert': 'false' },
    })
  }
