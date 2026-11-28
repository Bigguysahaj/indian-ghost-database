# 22 · Arrow keys step the row like the edges, and the hold loop is removed

**Why:** after issue 21, the arrow keys are the last user of issue 16's jerky velocity loop. Making them match the edges lets that loop and its helpers be deleted.

Part of: 10. Depends on: 21. **Replaces part of issue 17** (holding an arrow key to scroll and `keyup` to stop). The `keyup` assertion is removed from the `17 · ...` test in `v2-layout.test.js`.

## Acceptance
- [ ] The `keydown` handler: ArrowLeft and ArrowRight call `stepRow(dir)` and `preventDefault()`. `e.repeat` is ignored, so holding a key gives one glide per press. Escape still closes the panel.
- [ ] Reduced motion works through `glideTo` (an instant jump), so the separate `stepOne` path goes away.
- [ ] Delete from `site/v2/index.html`:
  - `startGlide`, `glideTick`, `glideDir`, `glideStart`, `glidePrev`, `glidePos`, `stepOne`
  - the `keyup` listener
  - the `blur` → `stopGlide` listener, unless `glideTo` still uses it
- [ ] Delete `SLOW`, `RAMP`, `edgeSpeed` and `nextScroll` from `site/src/lib/v2-scroll.js`, and remove them from the import.

## Test
- Files:
  - `site/src/lib/v2-scroll.test.js`, test `22 · ...`
  - `site/src/lib/v2-layout.test.js`, test `22 · ...`
- Run: `node --test --test-name-pattern="^22 " site/src/lib/v2-scroll.test.js site/src/lib/v2-layout.test.js`
- Fails today because `nextScroll`, `startGlide` and `keyup` exist.
- Manual check: pressing → glides exactly like clicking the → edge, and holding → does not keep scrolling.

## Out of scope
- Hold-to-repeat on keys.
- Home and End keys.
