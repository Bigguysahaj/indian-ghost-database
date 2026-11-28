# 19 · Add a visible mute toggle for the tick sound

**Why:** the ticker must be easy to silence.

Part of: 10. Depends on: 18.

## Acceptance
- [ ] Add `<button id="sound" class="round" type="button" aria-pressed="..." aria-label="...">` to `site/v2/index.html`. It stays visible in a fixed corner, does not cover the edges or `#close`, and shows a clear on or off glyph.
- [ ] Clicking it toggles a `muted` flag and updates `aria-pressed` and the label. Tick playback from issue 18 checks `muted` first.
- [ ] It is reachable and usable with the keyboard. Its own click counts as the first gesture that unlocks audio.

## Test
- File: `site/src/lib/v2-layout.test.js`, test `19 · ...`
- Run: `node --test --test-name-pattern="^19 " site/src/lib/v2-layout.test.js`
- Fails today because there is no `#sound` button.

## Out of scope
- Saving the choice (localStorage).
- A volume slider.
