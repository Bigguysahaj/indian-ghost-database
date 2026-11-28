# 14 · Show each side glow only while its edge is hovered or focused

**Why:** the owner wants the side colours to show only when you hover that side, not all the time.

Part of: 10. Depends on: 13, so that only the side glows are left to move.

## Acceptance
- [ ] Remove `<div id="bleed">` and its CSS. Do not keep an always-on colour layer.
- [ ] `.edge::before` holds the glow: fixed, `pointer-events: none`, `filter: blur(38px)`, `opacity: 0`, and a `transition` that includes `opacity`.
  - `#prev::before` holds the two left gradients (`at 0% ...`), anchored to the left of the window.
  - `#next::before` holds the two right gradients (`at 100% ...`), anchored to the right.
  - Colours stay as they are today.
- [ ] `.edge::after` holds that side's grain, moved from `#bleed::after`: `opacity: 0` by default, and it fades together with the glow.
- [ ] `.edge:hover::before`, `.edge:focus-visible::before`, `.edge:hover::after` and `.edge:focus-visible::after` set `opacity: 1`. Write each as its own selector in the rule, so it reads plainly and matches the test.
- [ ] An edge that is `hidden` (at the start or end of the row) shows no glow.
- [ ] The glow never blocks clicks on figures. Under `prefers-reduced-motion` the existing rule drops the fade, so the glow simply appears and disappears.

## Test
- File: `site/src/lib/v2-layout.test.js`, test `14 · ...`
- Run: `node --test --test-name-pattern="^14 " site/src/lib/v2-layout.test.js`
- Fails today because `#bleed` exists and there are no `.edge::before` or `.edge::after` rules.
- Manual check: hover the left zone and the left glow fades in; leave it and the glow fades out. Tab to `#next` and the right glow shows.

## Out of scope
- Touch devices (`hover: none`): there is no hover, so there is no glow. That is accepted.
- What the edges do when activated (issues 15 and 16).
