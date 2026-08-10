# EN + RU theme setup (single zip)

One Blogtheme zip deploys to both Ghost instances. Differences are Design settings + publication language.

## Ghost settings

| Site | Admin API host | Publication language | `artalk_site_name` | `show_ad_banner` |
|------|----------------|----------------------|--------------------|------------------|
| RU `blog.themarfa.name` | `https://test1574.ghost.io` | **`ru`** (required after locale split) | `All-in-One Person` (default) | on (default) |
| EN `en.blog.themarfa.name` | `https://enaip.ghost.io` | `en` | `All-in-One Person EN` | **off** |

Use `*.ghost.io` for Admin API theme upload — custom domains drop `Authorization`.

## GitHub secrets (dual deploy)

Already used for RU:

- `GHOST_ADMIN_API_URL` → `https://test1574.ghost.io`
- `GHOST_ADMIN_API_KEY`

Add for EN (workflow skips EN deploy until key is set):

- `GHOST_EN_ADMIN_API_URL` → `https://enaip.ghost.io`
- `GHOST_EN_ADMIN_API_KEY` → Integration Admin API key

Until EN secrets exist, download the `joben-theme` artifact from Actions and upload manually in Ghost EN Admin → Design → Change theme.

## Artalk

1. Dashboard → Sites → create **All-in-One Person EN**, URL `https://en.blog.themarfa.name`.
2. Confirm `admin_notify.telegram` is enabled (same bot as RU; `site_name` distinguishes EN).
3. After theme deploy on EN: set Design → Artalk site name / turn off ad banner.
4. Disable native Ghost Comments on EN so only Artalk shows.
5. Smoke: post a test comment on an EN post → Telegram should notify.

## Migrate EN Ghost Comments → Artalk

```bash
# Option A: fetch from Admin API
set GHOST_ADMIN_API_URL=https://enaip.ghost.io
set GHOST_ADMIN_API_KEY=id:secret
node scripts/ghost-comments-to-artrans.js --fetch --out en.artrans.json

# Option B: convert a saved JSON export
node scripts/ghost-comments-to-artrans.js --in ghost-comments.json --out en.artrans.json
```

Import `en.artrans.json` in Artalk → Migration (target site **All-in-One Person EN**). Spot-check 2–3 posts with history.

## Checklist

1. Ghost RU: Publication language → `ru` **before or immediately with** the locale deploy.
2. Artalk: create EN site.
3. Deploy theme (push or artifact).
4. Ghost EN Design: Artalk site name + hide banners.
5. Migrate comments if any; then disable native comments on EN.
6. Add `GHOST_EN_ADMIN_API_*` secrets for ongoing dual auto-deploy.
7. Test EN comment → Telegram.
