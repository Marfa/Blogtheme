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

After theme deploy, ROBOTS_TXT-sourced `sitemap.xml` entries should drop on the next Yandex robots re-read.

## Must finish in Yandex Webmaster UI (no API)

URL deletion and threat resubmit are **UI-only**.

### 1. Remove pages from search (prefix)

For **RU** and **EN** hosts → Tools → Remove pages from search → **By prefix**:

- `https://blog.themarfa.name/tag/`
- `https://blog.themarfa.name/author/`
- `https://en.blog.themarfa.name/tag/`
- `https://en.blog.themarfa.name/author/`

Optional (markdown duplicates):

- `https://blog.themarfa.name/` … pages matching `*.md` — submit top samples or wait for Disallow; Disallow `/*.md` already in robots for Yandex.

Removal is accepted only while Disallow remains (already set).

### 2. Confirm sitemaps

Per host, keep only:

- `…/sitemap-posts.xml`
- `…/sitemap-pages.xml`

Remove any remaining `…/sitemap.xml` index if still listed after robots refresh.

### 3. Resubmit threat

Security / Threats → useless content → mark fixed → comment (RU example):

> Закрыли индексацию /tag/ и /author/ (robots Disallow + noindex). В robots и Вебмастере заявлены только sitemap-posts.xml и sitemap-pages.xml — каталог тегов/авторов больше не рекламируется. Отправлены на удаление префиксы /tag/ и /author/. Markdown *.md закрыт Disallow для Yandex. Посты с мёртвыми офферами/заглушками выведены из публикации или обновлены.

Attach: screenshot of robots Sitemap lines + prefix-delete queue.

## Content pass (CMS)

Posts live in Ghost, not this repo. Minimal pass:

1. Run GitHub Action **Clean LLM index** (drafts verification pages already listed in `scripts/clean-llms-index.js`).
2. Manually refresh top Yandex-demand posts (from Sep audit): Rutracker Android, R7 Office how-tos, Appdater / SuperShift / Twitch clusters — drop dead offers, keep unique how-to value.
3. Draft or delete obvious stubs / expired promo posts.

## Measure later

| KPI | Baseline (Sep 2026) | Success |
| --- | --- | --- |
| Yandex `THREATS` | PRESENT since 2025-11-21 | ABSENT |
| Yandex searchable (RU) | ~7722 | Drop as /tag/ leave index; posts remain |
| robots Sitemap | was `sitemap.xml` index | posts + pages only (live) |

Re-audit ~28 days after threat clearance + prefix deletes applied.
