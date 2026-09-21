# Website

A static, zero-build homepage that lists all 84 entries as a searchable card grid, backed by the canonical data.

Open `index.html` directly, or serve the folder (`python -m http.server` from inside `site/`) — it's plain HTML/CSS/JS with no dependencies and no build step.

## Files

- `index.html`, `styles.css`, `app.js` — the page.
- `data/` — a synced copy of `data/ghosts.json`, `data/references.json` and `research/evidence.json`.
- `images/ghosts/*.webp` — a synced copy of the per-entry portrait crops.

`data/` and `images/ghosts/` inside `site/` are **generated copies**, not sources of truth. After editing `data/ghosts.json` or the images at the repository root, regenerate them:

```bash
python scripts/sync_site.py
```

Commit the result. The `Validate catalogue` GitHub Action fails the build if `site/` drifts from the canonical data.

## Deploying

`site/` is self-contained, so any static host works with the "root directory" (or "publish directory") set to `site` and no build command:

- **Cloudflare Pages**: set the project's root directory to `site`, framework preset "None", build command empty.
- **Vercel**: set the project's root directory to `site`; no framework, no build command.

## What's not here yet

Regional filtering beyond search, a dedicated page per ghost, and JSON download links are natural next steps but aren't built. The card grid and detail modal cover the "showcase everything, click through for the sourced detail" use case for now.
