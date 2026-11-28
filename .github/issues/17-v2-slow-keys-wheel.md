# 17 · Arrow keys and the wheel scroll the row at the same slow pace

> **Partly superseded:** issue 22 replaces holding an arrow key to scroll and `keyup`, and issue 23 replaces the wheel's instant `scrollLeft +=` with a glide. `wheelDelta` stays.

**Why:** keyboard and wheel users need the same controlled sideways movement as the edges, not a page jump or a native fling.

Part of: 10. Depends on: 16.

## Acceptance
- [ ] `site/src/lib/v2-scroll.js` exports:
  - `WHEEL_MAX`: px per wheel event, at most 48.
  - `wheelDelta({ deltaX, deltaY, deltaMode })`: uses whichever axis is larger and scales line mode (`deltaMode` 1) and page mode (`deltaMode` 2) up to pixels. It then damps the value and clamps it to `±WHEEL_MAX`. The sign follows the input, so down or right gives a positive value.
- [ ] Holding ArrowRight or ArrowLeft runs the same `requestAnimationFrame` loop as an edge hold from issue 16. `keyup` stops it, and `e.repeat` does not restart the ramp. Escape still closes the panel.
- [ ] A `wheel` listener on `#stage` (`{ passive: false }`) calls `preventDefault()` and adds `wheelDelta(e)` to `scrollLeft`.
- [ ] Reduced motion: each arrow keydown moves exactly one figure and does not loop. The wheel behaves as above.

## Test
- Files:
  - `site/src/lib/v2-scroll.test.js`, test `17 · ...`
  - `site/src/lib/v2-layout.test.js`, test `17 · ...`
- Run: `node --test --test-name-pattern="^17 " site/src/lib/v2-scroll.test.js site/src/lib/v2-layout.test.js`
- Fails today because `wheelDelta` does not exist, there is no `wheel` or `keyup` handling, and the arrow keys call `go(page ± 1)`.

## Out of scope
- Native touch swipe on phones. It stays native.
- Momentum or inertia tuning.
