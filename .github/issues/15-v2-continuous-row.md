# 15 · Put every ghost in one continuous, connected row

**Why:** the owner wants one row that continues unbroken across what are pages today, scrolled sideways to see more ghosts. This replaces the 12-per-page chapters.

Part of: 10. Independent of 13 and 14. Issues 16-18 build on it.

## Acceptance
- [ ] `site/v2/index.html` builds a single `.lineup` holding all ghost buttons in data order. Remove `PER_PAGE`, the `.page` sections, `go()`'s `translateX` and every `.page` CSS rule.
- [ ] `.lineup` uses `grid-auto-flow: column` with a fixed column width, for example `grid-auto-columns: calc(41vw / 12)`, so the figure size and overlap match today. There is no gap or re-centring between groups of 12. Remove both `grid-template-columns: repeat(...)` rules, including the one for phones.
- [ ] `#stage` is the horizontal scroller (`overflow-x: auto`, `scrollbar-width: none`). Drop `#track`, or keep it as a plain wrapper.
- [ ] The first figure still starts at the centre of the window, as page 1 does today.
- [ ] Until issue 16 lands, `#prev` and `#next` call `scrollBy` with `behavior: 'smooth'`. Each edge is hidden when the row is at that end, worked out from `scrollLeft` on `scroll`.
- [ ] Edge labels become "Scroll left" and "Scroll right", replacing "Previous/Next 12 ghosts".
- [ ] Picking a ghost, the panel, closing and the stage narrowing on `.open` all still work. Moving the row no longer force-closes the panel.

## Test
- File: `site/src/lib/v2-layout.test.js`, test `15 · ...`
- Run: `node --test --test-name-pattern="^15 " site/src/lib/v2-layout.test.js`
- Fails today because of `PER_PAGE`, the `.page` sections, `translateX` and the `repeat(12, 1fr)` columns.
- Manual check: figures 12 and 13 stand next to each other with the same overlap as 11 and 12.

## Out of scope
- Slow hold-to-scroll on the edges (16), keys and wheel (17), sound (18 and 19).
- The new portrait art (12).
- Virtualising the 84 canvases.
