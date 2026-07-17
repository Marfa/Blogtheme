# Agent / contributor rules

## Dependencies

1. **Never pin a version from memory.** When adding or bumping a package, install the current latest published version (`npm install <pkg>@latest` or the exact version from `npm view <pkg> version`), then commit the resulting `package.json` + `package-lock.json`.
2. **Audit immediately after install:** `npm audit`. Do not leave critical/high findings unresolved without an explicit decision (fix, `overrides`, or documented accept).
3. **Before adding a new dependency**, run the project `/check-dep` skill (registry status, advisories, typosquatting).
4. **Regular freshness check** (not every PR): `npx npm-check-updates`. Review major bumps carefully; do not blind-upgrade PostCSS/Babel majors without a build smoke test (`npm run build` / `npm run zip`).
5. **CI gates:** `.github/workflows/security.yml` runs `npm audit --audit-level=critical` and gitleaks on every push and PR. Do not weaken these gates to silence known issues — fix or allowlist with a written reason.

## Secrets

- Never commit `.env`, API keys, tokens, or credentials.
- Local pre-commit: `git config core.hooksPath .githooks` (once per clone). The hook runs gitleaks on staged changes.
- Public verification files (e.g. Brave Rewards `.well-known/brave-rewards-verification.txt`) are intentionally public; they are allowlisted in `.gitleaks.toml`.
