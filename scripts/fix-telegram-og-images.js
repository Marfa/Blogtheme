#!/usr/bin/env node
/**
 * Re-upload feature images as real .jpg and set post og_image/twitter_image.
 * Telegram WebpageBot rejects JPEG bytes served under a .png URL (Ghost format=jpeg keeps the extension).
 *
 * Needs: GHOST_ADMIN_API_URL (*.ghost.io), GHOST_ADMIN_API_KEY (id:secret)
 *
 * Usage:
 *   node scripts/fix-telegram-og-images.js --slugs slug-a,slug-b
 *   node scripts/fix-telegram-og-images.js --all-png
 */
const crypto = require('crypto');

function parseArgs(argv) {
  const out = { slugs: [], allPng: false };
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--all-png') out.allPng = true;
    else if (a === '--slugs') out.slugs = String(argv[++i] || '').split(',').map((s) => s.trim()).filter(Boolean);
    else if (a === '--help' || a === '-h') out.help = true;
  }
  return out;
}

function jwtForGhost(adminApiKey) {
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

function adminBase(apiUrl) {
  return String(apiUrl).replace(/\/$/, '');
}

function authHeaders(token) {
  return {
    Authorization: `Ghost ${token}`,
    Accept: 'application/json',
    'Accept-Version': 'v5.0',
  };
}

async function adminJson(apiUrl, apiKey, path, options = {}) {
  const token = jwtForGhost(apiKey);
  const res = await fetch(`${adminBase(apiUrl)}${path}`, {
    ...options,
    headers: {
      ...authHeaders(token),
      ...(options.body && !(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status} ${path}: ${text.slice(0, 500)}`);
  return text ? JSON.parse(text) : null;
}

function toJpegTransformUrl(imageUrl) {
  if (!imageUrl || !imageUrl.includes('/content/images/')) return imageUrl;
  if (imageUrl.includes('/format/jpeg/')) return imageUrl;
  return imageUrl.replace('/content/images/', '/content/images/size/w1200/format/jpeg/');
}

function isPngUrl(url) {
  return /\.png(?:\?|$)/i.test(String(url || ''));
}

function oneLine(text, max = 180) {
  const s = String(text || '').replace(/\s+/g, ' ').trim();
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1).trim()}…`;
}

async function downloadBuffer(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'TelegramBot (like TwitterBot)' } });
  if (!res.ok) throw new Error(`download ${res.status}: ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function uploadJpeg(apiUrl, apiKey, jpegBuf, filename) {
  const token = jwtForGhost(apiKey);
  const form = new FormData();
  form.append('file', new Blob([jpegBuf], { type: 'image/jpeg' }), filename);
  form.append('purpose', 'image');
  const res = await fetch(`${adminBase(apiUrl)}/ghost/api/admin/images/upload/`, {
    method: 'POST',
    headers: authHeaders(token),
    body: form,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`upload ${res.status}: ${text.slice(0, 500)}`);
  const data = JSON.parse(text);
  const url = data.images && data.images[0] && data.images[0].url;
  if (!url) throw new Error(`upload missing url: ${text.slice(0, 300)}`);
  return url;
}

async function listPngPosts(apiUrl, apiKey) {
  const posts = [];
  let page = 1;
  let pages = 1;
  while (page <= pages) {
    const data = await adminJson(
      apiUrl,
      apiKey,
      `/ghost/api/admin/posts/?limit=50&page=${page}&formats=`,
    );
    for (const p of data.posts || []) {
      if (p.status !== 'published') continue;
      if (isPngUrl(p.feature_image) || isPngUrl(p.og_image)) posts.push(p);
    }
    pages = (data.meta && data.meta.pagination && data.meta.pagination.pages) || 1;
    page += 1;
  }
  return posts;
}

async function getPostBySlug(apiUrl, apiKey, slug) {
  const data = await adminJson(apiUrl, apiKey, `/ghost/api/admin/posts/slug/${encodeURIComponent(slug)}/`);
  const post = data.posts && data.posts[0];
  if (!post) throw new Error(`post not found: ${slug}`);
  return post;
}

async function fixPost(apiUrl, apiKey, post) {
  const source = post.og_image || post.feature_image;
  if (!source) {
    console.log(`skip ${post.slug}: no image`);
    return null;
  }

  // Already a real .jpg social image — nothing to do for Telegram extension check.
  if (post.og_image && /\.jpe?g(?:\?|$)/i.test(post.og_image) && !isPngUrl(post.og_image)) {
    console.log(`skip ${post.slug}: og_image already jpeg url`);
    return null;
  }

  const jpegUrl = toJpegTransformUrl(source);
  const jpegBuf = await downloadBuffer(jpegUrl);
  if (jpegBuf[0] !== 0xff || jpegBuf[1] !== 0xd8) {
    throw new Error(`${post.slug}: transform did not return JPEG magic bytes`);
  }

  const uploaded = await uploadJpeg(apiUrl, apiKey, jpegBuf, `${post.slug}-og.jpg`);
  if (!/\.jpe?g(?:\?|$)/i.test(uploaded)) {
    throw new Error(`${post.slug}: uploaded URL is not .jpg: ${uploaded}`);
  }

  const desc = oneLine(
    post.og_description || post.meta_description || post.custom_excerpt || post.excerpt || post.title,
  );

  const body = {
    posts: [
      {
        og_image: uploaded,
        twitter_image: uploaded,
        updated_at: post.updated_at,
      },
    ],
  };
  if (!post.meta_description) body.posts[0].meta_description = desc;
  if (!post.og_description) body.posts[0].og_description = desc;
  if (!post.twitter_description) body.posts[0].twitter_description = desc;

  await adminJson(apiUrl, apiKey, `/ghost/api/admin/posts/${post.id}/`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

  console.log(`ok ${post.slug} -> ${uploaded}`);
  return uploaded;
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    console.log(`Usage:
  node scripts/fix-telegram-og-images.js --slugs a,b,c
  node scripts/fix-telegram-og-images.js --all-png
`);
    return;
  }

  const apiUrl = process.env.GHOST_ADMIN_API_URL;
  const apiKey = process.env.GHOST_ADMIN_API_KEY;
  if (!apiUrl || !apiKey) throw new Error('Set GHOST_ADMIN_API_URL and GHOST_ADMIN_API_KEY');
  if (!/\.ghost\.io/i.test(apiUrl)) {
    console.warn('warning: Admin API URL should be *.ghost.io (custom domains drop Authorization)');
  }

  let posts = [];
  if (args.allPng) {
    posts = await listPngPosts(apiUrl, apiKey);
  } else if (args.slugs.length) {
    for (const slug of args.slugs) posts.push(await getPostBySlug(apiUrl, apiKey, slug));
  } else {
    throw new Error('Pass --slugs a,b or --all-png');
  }

  console.log(`fixing ${posts.length} post(s)`);
  for (const post of posts) {
    await fixPost(apiUrl, apiKey, post);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
