---
name: haunt-ghost-cards
description: Add pixel-art hover animations ("haunts") to the next batch of ghost cards on the Indian Ghost Database site. Use when asked to animate, haunt or add hover effects to more ghosts ("do the next 5", "animate Chanda"), or to fix or tweak an existing haunt.
---

# Haunting ghost cards

The site (`site/`, Svelte 5 + Vite) shows every ghost as a card with a 16-bit
pixel-art portrait. The portraits look like a game bestiary: each has a numbered
label such as `01 AACHERI`. Cards with a "haunt" play a short animation on hover.
It's a nod to that art style: motion is **frame-by-frame**, like a sprite, and an
**RPG dialog box** slides up over the label and types out one line.

Entries 1–84 are done. Study them before you design new ones: they are the
reference for tone, density and technique. `batch.py` (step 1) lists which ids
already have a haunt.

## Files you will touch

| File | What goes there |
|---|---|
| `site/src/lib/haunts.js` | One `HAUNTS` entry per ghost: `line` (dialog text) and `fx` (overlay markup). |
| `site/src/styles.css` | One commented CSS block per ghost, placed **before** the `@media (prefers-reduced-motion: reduce)` block at the end of the haunt section. |

You do not need to touch `Card.svelte` or `App.svelte`. A card becomes haunted
automatically when its ghost's `id` is a key in `HAUNTS` and the ghost has a
portrait crop. Hover, keyboard focus and the Konami code (↑↑↓↓←→←→BA, which haunts
every card at once) are already wired up.

How the card renders a haunt (from `Card.svelte`):

```html
<button class="card haunt haunt--{id}" class:is-haunting={hovering || hauntAll}>
  <div class="card-media">            <!-- square, position: relative, overflow hidden -->
    <img src="...">                   <!-- the portrait, object-fit: cover -->
    <span class="haunt-fx">{@html fx}</span>   <!-- inset: 0, your overlay spans go here -->
    <span class="haunt-say" style="--chars:N"><span class="haunt-text">LINE</span></span>
  </div>
  ...
```

Everything animates only while `.is-haunting` is on the card. Removing the class
on mouse leave resets the animations, so they replay on every hover.

## Workflow

Do these steps in order. Do not skip the look-at-the-portrait step or the
screenshot step: the effects are positioned by eye, and you cannot get positions
right from the data alone.

### 1. Pick the batch and read the data

From the repo root:

```bash
python .claude/skills/haunt-ghost-cards/scripts/batch.py            # next 5 without a haunt
python .claude/skills/haunt-ghost-cards/scripts/batch.py --count 3
python .claude/skills/haunt-ghost-cards/scripts/batch.py --ids chanda chedipe
```

For each ghost this prints the id, portrait path and pixel size, every sourced
claim, and the art review note.

### 2. Look at every portrait

Open each `site/public/images/ghosts/<id>.webp` with the Read tool (it displays
images). For each one, write down:

- what is in the picture: the figure, props, and the empty background areas
- where things are, as **percentages of the image** (left %, top %). Note the
  feet/base, head, hands, any prop the lore cares about, and empty space where an
  effect could go without covering the face
- the label strip along the bottom (up to the bottom ~10%, and it can run nearly
  edge to edge). The dialog box is a full-width panel that covers the bottom 14%,
  so never put an important effect there.

The portraits are square crops that map 1:1 onto the square card, so percentages
you measure on the image are the percentages you use in CSS. Still confirm them
on the screenshot in step 6.

If a portrait itself looks wrong (label cut off, figure clipped, a neighbour's
artwork showing), don't work around it in CSS. Re-cut it from its atlas sheet with
`scripts/crop_portraits.py --ids <id>`, check the result, then run
`python scripts/sync_site.py`. See that script's docstring; it needs Pillow and numpy.

### 3. Design one effect per ghost from its claims

**The rule: every effect must come from a sourced claim in the data** (the output of
step 1), not from general knowledge about the ghost and not from the artwork.
This is a research database that is careful about evidence, and the haunts must
not invent folklore.

Good, from the existing ten:

| Ghost | Claim used | Effect |
|---|---|---|
| Aacheri | "Descends at dusk; her shadow is said to bring illness." | Dusk tint, sprite steps down, sickly shadow spreads at her feet |
| Aayeri | "Accompanied by hounds with bells"; art note says the cell omits the hounds | Bell notes from the staff, paw prints walk past (restoring what the art left out) |
| Adam Bhediya | "Transforms at full moon." | Night tint, pixel moon rises, then the sprite growl-shakes |
| Ateswar | "Headless water ghost." | Bobbing on ripples, blinking `?` where the head should be |
| Bagowa Bhoot | "Roars or misleads forest visitors toward danger." | Screen shake, claw rake, and a lying line: "THIS WAY, TRAVELLER… ROAR!" |
| Brahmadaitya | "Helping the man ends the spirit's ghostly term"; habitat "a vakula tree" | Vakula blossoms fall, the sprite rises and brightens, "QUEST COMPLETE!" |
| Chedipe | "Enters homes at night, induces sleep and drains blood" | Night tint, floating Zs, and an HP bar that drains: a claim turned into a game UI wink |
| Chirbatti | Lights "move, pause or follow observers", "changing colour" | The sprite hops and holds while `hue-rotate` steps through colours. No new objects needed |
| Chordewa | Appearance "Woman"; art note: "cat depiction is not substantiated" | Spotlight on the smoky woman behind the cat. Line: "THE CAT IS A LIE…" |
| Jilaiya | Prey: "people whose names it hears" | Night tint and an arcade NAME? entry box with a blinking cursor: a game UI that stands in for the claim |
| Gutiya Deo | "Dwarf ghost." | Mario power-down flicker to 0.8×. Set `.card-media` background to the portrait's own colour so the shrunk sprite leaves no seam |

Rules for the design:

- **One idea per ghost**, built from 1–3 small layers (tint, an object, particles).
  The best ones are combinations like "tint + one object + sprite motion".
- **Add one wink if it fits**: a game reference (Mario coin "+1", "HEAD: 404",
  "QUEST COMPLETE!") or a touch drawn from the art review note (Aayeri's missing
  hounds). Don't force it.
- **Ghosts with no claims** (batch.py prints `claims: NONE`) get a generic
  effect: a short tint flicker or a stepped float. Their line must not state any
  fact: use something like `#11 CHANDA… ???` or `A NAMELESS CHILL…`.
- **Never cover the face** for long. Tints are fine; opaque objects go in the
  empty space you noted in step 2.

### 4. Write the dialog line

- **ALL CAPS, at most 27 characters** including spaces and punctuation. Longer
  lines overflow the box on the narrowest card (220px). `shoot.mjs` checks this.
- Use the ghost's name, or a short form if the name is long (`BHEDIYA` for Adam
  Bhediya).
- Use `…` (one character) rather than `...` to save two characters.
- Keep it to one short sentence, or two very short ones. Say what happens, or
  give a game-style wink: `FULL MOON! BHEDIYA TURNS.`
- It must be consistent with the claims (see step 3).

### 5. Write the code

#### `haunts.js` entry

Use static markup only (it's rendered with `{@html}`). Quote ids that contain hyphens.

```js
  'ghost-id': {
    line: 'ALL CAPS LINE ≤27 CHARS',
    fx: '<span class="haunt-tint"></span><span class="haunt-thing"></span>',
  },
```

For repeated particles with varying parameters, build the string once at the top
of the file (next to `leaves`, `coins`, `blossoms` and `pages`) and pass the
per-item values as inline CSS variables:

```js
const sparks = [10, 40, 75].map((x, i) => `<span class="haunt-spark" style="left:${x}%;animation-delay:${i * 0.2}s"></span>`).join('');
```

Also update the comment at the top of `haunts.js` that lists what each effect is
drawn from.

#### CSS block

Add one block per ghost, in entry-number order, before the reduced-motion media
query. Start it with a comment that says the number, name and the idea:

```css
/* 11 Chanda: <what happens, and the claim it comes from>. */
.haunt--chanda .haunt-tint { background: rgba(...); }
.haunt--chanda.is-haunting .haunt-tint { animation: haunt-appear 0.4s steps(4) forwards; }
.haunt--chanda.is-haunting .card-media img { animation: haunt-bob 1s steps(1) infinite; }
.haunt--chanda .haunt-thing {
  left: 30%; top: 40%;
  width: 12px; height: 12px;
  background: #......;
  clip-path: var(--pixel-oval);
}
.haunt--chanda.is-haunting .haunt-thing { animation: haunt-something 0.6s steps(5) 0.3s forwards; }
@keyframes haunt-something { ... }
```

Selector patterns:

- Static look: `.haunt--<id> .haunt-xxx { ... }`
- Animation: `.haunt--<id>.is-haunting .haunt-xxx { animation: ... }` (note: no
  space between `.haunt--<id>` and `.is-haunting`, because both classes are on
  the same element)
- Sprite motion: `.haunt--<id>.is-haunting .card-media img { animation: ... }`

### 6. Run it and check the screenshots

Start the dev server in the background (it hot-reloads, so leave it running):

```bash
cd site && npm run dev -- --port 5173 --strictPort
```

Then capture every new card mid-animation, in light and dark mode. `shoot.mjs`
needs the `playwright` package. Run it from a scratch directory where that is
installed (`npm i playwright` there once), not from `site/`. Do not add playwright
to the site's dependencies.

```bash
node shoot.mjs <out-dir> --ids chanda,chedipe --at 400,1500
node shoot.mjs <out-dir> --ids chanda,chedipe --at 1500 --dark
```

(`shoot.mjs` lives in `.claude/skills/haunt-ghost-cards/scripts/`; copy it next to
your playwright install.) If no Chromium is cached, run `npx playwright install chromium` once.

Then:

1. Read the printed checks. Every card must say `HAUNT-OK`, and the run must end
   with `no console errors`. Fix every `HAUNT-FAIL` first.
2. **Open every screenshot with the Read tool and look at it.** Check that:
   - each overlay sits where you meant it to (on the staff, at the feet, in the sky)
   - nothing important covers the face
   - the effect is visible against this portrait's colours. A green leaf on green
     art disappears; add a dark 3px pixel outline with `box-shadow`, or change
     the colour
   - the dialog box is fully inside the card and the text isn't cut off
   - in dark mode, nothing looks broken (the dialog box is dark in both themes on
     purpose)
3. Adjust and re-shoot until all of them look right. Two or three rounds is normal.

Also run `cd site && npm run build` and confirm it succeeds; CI runs the same build.

### 7. Report back

Tell the user, for each ghost: the effect, the claim it came from, and the dialog
line (a table works well). Say what you checked, and list anything you could not
verify or chose to leave generic (for example, ghosts with no claims).

## The style rules (non-negotiable)

1. **Every animation uses `steps()`.** Use `steps(n)` for a move of n frames, or
   `steps(1)` with keyframes that list each frame's position. Never use
   `ease`, `linear` or any other smooth timing on a haunt. The stepped motion is
   what makes it read as pixel art.
2. **Move in pixel-sized amounts**: 2px, 3px, 4px or 6px. Scale objects with
   `transform: scale()` stepped over a few frames, not with smooth growth.
3. **Pixel shapes, not smooth ones.** No `border-radius` on haunt elements. Use
   `clip-path: var(--pixel-oval)` for anything round, `box-shadow` pixel art for
   small sprites (see the paw print), or plain rectangles.
4. **Rotation blurs pixel art.** Avoid rotating the portrait. Rotating small
   overlays is acceptable (the claw marks, the orbiting leaves) but keep it rare.
5. **Overlays never catch the mouse.** This is already handled for anything inside
   `.haunt-fx`. Don't put haunt elements anywhere else.
6. **Keep it short and light.** One-shot effects should finish within about
   0.3–1.5s. Loops should have small amplitude. Three to six overlay elements is a
   lot; ten is too many.

## Building blocks already in `styles.css`

Reuse these rather than writing new ones.

| Name | What it is | How to use it |
|---|---|---|
| `--pixel-oval` | Stepped circle/ellipse `clip-path` (set on `.haunt`) | `clip-path: var(--pixel-oval)`. Square element → pixel circle; wide element → pixel ellipse; with a `border` → a pixel ring |
| `.haunt-tint` | Full-card overlay with `mix-blend-mode: multiply` | Set `background` (gradient or rgba). Fade it in with `haunt-appear 0.4s steps(4) forwards`. Darker, more saturated colours give stronger tints |
| `haunt-appear` | `to { opacity: 1 }` | Fade in: `0.4s steps(4) forwards`. Pop in at a moment: `0s <delay> forwards` |
| `haunt-blink` | `50% { opacity: 0 }` | Blinking: `0.5s steps(1) <delay> infinite`. Pair with `haunt-appear 0s <delay> forwards` so it starts hidden |
| `haunt-sway` | 4-frame left/right shuffle (±2px) | On the img: `0.8s steps(1) infinite` |
| `haunt-bob` | 4-frame float up/down (0 to −6px) | On the img: `1s steps(1) infinite` |
| `haunt-shake` | One-shot screen shake | On the img: `0.4s steps(1)` |
| `haunt-float` | Rise 20px and fade (notes, "+1") | `1.2s steps(4) infinite` |
| `haunt-fall` | Drop 150px and fade (blossoms) | `1.4s steps(7) infinite` |
| `haunt-ripple` | Grow from 0.3× to 1.5× and fade | `1.5s steps(5) infinite`, staggered delays |
| `haunt-orbit` | Circle around the element's origin at radius `--r` | `0.8s steps(8) infinite` |
| `haunt-coin` | Arc up and out by `--dx` | `0.9s steps(6) infinite` |
| `haunt-page` | Fly to `--dx`/`--dy` while turning | `1.2s steps(6) infinite` |

The dialog box (`.haunt-say` and `.haunt-text`) is fully generic: a full-width
panel across the bottom of the card that hides the portrait's label. Never style
it per ghost, and never shrink it, or the label will show around it.

## Pitfalls (each of these has already bitten once)

- **`:nth-of-type` counts every `<span>`, not just your class.** All overlays are
  spans, so in `fx: '<span class="haunt-note">…</span><span class="haunt-note">…</span><span class="haunt-paw"></span>…'`
  the first paw is `:nth-of-type(3)`, not `(1)`. Count every span before it in
  the `fx` string, or avoid the problem: pass per-item values as inline CSS
  variables (`style="--dx:…;animation-delay:…"`) as `coins` and `pages` do.
- **Overlays start invisible.** `.haunt-fx > *` has `opacity: 0`, so every element
  needs an animation that sets `opacity: 1`. That can be `haunt-appear`, or
  `opacity: 1` inside your own keyframes (see `haunt-rise`, `haunt-rake`). If
  `shoot.mjs` says no fx are visible, this is usually why.
- **Two animations on the same property fight**, and the later one in the list
  wins. Keep `transform` animations on the img to one per ghost. Combine opacity
  and transform in a single keyframe set when an element needs both.
- **`transform` replaces `transform`.** If an element is positioned with
  `transform: rotate(90deg)` and its animation sets `transform: translateY(…)`,
  the rotation is lost during the animation. Repeat the static part in every
  keyframe (see `haunt-rake`), or centre the element with the separate `translate`
  property, which composes with `transform` (see `.haunt-ripple`).
- **Colours that match the art disappear.** Check the screenshot; outline small
  sprites with a dark 3px `box-shadow`. The same goes for "glow the eyes" on art
  whose eyes already glow: nothing changes. To animate a feature the art already
  draws, cover it briefly instead (Chordewa's blink is a dark "eyelid" over each eye).
- **A `border` on a short, wide `--pixel-oval` falls apart.** The clip keeps only
  the straight runs of the border, so a thin ring reads as a flat line and two
  ticks. Use a filled pixel ellipse with a translucent background (Chanda's glow),
  or make the element tall enough that the ring survives (Ateswar's ripples).
- **Anything below ~86% is hidden by the dialog panel.** Keep ground effects
  (roads, rings, shadows) at about 72–83%.
- **Short effects slip between screenshots.** A blink that shows for 8% of a 2s
  loop won't be in a capture at 500ms or 1500ms. Work out when it appears
  (delay + loop position) and pass that time to `--at`.
- **`steps(var(--chars))` and `calc(var(--chars) * 35ms)` are intentional** in the
  dialog-box CSS. They make the typing speed match the line length. Don't
  "simplify" them.
- **Don't edit `site/public/`.** It holds generated copies of the data and
  images. Use `python scripts/sync_site.py` if those ever need regenerating.
- **A dev server started on another branch serves stale errors.** If the page
  shows no cards and the dev server log says "Failed to parse source", but
  `npm run build` succeeds, restart the dev server rather than changing code.
- **Someone else may be editing `site/` at the same time.** If a file changes or
  disappears under you, stop and ask the user before continuing. Don't overwrite
  their work.

## Accessibility

This is already handled globally; just don't break it:

- `aria-hidden="true"` is on the fx and dialog spans, so screen readers don't hear them.
- Under `prefers-reduced-motion: reduce` the fx layer is hidden, the img doesn't
  move, and the dialog box shows its line without the typing animation. If you add
  an animation on something other than `.haunt-fx` children, the img, or the
  dialog box, add a matching `animation: none` to that media query.
- Keyboard focus triggers the haunt the same way hover does.

## Definition of done

- [ ] Each new ghost has a `HAUNTS` entry and a commented CSS block in entry order
- [ ] Every effect and line traces back to a sourced claim (or is generic for a ghost with no claims)
- [ ] Every line is ALL CAPS and ≤27 characters
- [ ] Only `steps()` timing; no `border-radius` or smooth easing in haunt CSS
- [ ] `shoot.mjs` prints `HAUNT-OK` for every new card and `no console errors`
- [ ] You looked at the light- and dark-mode screenshots of every new card
- [ ] `npm run build` succeeds
- [ ] The header comment in `haunts.js` lists the new effects
- [ ] The "Entries 1–N are done" line and the examples table above are updated if the batch adds a useful new pattern
- [ ] Nothing is committed unless the user asked for a commit
