# IEL Website — Next.js + Payload CMS Rebuild Plan

**Status:** decisions agreed, ready to start · 27 Nov 2026
**Based on:** the client proposal ([IEL-Website-Revamp-Proposal.pdf](IEL-Website-Revamp-Proposal.pdf)) and the client-approved **dark-green** design (`mockups/dark-green`, the same design as the `revamp-homepage` branch).

---

## 1. Goal

Rebuild the IEL website in Next.js with the dark-green design, with an admin panel (Payload CMS) so IEL staff can edit site sections themselves.

- All 21 pages, desktop and mobile, rendered on the server for search engines.
- Every feature of the current site keeps working (checklist in §5).
- Data that lives in Supabase today stays there and is read live, never copied.
- Launch at the end of week 5 (development weeks 1–4, UAT week 5), as in the proposal.

Not included (per proposal): copywriting, photography, Urdu or other languages, approval workflow.

---

## 2. Architecture

One Next.js application on Vercel, with Payload CMS built into it.

```
                         ┌──────────────────── Next.js app (Vercel) ─────────────────────┐
Browser ── HTTPS ──────> │  Public site (server-rendered)     /admin  (Payload admin)     │
  (never talks to        │        │                               │                       │
   Supabase directly)    │  lib/supabase-data (server only)   Payload (collections,       │
                         │        │                            auth, hooks, REST API)     │
                         └────────┼───────────────────────────────┼──────────┬────────────┘
                                  │ anon key, read-only           │          │ cms-uploader login
                                  ▼                               ▼          ▼
                     Existing IEL Supabase project       CMS Postgres     Supabase bucket
                     news, blogs, research, sector,      (Payload data)   `website-cms`
                     finanicial_statements,                               (CMS uploads)
                     Images / PDF Files buckets
```

| Part | Technology |
|---|---|
| Framework | Next.js (App Router, TypeScript, React Server Components) |
| CMS | Payload 3 (runs inside the Next.js app; admin at `/admin`, REST API at `/api/cms/*`) |
| CMS database | Postgres via `@payloadcms/db-postgres`; schema changes as committed Payload migrations |
| Rich text | Payload Lexical editor |
| Styling | Tailwind (compiled), tokens ported from the dark-green `RevampHead.astro` (IBM Plex Sans/Serif, logo palette) |
| Supabase access | `@supabase/supabase-js`, server-only module (`import "server-only"`), anon key |
| CMS file storage | Custom Payload storage adapter → Supabase bucket `website-cms`, signed in as `cms-uploader` |
| Images | `sharp` (Payload image sizes, WebP), `next/image` |
| Hosting | Vercel (one project) |

### Rules
1. **Supabase data stays in Supabase.** Read live by the server side of the Next.js app. No imports, no syncs, no copies.
2. **The browser never talks to Supabase.** No Supabase key ships to the browser; pages arrive already rendered, and anything the browser fetches later comes from our own `/api/site/*` routes.
3. **Nothing in the existing Supabase project changes**, apart from the `website-cms` bucket, which is already set up (`supabase/website-cms-bucket.sql`; user `cms-uploader`, `461b59f4-2cd9-4cc4-9c60-71a082311267`).
4. **The CMS database holds only CMS-owned content** and is separate from the existing IEL Supabase project.

---

## 3. Where each piece of content comes from

| Content | Source | Edited in |
|---|---|---|
| News | Supabase `news` | IEL's existing admin panel (unchanged) |
| Learn articles (list + detail) | Supabase `blogs` | IEL's existing admin panel |
| Research reports and sectors | Supabase `research`, `sector` | IEL's existing admin panel |
| Financial statements (online rows) | Supabase `finanicial_statements` | IEL's existing admin panel |
| Their PDFs and images | Supabase `PDF Files`, `Images` buckets (public URLs) | IEL's existing admin panel |
| Homepage sections | Payload | **New CMS** |
| Team, transactions, partners | Payload | **New CMS** |
| Site settings: utility bar, menus, contact details, client login URL, footer, HubSpot link | Payload | **New CMS** |
| Text pages: About, 4 service pages, Brokerage, Privacy, Terms, Risk disclosure, Fraud, Regulatory, Investor education | Payload | **New CMS** |
| Corporate reports (Reports page) | Payload | **New CMS** |
| Static financial statements (83 rows now in `STATIC_STATEMENTS`) | Payload | **New CMS** |
| Announcements and disclosures | Payload | **New CMS** |
| Files uploaded through the CMS | Bucket `website-cms` | **New CMS** |
| Contact and Open Account submissions | Existing `ielapis.u2ventures.io` API (unchanged), reached through our server (§5a) | — |

**One-time seed:** the content now hard-coded in this repo (homepage, text pages, team, statements, reports, settings, menus) is loaded into Payload by a seed script, so the CMS starts filled. Existing PDFs in `public/` stay where they are and are referenced by URL. This is not an import from Supabase.

---

## 4. Payload content model

### Globals (one of each)
| Global | Fields |
|---|---|
| `site-settings` | Utility bar text and links, contact details (address, phones, email), client login URL, HubSpot booking URL, social links, default SEO (title suffix, description, OG image) |
| `navigation` | Header menu: groups and links (internal page / URL / PDF, "opens in new tab"); "Discuss a mandate" button |
| `footer` | Link columns, regulatory lines, complaint-procedure popup text and PDF |
| `homepage` | Ordered **blocks** (each can be hidden): Hero, Stats, Services, Transactions, Process, Team, Insights, Partners, Contact band. Blocks pick items from the collections below where relevant. |

### Collections
| Collection | Purpose / key fields |
|---|---|
| `users` | Staff logins (Payload auth): name, email, role (`admin`, `editor`) |
| `media` | Uploads to `website-cms`: alt text (required for images), image sizes (thumbnail, card, hero), PDFs allowed |
| `pages` | Text pages: title, slug, hero (eyebrow, title, intro), body as blocks (rich text, card grid, table, PDF list, CTA), SEO fields |
| `team-members` | Name, role, short bio, portrait, order, show on homepage / About |
| `transactions` | Year, practice, client, description, size, role, order, featured on homepage |
| `partners` | Name, logo, link, order |
| `services` | Practice title, summary, CTA label, link to service page, order |
| `corporate-reports` | Title, date, PDF, order |
| `static-financial-statements` | Tab (Annual 30 June / Half-yearly 31 Dec / Q1 30 Sept / Q3 31 March / LCB), title, date, PDF |
| `announcements` | Title, date, summary, body, PDF, show on homepage until (date) |
| `audit-log` | Written by hooks: user, collection/global, item, action, time (read-only in admin) |

### Access rules
- Public read: published content only (via server code, not open REST listing of drafts/users).
- `editor`: create/edit/delete content in all collections and globals except `users` and `site-settings`.
- `admin`: everything, including users and settings.
- `audit-log`: read-only for admins, writes only from hooks.

### Publishing
- Content goes live on save (no approval workflow, per proposal).
- Payload `afterChange` / `afterDelete` hooks call `revalidateTag` for the affected pages, so changes appear immediately.
- Version history kept for `homepage` and `pages` (Payload versions), so an editor can restore a previous version.

---

## 5. Features to keep (parity checklist)

| # | Feature | Today | In the rebuild |
|---|---|---|---|
| 1 | Header: dropdown menus (hover/click/keyboard, Escape closes), ☰ mobile menu below 1280 px, current page highlighted, utility bar | `SiteHeader.astro` | `Header` component, items from `navigation` |
| 2 | Footer: all page links, complaint-procedure popup and PDF | `SiteFooter.astro` | `Footer` component, from `footer` |
| 3 | Homepage enquiry form → `ielapis …/contact/contactus/` | inline script, browser posts directly | Same fields; browser posts to our `/api/forms/contact`, which forwards to the same endpoint (§5a); success/error states |
| 4 | Contact page form → same endpoint | inline script, browser posts directly | Same, via `/api/forms/contact` |
| 5 | Open Account form → `ielapis …/contact/free-account/` | inline script, browser posts directly | Same fields, via `/api/forms/open-account` |
| 6 | News: 20 latest, newest first, PDF links | `supabaseNews.js` | Server-rendered from `news` |
| 7 | Research: sector tabs (alphabetical, first selected), search across all reports (search clears the tab), report list, view and download PDF (`?download=`) | `supabaseReseach.js` | Data loaded on the server; tabs and search in a client component, same behaviour |
| 8 | Learn: article list, newest first | `supabaseBlogs.js` | Server-rendered from `blogs` |
| 9 | Article detail `NewBlogDetail.html?id=…` | inline script | `/learn/[id]` |
| 10 | Financial statements: 5 tabs, grouped by financial year (Jul–Jun), Supabase rows merged with static rows, date taken from title, PDF view | `supabaseFinancialStatements.js` | Merge and grouping in server code (Supabase + `static-financial-statements`); tabs in a client component |
| 11 | Static PDFs: Regulatory, Investor education, Reports, complaint procedure | `public/` | Kept at the same paths; new ones via CMS |
| 12 | Book a consultation (HubSpot) | header | From `site-settings` |
| 13 | Page addresses | `.html` URLs (`/About.html`, …) | Clean URLs only (`/about`, `/research`, …); old `.html` addresses are **not kept** (decided 27 Nov 2026) |
| 14 | Google site verification file | `public/` | Same file, same path |
| 15 | Security headers | `vercel.json` | `next.config` headers; CSP updated (Supabase storage, HubSpot; `ielapis` no longer called from the browser) |
| 16 | 375 px mobile layout, no horizontal scroll | all pages | Checked per page |

### URL map (for reference: old addresses are not redirected)
| Old | New |
|---|---|
| `/index.html` | `/` |
| `/About.html` | `/about` |
| `/FinancialAdvisory.html`, `/StrategyConsulting.html`, `/RealStateAdvisory.html`, `/FintechService.html` | `/services/financial-advisory`, `/services/strategy-consulting`, `/services/real-estate-advisory`, `/services/fintech` |
| `/BrokerageService.html` | `/brokerage` |
| `/OpenAccount.html` | `/open-account` |
| `/Research.html` | `/research` |
| `/News.html` | `/news` |
| `/Resources.html`, `/NewBlogDetail.html?id=X` | `/learn`, `/learn/X` |
| `/Reports.html` | `/corporate-reports` |
| `/NewReport.html` | `/financial-statements` |
| `/Regulatory.html`, `/Investor_education.html`, `/Fraud.html`, `/RiskDisclosure.html` | `/regulatory`, `/investor-education`, `/fraud-awareness`, `/risk-disclosure` |
| `/Privacy.html`, `/Terms.html`, `/Contact.html` | `/privacy`, `/terms`, `/contact` |

### 5a. Forms

- The browser posts to our own routes: `/api/forms/contact` (homepage and Contact page) and `/api/forms/open-account`.
- The server validates the fields, checks a hidden honeypot field and a per-IP rate limit, then forwards the same fields to `ielapis.u2ventures.io` (`/contact/contactus/`, `/contact/free-account/`).
- The `ielapis` API itself does not change; its address is no longer visible in the browser.
- The user sees the same success and error messages as today; if `ielapis` is down, a clear "please try again or call us" message.

---

## 6. Server-side Supabase data layer

`lib/supabase-data/` (server-only; importing it into browser code fails the build):

| Function | Query (same as today) |
|---|---|
| `getNews(limit = 20)` | `news`: `short_des, pdf`, newest first |
| `getBlogs()` / `getBlog(id)` | `blogs`: `title, img, desc, id` / `+ created_at` |
| `getSectors()` / `getResearch()` | `sector` by name; `research` newest first |
| `getFinancialStatements()` | `finanicial_statements`, merged with Payload static rows, grouped by FY |

- **Freshness:** results cached with Next.js data cache, `revalidate: 60` and a tag per table. New items appear within about a minute. (Supabase can't notify us without a DB change, so this is time-based.)
- **Failure:** if Supabase is down, the page shows the last cached data; if there is none, a friendly "temporarily unavailable" message instead of a broken page.
- **Columns:** only the columns the page uses are selected; the mapping lives in one place, so a column change by the app team is a one-file fix.
- **Optional routes** `/api/site/*` expose the same functions as JSON if the browser ever needs to fetch after load.

---

## 7. Uploads to `website-cms`

- Custom Payload storage adapter: `handleUpload`, `handleDelete`, `generateURL` using supabase-js signed in as `cms-uploader` (email/password from env; session kept and refreshed on the server).
- Supabase's S3 access keys are **not** used: they unlock every bucket.
- Paths: `<collection>/<yyyy>/<name>-<hash>.<ext>`; public URL stored on the media item.
- Images: max 10 MB, resized by Payload/sharp into WebP sizes; SVG not allowed.
- PDFs: up to 10 MB. Vercel limits request bodies to ~4.5 MB, so files above that are uploaded from the browser straight to the bucket with a one-time signed upload URL issued by the server.
- Deleting a media item deletes its files from the bucket.

---

## 8. Security

- Payload auth: hashed passwords, httpOnly secure cookies, login lockout after repeated failures; named staff accounts only, no public sign-up.
- Access control as in §4; `users` and drafts are never publicly readable.
- Supabase anon key and `cms-uploader` credentials only in server env vars.
- New CMS Postgres: no Data API exposure (if hosted on Supabase, the Data API is turned off for that project).
- Security headers carried over from `vercel.json`, CSP tightened to the domains in use.
- `/admin` excluded from search engines (`noindex`, robots).
- Dependencies pinned; `npm audit` in CI.

---

## 9. Hosting, configuration and cost

| Item | Choice | Approx. monthly |
|---|---|---|
| Next.js + Payload | Vercel **Pro** (Hobby is not allowed for commercial sites) | USD 20 per seat (if IEL is not already on Pro) |
| CMS Postgres | New, separate project in IEL's Supabase organisation (Micro compute) | ~USD 10 if the org is on Pro; USD 25 if the org has to move to Pro |
| CMS files | `website-cms` bucket in the existing Supabase project | Negligible |

Connection: pooled Postgres URL for the app (serverless), direct URL for migrations. Postgres region close to Vercel's function region; Vercel function region set close to the existing IEL Supabase project, since most reads go there.

### Environment variables (Vercel; local `.env` is gitignored, `.env.example` committed)
```
DATABASE_URI=            # pooled
DATABASE_URI_DIRECT=     # migrations
PAYLOAD_SECRET=
NEXT_PUBLIC_SITE_URL=https://iel.net.pk
SUPABASE_URL=https://bfxmfaakufrmzcxhtgfw.supabase.co
SUPABASE_ANON_KEY=
SUPABASE_CMS_EMAIL=
SUPABASE_CMS_PASSWORD=
CONTACT_API_BASE=https://ielapis.u2ventures.io/api/contact
```

### Deploy
- Build: `payload migrate && next build` (migrations run before each production build).
- Environments: **Preview** (every branch push, own CMS database branch or a staging database), **Production** (`main`).
- Backups: daily Postgres backups (Supabase Pro); `website-cms` files listed in the media collection, so a restore is consistent.

---

## 10. Repo and branches

- Repo: `faisaldhoulka/IELWebsite-faisal` only.
- New branch **`nextjs-rebuild`** from `revamp-homepage`. The Next.js app replaces the Astro files at the repo root; the Astro build stays available on `revamp-homepage` as the reference for the parity test.
- `mockups/` not carried into the new branch (kept in history).
- Docs updated as the work goes: `README.md`, `MEMORY.md`, `CHANGELOG.md`, and a short CMS guide for IEL staff.

```
src/
  app/
    (site)/            public pages, layout, header, footer
    (payload)/admin    Payload admin
    (payload)/api      Payload REST (/api/cms)
    api/site/          optional JSON routes over lib/supabase-data
  collections/  globals/  blocks/  hooks/  access/
  lib/supabase-data/   server-only Supabase reads
  lib/storage/         website-cms storage adapter
  components/
  payload.config.ts
scripts/seed.ts        one-time seed from current content
```

---

## 11. Schedule

| Week | Work | Done when |
|---|---|---|
| **1** | Next.js + Payload setup; Postgres and migrations; collections, globals and access rules; `website-cms` storage adapter; Supabase data layer; design tokens and base layout; seed script. **Client sends final content.** | Admin login works; every data set the current site shows can be read on the server |
| **2** | All 21 public pages built to the dark-green design; header, footer, forms | Parity items 1–16 pass on a preview deployment |
| **3** | Homepage blocks and page blocks finished in the admin; publish-on-save; version history; audit log; large-PDF direct upload; seed with final client content | Staff can change every CMS section end to end on preview |
| **4** | SEO (metadata, sitemap, robots, OG images); security headers/CSP; performance (images, Lighthouse); backups; full parity test against the current site; staff CMS guide | Internal sign-off on preview |
| **5** | UAT with IEL's named contact; fixes; launch (DNS to Vercel, production env vars, smoke test); hand-over | Live on iel.net.pk |

Payload provides the admin panel, so week 3 has slack; it is the buffer for late content and UAT fixes.

---

## 12. Dependencies

| From | What | Needed by |
|---|---|---|
| Client | Final copy, transaction list, stats, team bios, high-res portraits, partner logos, client login URL, founding year (2007 vs 2008) | End of week 1 |
| Client / IT | Vercel plan confirmed (Pro); Supabase organisation plan confirmed (Pro); new CMS Supabase project created (Data API off) and its connection strings shared with us | Week 1 |
| Client | Names and emails of staff who need CMS logins, and their role | Week 3 |
| Client | Named UAT contact; feedback within 2 working days per round | Week 5 |
| Client / IT | DNS access for iel.net.pk | Week 5 |
| Done | `website-cms` bucket, policies and `cms-uploader` user | ✓ |

---

## 13. Risks

| Risk | Mitigation |
|---|---|
| Late content | Launch moves day for day (per proposal); seed placeholder content so building isn't blocked |
| App team changes the Supabase tables the site reads | Column mapping in one module; ask the app team to tell us before changing `news`, `blogs`, `research`, `sector`, `finanicial_statements` |
| Supabase outage | Last cached data keeps showing; friendly fallback message |
| Vercel request/time limits on uploads | Direct signed uploads for large PDFs; 10 MB cap |
| Payload is a framework we commit to | Mainstream, open source (MIT), runs in our own app and database; content exportable via its API |
| Open Supabase security findings (`supabase/SECURITY_FINDINGS.md`) | Not in scope; the rebuild removes the website's key from the browser, but the DB owners still need to fix the policies |

---

## 14. Decisions (agreed 27 Nov 2026)

1. **URLs:** clean URLs only; the old `.html` addresses are not kept or redirected. Old links show "page not found" until Google re-indexes; submit the new sitemap in Google Search Console at launch.
2. **Text pages** (Privacy, Terms, Risk disclosure, Fraud, Regulatory, …) are editable in the CMS.
3. **CMS database:** a new, separate project in IEL's Supabase organisation (Data API off).
4. **Forms** go through our server (§5a) before reaching `ielapis`.
5. **Version history** on the homepage and pages only; other collections rely on the audit log.

Still to confirm with IEL (facts, not decisions): Vercel plan (Pro needed) and Supabase organisation plan (Pro).
