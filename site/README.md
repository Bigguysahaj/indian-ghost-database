# Website

A [Svelte 5](https://svelte.dev) + [Vite](https://vite.dev) single-page app that lists all 84 entries as a searchable card grid, backed by the canonical data.

```bash
cd site
npm install
npm run dev      # local dev server with hot reload
npm run build    # static output in site/dist/
npm run preview  # serve the built output
```

## Layout

- `index.html`, `src/main.js` — entry point.
- `src/App.svelte` — header stats, search, status filters, card grid, Konami easter egg.
- `src/Card.svelte`, `src/Modal.svelte`, `src/SourceRefs.svelte` — components.
- `src/lib/ghosts.js` — claim fields, search/teaser helpers and data loading.
- `src/lib/haunts.js` — the hover "encounter" effects for the first ten entries.
- `src/lib/motion.js` — hover motion for entries #11–16: a spring-driven 3D tilt with parallax, glare and shadow, plus overlays matched to each ghost's demeanour. Add a ghost by giving it an entry in `PERSONAS`; overlay positions are fractions of the square portrait crop. Turned off entirely under `prefers-reduced-motion`.
- `src/styles.css` — global styles (light/dark themes, card and haunt animations).
- `public/data/` — a synced copy of `data/ghosts.json`, `data/references.json` and `research/evidence.json`.
- `public/images/ghosts/*.webp` — a synced copy of the per-entry portrait crops.

`public/data/` and `public/images/ghosts/` are **generated copies**, not sources of truth. After editing `data/ghosts.json` or the images at the repository root, regenerate them from the repo root:

```bash
python scripts/sync_site.py
```

Commit the result. The `Validate catalogue` GitHub Action fails the build if `site/public/` drifts from the canonical data, and also runs `npm run build`.

The portrait crops in `images/ghosts/` are themselves cut from the atlas sheets in `images/atlases/` by `python scripts/crop_portraits.py` (needs Pillow and numpy). It finds each sheet's real divider lines rather than assuming an even grid, then writes a square crop per ghost. Re-run it if a crop looks wrong, then run `sync_site.py`.

## Deploying

Build the `site` directory and publish `site/dist`:

- **Cloudflare Pages**: root directory `site`, build command `npm run build`, output directory `dist`.
- **Vercel**: root directory `site`, framework preset "Vite" (build `npm run build`, output `dist`).

The build uses relative asset paths (`base: './'`), so it also works from a sub-path.

## What's not here yet

Regional filtering beyond search, a dedicated page per ghost, and JSON download links are natural next steps but aren't built. The card grid and detail modal cover the "showcase everything, click through for the sourced detail" use case for now.
