# Yandex «малополезный контент» — hide tags (2026-10-09)

**Hosts:** `https://blog.themarfa.name/`, `https://en.blog.themarfa.name/`  
**Related:** `docs/seo/search-console-audit-2026-09-10.md` (FATAL `THREATS` since 2025-11-21)  
**Mode:** redacted (public repo)

## Goal

Stop advertising tag/author catalogs to Yandex without changing Ghost tag taxonomy. Clear path to resubmit the useless-content threat for review.

## Done in theme / API

| Change | Status |
| --- | --- |
| `robots.txt`: `Sitemap` = posts + pages only (no `sitemap.xml` index → no tags/authors child sitemaps) | In repo; deploy with theme |
| `robots.txt`: Yandex `Disallow: /tag/`, `/author/`, `*.md` | Already live; kept |
| Theme `noindex` on tag/author | Already live; kept |
| Yandex user-added sitemaps RU: `sitemap-posts.xml`, `sitemap-pages.xml` | API 201 (2026-10-09) |
| Yandex user-added sitemaps EN: `sitemap-posts.xml`, `sitemap-pages.xml` | API 201 (2026-10-09) |
| Removed EN user-added `sitemap.xml` index | API 204 (2026-10-09) |
| Theme deploy RU+EN | Actions `Deploy Theme` success; live `robots.txt` shows posts+pages only |
| Recrawl `robots.txt` (RU+EN) | API 202 (2026-10-09) — old ROBOTS_TXT `sitemap.xml` rows may linger until Yandex re-parses |
| Clean LLM index Action | Success: verification pages already draft; `#howto` tags + hreflang refresh |

After theme deploy, ROBOTS_TXT-sourced `sitemap.xml` entries should drop on the next Yandex robots re-read.

## Webmaster UI (done 2026-10-09 — user confirmed)

Prefix delete `/tag/`, `/author/` (RU+EN) and threat resubmit completed in UI.

### API check after UI (2026-10-09 late morning)

| Signal | Value |
| --- | --- |
| RU searchable | **5773** (was ~7722 in Sep audit) — drop consistent with tag deindex |
| EN searchable | 1310 |
| `THREATS` | still **PRESENT** (expected until Yandex finishes review, up to ~30d) |
| User-added sitemaps | posts + pages only (RU+EN) |
| Live robots Sitemap | posts + pages only |
| Stale `sitemap.xml` in API list | still `ROBOTS_TXT` source — lag until robots re-parse |
| New: `ERROR_IN_ROBOTS_TXT` | PRESENT RU+EN — watch; may clear after robots re-read |

## Content pass (CMS)

Posts live in Ghost, not this repo.

**Done via Action (2026-10-09):** `Clean LLM index` — RU verification page already draft; EN `gogetlinks-verification` already draft; recent how-tos tagged `#howto`; hreflang pairs refreshed.

**Still manual in Ghost Admin (top Yandex demand from Sep audit):**

1. `kak-poluchit-dostup-k-rutracker-s-android-biez-vpn` — refresh facts, drop dead workarounds.
2. R7 Office / spreadsheet how-tos — update screenshots/steps if stale.
3. Appdater / SuperShift / Twitch clusters — remove expired promos; keep unique how-to value.
4. Scan recent `[Скидка]` / promo posts — draft if offer is dead.

## Measure later

| KPI | Baseline (Sep 2026) | Success |
| --- | --- | --- |
| Yandex `THREATS` | PRESENT since 2025-11-21 | ABSENT |
| Yandex searchable (RU) | ~7722 | Drop as /tag/ leave index; posts remain |
| robots Sitemap | was `sitemap.xml` index | posts + pages only (live) |

Re-audit ~28 days after threat clearance + prefix deletes applied.
