# Search Console SEO Audit — 2026-08-07

**Property:** `sc-domain:themarfa.name`  
**Search type:** web · **data_state:** all · **stable cutoff:** 2026-08-04 (lag 3 days)  
**Business goal:** restore qualified organic clicks to `blog.themarfa.name` / `en.blog.themarfa.name`  
**Report mode:** redacted (public GitHub repo). Query strings and full URL lists are summarized; exact evidence lives in Search Console / local MCP session.

Repo used for theme-level changes: `Blogtheme` (Ghost theme for the site). Post content lives in Ghost CMS, not in this repository.

---

## Executive summary

Organic search for `themarfa.name` collapsed between **2026-03-19 and 2026-03-20** (≈150–300 clicks/day → ≈20), then fell again around **2026-04-14/15** to near-zero. Current 90-day totals are **18 clicks / 495 impressions** versus **11 208 clicks / 661 637 impressions** in the prior 90 days (−99.8% / −99.9%).

This is **not** a title/snippet CTR problem. Remaining impressions are dominated by `site:` operator queries; formerly top posts inspect as **“Crawled — currently not indexed”** while the homepage remains indexed. English sitemaps report **0 indexed** URLs.

**Best next action:** in Google Search Console, open **Manual actions**, **Security issues**, and **Page indexing**; clean obsolete/erroring sitemap submissions; then request indexing for a shortlist of formerly high-demand canonical posts and monitor recovery. Theme-only CTR tweaks will not restore traffic while pages stay out of the index.

### Three most important findings

1. Sitewide impression/click cliff on **2026-03-20**, second floor on **2026-04-14/15**.
2. Sample of former top posts: crawlable, allowed by robots, successful fetch, but **not indexed**; last crawl ≈ mid-April 2026.
3. Submitted sitemap inventory is messy: live HTTPS sitemaps exist, but GSC still holds old `http://` / root-domain entries with errors, and `en.blog` child sitemaps show **indexed: 0**.

---

## Performance snapshot

| Metric | Current 90d (2026-05-07 → 2026-08-04) | Previous 90d (2026-02-06 → 2026-05-06) | Change |
| --- | ---: | ---: | ---: |
| Clicks | 18 | 11 208 | −11 190 (−99.8%) |
| Impressions | 495 | 661 637 | −661 142 (−99.9%) |
| CTR | 3.64% | 1.69% | +1.95 pp (unstable; tiny sample) |
| Avg. position | 1.5 | 9.9 | — (not comparable after deindex) |

| Metric | Current 28d (2026-07-08 → 2026-08-04) | Previous 28d (2026-06-10 → 2026-07-07) | Change |
| --- | ---: | ---: | ---: |
| Clicks | 1 | 2 | −1 |
| Impressions | 53 | 67 | −14 |
| CTR | 1.89% | 2.99% | −1.1 pp |
| Avg. position | 2.4 | 1.3 | — |

YoY 90d (2025-05-07 → 2025-08-04): **15 397 clicks / 897 786 impressions** — confirms the property historically had substantial organic demand.

### Collapse timing (daily, previous window)

| Date | Clicks | Impressions | Notes |
| --- | ---: | ---: | --- |
| 2026-03-19 | 155 | 10 553 | Last “normal” day in sample |
| 2026-03-20 | 21 | 1 334 | First cliff |
| 2026-04-14 | 13 | 411 | Pre–second cliff |
| 2026-04-15 | 2 | 84 | Second cliff |
| 2026-04-22+ | ≈0 | ≈10–25/day | Residual / navigational |

### Current residual traffic (facts)

- **12 pages** with any impressions in current 90d; one SMS-autofill post ≈290 impressions / 13 clicks; homepage ≈104 impressions / 3 clicks.
- Queries with residual impressions are mostly `site:blog.themarfa.name`, `site:themarfa.name`, `site:en.blog.themarfa.name`, plus a handful of SMS-related terms.
- Device split (current 90d): mobile 12 clicks / 202 imps; desktop 6 / 287.
- Country (top): mostly RU/KZ/BY/UA — residual CIS audience.

---

## Prioritized actions

| Priority | Finding and evidence | Action | Execution status | Impact | Effort | Confidence |
| --- | --- | --- | --- | --- | --- | --- |
| Critical | Sitewide −99.9% impressions after 2026-03-20; former tops “Crawled — currently not indexed” | Check GSC Manual actions + Security issues; review Page indexing for “Crawled - currently not indexed” volume | Needs input or access (GSC UI) | Restore organic eligibility | Small | High |
| Critical | `en.blog` sitemaps: thousands submitted, **0 indexed** | Treat EN publication as separately demoted; inspect indexing + request indexing for EN homepage + top EN posts after RU triage | Needs input or access | Recover EN organic | Medium | High |
| High | GSC still lists erroring `http://themarfa.name/sitemap*.xml` (last download 2021) and mixed `http://blog…` submissions | Remove obsolete sitemap URLs in GSC; keep/re-submit only `https://blog.themarfa.name/sitemap.xml` and `https://en.blog.themarfa.name/sitemap.xml` | Needs input or access (GSC mutation) | Cleaner crawl/index signals | Small | High |
| High | Homepage indexed; former #1/#OpenCore posts crawled Apr 13–14, not indexed | Request indexing for a shortlist of formerly high-click canonical posts (see map); do not bulk-spam | Needs input or access | Re-enter index for demand pages | Small | Medium |
| High | Collapse coincides with crawl dates on demoted URLs | Hypothesis: quality / spam / algorithmic ranking systems update — audit thin/duplicate/AI/affiliate-heavy templates in Ghost (CMS), not theme titles | Needs input or access (CMS content) | Address root quality signal | Large | Medium |
| Medium | Theme `robots.txt` listed only RU sitemap | Added EN HTTPS sitemap line in theme `robots.txt` | Implement now (done in repo; needs theme deploy) | Helps discovery of EN sitemap | Small | Medium |
| Medium | Residual SMS post still gets impressions while inspect says not indexed | Re-inspect after recrawl; if still excluded, refresh unique content + internal links from indexed homepage | Needs input or access | Protect last residual demand | Medium | Medium |
| Low | CTR/title experiments on demoted URLs | Defer until pages are indexed again | Measure later | N/A until indexed | — | High |

---

## Search opportunity map

Pre-collapse demand (previous 90d page sample ≈4075 URLs). Paths only (redacted):

| Intent cluster (examples) | Prev 90d demand signal | Current status | Recommended path |
| --- | --- | --- | --- |
| Rutracker Android access guide | Former #1 page ≈360 clicks / 22k imps | Inspect: crawled, not indexed; last crawl 2026-04-14 | Improve existing page after reindex eligibility; then request indexing |
| OpenCore Legacy Patcher | Strong query+page demand | Inspect: crawled, not indexed; last crawl 2026-04-13 | Improve existing page + request indexing |
| SMS autofill Android | Survived with residual imps; prev strong | Residual clicks; inspect not indexed | Improve existing page; prioritize recrawl |
| Screen-mirroring apps, Telegram clients, Steam card farm, etc. | Large prev click share | No material current imps | Monitor after indexing recovery; improve only if reindexed |
| EN Obsidian / macOS posts | Small residual on EN host | EN host largely unindexed per sitemaps | Improve existing EN pages after EN indexing triage |

**Do not** create new thin keyword pages while the host is broadly deindexed.

---

## Technical and indexing findings

### URL Inspection (sample)

| URL role | Coverage | Robots | Fetch | Last crawled | Canonicals |
| --- | --- | --- | --- | --- | --- |
| `https://blog.themarfa.name/` | Submitted and indexed | ALLOWED | SUCCESSFUL | 2026-08-06 | Match HTTPS homepage |
| SMS autofill post | Crawled — currently not indexed | ALLOWED | SUCCESSFUL | 2026-04-14 | Match |
| Rutracker Android post | Crawled — currently not indexed | ALLOWED | SUCCESSFUL | 2026-04-14 | Match |
| OpenCore post | Crawled — currently not indexed | ALLOWED | SUCCESSFUL | 2026-04-13 | Match |
| `https://en.blog.themarfa.name/` | Crawled — currently not indexed | ALLOWED | SUCCESSFUL | 2026-04-02 | Match |

Live checks (2026-08-07): site returns HTTP 200; `themarfa.name` → `blog.themarfa.name` 301; live robots allows crawl and points at HTTPS sitemap; live sitemap indexes are present for RU and EN.

### Sitemaps in GSC (summary)

| Group | Indexed signal | Status notes |
| --- | --- | --- |
| `https://en.blog.themarfa.name/sitemap*.xml` | **0** indexed across posts/pages/tags sampled | Has warnings; still downloaded in 2026 |
| `http://blog.themarfa.name/sitemap*.xml` | Some indexed counts remain (e.g. posts ~961) | Mixed HTTP submissions; prefer HTTPS |
| `http://themarfa.name/sitemap*.xml` | Empty / errors | Last downloaded 2021 — remove |

Hypothesis (labeled): Google still crawls selectively but excludes most URLs from the serving index (“soft demotion” / quality systems), not a robots/`noindex` meta block. Theme `<noindex>` wrappers around ads are Yandex-style ad markup, not Google meta robots.

---

## Implemented now

| Change | File / system | Notes |
| --- | --- | --- |
| Declare both RU and EN HTTPS sitemaps in theme robots | `robots.txt` | Needs **git push** to auto-deploy RU theme. EN theme is admin-only — upload robots there separately if needed. |
| Submit HTTPS sitemaps; remove obsolete HTTP/root sitemaps | GSC API 2026-08-07 | After: `https://blog…/sitemap.xml`, `https://en.blog…/sitemap.xml` (+ EN child sitemaps). Removed `http://themarfa.name/*` and `http://blog.themarfa.name/*`. |
| Indexing API `URL_UPDATED` for shortlist | GSC Indexing API 2026-08-07 | 11 URLs requested (homepage RU skipped — already indexed). Not a guarantee of reindex. |
| Ghost Admin API verified | `test1574.ghost.io` (RU), `enaip.ghost.io` (EN) | Custom-domain `/ghost/api` redirects and drops `Authorization`. Integration **cannot** upload themes. **No posts deleted.** |

Shortlist posts checked via Ghost: published, have meta descriptions / excerpts and feature images. No destructive CMS edits applied.

---

## Needs input or access

1. **GSC UI:** Manual actions, Security issues, Page indexing filters, remove obsolete sitemaps, re-submit HTTPS sitemaps, request indexing for shortlist.
2. **Ghost CMS:** content quality pass on top historical posts (unique value, outdated affiliate blocks, thin translations).
3. **Confirm** whether any site-wide change shipped around **2026-03-19/20** (Cloudflare, theme, ads, redirects, Soft 404, AI mass publish). Correlation only until confirmed.
4. **Theme deploy** of updated `robots.txt`.

---

## Measure later

| KPI | Segment | Baseline window | Evaluation |
| --- | --- | --- | --- |
| Impressions + indexed URL count | Property + top 20 historical paths | 2026-07-08 → 2026-08-04 (near-zero) | Next stable 28d after indexing requests |
| Clicks to non-`site:` queries | Query report excluding `site:` | Current residual | Same 28d; success = non-site organic queries reappear |
| EN indexed count in sitemap report | `en.blog` sitemaps | 0 indexed | Any sustained indexed > 0 |

Decision rule: if after one full stable 28d post-index-request window impressions remain &lt;1% of Feb 2026 daily levels, escalate to deeper quality/spam review rather than more title tests.

---

## SEO experiment backlog

Defer CTR experiments until indexing recovers. Candidate backlog once pages are indexed:

| Priority and experiment | Page / segment | Baseline (prev demand) | Proposed change | Expected improvement | Re-run audit | Decision rule |
| --- | --- | --- | --- | --- | --- | --- |
| 1. Reindex shortlist | Top 10 prev-click RU posts | High prev clicks; now not indexed | Request indexing only; no content rewrite yet | Indexed status + impressions return | 28d after requests | Indexed + rising imps → proceed to content; else quality audit |
| 2. Content refresh SMS post | Residual RU post | Only residual cluster with clicks | Unique how-to update + internal links from homepage | Clicks/CTR when indexed | 28d post-publish | Non-`site:` queries regain imps |
| 3. EN homepage recovery | `en.blog` home | Sitemap indexed 0 | Indexing + unique EN value proposition | EN impressions leave site: only | 28d | EN non-site queries appear |
| 4. Sitemap hygiene | Property | Erroring root sitemaps | Remove obsolete submissions | Cleaner GSC sitemap report | Next weekly history | No erroring legacy sitemaps |
| 5. Quality systems review | Sitewide | Cliff 2026-03-20 | CMS audit of thin/duplicate/AI pages | Sitewide impression recovery | 6–8 weeks | Daily imps leave double-digit floor |

---

## Measurement plan

- Primary KPI: **non-navigational organic clicks** and **impressions** (exclude `site:` queries).
- Secondary: URL Inspection coverage for the shortlist; sitemap indexed counts for RU posts and EN posts.
- Windows: stable 28d vs previous 28d; keep YoY when seasonality matters.
- End windows ≥3 days before run date (`first_incomplete_date` handling).

---

## Data limitations

- Search Analytics omits some queries/rows; pagination coverage ≠ complete dataset.
- URL Inspection samples are not a full index census.
- SearchConsole.ai URL batch inspection briefly returned Heroku application errors during this run; single-URL inspection succeeded.
- GSC clicks ≠ analytics sessions.
- CTR and position are misleading while most pages are out of the index.
- Public-repo redaction: exact query lists and full URL inventories intentionally omitted.

---

## Saved report

Path: `docs/seo/search-console-audit-2026-08-07.md` (this file). **Redacted.**

---

## Follow-up re-audit (proposed — not created)

- **Condition:** first run **28 days after** theme deploy + GSC sitemap cleanup + indexing shortlist requests (record that date when done).
- **Cadence:** one-shot then optional monthly until impressions stabilize.
- **Timezone:** Europe/Moscow.
- **Working directory:** this repo (`Blogtheme`) or the CMS export workspace you prefer.
- **Task brief:** offer to create `docs/seo/search-console-re-audit.md` with `Previous audit` = this file. **Ask before creating the file or any cron/automation.**

## Weekly historical snapshots (proposed — not created)

- **Propose:** Mondays 10:00 Europe/Moscow.
- **Task brief:** `docs/seo/search-console-weekly-history.md`.
- **Snapshots:** `docs/seo/search-console-history/search-console-weekly-YYYY-MM-DD.md` (stable 7d end date).
- Markdown snapshots are summaries, not a full GSC export. **Ask before creating the brief, schedule, or first snapshot.**

---

## Appendix — analysis windows used

- Current 90 / previous 90 / YoY 90 / current 28 / previous 28 from `get_seo_audit_baseline`
- Page + query samples via `get_advanced_search_analytics` (`fetch_all` where used)
- Sitemaps via `list_sitemaps_enhanced`
- Playbook: `searchconsole://guides/seo-analysis-playbook`
