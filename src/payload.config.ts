import { postgresAdapter } from '@payloadcms/db-postgres'
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
import { initClientUploads } from '@payloadcms/plugin-cloud-storage/utilities'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { AuditLog } from './collections/AuditLog'
import {
  Announcements,
  CorporateReports,
  Pages,
  Partners,
  Services,
  StaticFinancialStatements,
  TeamMembers,
  Transactions,
} from './collections/content'
import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { AccountOpening, Footer, Homepage, Navigation, Popups, SiteSettings } from './globals'
import { rowLabels } from './lib/admin/rowLabels'
import { editor } from './lib/editor'
import { migrations } from './migrations'
import { SIGNED_UPLOAD_PATH, generateSignedUploadURL, supabaseStorageAdapter } from './lib/storage/supabaseStorage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Uploads go to the Supabase `website-cms` bucket only when its credentials are set,
// so the admin still starts locally without them (uploads then fail with a clear error).
const storageConfigured = Boolean(process.env.SUPABASE_CMS_EMAIL && process.env.SUPABASE_CMS_PASSWORD)

// Collections whose files live in the bucket, with their folder.
const storageCollections = { media: { prefix: 'media' } }

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || '',
  routes: { admin: '/admin', api: '/api/cms' },
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ' · IEL CMS', robots: 'noindex, nofollow' },
    importMap: { baseDir: path.resolve(dirname) },
    components: { beforeDashboard: ['/components/admin/DashboardGuide#DashboardGuide'] },
  },
  collections: [
    Pages,
    Services,
    Transactions,
    TeamMembers,
    Partners,
    Announcements,
    CorporateReports,
    StaticFinancialStatements,
    Media,
    Users,
    AuditLog,
  ],
  globals: [Homepage, Popups, AccountOpening, Navigation, Footer, SiteSettings],
  editor,
  secret: process.env.PAYLOAD_SECRET || '',
  graphQL: { disable: true },
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || '' },
    // Schema changes go through committed migrations (src/migrations), never auto-push in production.
    push: false,
    migrationDir: path.resolve(dirname, 'migrations'),
    prodMigrations: migrations,
  }),
  sharp,
  upload: { limits: { fileSize: 10 * 1024 * 1024 } }, // 10 MB (plan §7)
  plugins: [
    // Direct browser-to-bucket uploads for large files (plan §7): registers the signed-URL
    // endpoint and the admin upload handler. Must run before cloudStoragePlugin.
    (config) => {
      initClientUploads({
        clientHandler: '/lib/storage/SupabaseClientUploadHandler#SupabaseClientUploadHandler',
        collections: storageCollections,
        config,
        enabled: storageConfigured,
        serverHandler: generateSignedUploadURL(storageCollections),
        serverHandlerPath: SIGNED_UPLOAD_PATH,
      })
      return config
    },
    cloudStoragePlugin({
      enabled: storageConfigured,
      alwaysInsertFields: true,
      collections: {
        media: {
          adapter: supabaseStorageAdapter,
          prefix: storageCollections.media.prefix,
          disableLocalStorage: true,
          disablePayloadAccessControl: true, // serve files straight from the public bucket URL
        },
      },
    }),
    rowLabels,
  ],
})
