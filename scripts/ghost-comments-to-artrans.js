/**
 * Convert Ghost native comments JSON to Artalk Artrans for import.
 *
 * Usage:
 *   node scripts/ghost-comments-to-artrans.js --in ghost-comments.json --out en.artrans.json
 *   node scripts/ghost-comments-to-artrans.js --fetch --out en.artrans.json
 *
 * Fetch mode needs:
 *   GHOST_ADMIN_API_URL=https://enaip.ghost.io
 *   GHOST_ADMIN_API_KEY=<id>:<secret>
 *
 * Import the .artrans.json in Artalk Dashboard → Migration, target site
 * "All-in-One Person EN".
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const https = require('https');
const http = require('http');

const DEFAULT_SITE = 'All-in-One Person EN';
const DEFAULT_SITE_URL = 'https://en.blog.themarfa.name';

function parseArgs(argv) {
  const args = {
    in: null,
    out: 'ghost-comments.artrans.json',
    site: DEFAULT_SITE,
    siteUrl: DEFAULT_SITE_URL,
    fetch: false,
  };
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--fetch') args.fetch = true;
    else if (a === '--in') args.in = argv[++i];
    else if (a === '--out') args.out = argv[++i];
    else if (a === '--site') args.site = argv[++i];
    else if (a === '--site-url') args.siteUrl = argv[++i];
    else if (a === '-h' || a === '--help') args.help = true;
    else throw new Error(`Unknown arg: ${a}`);
  }
  return args;
}

function htmlToText(html) {
  if (!html) return '';
  let s = String(html)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n');
  // Strip tags until stable (handles incomplete/malformed tags).
  let prev;
  do {
    prev = s;
    s = s.replace(/<[^>]*>?/g, '');
  } while (s !== prev);
  // Decode entities; &amp; last to avoid double-unescaping.
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .trim();
}

function toArtalkDate(iso) {
  if (!iso) return new Date().toISOString().replace('T', ' ').replace(/\.\d+Z$/, ' +0000');
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  const off = -d.getTimezoneOffset();
  const sign = off >= 0 ? '+' : '-';
  const oh = pad(Math.floor(Math.abs(off) / 60));
  const om = pad(Math.abs(off) % 60);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${sign}${oh}${om}`;
}

function pageKeyFromPost(post, siteUrl) {
  if (!post) return '/';
  if (post.url) {
    try {
      const u = new URL(post.url, siteUrl);
      return u.pathname.endsWith('/') ? u.pathname : `${u.pathname}/`;
    } catch {
      /* fall through */
    }
  }
  if (post.slug) return `/${post.slug}/`;
  return '/';
}

function flattenComments(comments) {
  const flat = [];
  const walk = (list, parentId) => {
    for (const c of list || []) {
      flat.push({ ...c, parent_id: c.parent_id ?? parentId ?? null });
      if (Array.isArray(c.replies) && c.replies.length) {
        walk(c.replies, c.id);
      }
    }
  };
  walk(comments, null);
  return flat;
}

function ghostToArtrans(payload, opts) {
  const raw = Array.isArray(payload) ? payload : payload.comments || [];
  const comments = flattenComments(raw);
  const artrans = [];

  for (const c of comments) {
    if (c.status && c.status !== 'published') continue;
    const content = htmlToText(c.html);
    if (!content) continue;

    const member = c.member || {};
    const post = c.post || {};
    const pageKey = pageKeyFromPost(post, opts.siteUrl);
    const created = toArtalkDate(c.created_at);
    const updated = toArtalkDate(c.edited_at || c.created_at);

    artrans.push({
      id: String(c.id),
      rid: c.parent_id ? String(c.parent_id) : '0',
      content,
      ua: '',
      ip: '',
      created_at: created,
      updated_at: updated,
      is_collapsed: 'false',
      is_pending: 'false',
      vote_up: String((c.count && c.count.likes) || 0),
      vote_down: '0',
      nick: member.name || 'Guest',
      email: member.email || '',
      link: '',
      password: '',
      badge_name: '',
      badge_color: '',
      page_key: pageKey,
      page_title: post.title || '',
      page_admin_only: 'false',
      site_name: opts.site,
      site_urls: opts.siteUrl,
    });
  }

  return artrans;
}

function jwtForGhost(adminApiKey) {
  // Ghost Admin API uses HMAC-SHA256 JWT signing (not password hashing).
  // codeql[js/insufficient-password-hash]
  const [id, secret] = String(adminApiKey).split(':');
  if (!id || !secret) throw new Error('GHOST_ADMIN_API_KEY must be id:secret');
  const signingKey = Buffer.from(secret, 'hex');
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT', kid: id })).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(JSON.stringify({ iat: now, exp: now + 300, aud: '/admin/' })).toString('base64url');
  const data = `${header}.${payload}`;
  const sig = crypto.createHmac('sha256', signingKey).update(data).digest('base64url');
  return `${data}.${sig}`;
}

function requestJson(url, headers) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(url, { headers }, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode}: ${body.slice(0, 400)}`));
          return;
        }
        try {
          resolve(JSON.parse(body));
        } catch (err) {
          reject(err);
        }
      });
    });
    req.on('error', reject);
  });
}

async function fetchAllComments(apiUrl, apiKey) {
  const token = jwtForGhost(apiKey);
  const base = apiUrl.replace(/\/$/, '');
  const all = [];
  let page = 1;
  let pages = 1;

  while (page <= pages) {
    const url = `${base}/ghost/api/admin/comments/?limit=100&page=${page}&include_nested=true`;
    const data = await requestJson(url, {
      Authorization: `Ghost ${token}`,
      Accept: 'application/json',
      'Accept-Version': 'v5.0',
    });
    all.push(...(data.comments || []));
    pages = (data.meta && data.meta.pagination && data.meta.pagination.pages) || 1;
    page += 1;
  }

  return { comments: all };
}

function printHelp() {
  console.log(`Usage:
  node scripts/ghost-comments-to-artrans.js --in ghost-comments.json --out en.artrans.json
  node scripts/ghost-comments-to-artrans.js --fetch --out en.artrans.json

Options:
  --site       Artalk site name (default: ${DEFAULT_SITE})
  --site-url   Site URL (default: ${DEFAULT_SITE_URL})
  --fetch      Pull from Ghost Admin API (needs GHOST_ADMIN_API_URL + GHOST_ADMIN_API_KEY)
`);
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    printHelp();
    return;
  }

  let payload;
  if (args.fetch) {
    const apiUrl = process.env.GHOST_ADMIN_API_URL;
    const apiKey = process.env.GHOST_ADMIN_API_KEY;
    if (!apiUrl || !apiKey) {
      throw new Error('Set GHOST_ADMIN_API_URL and GHOST_ADMIN_API_KEY for --fetch');
    }
    payload = await fetchAllComments(apiUrl, apiKey);
  } else if (args.in) {
    payload = JSON.parse(fs.readFileSync(path.resolve(args.in), 'utf8'));
  } else {
    printHelp();
    process.exitCode = 1;
    return;
  }

  const artrans = ghostToArtrans(payload, { site: args.site, siteUrl: args.siteUrl });
  const outPath = path.resolve(args.out);
  fs.writeFileSync(outPath, `${JSON.stringify(artrans, null, 2)}\n`);
  console.log(`Wrote ${artrans.length} comments → ${outPath}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exitCode = 1;
});
