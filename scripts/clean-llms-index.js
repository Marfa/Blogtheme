#!/usr/bin/env node
/**
 * Clean LLM index noise + author branding for AI citation.
 *
 * - Draft verification pages (drop from llms.txt)
 * - Rename author «Гостевой» → «Редакция»
 * - Tag how-to posts with #howto (theme JSON-LD)
 * - Inject reciprocal hreflang link tags into codeinjection_head for RU↔EN pairs
 *
 *   node scripts/clean-llms-index.js
 *   node scripts/clean-llms-index.js --dry-run
 */
const crypto = require('crypto');

const DRY = process.argv.includes('--dry-run');
const VERIFICATION_SLUGS = new Set([
  '30af8eeaa0883aad5355974667c162356cab3a82',
  'gogetlinks-verification',
]);
const HOWTO_SCAN_LIMIT = 400;
const HREFLANG_RECENT = 200;

function jwtForGhost(adminApiKey) {
  const [id, secret] = String(adminApiKey).split(':');
  if (!id || !secret) throw new Error('Admin API key must be id:secret');
  const signingKey = Buffer.from(secret, 'hex');
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT', kid: id })).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(JSON.stringify({ iat: now, exp: now + 300, aud: '/admin/' })).toString('base64url');
  const data = `${header}.${payload}`;
  const sig = crypto.createHmac('sha256', signingKey).update(data).digest('base64url');
  return `${data}.${sig}`;
}

function adminBase(apiUrl) {
  return String(apiUrl).replace(/\/$/, '');
}

async function adminJson(apiUrl, apiKey, path, options = {}) {
  const token = jwtForGhost(apiKey);
  const res = await fetch(`${adminBase(apiUrl)}${path}`, {
    ...options,
    headers: {
      Authorization: `Ghost ${token}`,
      Accept: 'application/json',
      'Accept-Version': 'v5.0',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status} ${path}: ${text.slice(0, 500)}`);
  return text ? JSON.parse(text) : null;
}

async function listPages(apiUrl, apiKey, maxPages = 50) {
  const out = [];
  let page = 1;
  for (;;) {
    const data = await adminJson(apiUrl, apiKey, `/ghost/api/admin/pages/?limit=100&page=${page}`);
    out.push(...(data.pages || []));
    const pages = data.meta?.pagination?.pages || 1;
    if (page >= pages || page >= maxPages) break;
    page += 1;
  }
  return out;
}

async function listRecentPosts(apiUrl, apiKey, limit) {
  const out = [];
  let page = 1;
  const perPage = 100;
  while (out.length < limit) {
    const data = await adminJson(
      apiUrl,
      apiKey,
      `/ghost/api/admin/posts/?limit=${perPage}&page=${page}&filter=status:published&order=published_at%20desc&formats=mobiledoc&include=tags,authors`,
    );
    const rows = data.posts || [];
    if (!rows.length) break;
    out.push(...rows);
    if (page >= (data.meta?.pagination?.pages || 1)) break;
    page += 1;
  }
  return out.slice(0, limit);
}

function normalizeTitle(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/\[.*?\]/g, ' ')
    .replace(/[^a-z0-9а-яё\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenSet(s) {
  return new Set(normalizeTitle(s).split(' ').filter((t) => t.length > 2));
}

function jaccard(a, b) {
  const A = tokenSet(a);
  const B = tokenSet(b);
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const t of A) if (B.has(t)) inter += 1;
  return inter / (A.size + B.size - inter);
}

const LATIN_STOP = new Set([
  'kak', 'how', 'the', 'for', 'and', 'with', 'from', 'your', 'into', 'onto', 'via',
  'using', 'review', 'best', 'new', 'all', 'any', 'app', 'apps', 'mac', 'macos',
  'windows', 'linux', 'android', 'iphone', 'google', 'free', 'easy', 'easily',
  'quick', 'quickly', 'make', 'made', 'get', 'set', 'add', 'use',
  'betting', 'sports', 'browser', 'tokens', 'advanced', 'manager', 'status',
  'volume', 'music', 'apple', 'task', 'online', 'games', 'trending',
]);

function latinTokens(s) {
  return new Set(
    (String(s || '').toLowerCase().match(/[a-z][a-z0-9]{2,}/g) || []).filter((t) => !LATIN_STOP.has(t)),
  );
}

function latinOverlap(a, b) {
  const A = latinTokens(a);
  const B = latinTokens(b);
  if (!A.size || !B.size) return 0;
  const shared = [...A].filter((t) => B.has(t));
  const inter = shared.length;
  if (!inter) return 0;
  // One distinctive product/brand token (obsidian, livesync, navidrome…) is enough
  if (shared.some((t) => t.length >= 7)) return 0.8;
  if (inter >= 2) return 0.7 + Math.min(inter, 5) * 0.05;
  return 0;
}

function pairScore(ruPost, enPost) {
  const ruBlob = `${ruPost.slug} ${ruPost.title}`;
  const enBlob = `${enPost.slug} ${enPost.title}`;
  return Math.max(
    jaccard(ruPost.slug.replace(/-/g, ' '), enPost.slug.replace(/-/g, ' ')),
    jaccard(ruPost.title, enPost.title),
    latinOverlap(ruBlob, enBlob),
  );
}

function isHowToTitle(title) {
  // Avoid \\b — in JS it does not treat Cyrillic as word chars, so «Как …» never matched.
  return /^(как|how to|how-to)([\s:.—–-]|$)/i.test(String(title || '').trim());
}

const HREFLANG_MARK = 'data-ai-hreflang="1"';

function stripHreflangInjection(html) {
  return String(html || '')
    .replace(/<!--ai-hreflang-->[\s\S]*?<!--\/ai-hreflang-->\n?/g, '')
    .trim();
}

function withHreflangInjection(existing, lang, href) {
  const base = stripHreflangInjection(existing);
  const block = `<!--ai-hreflang-->\n<link rel="alternate" hreflang="${lang}" href="${href}" ${HREFLANG_MARK}>\n<!--/ai-hreflang-->`;
  return base ? `${base}\n${block}` : block;
}

async function draftVerificationPages(apiUrl, apiKey, label) {
  const pages = await listPages(apiUrl, apiKey);
  for (const page of pages) {
    if (!VERIFICATION_SLUGS.has(page.slug)) continue;
    if (page.status === 'draft') {
      console.log(`[${label}] already draft: ${page.slug}`);
      continue;
    }
    console.log(`[${label}] draft verification page: ${page.slug}`);
    if (DRY) continue;
    await adminJson(apiUrl, apiKey, `/ghost/api/admin/pages/${page.id}/`, {
      method: 'PUT',
      body: JSON.stringify({
        pages: [{ status: 'draft', updated_at: page.updated_at }],
      }),
    });
  }
}

async function findUser(apiUrl, apiKey, slug) {
  const data = await adminJson(apiUrl, apiKey, `/ghost/api/admin/users/?filter=slug:${slug}&limit=1`);
  return data.users?.[0] || null;
}

/** Integration tokens cannot PATCH /users — reassign recent guest posts instead. */
async function rebrandGuestAuthor(apiUrl, apiKey, label) {
  const guest = await findUser(apiUrl, apiKey, 'gostievoi');
  if (!guest) {
    console.log(`[${label}] guest author not found (ok)`);
    return;
  }

  try {
    const patch = {
      name: 'Редакция',
      bio: 'Материалы редакции All-In-One Person и приглашённых авторов.',
      website: label === 'EN' ? 'https://en.blog.themarfa.name/' : 'https://blog.themarfa.name/',
      updated_at: guest.updated_at,
    };
    console.log(`[${label}] rebrand author ${guest.slug} → ${patch.name}`);
    if (!DRY) {
      await adminJson(apiUrl, apiKey, `/ghost/api/admin/users/${guest.id}/`, {
        method: 'PUT',
        body: JSON.stringify({ users: [patch] }),
      });
      return;
    }
  } catch (err) {
    const msg = String(err.message || err);
    if (!msg.includes('HTTP 403')) throw err;
    console.log(`[${label}] users API forbidden for Integration key — reassign recent posts`);
  }

  const owner =
    (await findUser(apiUrl, apiKey, 'konstantin')) ||
    (await findUser(apiUrl, apiKey, 'immarfa'));
  if (!owner) {
    console.log(`[${label}] owner author not found; skip post reassignment`);
    return;
  }

  const posts = await listRecentPosts(apiUrl, apiKey, HOWTO_SCAN_LIMIT);
  let n = 0;
  for (const post of posts) {
    const authors = post.authors || [];
    const isGuest = authors.some((a) => a.slug === 'gostievoi' || a.id === guest.id);
    if (!isGuest) continue;
    n += 1;
    console.log(`[${label}] author ${owner.slug} ← ${post.slug}`);
    if (DRY) continue;
    await adminJson(apiUrl, apiKey, `/ghost/api/admin/posts/${post.id}/`, {
      method: 'PUT',
      body: JSON.stringify({
        posts: [{ authors: [{ id: owner.id }], updated_at: post.updated_at }],
      }),
    });
  }
  console.log(`[${label}] posts reassigned off guest: ${n}`);
}

async function ensureHowToTag(apiUrl, apiKey) {
  const found = await adminJson(apiUrl, apiKey, `/ghost/api/admin/tags/?filter=${encodeURIComponent('name:#howto')}&limit=1`);
  if (found.tags?.[0]) return found.tags[0];
  if (DRY) return { id: 'dry-howto', name: '#howto', slug: 'hash-howto' };
  const created = await adminJson(apiUrl, apiKey, '/ghost/api/admin/tags/', {
    method: 'POST',
    body: JSON.stringify({ tags: [{ name: '#howto', visibility: 'internal' }] }),
  });
  return created.tags[0];
}

async function tagHowToPosts(apiUrl, apiKey, label) {
  const howto = await ensureHowToTag(apiUrl, apiKey);
  // Scan enough pages that «Как…» / «How to…» titles are included, not only guest churn.
  const posts = await listRecentPosts(apiUrl, apiKey, Math.max(HOWTO_SCAN_LIMIT, 800));
  let n = 0;
  for (const post of posts) {
    if (!isHowToTitle(post.title)) continue;
    const has = (post.tags || []).some((t) => t.slug === 'hash-howto' || t.name === '#howto');
    if (has) continue;
    n += 1;
    console.log(`[${label}] #howto ← ${post.slug}`);
    if (DRY) continue;
    const tags = [...(post.tags || []).map((t) => ({ id: t.id })), { id: howto.id }];
    await adminJson(apiUrl, apiKey, `/ghost/api/admin/posts/${post.id}/`, {
      method: 'PUT',
      body: JSON.stringify({ posts: [{ tags, updated_at: post.updated_at }] }),
    });
  }
  console.log(`[${label}] howto tags added: ${n}`);
}

async function linkHreflang(ru, en) {
  let ruPosts = await listRecentPosts(ru.url, ru.key, HREFLANG_RECENT);
  let enPosts = await listRecentPosts(en.url, en.key, HREFLANG_RECENT);

  // Drop previous auto-links so false positives from earlier runs can be replaced.
  for (const [site, posts] of [[ru, ruPosts], [en, enPosts]]) {
    for (const post of posts) {
      if (!String(post.codeinjection_head || '').includes(HREFLANG_MARK)) continue;
      const cleaned = stripHreflangInjection(post.codeinjection_head);
      console.log(`[hreflang] clear ${post.slug}`);
      if (DRY) continue;
      const updated = await adminJson(site.url, site.key, `/ghost/api/admin/posts/${post.id}/`, {
        method: 'PUT',
        body: JSON.stringify({
          posts: [{ codeinjection_head: cleaned || null, updated_at: post.updated_at }],
        }),
      });
      post.codeinjection_head = cleaned;
      post.updated_at = updated.posts?.[0]?.updated_at || post.updated_at;
    }
  }

  ruPosts = await listRecentPosts(ru.url, ru.key, HREFLANG_RECENT);
  enPosts = await listRecentPosts(en.url, en.key, HREFLANG_RECENT);

  const pairs = [];
  for (const r of ruPosts) {
    let best = null;
    let bestScore = 0;
    for (const e of enPosts) {
      const score = pairScore(r, e);
      if (score > bestScore) {
        bestScore = score;
        best = e;
      }
    }
    if (best && bestScore >= 0.7) pairs.push([r, best, bestScore]);
  }

  const usedEn = new Set();
  const unique = [];
  pairs.sort((a, b) => b[2] - a[2]);
  for (const row of pairs) {
    if (usedEn.has(row[1].id)) continue;
    usedEn.add(row[1].id);
    unique.push(row);
  }
  console.log(`[hreflang] pairs: ${unique.length}`);

  for (const [r, e, score] of unique) {
    console.log(`[hreflang] ${score.toFixed(2)} ${r.slug} ↔ ${e.slug}`);
    if (DRY) continue;

    await adminJson(ru.url, ru.key, `/ghost/api/admin/posts/${r.id}/`, {
      method: 'PUT',
      body: JSON.stringify({
        posts: [{
          codeinjection_head: withHreflangInjection(r.codeinjection_head, 'en', e.url),
          updated_at: r.updated_at,
        }],
      }),
    });
    await adminJson(en.url, en.key, `/ghost/api/admin/posts/${e.id}/`, {
      method: 'PUT',
      body: JSON.stringify({
        posts: [{
          codeinjection_head: withHreflangInjection(e.codeinjection_head, 'ru', r.url),
          updated_at: e.updated_at,
        }],
      }),
    });
  }
}

async function runSite(label, url, key) {
  if (!url || !key) {
    console.log(`[${label}] skip (no credentials)`);
    return null;
  }
  console.log(`\n=== ${label} ${url} ===`);
  await draftVerificationPages(url, key, label);
  await rebrandGuestAuthor(url, key, label);
  await tagHowToPosts(url, key, label);
  return { url, key };
}

async function main() {
  const ru = await runSite('RU', process.env.GHOST_ADMIN_API_URL, process.env.GHOST_ADMIN_API_KEY);
  const en = await runSite('EN', process.env.GHOST_EN_ADMIN_API_URL, process.env.GHOST_EN_ADMIN_API_KEY);
  if (ru && en) await linkHreflang(ru, en);
  console.log(DRY ? '\nDry run done.' : '\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
