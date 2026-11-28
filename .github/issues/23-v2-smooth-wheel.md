# 23 · The wheel glides smoothly instead of jumping each notch

**Why:** the wheel handler adds up to 32 px straight to `scrollLeft`, and `preventDefault()` turns off the browser's own smoothing. Each mouse-wheel notch is therefore a visible jump, which is a confirmed source of the jerky scroll.

Part of: 10. Depends on: 21. Keeps the issue 17 `wheelDelta` pace and cap.

## Acceptance
- [ ] `site/src/lib/v2-scroll.js` exports:
  - `WHEEL_MS` (120 to 400; 220 suggested).
  - `easeOut(t)` (for example, cubic `1 - (1 - t) ** 3`).
  - It starts at full speed, so a new notch that retargets a running glide does not stall the way an ease-in would.
- [ ] The `wheel` listener still calls `preventDefault()`. Instead of `scrollLeft += d`, it calls `glideTo((glideFrame ? glideTarget : stage.scrollLeft) + wheelDelta(e), WHEEL_MS, easeOut)`, so notches add up onto the pending target.
- [ ] Trackpads, with many small events, still feel direct. Each event only retargets the glide.
- [ ] Reduced motion: `glideTo` jumps instantly, as in 21.

## Test
- Files:
  - `site/src/lib/v2-scroll.test.js`, test `23 · ...`
  - `site/src/lib/v2-layout.test.js`, test `23 · ...`
- Run: `node --test --test-name-pattern="^23 " site/src/lib/v2-scroll.test.js site/src/lib/v2-layout.test.js`
- Fails today because `easeOut` and `WHEEL_MS` do not exist and the wheel writes `scrollLeft +=`.
- Manual check: a slow turn of the mouse wheel moves the row in one continuous glide with no steps, and ticks still sound.

## Out of scope
- Momentum or inertia after the wheel stops.
- Changing `WHEEL_MAX` or the damping.
