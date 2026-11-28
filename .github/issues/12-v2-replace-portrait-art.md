# 12 · Replace the cutout and layered portrait art in `/v2/` (parked plan)

**Why:** the owner rejected the cutout look outright ("I don't like the cutout concepts, no, not at all"). A new direction will be chosen later.

Part of: 10. Status: **parked**. Nothing gets built until the open decision below is made and written here.

## What uses the rejected art today (all untracked, not committed yet)
- `site/v2/cutouts/<id>.webp`: 84 transparent, label-free cutouts, made by `scripts/cutout_portraits.py`.
- `site/v2/layers/aacheri-{still,hair,body,head}.webp`: hand-traced Aacheri layers, made by `scripts/layer_aacheri.py`.
- `site/v2/index.html`, `portrait()`: loads `cutouts/${g.id}.webp`, or `layers/aacheri-*.webp` for Aacheri, then warps it on a canvas (sway, breathe, hair ripple).
- Both scripts are dev-only and need Pillow, numpy and scipy.

## Open decision (owner has NOT decided)
- What the figures and the hero should look like instead of the cutouts. Undecided. Do not pick a direction for the owner.
- Whether any motion stays (the canvas warp in `portrait()`) once the cutouts are gone.
- Constraints from issue 10 still apply: no alpha cutouts of white or wispy art, integer-only pixel scaling, and a visible "AI concept art" label.

## Plan once decided
- [ ] Write the decision here and in issue 10.
- [ ] Split the work into child issues of about 50 lines each, with tests, in the usual format.
- [ ] The child issues remove `site/v2/cutouts/`, `site/v2/layers/`, `scripts/cutout_portraits.py` and `scripts/layer_aacheri.py`, unless the decision reuses them.
- [ ] `portrait()` no longer references `cutouts/` or `layers/`.

## Test
- None. This is a plan only. Each child issue brings its own test.

## Out of scope
- Any implementation now. Until the decision, the mockup keeps the current cutouts so that layout issues 13-19 can be reviewed.
- Regenerating art under `images/ghosts/`.
