'use client'

import { createClientUploadHandler } from '@payloadcms/plugin-cloud-storage/client'
import { formatAdminURL } from 'payload/shared'

/**
 * Admin-side upload: asks our server for a signed upload URL, then sends the file
 * straight to the Supabase `website-cms` bucket, so large PDFs never pass through the
 * Vercel function (≈4.5 MB request limit). Returns the server-issued receipt that the
 * document save request carries.
 */
export const SupabaseClientUploadHandler = createClientUploadHandler({
  handler: async ({ apiRoute, collectionSlug, docPrefix, file, serverHandlerPath, serverURL, updateFilename }) => {
    const endpoint = formatAdminURL({ apiRoute, path: serverHandlerPath, serverURL })
    const res = await fetch(endpoint, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collectionSlug, docPrefix, filename: file.name, filesize: file.size, mimeType: file.type }),
    })
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { errors?: { message: string }[] }
      throw new Error(body.errors?.map((e) => e.message).join(', ') || `Upload could not start (${res.status})`)
    }
    const { clientUploadContext, filename, headers, url } = (await res.json()) as {
      clientUploadContext: { prefix: string; signedReceipt: string }
      filename?: string
      headers: Record<string, string>
      url: string
    }
    if (filename && filename !== file.name) updateFilename(filename)

    const upload = await fetch(url, { method: 'PUT', headers, body: file })
    if (!upload.ok) throw new Error(`Upload to storage failed (${upload.status})`)

    return { prefix: clientUploadContext.prefix, signedReceipt: clientUploadContext.signedReceipt }
  },
})
