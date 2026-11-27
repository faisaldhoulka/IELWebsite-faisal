# IEL Website

Corporate website of **Integrated Equities Limited (IEL)** — https://iel.net.pk

This branch (`nextjs-rebuild`) rebuilds the site in **Next.js with Payload CMS** to the client-approved dark-green design. The full plan, decisions and schedule are in [docs/NEXTJS-REBUILD-PLAN.md](docs/NEXTJS-REBUILD-PLAN.md).

## Branches
- `main` — current production site (Astro).
- `revamp-homepage` — Astro build of the dark-green design; the reference for the feature-parity check.
- `nextjs-rebuild` — this rebuild.

## How it fits together
- One Next.js app (Vercel): the public site plus the Payload admin at `/admin`, Payload REST at `/api/cms/*`.
- **CMS content** (homepage sections, pages, team, transactions, settings, reports…) lives in a separate Postgres database.
- **News, Learn articles, research, sectors and online financial statements** stay in the existing IEL Supabase project and are read live, on the server only (`src/lib/supabase-data`). The browser never talks to Supabase; nothing is written there.
- **CMS uploads** go to the Supabase `website-cms` bucket, written only by the `cms-uploader` user (`src/lib/storage`).
- **Forms** post to our `/api/forms/*` routes, which validate, rate-limit and forward to the existing `ielapis` API (`src/lib/forms.ts`).

## Project structure
```
src/app/(frontend)/   public pages, layout, design tokens (globals.css), form routes
src/app/(payload)/    Payload admin and REST routes (generated; don't edit)
src/collections/      CMS collections (content.ts, Media, Users, AuditLog)
src/globals/          Homepage, Homepage pop-ups, Account opening, Header menu, Footer, Site settings
src/blocks/           homepage and page section blocks
src/access/ hooks/    roles, change log, publish-on-save
src/lib/              supabase-data, storage adapter, forms, cms helpers
src/migrations/       Payload database migrations (committed)
public/               static files (images, PDFs, Google verification)
supabase/             schema snapshot, security notes, bucket SQL (gitignored)
```

## Local development
Requires Node `^24.22.3` (or `^22.23.5`), npm and Docker.

```bash
cp .env.example .env          # fill in PAYLOAD_SECRET and SUPABASE_ANON_KEY
npm install
npm run db:up                 # local Postgres on port 5432
npm run migrate               # create the CMS tables
npm run seed                  # load the current site's content into the CMS (once)
npm run dev                   # http://localhost:3000, admin at /admin
```
The first account created at `/admin` is always an admin. Uploads need `SUPABASE_CMS_EMAIL` / `SUPABASE_CMS_PASSWORD`; without them the admin works but uploads are off.

### Seed content
`scripts/seed.ts` loads the current site's content (homepage, 12 pages, team, services, transactions, partners, reports, static financial statements, menus, footer, settings, homepage pop-ups) from `scripts/seed-data/`. It refuses to run if pages exist; `npm run seed -- --reset` replaces seeded content (users, media and the change log are never touched). Legal page text lives in `scripts/seed-data/legal/*.html` (extracted once from the Astro build by `scripts/extract-legal-html.ts`). Supabase data is never seeded: it is read live.

### Changing the CMS schema
1. Edit a collection, global or block.
2. `npm run migrate:create -- <name>` and commit the new file in `src/migrations/`.
3. `npm run generate:types` (and `npm run generate:importmap` if admin components changed).

Production builds run `npm run build:vercel` (migrations, then `next build`).

## Project notes
Decisions, history and next steps: [MEMORY.md](MEMORY.md) · changes: [CHANGELOG.md](CHANGELOG.md).
