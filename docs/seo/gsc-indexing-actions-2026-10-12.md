# GSC indexing actions — 2026-10-12

**Property:** `sc-domain:themarfa.name`  
**Mode:** redacted (public repo)  
**Related:** `docs/seo/search-console-audit-2026-09-10.md`

## Direct GSC UI links

Open while logged into the Google account that owns the property:

| Report | Link |
| --- | --- |
| Manual actions | https://search.google.com/search-console/manual-actions?resource_id=sc-domain%3Athemarfa.name |
| Security issues | https://search.google.com/search-console/security-issues?resource_id=sc-domain%3Athemarfa.name |
| Page indexing | https://search.google.com/search-console/index?resource_id=sc-domain%3Athemarfa.name |
| Sitemaps | https://search.google.com/search-console/sitemaps?resource_id=sc-domain%3Athemarfa.name |
| Removals | https://search.google.com/search-console/removals?resource_id=sc-domain%3Athemarfa.name |
| URL Inspection | https://search.google.com/search-console/inspect?resource_id=sc-domain%3Athemarfa.name |

---

## 1) Content crawled, not selected (theme + CMS)

### Theme (this repo — deploy)

- Homepage: removed «Explore topics» tag cards (`/tag/` is `noindex` + `Disallow`). Replaced with **Featured** posts (indexable HTML).
- `related-posts`: fallback to recent posts when same-tag set is empty.
- Breadcrumb JSON-LD: no longer emits `/tag/` URLs (blocked for Googlebot).

### Ghost Admin (manual quality pass — posts not in this repo)

Prioritize live HTML posts that still match demand (Yandex / historical GSC), not deleted slugs:

1. Mark **Featured** on 6–12 strongest evergreen how-tos (RU + EN) so they appear on the indexed homepage.
2. Refresh stale steps/screenshots; drop dead affiliate/`[Скидка]` when offer is gone.
3. From homepage after deploy: confirm Featured block links only to `200` HTML posts.
4. Do **not** mass-request indexing until Manual actions / Security are clear and Featured links are live.

**Validation:** stable 28d non-`site:` impressions; shortlist Coverage → «Submitted and indexed».

---

## 2) EN = 0 indexed

| Fact (2026-10-12) | Evidence |
| --- | --- |
| EN sitemap index | ~2938 submitted / **0** indexed |
| `en.blog` homepage | Crawled 2026-10-12, not indexed |
| Sample EN post | URL unknown / not selected |

### Do in GSC (after sitemap sync below)

1. URL Inspection → `https://en.blog.themarfa.name/` → Request indexing (once).
2. After Featured EN posts exist: request indexing for **at most 3–5** strong EN how-tos (not the whole sitemap).
3. Do not create new thin EN pages while indexed count stays 0.

---

## 3) GSC sitemaps ↔ robots sync

Live `robots.txt` already advertises **posts + pages only** (RU + EN). Align GSC submissions:

### Add (exact URLs — paste into GSC «Добавить новую карту сайта»)

UI: https://search.google.com/search-console/sitemaps?resource_id=sc-domain%3Athemarfa.name

```text
https://blog.themarfa.name/sitemap-posts.xml
https://blog.themarfa.name/sitemap-pages.xml
https://en.blog.themarfa.name/sitemap-posts.xml
https://en.blog.themarfa.name/sitemap-pages.xml
```

(EN posts/pages may already exist from 2019 — leave them; re-add only if missing.)

### Remove (if still listed)

```text
https://blog.themarfa.name/sitemap.xml
https://en.blog.themarfa.name/sitemap.xml
https://en.blog.themarfa.name/sitemap-tags.xml
https://en.blog.themarfa.name/sitemap-authors.xml
```

(`sitemap.xml` index pulls tags/authors — avoid.)

---

## 4) `*.md` / llms

**Already live** in `robots.txt` for Googlebot / Bing / Yandex / `*`: `Disallow` on `/*.md$`, `/llms.txt`, `/llms-full.txt`. AI bots keep `Allow` by design.

HTML remains the canonical for search. No theme deploy required for this item unless robots regresses.

Optional: Removals → temporary remove for any `.md` URL still in results (prefix not required if volume is low).

---

## 5) Former demand URLs permanently deleted

User decision: **permanent delete** — keep **404**, no 301.

| Check (2026-10-12) | Result |
| --- | --- |
| Example deleted slugs (Rutracker / SMS / OpenCore / screen-mirroring) | HTTP **404** |
| In `sitemap-posts.xml` | **Absent** (good) |

Optional GSC Removals for any deleted URL that still appears in Search (temporary clear while 404 sticks). Do not restore those posts for SEO.

---

## Execution status

| Item | Status |
| --- | --- |
| GSC Manual / Security / Indexing UI links | Listed above — **needs your click** |
| Theme: homepage Featured + related fallback + breadcrumb | **Done in repo** — needs theme deploy |
| Ghost Featured + content refresh | **Needs Ghost Admin** |
| EN selective reindex | After sitemap sync + Featured |
| GSC sitemap add/remove | **Needs GSC UI** (MCP read-only) |
| `*.md` / llms robots | **Done / live** |
| Permanent 404 demand URLs | **Accepted** — out of sitemap |

## Measure later

| KPI | Baseline | Success |
| --- | --- | --- |
| GSC non-`site:` impressions (28d) | ~noise floor | Sustained rise |
| EN sitemap indexed count | 0 | > 0 sustained |
| Homepage outbound links | tags | Featured HTML posts |
| Deleted demand URLs | 404 | Stay 404; not in sitemap |
