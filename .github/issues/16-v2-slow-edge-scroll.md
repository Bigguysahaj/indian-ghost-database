# 16 · Hovering or holding an edge scrolls the row slowly and steadily

> **Superseded by 21 and 22.** The owner asked for scrolling on click, not hover, and the hold loop was jerky. The `16 · ...` tests were removed.

**Why:** the owner wants slow, controlled sideways movement to see more ghosts, not a jump.

Part of: 10. Depends on: 15.

## Acceptance
- [ ] New file `site/src/lib/v2-scroll.js`, with pure functions and no DOM:
  - `SLOW`: the steady speed in px/s, at most 400.
  - `RAMP`: the ease-in time in ms, at most 600.
  - `edgeSpeed(heldMs)`: rises from 0 to `SLOW` over `RAMP`, then stays at `SLOW`. It never goes past `SLOW`.
  - `nextScroll(x, dir, dtMs, heldMs, max)`: moves `x + dir * edgeSpeed(heldMs) * dt` and clamps the result to `[0, max]`. It caps `dt` at 50 ms, so a tab switch does not cause a jump.
- [ ] `site/v2/index.html` imports both functions from `'../src/lib/v2-scroll.js'`. While the pointer is over `#prev` or `#next`, or a pointer is pressed on it (touch), a `requestAnimationFrame` loop sets `#stage.scrollLeft` with `nextScroll`. Leaving the edge, releasing the pointer or reaching the end stops the loop.
- [ ] Remove the screen-width `scrollBy` jump from issue 15.
- [ ] Reduced motion (`calm.matches`): hovering does not auto-scroll. Clicking or pressing Enter on an edge moves exactly one figure, with no smooth animation.

## Test
- Files:
  - `site/src/lib/v2-scroll.test.js`, the `16 · ...` tests (helpers).
  - `site/src/lib/v2-layout.test.js`, test `16 · ...` (wiring).
- Run: `node --test --test-name-pattern="^16 " site/src/lib/v2-scroll.test.js site/src/lib/v2-layout.test.js`
- Fails today because `v2-scroll.js` does not exist and the page does not import it.
- Manual check: resting on the right edge glides the row at an even, slow pace. It starts softly, with no lurch.

## Out of scope
- Arrow keys and wheel (17).
- Tick sound (18).
- A user setting for the speed.
