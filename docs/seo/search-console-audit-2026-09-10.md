# SEO Re-Audit — 2026-09-10 (GSC + Yandex Webmaster)

**Previous audit:** `docs/seo/search-console-audit-2026-08-07.md`  
**Property (Google):** `sc-domain:themarfa.name`  
**Hosts (Yandex):** `https://blog.themarfa.name/`, `https://en.blog.themarfa.name/`, `https://themarfa.name/`  
**Search type (GSC):** web · **data_state:** all · **stable cutoff:** 2026-09-06 (lag 3 days)  
**Business goal:** restore qualified organic clicks to `blog.themarfa.name` / `en.blog.themarfa.name`  
**Report mode:** redacted (public GitHub repo). Exact query/URL inventories summarized; full evidence lives in GSC / Yandex Webmaster / local MCP session.

Repo used for theme-level notes: `Blogtheme`. Post content lives in Ghost CMS, not in this repository.

---

## Executive summary

**Google has not recovered.** Versus the 2026-08-07 audit, organic visibility is still near-zero and slightly worse on a rolling 90-day basis. The RU homepage remains the only clearly indexed surface in the inspected shortlist; former top posts are still **“Crawled — currently not indexed”** with **last crawl stuck in mid-April 2026**. EN sitemaps still report **0 indexed**. The prior audit’s decision rule (impressions still &lt;1% of Feb 2026 daily levels after a full stable 28d post-index-request window) is met → **escalate beyond theme/sitemap hygiene to quality / security / spam systems review**.

**Yandex is a different picture:** RU host still shows **~7.7k searchable pages**, SQI **80** (flat Mar→Sep), and real query demand in the current window (top-500 sample ≈ **6.7k shows / 139 clicks**, non-`geo` queries). That contrast supports the hypothesis that the Google collapse is **engine-specific demotion / indexing exclusion**, not a total site outage.

**Best next action:** in **Yandex Webmaster UI**, open and resolve the **FATAL `THREATS`** flag (PRESENT since **2025-11-21** on both RU and EN), then stop indexing of live **`*.md` markdown URLs** (they return HTTP 200 `text/markdown` and dominate recent “appeared in search” samples). In parallel, in **Google Search Console UI**, re-check Manual actions / Security issues / Page indexing volume for “Crawled - currently not indexed”, and run a CMS quality pass on historically high-demand posts.

### Three most important findings

1. **Google:** shortlist posts still not indexed; last crawl ≈ 2026-04-13/14; homepage indexed and recrawled **2026-09-09**. Current 90d: **7 clicks / 187 impressions** (prior audit’s then-current 90d: 18 / 495).
2. **Yandex:** FATAL **`THREATS`** PRESENT since **2025-11-21** (RU + EN) — must be checked in UI (API exposes only the diagnostic flag).
3. **New:** Ghost serves **`/{slug}.md`** as 200 markdown (llms-style). Yandex event samples: **89/100** recent samples were `.md` URLs “appeared in search”.

---

## Comparison with previous audit (2026-08-07)

| Area | 2026-08-07 | 2026-09-10 | Label |
| --- | --- | --- | --- |
| GSC current 90d clicks / imps | 18 / 495 (cutover 2026-08-04) | 7 / 187 (cutover 2026-09-06) | Declined |
| GSC current 28d clicks / imps | 1 / 53 | 3 / 53 | Unchanged (noise floor) |
| Homepage Google coverage | Submitted and indexed | Submitted and indexed (last crawl 2026-09-09) | Unchanged (good) |
| Former top posts coverage | Crawled — not indexed (Apr crawl) | Same status; **same Apr last-crawl dates** | Unchanged (bad) |
| EN sitemap indexed count | 0 | 0 | Unchanged (bad) |
| Obsolete HTTP/root sitemaps in GSC | Removed on 2026-08-07 | Still gone; only HTTPS submissions remain | Improved |
| Theme `robots.txt` EN sitemap line | Claimed added in repo | **Not present** in current `robots.txt` / live RU+EN robots (both declare only RU sitemap) | Declined / incomplete |
| Indexing API shortlist requests | Sent 2026-08-07 | No evidence of reindex in inspected URLs | Inconclusive → treat as failed recovery |
| Yandex searchable (RU) | Not in prior GSC-only report | **7722** searchable / **69** excluded; SQI 80 | New baseline |

---

## Performance snapshot (Google Search Console)

| Metric | Current 90d (2026-06-09 → 2026-09-06) | Previous 90d (2026-03-11 → 2026-06-08) | Change |
| --- | ---: | ---: | ---: |
| Clicks | 7 | 2 355 | −2 348 (−99.7%) |
| Impressions | 187 | 129 009 | −128 822 (−99.9%) |
| CTR | 3.74% | 1.83% | +1.91 pp (unstable; tiny sample) |
| Avg. position | 2.0 | 9.9 | — (not comparable after deindex) |

| Metric | Current 28d (2026-08-10 → 2026-09-06) | Previous 28d (2026-07-13 → 2026-08-09) | Change |
| --- | ---: | ---: | ---: |
| Clicks | 3 | 0 | +3 |
| Impressions | 53 | 42 | +11 |
| CTR | 5.66% | 0% | — |
| Avg. position | 2.7 | 2.6 | — |

YoY 90d (2025-06-09 → 2025-09-06): **24 704 clicks / 1 429 404 impressions**.

### Residual Google traffic (facts)

- **5 pages** with any impressions in current 90d; homepage ≈164 imps / 6 clicks; SMS autofill post ≈20 / 1; YouTube speed post ≈7 / 0; one EN Obsidian post ≈2 / 0.
- Queries are still dominated by `site:blog.themarfa.name` / `site:themarfa.name` plus a handful of SMS-related / odd operator strings.
- Device (current 90d): desktop 6 clicks / 163 imps; mobile 1 / 24.
- Country: residual clicks almost entirely RU (+1 BY); USA contributes impressions without clicks (likely `site:`).

---

## Performance snapshot (Yandex Webmaster)

Windows for popular queries: **2026-06-09 → 2026-09-06** (aligned to GSC stable cutoff). API returns up to 500 query rows (not a full census).

| Host | SQI | Searchable pages | Excluded | Top-N query sample | Sample shows | Sample clicks |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `blog.themarfa.name` | 80 | 7 722 | 69 | 500 queries | ≈6 698 | ≈139 |
| `en.blog.themarfa.name` | 80 | 1 346 | 1 | 95 queries | ≈158 | ≈1 |
| `themarfa.name` | 80 | 0 | 0 | 0 | — | — |

SQI history for RU: **80 every day** from 2026-03-01 through 2026-09-06 (190 points).

### Yandex diagnostics (PRESENT)

| Host | Severity | Code | Last update | Notes |
| --- | --- | --- | --- | --- |
| RU + EN | FATAL | `THREATS` | 2025-11-21 | **Open Webmaster UI** — API has no threat detail payload |
| RU | POSSIBLE_PROBLEM | `DOCUMENTS_MISSING_DESCRIPTION` | 2026-08-23 | Meta description gaps |
| EN | POSSIBLE_PROBLEM | `NO_METRIKA_COUNTER_BINDING` | 2026-09-07 | Metrika not bound |
| RU + EN | RECOMMENDATION | `NOT_IN_SPRAV` / `NO_REGIONS` | 2026-08-23 | Directory / region |

Recrawl quota (RU/EN): **750 / 750** remaining today.

### Yandex search-URL events (RU, Mar–Sep 2026)

Monthly sums from `search-urls/events/history`:

| Month | Appeared in search | Removed from search |
| --- | ---: | ---: |
| 2026-03 | 169 | 45 |
| 2026-04 | 53 | 532 |
| 2026-05 | 143 | 1 037 |
| 2026-06 | 87 | **5 676** |
| 2026-07 | 112 | 103 |
| 2026-08 | 1 130 | 288 |
| 2026-09 (partial) | 40 | 3 |

**Fact:** June 2026 shows a large Yandex removal spike (5 676), followed by an August “appeared” rebound (1 130). Searchable count remains high (~7.7k), so this is churn inside Yandex, not a Google-style near-total wipe. Recent event samples are heavily **`*.md` URLs** (see technical findings).

---

## Prioritized actions

| Priority | Finding and evidence | Action | Execution status | Impact | Effort | Confidence |
| --- | --- | --- | --- | --- | --- | --- |
| Critical | Yandex FATAL `THREATS` PRESENT since 2025-11-21 (RU+EN) | Open Yandex Webmaster → Security/Threats; remediate or dispute; verify flag clears | Needs input or access (Webmaster UI) | Unblock trust signals; possible cross-engine reputation | Medium | High |
| Critical | Google still sitewide ~0 organic; posts not indexed after Aug indexing requests | Treat as quality/spam/security systems issue: GSC Manual actions + Security + Page indexing census; CMS audit of thin/duplicate/AI/affiliate templates | Needs input or access (GSC UI + Ghost) | Restore Google eligibility | Large | High |
| Critical | `/{slug}.md` returns 200 `text/markdown`; Yandex samples ≈89% `.md` “appeared” | Stop indexing: `noindex` / robots Disallow for `*.md` / `llms.txt`, or 404/301 to HTML canonical; then recrawl | Needs input or access (Ghost plugin / hosting) | Clean Yandex index; reduce duplicate formats | Small–Medium | High |
| High | EN live `robots.txt` declares **RU** sitemap only; theme file same | Deploy host-correct Sitemap lines (RU + EN) on each Ghost instance | Implement now (theme) / Needs deploy | Clearer discovery signals | Small | Medium |
| High | EN GSC sitemaps: thousands submitted, **indexed: 0** | After RU triage, request indexing for EN homepage + top EN posts; fix EN sitemap registration in Yandex (currently lists RU sitemap URL) | Needs input or access | Recover EN organic | Medium | High |
| High | Shortlist last Google crawl still Apr 2026 despite Aug `URL_UPDATED` | Do not spam more Indexing API calls; refresh content + internal links from indexed homepage, then selective re-request | Needs input or access (CMS) | Re-enter Google index for demand pages | Medium | Medium |
| Medium | Yandex `DOCUMENTS_MISSING_DESCRIPTION` | Fill missing meta descriptions on affected Ghost posts | Needs input or access (CMS) | Snippet quality in Yandex | Medium | Medium |
| Medium | EN `NO_METRIKA_COUNTER_BINDING` | Bind Metrika to EN host in Webmaster | Needs input or access | Cleaner diagnostics | Small | High |
| Low | CTR/title experiments on Google-demoted URLs | Defer until Google indexes again | Measure later | N/A until indexed | — | High |

---

## Search opportunity map

### Google (current 90d)

Almost no non-`site:` demand. Residual SMS-related impressions attach to a URL that inspects as **not indexed**. **Do not** create new thin keyword pages while Google broadly excludes URLs.

| Intent cluster | Current GSC signal | Status | Recommended path |
| --- | --- | --- | --- |
| Navigational `site:` operators | Majority of residual imps | Not business traffic | Monitor only |
| SMS autofill Android | Tiny residual imps/clicks | Not indexed (Apr crawl) | Improve existing page after eligibility; internal link from homepage |
| Former #1 Rutracker / OpenCore / screen-mirroring | Strong in **previous** 90d; ~0 now | Not indexed | Quality refresh + reindex only after threats/quality review |

### Yandex (current window, redacted)

| Intent cluster (examples) | Sample demand | Notes | Recommended path |
| --- | --- | --- | --- |
| Rutracker Android access | High shows + clicks in sample | Still ranks in Yandex | Improve existing page; keep canonical HTML (not `.md`) |
| R7 Office / spreadsheet how-tos | High shows, low clicks | Positions ~9 | Improve snippets/titles on existing pages |
| Appdater / SuperShift / Twitch / film-clothes | Mid shows with some clicks | Active Yandex demand | Improve existing pages |
| EN Xeovo VPN cluster | Low–mid shows, ~0 clicks | EN host weak | Improve existing EN page after EN indexing hygiene |

---

## Technical and indexing findings

### Google URL Inspection (re-check 2026-09-10)

| URL role | Coverage | Robots | Fetch | Last crawled | Canonicals |
| --- | --- | --- | --- | --- | --- |
| `https://blog.themarfa.name/` | Submitted and indexed | ALLOWED | SUCCESSFUL | 2026-09-09 | Match |
| SMS autofill post | Crawled — currently not indexed | ALLOWED | SUCCESSFUL | 2026-04-14 | Match |
| Rutracker Android post | Crawled — currently not indexed | ALLOWED | SUCCESSFUL | 2026-04-14 | Match |
| OpenCore post | Crawled — currently not indexed | ALLOWED | SUCCESSFUL | 2026-04-13 | Match |
| Screen-mirroring apps post | Crawled — currently not indexed | ALLOWED | SUCCESSFUL | 2026-04-13 | Match |
| `https://en.blog.themarfa.name/` | Crawled — currently not indexed | ALLOWED | SUCCESSFUL | 2026-04-02 | Match |

Live checks (2026-09-10): RU/EN homes HTTP 200; `themarfa.name` → `blog.themarfa.name`; sitemaps present for RU and EN; SMS post HTTP 200.

### Google sitemaps

| Sitemap | Status | Indexed signal |
| --- | --- | --- |
| `https://blog.themarfa.name/sitemap.xml` | Valid; last download 2026-09-08 | `contents: []` (empty counts in API — investigate in GSC UI) |
| `https://en.blog.themarfa.name/sitemap.xml` | Valid | web submitted 2938 / **indexed 0** |
| EN child sitemaps | Valid / one warning | indexed 0 across sampled children |
| Legacy `http://` / root sitemaps | Absent | Hygiene from 2026-08-07 held |

### Markdown / llms URLs (new)

- `https://blog.themarfa.name/{slug}.md` → **200**, `Content-Type: text/markdown`, body references `llms.txt`.
- HTML canonical `/{slug}/` also 200.
- Hypothesis: an llms / markdown export feature is creating a second indexable representation. Yandex is already ingesting it. Google sample inspections were on HTML URLs only.

### Theme robots

Current `robots.txt` (repo + live RU + live EN) lists only:

`Sitemap: https://blog.themarfa.name/sitemap.xml`

EN host therefore advertises the RU sitemap. Previous audit’s “add EN sitemap line” is **not** in the current tree.

---

## Implemented now

| Change | Notes |
| --- | --- |
| Re-audit (2026-09-10 morning) | Read-only GSC MCP + Yandex API + live HTTP checks. |
| `robots.txt`: both RU+EN HTTPS sitemaps; Disallow `*.md`, `/llms.txt`, `/llms-full.txt` (incl. Yandex blocks) | In repo 2026-09-10; **needs theme deploy** (git push → Actions) for live RU/EN. |
| Yandex EN host: user-added `https://en.blog.themarfa.name/sitemap.xml` | API 201 on 2026-09-10. Old RU sitemap entry remains until robots re-read after deploy. |

---

## Needs input or access

1. **Yandex Webmaster UI:** open FATAL `THREATS` details for RU and EN; remediate or mark fixed; confirm clearance.
2. **Google Search Console UI:** Manual actions, Security issues, Page indexing filters; inspect why RU sitemap index shows empty `contents` in API.
3. **Ghost / hosting:** identify what serves `*.md` / `llms.txt`; disable public indexability without breaking intentional LLM exports if you still want them non-indexed.
4. **Ghost CMS content:** quality pass on historically high-click posts (unique value, outdated affiliates, thin/AI/duplicate).
5. **Theme deploy:** host-correct `Sitemap:` lines for RU and EN (or dual declaration) once you approve the edit.
6. **Confirm** any site-wide change around **2025-11-21** (Yandex threats) and **2026-03-19/20** (Google cliff).

---

## Measure later

| KPI | Segment | Baseline | Evaluation |
| --- | --- | --- | --- |
| GSC impressions + indexed shortlist | Property + Aug shortlist | Current 28d: 53 imps; posts not indexed | Next stable 28d after threats + `.md` fix + content refresh |
| Non-`site:` GSC queries | Query report | Almost none | Success = organic non-site queries reappear |
| EN GSC sitemap indexed count | `en.blog` sitemaps | 0 | Any sustained &gt; 0 |
| Yandex `THREATS` state | Diagnostics | PRESENT | Must become ABSENT |
| Yandex `.md` share of appeared samples | Event samples | ≈89/100 | Should fall near 0 after block |

Decision rule (carry-forward, updated): if after threats remediation + `.md` cleanup + one full stable 28d window Google impressions remain &lt;1% of Feb 2026 daily levels, continue CMS-level quality/spam review rather than more Indexing API or title tests.

---

## SEO experiment backlog

Defer Google CTR experiments until indexing recovers.

| Priority and experiment | Page / segment | Baseline | Proposed change | Expected improvement | Re-run audit | Decision rule |
| --- | --- | --- | --- | --- | --- | --- |
| 1. Clear Yandex THREATS | RU+EN hosts | FATAL PRESENT since 2025-11-21 | Remediate per Webmaster UI | Flag ABSENT; watch Yandex shows | 14d after clear | Flag ABSENT → proceed; else escalate hosting |
| 2. Deindex `*.md` | Sitewide markdown URLs | Dominate Yandex appeared samples | Robots/noindex/404 + recrawl | `.md` leave search samples | 28d | HTML URLs keep demand; `.md` ≈0 |
| 3. Reindex Google shortlist after quality refresh | Top historical RU posts | Not indexed; Apr last crawl | Content refresh + internal links + selective request | Coverage → indexed; imps return | 28d post-request | Indexed + rising non-site imps |
| 4. EN robots + sitemap hygiene | EN host | Wrong sitemap in robots/Yandex | Point to EN HTTPS sitemap only (plus optional RU) | Cleaner EN discovery | Next weekly history | EN sitemap registered correctly |
| 5. SMS residual recovery | SMS autofill post | Only residual Google cluster | Unique how-to update + homepage link | Non-site queries when indexed | 28d post-publish | Non-`site:` imps on that intent |

---

## Measurement plan

- Primary KPI (Google): **non-navigational organic clicks** and **impressions** (exclude `site:`).
- Primary KPI (Yandex): query shows/clicks on HTML URLs; `THREATS` ABSENT; searchable count stable.
- Secondary: URL Inspection coverage for the shortlist; EN sitemap indexed counts.
- Windows: stable 28d vs previous 28d; keep YoY when seasonality matters; end ≥3 days before run date.

---

## Data limitations

- Search Analytics omits some queries/rows; pagination coverage ≠ complete dataset.
- URL Inspection samples are not a full index census.
- SearchConsole.ai `batch_url_inspection` returned a Heroku application error during this run; single-URL inspection succeeded.
- Yandex popular-queries API capped at 500 rows; `queries_prev` for Mar–Jun returned 0 rows (API/date quirk) — do not treat as zero historical demand.
- Yandex `THREATS` has no detail payload via the endpoints tried; UI required.
- GSC clicks ≠ analytics sessions; Yandex shows ≠ GSC impressions.
- CTR/position misleading while Google broadly excludes URLs.
- Public-repo redaction: exact query lists and full URL inventories intentionally omitted.

---

## Saved report

Path: `docs/seo/search-console-audit-2026-09-10.md` (this file). **Redacted.**  
Previous audit path for next run: update `docs/seo/search-console-re-audit.md` → this file when that brief is created.

---

## Follow-up re-audit (proposed — not created)

- **Condition:** first run **28 days after** Yandex `THREATS` clearance **and** `.md` indexability fix are deployed (record that date).
- **Cadence:** one-shot then monthly until Google impressions leave the noise floor.
- **Timezone:** Europe/Moscow.
- **Working directory:** `Blogtheme`.
- **Task brief:** offer to create `docs/seo/search-console-re-audit.md` with `Previous audit` = this file. **Ask before creating the file or any cron/automation.**

## Weekly historical snapshots (proposed — not created)

- **Propose:** Mondays 10:00 Europe/Moscow.
- **Task brief:** `docs/seo/search-console-weekly-history.md`.
- **Snapshots:** `docs/seo/search-console-history/search-console-weekly-YYYY-MM-DD.md`.
- Include both GSC baseline totals and Yandex summary (SQI, searchable, THREATS state, top-level shows/clicks).
- **Ask before creating the brief, schedule, or first snapshot.**

---

## Appendix — analysis windows used

- GSC: `get_seo_audit_baseline` + `get_advanced_search_analytics` (page/query/device/country) + `list_sitemaps_enhanced` / `get_sitemap_details` + `inspect_url_enhanced`
- Yandex Webmaster API v4: `/user`, `/hosts`, `/summary`, `/diagnostics`, `/sqi-history`, `/search-queries/popular`, `/sitemaps`, `/indexing/samples`, `/search-urls/events/*`, `/recrawl/quota`
- Live HTTP: homes, robots, sitemaps, sample `.md` vs HTML
- Playbook: `searchconsole://guides/seo-analysis-playbook`
