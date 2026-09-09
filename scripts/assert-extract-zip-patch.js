#!/usr/bin/env node
/**
 * Fail if installed extract-zip is missing the CVE-2026-19693 leaf-symlink guard.
 */
const path = require('path');
const fs = require('fs');

const searchPaths = [
  path.join(__dirname, '..', 'node_modules', '@tryghost', 'zip'),
  path.join(__dirname, '..'),
];

let indexPath;
for (const base of searchPaths) {
  try {
    indexPath = require.resolve('extract-zip', { paths: [base] });
    break;
  } catch (_) {
    /* try next */
  }
}

if (!indexPath) {
  console.error('extract-zip not installed');
  process.exit(1);
}

const src = fs.readFileSync(indexPath, 'utf8');
if (!src.includes('existing.isSymbolicLink()') || !src.includes('Out of bound path')) {
  console.error('extract-zip CVE-2026-19693 patch missing:', indexPath);
  console.error('Run: node scripts/patch-extract-zip.js');
  process.exit(1);
}

console.log('extract-zip patch OK:', indexPath);
