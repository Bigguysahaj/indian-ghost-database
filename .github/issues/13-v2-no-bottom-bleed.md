# 13 · Remove the bottom-edge colour from `/v2/`

**Why:** the owner doesn't like the colour along the bottom edge.

Part of: 10. Independent of the other issues.

## Acceptance
- [ ] In `#bleed::before` in `site/v2/index.html`, delete the two bottom gradients, `at 28% 100%` and `at 78% 101%`.
- [ ] In `#bleed::after`, delete the bottom grain mask layer `linear-gradient(0deg, #000, transparent 30%)` from both `-webkit-mask` and `mask`. Keep the `90deg` side mask.
- [ ] The four side gradients (`at 0% 62%`, `at 0% 92%`, `at 100% 52%`, `at 100% 90%`) and the top stay unchanged.
- [ ] Update the comment above `#bleed` so it no longer mentions the bottom.

## Test
- File: `site/src/lib/v2-layout.test.js`, test `13 · ...`
- Run: `node --test --test-name-pattern="^13 " site/src/lib/v2-layout.test.js`
- Fails today because two radial gradients are anchored along the bottom (x = 28% and 78%).
- The test reads the whole `<style>`, so it keeps passing after issue 14 moves the side glows.

## Out of scope
- Making the side glows appear on hover only (issue 14).
- Changing the colours or blur.
