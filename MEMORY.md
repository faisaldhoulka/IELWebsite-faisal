# MEMORY — IEL Website Project Log

Living project memory. Updated as work progresses, together with [README.md](README.md).

## Project snapshot
- **Site:** Integrated Equities Limited (IEL) corporate website — https://iel.net.pk
- **Stack (`main`, v1.0.0):** static HTML + vanilla JS + `style.css`, data from Supabase.
- **Stack (`IELAstro`):** Astro 7 static site (21 pages), Tailwind via CDN script (unchanged), same vanilla JS in `public/`.
- **Hosting:** Vercel, deployed from GitHub. Security headers live in `vercel.json`.
- **Repo (original, do not update):** https://github.com/tanveer-iel/IELWebsite
- **Working repo (revamp):** https://github.com/faisaldhoulka/IELWebsite-faisal — the only repo this checkout pushes to; a local `.git/hooks/pre-push` guard blocks any other target.
- **Owner / maintainer:** Tanveer (tanveer@iel.net.pk)
- **Origin:** copied from UsamaAshraf1/IEL; base build handed over by Anwar Farid sb on 2026-10-06.

## Branches
| Branch | Purpose | Status |
|---|---|---|
| `main` | Production base build (`v1.0.0`, plain HTML) | Pushed |
| `IELAstro` | Astro version of the site | Pushed; all pages migrated (see Log) |

## Releases / tags
- `v1.0.0` — Base build as handed over by Anwar Farid sb on October 06, 2026. GitHub Release with `IELWebsite-v1.0.0.zip`: https://github.com/tanveer-iel/IELWebsite/releases/tag/v1.0.0

## Astro layout (IELAstro)
- `src/pages/*.astro` — one per old `.html` page (21). `build.format: "file"` keeps URLs identical (`/About.html`, `/index.html`).
- `src/layouts/Layout.astro` — `<html>`/`<head>` (via `head` slot)/`<body>`.
- `src/components/Nav.astro`, `Footer.astro` — shared nav/footer (content from home page). Nav takes `navClass`; Footer takes `extra` and `padTop`.
- `public/` — everything served as-is: `Assets/`, `IEL Assets/`, `fonts/`, `style.css`, `home.js`, `index.js`, `supabase*.js`, Google verification file.
- All `<script>`/`<style>` in pages are `is:inline` so they ship exactly as written.
- All pages incl. `index.astro` use the shared Nav/Footer; the home page's header/footer (from `main` index.html) is the standard. Never inline a copy.

## Docs
- `Guides/DEVELOPERS_GUIDE.md` — how the Astro templates work and how to create/edit pages and components. `Guides/` is in `.vercelignore` (not deployed).
- `Guides/HOW_TO_CHANGE_HEADER_FOOTER.md` — how to edit the single-source header/footer, props, dropdown wrapping fix.

## Build workflow (IMPORTANT)
- `node_modules` **cannot** live on Google Drive (npm EBADF errors, junctions unsupported, sync noise).
- Use `bash scripts/local-build.sh [build|preview]` — copies `src/`, `public/`, config to `C:/dev/iel-build`, installs there, builds. Output is in `C:/dev/iel-build/dist`.
- Vercel builds from the repo itself (`npm run build` → `dist/`), so no action needed there.

## Decisions
- 2026-10-07: Full migration of all pages to Astro, preserving markup verbatim for zero visual change; Tailwind stays on the CDN script for now.
- 2026-10-07: Shared Nav/Footer unified from Terms.html. Old per-page variations were only `alt` text casing/typos and a commented-out block; no content differences.
- 2026-10-07: Keep this file and README.md updated at each meaningful step.

## Log
- 2026-11-25 (later): **4th mockup `dark-green`** (first created as `current-revamp`, renamed by the user): an unchanged snapshot of the branch homepage (`src/pages/index.astro` built via `scripts/local-build.sh`, copied from `dist/index.html` with its 4 assets) so all four directions can be compared. Only additions: the compare/note bar and a script that blocks the enquiry form (the real form posts to the live contact API). Inner-page links don't resolve inside `mockups/`. Re-snapshot after homepage changes. All four mockups now cross-link.
- 2026-11-25 (later): **Real team photos** in `signature-ink` and `daylight-green` (user: people like the design more when they see themselves). Source: `public/IEL Assets/Members/` (CEO, COO, Head of IB, Head of Research), cropped to head-and-shoulders and saved per mockup in `assets/team/` (3:4 for Signature ink, shown greyscale with colour on hover; 1:1 colour for Daylight green). Originals are small (156–292 px), so they look soft when large — ask the client for higher-resolution portraits. Daylight team cards use short bios condensed from the About page.
- 2026-11-25 (later): `heritage-maroon` discarded at the user's request; replaced by `signature-ink` (private-bank restraint: ink green + stone paper, Cormorant Garamond + Inter, centred dark hero with credentials strip, roman-numeral sections with sticky labels, practice accordion, classic IB tombstones "as a matter of record only", dark sectors + cross-border, CEO quote + leaders, perspectives index, centred private-conversation contact, no form). Daylight green hero now reads "Advice that gets deals done." (user removed "Pakistan's").
- 2026-11-25: **Two more homepage mockups** in `mockups/` beside `advisory-first`, both advisory-led and using only logo colours: `heritage-maroon` (ivory + maroon lead, pine second; practice tabs, text deal list, CEO quote, credentials band, low-key contact) and `daylight-green` (white/mint, greens lead, pine deals band, maroon contact; deal cards in hero, process steps, named team). Ideas taken from iel.net.pk, aequitas.com.pk and peer advisory sites (Evercore, Moelis, PWP, Centerview, Lazard). Real team names from the live About page; founding year left as [2007/2008] because the live site states both. Preview: `mockups` entry in `.claude/launch.json` (python http.server on 4400).
- 2026-11-25: **Palette switched to the logo's colours** (user: site looked colourless). Sampled from `IELTezi-logo-trimmed.webp`: green #19A560, dark green #265140, light green #59B986, maroon #732E30, coral #DF4531, ink #0D1813. Tokens in `RevampHead.astro` (new `brand.*`, `mint`; accent = #13804A, a deeper logo green so white text passes AA). New `BrandStripe.astro` (five logo colours) above hero titles only (full-width ribbons on header and footer were tried and removed: user did not like them). All text/background pairs checked ≥4.5:1.
- 2026-11-25: **Main menu restored** in `SiteHeader.astro`, styled after aequitas.com.pk (inspiration site): sticky white bar, dropdowns About / Services / Transactions / Research / Investors / Contact covering every original menu item (What we offer, Investors information, Research reports, About, Learn, Contact, Get a consultation → HubSpot link) plus News, Corporate reports, Fraud, Risk disclosure, complaints PDF. ☰ menu with collapsible groups below 1024px; current page highlighted. Menu is the `menu` array at the top of the file. Later the same day: Brokerage and all research items moved into a low-priority "Brokerage & Research" dropdown (after Investors) so advisory leads; full bar shows from 1280px, ☰ menu below.
- 2026-11-25: **All 20 inner pages revamped** to the homepage design. Shared pieces: `layouts/RevampPage.astro` (head meta incl. `ogTitle`/`ogDescription`, header, contact band, footer; slots `head`/`scripts`), `PageHero`, `SectionHeading`, `ContactBand`, `.iel-prose` (long text) and `.grid-lines` (1px card grids) in `RevampHead`. Footer now links every page. Old `Nav.astro`/`Footer.astro`, `public/index.js` and `public/supabase.js` are no longer used by any page. Supabase scripts restyled (markup only, queries unchanged); cache tags bumped. Financial statements' 83 hard-coded rows moved from NewReport markup into `STATIC_STATEMENTS` in its JS. `scripts/local-build.sh` accepts `IEL_BUILD_DIR`. Checked: all links/anchors resolve, all 21 pages fine at 375px, live data loads.
- 2026-11-25: **Revamp started** on branch `revamp-homepage`: homepage rebuilt from the "IEL Advisory Website Revamp" design (advisory-led; IBM Plex Sans/Serif; pine/accent/wine palette). New components `RevampHead.astro` (fonts, Tailwind CDN + colour tokens), `SiteHeader.astro` (utility bar + nav), `SiteFooter.astro`. Other 20 pages still use the old `Nav`/`Footer` until redesigned. Bracketed text ([Client name], [XX], [Portrait], [Logo]) marks content still to supply; Client login URL is a TODO in `SiteHeader.astro`. Contact form posts to the existing `ielapis.u2ventures.io` contact endpoint (added an Email field the design lacked). Rule: the Supabase DB is read-only for the revamp.
- 2026-10-10: Header: larger Tezi logo (xl:h-[96px]), desktop menu no-wrap (text-sm, nowrap, dropdowns w-max). Checked in headless Chrome at 1280px. Growing the white bar to fit a 208px logo was tried and reverted (looked wrong).
- 2026-10-10: **Header/footer now single-source.** `index.astro` uses shared `Nav`/`Footer` (was inline copies). Content standardised on `index.html` from `main` (user rule: home header/footer is the standard). Layout differences are props: `Nav navClass`, `Footer extra` + `padTop`. 21 pages build; home keeps its own spacing. Side effect: shared nav alts are now the home ones (e.g. "Change Agency Logo" — template leftover, worth renaming).
- 2026-10-10: Reviewed codebase; added `Guides/DEVELOPERS_GUIDE.md` and `.vercelignore` (excludes Guides/, docs, scripts from Vercel uploads). Noted: relative asset paths require all pages at site root; `index.astro` keeps its own nav/footer.
- 2026-10-07: **Migrated all 21 pages to Astro** on `IELAstro`. Built 21 pages; checked against originals (text, img/a/script/style/div counts, img src, a href, script src) — identical. Preview served pages and assets with HTTP 200.
- 2026-10-07: Pushed MEMORY.md + README.md commits to `origin/IELAstro`.
- 2026-10-07: Created `IELAstro` branch from `main`; created MEMORY.md; rewrote README.md.
- 2026-10-07: Created GitHub Release `v1.0.0` with downloadable ZIP (GitHub CLI not installed; used GitHub API with saved git credentials).
- 2026-10-07: Added CHANGELOG.md, committed, tagged `v1.0.0`, pushed `main` and tag.

## Notes / gotchas
- `gh` CLI is not installed. Large curl uploads may report a connection reset even if they succeeded — verify via the API.
- Supabase anon key is hard-coded in `public/supabase.js` (anon keys are public by design; row-level security is what protects the data).
- Not yet visually compared in a real browser (browser MCP was unavailable) — do a manual pass before merging.

## Open questions / next steps
- Visual check in a browser of key pages (home, About, Research, News, Contact, OpenAccount).
- Check the Vercel preview deployment of `IELAstro` before merging into `main`.
- Optional follow-ups: replace Tailwind CDN with a compiled Tailwind build; move inline page scripts and Supabase scripts into bundled modules; unify home nav with the shared Nav; optimise the large images (e.g. Big_News.png is 1.6 MB).
