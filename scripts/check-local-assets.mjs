#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, normalize, relative } from 'node:path';

const ROOT = process.cwd();
const TEXT_EXTENSIONS = new Set([
  '.css', '.html', '.js', '.json', '.mjs', '.svg', '.webmanifest', '.xml',
]);
const ASSET_EXTENSIONS = new Set([
  '.avif', '.gif', '.ico', '.jpeg', '.jpg', '.mp4', '.otf', '.png', '.svg', '.webm', '.webp',
]);
const IGNORED_DIRECTORIES = new Set([
  '.git', 'docs', 'graphify-out', 'screenshots', 'tmp', 'to-del',
]);

function walk(directory, files = []) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && IGNORED_DIRECTORIES.has(entry.name)) continue;

    const absolutePath = join(directory, entry.name);
    if (entry.isDirectory()) walk(absolutePath, files);
    else if (TEXT_EXTENSIONS.has(extname(entry.name).toLowerCase())) files.push(absolutePath);
  }

  return files;
}

function walkFiles(directory, files = []) {
  if (!existsSync(directory)) return files;

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = join(directory, entry.name);
    if (entry.isDirectory()) walkFiles(absolutePath, files);
    else files.push(absolutePath);
  }

  return files;
}

function normalizeReference(rawReference) {
  const cleanReference = decodeURIComponent(rawReference)
    .replace(/[?#].*$/, '')
    .replace(/^\.\//, '')
    .replace(/^\.\.\//, '')
    .normalize('NFC');

  if (cleanReference.startsWith('/')) return cleanReference.slice(1);
  return cleanReference;
}

const references = new Map();
const referencePattern = /((?:\/|\.\.?\/)?(?:assets|backgrounds)\/[A-Za-z0-9À-ÿ\u0300-\u036f_.,'()\-=%+@\/ ]+?\.(?:avif|gif|ico|jpe?g|mp4|png|svg|webm|webp))(?:[?#][^"'`)\s]*)?/gi;

for (const filePath of walk(ROOT)) {
  const rawSource = readFileSync(filePath, 'utf8');
  const source = extname(filePath).toLowerCase() === '.html'
    ? rawSource.replace(/<!--[\s\S]*?-->/g, '')
    : rawSource;
  const assetBases = new Map(
    [...source.matchAll(/\bconst\s+([A-Z][A-Z0-9_]*)\s*=\s*['"]((?:\/)?(?:assets|backgrounds)\/[^'"]+)['"]/g)]
      .map((match) => [match[1], normalizeReference(match[2])]),
  );

  for (const match of source.matchAll(referencePattern)) {
    const reference = normalizeReference(match[1]);
    if (!references.has(reference)) references.set(reference, new Set());
    references.get(reference).add(relative(ROOT, filePath));
  }

  for (const match of source.matchAll(/\$\{([A-Z][A-Z0-9_]*)\}\/([A-Za-z0-9À-ÿ\u0300-\u036f_.,'()\-=%+@\/ ]+?\.(?:avif|gif|ico|jpe?g|mp4|png|svg|webm|webp))/gi)) {
    const base = assetBases.get(match[1]);
    if (!base) continue;

    const reference = normalizeReference(`${base}/${match[2]}`);
    if (!references.has(reference)) references.set(reference, new Set());
    references.get(reference).add(relative(ROOT, filePath));
  }
}

const missing = [];
for (const [reference, consumers] of references) {
  const absolutePath = normalize(join(ROOT, reference));
  if (!absolutePath.startsWith(ROOT) || !existsSync(absolutePath) || !statSync(absolutePath).isFile()) {
    missing.push({ reference, consumers: [...consumers].sort() });
  }
}

const runtimeAssets = [join(ROOT, 'assets'), join(ROOT, 'backgrounds')]
  .flatMap((directory) => walkFiles(directory))
  .filter((filePath) => ASSET_EXTENSIONS.has(extname(filePath).toLowerCase()));
const referencedAssetPaths = new Set(
  [...references.keys()].map((reference) => normalize(join(ROOT, reference))),
);
const unreferencedAssets = runtimeAssets
  .filter((filePath) => !referencedAssetPaths.has(normalize(filePath)))
  .sort((a, b) => a.localeCompare(b));
const referencedAssetBytes = [...references]
  .map(([reference]) => join(ROOT, reference))
  .filter((filePath) => existsSync(filePath) && statSync(filePath).isFile())
  .reduce((total, filePath) => total + statSync(filePath).size, 0);

const result = {
  scannedTextFiles: walk(ROOT).length,
  runtimeAssetFiles: runtimeAssets.length,
  runtimeAssetBytes: runtimeAssets.reduce((total, filePath) => total + statSync(filePath).size, 0),
  referencedAssets: references.size,
  referencedAssetBytes,
  unreferencedAssets: unreferencedAssets.length,
  unreferencedAssetBytes: unreferencedAssets.reduce((total, filePath) => total + statSync(filePath).size, 0),
  missingAssets: missing.length,
  missing,
};

if (process.argv.includes('--unused')) {
  for (const filePath of unreferencedAssets) console.log(relative(ROOT, filePath));
} else if (process.argv.includes('--list')) {
  for (const [reference, consumers] of [...references].sort(([a], [b]) => a.localeCompare(b))) {
    console.log(`${reference}\t${[...consumers].sort().join(',')}`);
  }
} else if (process.argv.includes('--json')) {
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
} else {
  console.log(`Text files scanned: ${result.scannedTextFiles}`);
  console.log(`Unique local assets referenced: ${result.referencedAssets}`);
  console.log(`Missing local assets: ${result.missingAssets}`);
  for (const item of missing) {
    console.log(`- ${item.reference}`);
    for (const consumer of item.consumers) console.log(`  used by ${consumer}`);
  }
}

process.exitCode = missing.length ? 1 : 0;
