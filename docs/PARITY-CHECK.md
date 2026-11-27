# Parity check: new site vs iel.net.pk

Checked 28 November 2026 on the local build (`nextjs-rebuild`), against the plan's feature list (`docs/NEXTJS-REBUILD-PLAN.md` §5) and live data from IEL's Supabase. To be repeated on the Vercel preview once it exists (IEL item E1).

| # | Feature | Result | How it was checked |
|---|---|---|---|
| 1 | Header: dropdowns (hover/click/keyboard, Escape), ☰ below 1280px, current section, utility bar | Pass | 5 dropdowns; "About" highlighted on /about; mobile menu present; checked in the browser at 1366px and 375px |
| 2 | Footer: all page links, complaint-procedure pop-up and PDF | Pass | 29 links; complaints pop-up with Download / View, PSX and SECP portals; PDF loads |
| 3 | Homepage enquiry form → ielapis contactus | Pass (partial) | Invalid input → 422 with field errors; bot field → silently accepted. **Real delivery not tested** (sends to IEL's inbox; IEL item D5) |
| 4 | Contact page form → same endpoint | Pass (partial) | As above |
| 5 | Open Account form → ielapis free-account | Pass (partial) | As above |
| 6 | News: 20 latest, newest first, PDF links | Pass | Order matches Supabase (8 items exist today) |
| 7 | Research: sector tabs A–Z, first selected, search across sectors clears the tab, view and download (`?download=`) | Pass | 14 tabs in database order; "market" → 44 results across sectors, no tab selected; download links use `?download=` |
| 8 | Learn: article list, newest first | Pass | Matches Supabase (1 article today) |
| 9 | Article page `/learn/[id]` | Pass | Article renders (sanitised HTML); unknown id → 404 |
| 10 | Financial statements: 5 tabs, financial-year groups, site + Supabase merged | Pass | 95 documents = 83 kept on the site + 12 from Supabase; groups "FY 2026-27" … |
| 11 | Static PDFs (Regulatory, Investor education, reports, forms, statements, complaints) | Pass | 107 PDF links checked, none broken |
| 12 | Book a consultation (HubSpot) | Pass | Link edited in Header menu (the unused Site settings field is now hidden). URL still IEL item D2 |
| 13 | Clean URLs; old `.html` addresses not kept | Pass | 20 new addresses return 200; `/About.html` → 404 (as decided) |
| 14 | Google site verification file | Pass | Same file, same path |
| 15 | Security headers | Pass | CSP (week 4), X-Frame-Options, nosniff, Referrer-Policy, HSTS, Permissions-Policy |
| 16 | 375px layout, no horizontal scroll | Pass | All 18 pages measured at 375px in week 2; no layout changes since |

## Content parity
Seeded text was compared word for word with iel.net.pk on 27 November 2026 (legal, Regulatory, team, partners, investor PDFs, statements, contact details). Differences are the approved design's own copy and the open items in `docs/IEL-Website-Content-and-Decisions-Request.docx`.

## Still open
- Real form submissions (IEL item D5).
- Repeat this check on the Vercel preview (IEL item E1).
