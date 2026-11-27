import type { Adapter } from '@payloadcms/plugin-cloud-storage/types'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Payload storage adapter for the Supabase `website-cms` bucket (plan §7).
 *
 * Writes sign in as the dedicated `cms-uploader` Supabase user, whose storage policies
 * allow it to write to `website-cms` only. Supabase's S3 access keys are deliberately
 * not used: they unlock every bucket in the shared IEL project.
 * Reads use the bucket's public URLs.
 */

const BUCKET = 'website-cms'

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

export const supabaseStorageAdapter: Adapter = ({ prefix }) => ({
  name: 'supabase-website-cms',

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

  generateURL({ filename, prefix: docPrefix }) {
    return publicUrl(objectPath(docPrefix ?? prefix, filename))
  },

  // Files are served straight from the public bucket URL (disablePayloadAccessControl),
  // so this is only a fallback for /api/cms/media/file/* requests.
  async staticHandler(_req, { params }) {
    const url = publicUrl(objectPath(params.prefix ?? prefix, params.filename))
    return Response.redirect(url, 302)
  },
})
