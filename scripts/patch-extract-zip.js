#!/usr/bin/env node
/**
 * Patch extract-zip in node_modules for CVE-2026-19693 (leaf symlink write-through).
 * Upstream has no fixed release; see https://github.com/max-mapper/extract-zip/pull/160
 */
const fs = require('fs');
const path = require('path');

const MARKER = 'existing.isSymbolicLink()';

const NEEDLE = `    if (symlink) {
      const link = await getStream(readStream)
      debug('creating symlink', link, dest)
      await fs.symlink(link, dest)
    } else {
      await pipeline(readStream, createWriteStream(dest, { mode: procMode }))
    }`;

const REPLACEMENT = `    if (symlink) {
      const link = await getStream(readStream)
      debug('creating symlink', link, dest)
      await fs.symlink(link, dest)
    } else {
      const existing = await fs.lstat(dest).catch(() => null)
      if (existing && existing.isSymbolicLink()) {
        throw new Error(\`Out of bound path "\${dest}" found while processing file \${entry.fileName}\`)
      }

      await pipeline(readStream, createWriteStream(dest, { mode: procMode }))
    }`;

function resolveExtractZipRoots() {
  const roots = new Set();
  const searchPaths = [
    path.join(__dirname, '..', 'node_modules', '@tryghost', 'zip'),
    path.join(__dirname, '..'),
  ];

  for (const base of searchPaths) {
    try {
      roots.add(path.dirname(require.resolve('extract-zip/package.json', { paths: [base] })));
    } catch (_) {
      /* not installed under this path */
    }
  }

  return [...roots];
}

function patchFile(indexPath) {
  const src = fs.readFileSync(indexPath, 'utf8');
  if (src.includes(MARKER)) {
    console.log('extract-zip already patched:', indexPath);
    return true;
  }
  if (!src.includes(NEEDLE)) {
    console.warn('extract-zip patch target not found (version changed?):', indexPath);
    return false;
  }
  fs.writeFileSync(indexPath, src.replace(NEEDLE, REPLACEMENT));
  console.log('extract-zip patched (CVE-2026-19693):', indexPath);
  return true;
}

const roots = resolveExtractZipRoots();
if (!roots.length) {
  console.log('extract-zip not installed; skip patch');
  process.exit(0);
}

let ok = true;
for (const root of roots) {
  ok = patchFile(path.join(root, 'index.js')) && ok;
}
process.exit(ok ? 0 : 1);
