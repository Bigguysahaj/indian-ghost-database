# 18 · Play a soft mechanical tick as each ghost passes the centre

**Why:** the owner wants a ticker sound while scrolling sideways, so the slow movement feels like turning a dial.

Part of: 10. Depends on: 15. Works with any scroll source, including 16 and 17.

## Acceptance
- [ ] `site/src/lib/v2-scroll.js` exports:
  - `tickIndex(x, pitch, offset = 0)`, which returns `Math.floor((x + offset) / pitch)`.
  - `ticksBetween(a, b, pitch, offset = 0)`, which returns the number of boundaries crossed in either direction, or 0 when `pitch <= 0`.
- [ ] In `site/v2/index.html`, a `scroll` listener on `#stage` compares the previous and current `scrollLeft`. It uses `pitch` = the figure column width (read from layout) and `offset` = half the stage width, so the fixed point is the centre. When `ticksBetween` is above 0, it plays one tick. It plays at most one tick per event, so a fast fling does not buzz.
- [ ] The tick is made with Web Audio only, with no audio files and no dependencies: a short (≤ 30 ms), quiet oscillator or noise burst with a fast gain decay.
- [ ] `AudioContext` is created or resumed only inside a first-gesture listener (`pointerdown` or `keydown`). Register it with a named function and `{ once: true }`. Before that gesture, nothing plays and nothing errors.

## Test
- Files:
  - `site/src/lib/v2-scroll.test.js`, test `18 · ...`
  - `site/src/lib/v2-layout.test.js`, test `18 · ...`
- Run: `node --test --test-name-pattern="^18 " site/src/lib/v2-scroll.test.js site/src/lib/v2-layout.test.js`
- Fails today because the helpers do not exist and there is no `AudioContext`.
- Manual check: after one click, gliding the row gives one soft tick per ghost.

## Out of scope
- The mute toggle (19).
- Pitch or volume settings.
- Silencing the tick under `prefers-reduced-motion`. That is not required; mute covers it.
