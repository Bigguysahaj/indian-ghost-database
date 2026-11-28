# 11 · `/v2/` Vite entry that loads ghost data from the site root

**Why:** the v2 redesign (issue 10) needs its own page that builds and reads the shared `data/` and `images/`, while `/` stays unchanged.

Part of: 10. Does not depend on the A/B layout decision.

## Acceptance
- [ ] `site/v2/index.html` exists as a second Vite HTML entry. `vite.config.js` lists both `index.html` and `v2/index.html` in `build.rollupOptions.input`, and `base: './'` stays unchanged.
- [ ] The v2 page mounts a placeholder Svelte component (for example `site/src/v2/App.svelte`). It calls `loadData('../')` and renders the ghost count and each ghost name, with images loaded through `siteUrl(crop, '../')`. No layout work yet.
- [ ] `site/src/lib/ghosts.js`:
  - `loadData(root = '')` fetches `${root}data/ghosts.json`, `references.json` and `evidence.json`. Calling it with no argument behaves exactly as it does today.
  - It exports `siteUrl(path, root = '')`, which returns `root + path`.
- [ ] Root URLs are relative (`'../'`), not absolute. `import.meta.env.BASE_URL` is `'./'` here, so it cannot be used. The build must work at a domain root and under a sub-path (for example `/repo/v2/` resolves data to `/repo/data/`).
- [ ] `vite build` emits `dist/index.html` unchanged in behaviour, plus `dist/v2/index.html`, whose script and style URLs are all relative (`../assets/...`).
- [ ] `/` still works. No changes to `site/index.html`, `App.svelte`, `Card.svelte` or `Modal.svelte`.

## Test
- File: `site/src/lib/v2.test.js`
- Run: `node --test site/src/lib/v2.test.js` (from the repo root; it runs `npx vite build` into a temp dir, so `site/node_modules` must be installed)
- Fails today, in 3 of 4 tests:
  - `loadData('../')` still fetches `data/...`.
  - `siteUrl` is not exported.
  - The build emits no `v2/index.html`.
- The test "`loadData()` with no root" passes today and must keep passing; it guards `/`.

## Out of scope
- Any v2 visual layout: hero, figure rows, chapters, captions, the "AI concept art" label (waits on issue 10's decision).
- Relative paths only work with a trailing slash. Visiting `/v2` without one would resolve `../data` wrongly under a sub-path. GitHub Pages redirects a directory to its trailing-slash URL; any other host is not handled.
- Navigation links between `/` and `/v2/`.
- Changes to `scripts/sync_site.py` or `.github/workflows/validate.yml`. Its `npm run build` step builds both entries once they are in `vite.config.js`.
