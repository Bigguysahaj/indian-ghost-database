# 21 · Clicking an edge glides the row by half a screen, and hovering no longer scrolls

**Why:** the owner wants scrolling to happen on click, not on hover, and wants it to be smooth. The hover-driven velocity loop from issue 16 is also the main reason the scroll is jerky (see Root cause).

Part of: 10. Depends on: 15. **Replaces issue 16** (hover and hold to scroll). Its tests are removed in `v2-layout.test.js` and `v2-scroll.test.js`, and issue 22 removes its remaining code.

## Root cause of the jerkiness (from the code, not a profile)
- Each `glideTick` frame integrates `speed * dt` with `dt` capped at 50 ms. Any frame longer than 50 ms loses distance for good, so the row visibly stalls instead of keeping its path.
- The ramp starts at 0 px/s and is driven by the pointer resting on the edge, so tiny moves of the mouse restart or stop it.
- Every frame also calls `syncEdges()` (which reads `scrollWidth` and `clientWidth`), and the `scroll` listener calls `figPitch()` (two `getBoundingClientRect`). That is a layout read on every frame, on top of the scroll handler's own.
- Ruled out: there is no `scroll-snap` or `scroll-behavior` in the CSS, and `glidePos` is already a float.
- Fix: compute position from elapsed time, `glideAt(from, to, now - start)`. Dropped frames then never change the path or the end point. Read the layout once per glide, not per frame.

## Acceptance
- [ ] `site/src/lib/v2-scroll.js` exports, all pure:
  - `GLIDE_MS` (600 to 1200; 900 suggested).
  - `easeInOut(t)` (smoothstep).
  - `glideAt(from, to, elapsedMs, durationMs, ease = easeInOut)`. It returns `from` at or before 0, exactly `to` at or after `durationMs`, and is monotonic. A `durationMs` of 0 returns `to`.
  - `clickStep(viewW, pitch)`: `max(1, floor(viewW / 2 / pitch)) * pitch`, or 0 when `pitch <= 0`.
- [ ] Step size is **half the visible row, rounded down to whole figures**, because:
  - Half keeps the figures you were just looking at on screen, so you keep your place.
  - Whole figures keep the row aligned, so the ticks (18) land evenly.
  - With 84 figures, the row takes about 6 to 7 clicks end to end on a laptop.
- [ ] In `site/v2/index.html`, `glideTo(x, ms = GLIDE_MS, ease)`:
  - Clamps `x` to `[0, scrollWidth - clientWidth]`, read once.
  - Stores `glideTarget` and runs one `requestAnimationFrame` loop. That loop only writes `stage.scrollLeft = glideAt(...)`, with no layout reads.
  - Calling it again cancels the running glide and starts from the current `scrollLeft`.
  - Under `calm.matches` it sets `scrollLeft` immediately, with no animation.
- [ ] `stepRow(dir)` calls `glideTo((glideFrame ? glideTarget : stage.scrollLeft) + dir * clickStep(stage.clientWidth, figPitch()))`. Quick repeated clicks therefore add up instead of being lost.
- [ ] `#prev` and `#next`: `edge.onclick = () => stepRow(dir)`. That one handler covers mouse click, touch tap, and Enter or Space on the focused button. Remove the edges' `onpointerenter`, `onpointerdown`, `onpointerup`, `onpointerleave` and `onpointercancel` glide handlers, and the `e.detail === 0` special case.
- [ ] Hovering an edge still shows only the glow and the arrow (14). It does not move the row.
- [ ] Ticks still fire as figures cross the centre during a glide. This needs no change, because the `scroll` listener from 18 handles it.
- [ ] The wheel cancels a running glide (keep the `stopGlide()` call), so the two never fight.

## Test
- Files:
  - `site/src/lib/v2-scroll.test.js`, the `21 · ...` tests (helpers).
  - `site/src/lib/v2-layout.test.js`, test `21 · ...` (wiring).
- Run: `node --test --test-name-pattern="^21 " site/src/lib/v2-scroll.test.js site/src/lib/v2-layout.test.js`
- Fails today because `glideAt` and `clickStep` do not exist and `edge.onpointerenter` starts a glide.
- Manual check:
  - Resting on → does nothing but glow.
  - One click glides about half a screen, starting and stopping softly, with a run of ticks.
  - Three fast clicks glide one and a half screens without a stutter.
  - With reduced motion on, a click jumps at once.

## Out of scope
- Press and hold to keep scrolling (the owner said it is optional).
- Arrow keys (22) and the wheel (23).
- A user setting for speed.
