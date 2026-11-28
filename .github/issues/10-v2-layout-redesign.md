# 10 · v2 layout redesign (tracking)

**Why:** try an editorial redesign of the catalogue at `/v2/` without touching the current page at `/`.

Reference look: a white editorial spread with one huge portrait bleeding off the right edge, a long line of small full-body figures on a shared baseline, one small serif caption under it, and a lot of empty space.

## Acceptance
- [ ] `/` keeps its current look and behaviour for the whole project.
- [ ] `/v2/` is built and deployed from the same `site/` Vite project and uses the same `data/` and `images/`.
- [ ] Every child issue below is closed.
- [x] The layout decision has been made by the owner and is written below.
- [ ] The portrait art decision in issue 12 has been made. It is still open.

## Child issues
- [ ] 11 · `/v2/` Vite entry that loads ghost data from the site root (`node --test site/src/lib/v2.test.js`)
- [ ] 12 · Replace the cutout and layered portrait art (parked plan, no test; waits on the owner's decision)
- [ ] 13 · Remove the bottom-edge colour (`node --test --test-name-pattern="^13 " site/src/lib/v2-layout.test.js`)
- [ ] 14 · Show each side glow only on edge hover or focus (`node --test --test-name-pattern="^14 " site/src/lib/v2-layout.test.js`)
- [ ] 15 · One continuous, connected row (`node --test --test-name-pattern="^15 " site/src/lib/v2-layout.test.js`)
- [x] ~~16 · Slow, steady scroll when hovering or holding an edge~~ Replaced by 21 and 22 (owner: scroll on click, not hover). Its tests were removed.
- [ ] 17 · Arrow keys and wheel scroll at the same slow pace (the arrow-key hold is replaced by 22 and the instant wheel step by 23) (`node --test --test-name-pattern="^17 " site/src/lib/v2-scroll.test.js site/src/lib/v2-layout.test.js`)
- [ ] 18 · Ticker sound as each ghost passes the centre (`node --test --test-name-pattern="^18 " site/src/lib/v2-scroll.test.js site/src/lib/v2-layout.test.js`)
- [ ] 19 · Visible mute toggle (`node --test --test-name-pattern="^19 " site/src/lib/v2-layout.test.js`)
- [ ] 20 · Soft fade where the row meets the left and right edges (`node --test --test-name-pattern="^20 " site/src/lib/v2-layout.test.js`)
- [ ] 21 · Edges glide half a screen on click, not hover, with an eased time-based glide (`node --test --test-name-pattern="^21 " site/src/lib/v2-scroll.test.js site/src/lib/v2-layout.test.js`)
- [ ] 22 · Arrow keys step like the edges, and the hold loop is removed (`node --test --test-name-pattern="^22 " site/src/lib/v2-scroll.test.js site/src/lib/v2-layout.test.js`)
- [ ] 23 · The wheel glides smoothly instead of jumping (`node --test --test-name-pattern="^23 " site/src/lib/v2-scroll.test.js site/src/lib/v2-layout.test.js`)

## Review findings (constraints for layout issues)
- The art is 84 AI pseudo-pixel full-body crops, 199-369 px, with number+name labels baked in, on cream backgrounds that differ from sheet to sheet.
- Many figures float, fly, ride, hang or include scenery, so there is no true shared feet baseline. The "shared baseline" has to be the box bottom, not the feet.
- Alpha cutouts would damage white and wispy art, so do not cut figures out of their backgrounds. The mockup tried cutouts anyway, and the owner rejected them. Issue 12 tracks the replacement.
- Pixelated upscaling by a non-integer factor looks bad. Scale only by an integer factor, capped at 2x or 3x.
- ~~Horizontal scroll hides most of the set. Do not use a single scrolling strip.~~ The owner's decision below overrides this. To soften the problem, scrolling is slow and controlled (17, 21-23) and a tick sounds as each ghost passes (18).
- Do not swap the hero on hover, because it flickers. Select on click or keyboard focus.
- A large hero needs a visible "AI concept art" label. Name-only ghosts (`research_status: name_only`) must say so on screen.

## Decision (owner, after reviewing the mockup)
- **One continuous, connected row** of all ghosts that runs unbroken across the old page boundaries. You scroll it sideways to see more ghosts, and the movement is slow and controlled, with a ticker sound.
- This replaces both earlier options: (A) 4 static rows of 21, and (B) paged chapters of about 12. Neither one is used.
- More owner feedback:
  - Remove the bottom-edge colour.
  - Show side colours only while hovering that side.
  - Rejection of the cutout art, which is parked in 12.
  - Soft, blurred edges where the row is clipped, not a hard cut (20).
  - Scroll on click, not hover, and make it smooth (21-23).
- The hero is still the art plus a huge serif name. The art itself waits on issue 12.

## Open decision (owner has NOT decided)
- The new portrait art direction that replaces the cutouts. See issue 12.

## Test
- None of its own. Done when every child issue's test passes.

## Out of scope
- Any change to `/` (`site/index.html`, `App.svelte`, `Card.svelte`, `Modal.svelte`).
- Regenerating, re-cropping or cutting out art.
- Changes to the data or schema.
