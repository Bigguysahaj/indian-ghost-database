# 20 · Fade the row softly into the left and right edges

**Why:** the owner dislikes the hard vertical cut where `#stage` clips the row and wants a soft fade there instead.

Part of: 10. Independent of the other issues (CSS only).

## Acceptance
- [ ] `#stage` in `site/v2/index.html` gets both `-webkit-mask-image` and `mask-image`, set to
  `linear-gradient(90deg, transparent, #000 var(--fade-l), #000 calc(100% - var(--fade-r)), transparent)`.
- [ ] `--fade-l` and `--fade-r` are set on `#stage` to a soft width, for example `clamp(32px, 6vw, 96px)`.
- [ ] While the row is at its start, there is no left fade: `body:has(#prev[hidden]) #stage { --fade-l: 0px; }`. This costs no JS, because `syncEdges()` already hides `#prev` at the start. The right fade stays on all the time.
- [ ] The fade follows the stage when `.open` narrows it, so the row also fades softly next to the panel.
- [ ] Clicking figures still works. A mask does not change hit-testing.

## Test
- File: `site/src/lib/v2-layout.test.js`, test `20 · ...`
- Run: `node --test --test-name-pattern="^20 " site/src/lib/v2-layout.test.js`
- Fails today because `#stage` has no mask.
- Manual check: at the start, the first figure has no fade. After one click on →, figures dissolve softly into both sides, and there is no hard edge next to the arrow.

## Out of scope
- Animating the left fade in and out. It snaps, because the custom property is not registered.
- Changing the side glow (14).
