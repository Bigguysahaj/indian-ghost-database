// Issue 11: /v2/ entry that loads ghost data from the site root.
// Run: node --test site/src/lib/v2.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as ghosts from './ghosts.js';

const { loadData } = ghosts;
const siteUrl = (...a) => { assert.equal(typeof ghosts.siteUrl, 'function', 'ghosts.js exports siteUrl'); return ghosts.siteUrl(...a); };

const SITE = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

test('loadData(root) fetches every data file from the given root', async () => {
  const seen = [];
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    seen.push(String(url));
    const body = String(url).endsWith('ghosts.json') ? { ghosts: [] } : {};
    return { ok: true, json: async () => body };
  };
  try {
    await loadData('../');
  } finally {
    globalThis.fetch = realFetch;
  }
  assert.deepEqual(seen.sort(), ['../data/evidence.json', '../data/ghosts.json', '../data/references.json']);
});

test('loadData() with no root keeps the / page fetching relative to itself', async () => {
  const seen = [];
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    seen.push(String(url));
    return { ok: true, json: async () => ({ ghosts: [] }) };
  };
  try {
    await loadData();
  } finally {
    globalThis.fetch = realFetch;
  }
  assert.ok(seen.includes('data/ghosts.json'), seen.join(', '));
});

test('siteUrl resolves data-relative image paths against a root', () => {
  assert.equal(siteUrl('images/ghosts/aacheri.webp', '../'), '../images/ghosts/aacheri.webp');
  assert.equal(siteUrl('images/ghosts/aacheri.webp'), 'images/ghosts/aacheri.webp');
  // Resolves under a GitHub Pages style sub-path, not just the domain root.
  assert.equal(
    new URL(siteUrl('data/ghosts.json', '../'), 'https://example.org/repo/v2/').href,
    'https://example.org/repo/data/ghosts.json',
  );
});

test('vite build emits v2/index.html with only relative asset URLs', () => {
  const out = mkdtempSync(join(tmpdir(), 'igdb-v2-'));
  try {
    execFileSync('npx', ['vite', 'build', '--outDir', out, '--emptyOutDir', '--logLevel', 'error'], { cwd: SITE, stdio: 'pipe' });
    assert.ok(existsSync(join(out, 'index.html')), 'root index.html still built');
    const v2 = join(out, 'v2', 'index.html');
    assert.ok(existsSync(v2), 'v2/index.html built');
    const html = readFileSync(v2, 'utf8');
    const refs = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((m) => m[1]).filter((u) => !u.startsWith('data:'));
    assert.ok(refs.some((u) => u.endsWith('.js')), 'v2 page loads a script');
    for (const u of refs) assert.ok(u.startsWith('../') || u.startsWith('./'), `non-relative URL in v2/index.html: ${u}`);
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
});
