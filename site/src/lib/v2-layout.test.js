// Issues 13-23: structural checks on the single-file /v2/ mockup (site/v2/index.html).
// Run all: node --test site/src/lib/v2-layout.test.js
// Run one issue: node --test --test-name-pattern="^14 " site/src/lib/v2-layout.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../../v2/index.html', import.meta.url), 'utf8');
const css = (html.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? '').replace(/\/\*[\s\S]*?\*\//g, '');
const script = html.match(/<script type="module">([\s\S]*?)<\/script>/)?.[1] ?? '';

// Innermost `selector { body }` pairs; rules nested in @media are found too.
const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({ sels: m[1].split(',').map((s) => s.trim()), body: m[2] }));
const decl = (sel) => rules.filter((r) => r.sels.includes(sel)).map((r) => r.body).join(';');
const opacity = (n) => new RegExp(`opacity:\\s*${n}\\s*(;|$)`);

test('13 · edge colour has no bottom glow and no bottom grain', () => {
  const at = [...css.matchAll(/radial-gradient\([^)]*?\bat\s+(-?[\d.]+)%\s+(-?[\d.]+)%/g)].map((m) => [+m[1], +m[2]]);
  assert.ok(at.filter(([x]) => x <= 0 || x >= 100).length >= 4, 'the four side glows are kept');
  assert.deepEqual(at.filter(([x]) => x > 0 && x < 100), [], 'no glow anchored along the bottom edge');
  assert.doesNotMatch(css, /linear-gradient\(\s*(0deg|to top)/, 'no bottom grain mask');
});

test('14 · side glow and grain appear only while that edge is hovered or focused', () => {
  assert.doesNotMatch(html, /id="bleed"/, 'the always-on #bleed layer is gone');
  for (const p of ['::before', '::after']) {
    assert.match(decl(`.edge${p}`), opacity(0), `.edge${p} hidden by default`);
    assert.match(decl(`.edge${p}`), /transition:[^;]*opacity/, `.edge${p} fades`);
    for (const s of [`.edge:hover${p}`, `.edge:focus-visible${p}`]) assert.match(decl(s), opacity(1), s);
  }
  assert.match(decl('#prev::before'), /radial-gradient\([^)]*\bat 0%/, 'left glow on #prev');
  assert.match(decl('#next::before'), /radial-gradient\([^)]*\bat 100%/, 'right glow on #next');
});

test('15 · all ghosts sit in one continuous, horizontally scrollable row', () => {
  assert.doesNotMatch(script, /PER_PAGE|className:\s*'page'/, 'no per-page sections');
  assert.doesNotMatch(script, /translateX\(/, 'no page-by-page transform');
  assert.doesNotMatch(css, /\.page\b/, 'no .page styles');
  assert.doesNotMatch(css, /grid-template-columns:\s*repeat\(/, 'no fixed 12/4-column pages');
  assert.match(decl('.lineup'), /grid-auto-flow:\s*column/, 'one row that grows with the data');
  assert.match(decl('#stage'), /overflow(-x)?:\s*(auto|scroll)/, '#stage scrolls sideways');
  assert.match(decl('#stage'), /scrollbar-width:\s*none/, 'no visible scrollbar');
  assert.match(script, /scroll(By|To|Left)\b/, 'edges move the scroller');
  assert.doesNotMatch(html, /aria-label="(Previous|Next) 12 ghosts"/);
});

// Issue 16 (hover/hold to scroll) is replaced by issues 21 (edges glide on click) and 22 (arrow keys step like the edges).

test('17 · arrow keys and wheel use the same slow scroll', () => {
  assert.match(script, /import\s*\{[^}]*\bwheelDelta\b[^}]*\}\s*from\s*'\.\.\/src\/lib\/v2-scroll\.js'/);
  assert.match(script, /'wheel'[\s\S]*?passive:\s*false/, 'wheel listener can preventDefault');
  // The keyup/hold assertion was removed: issue 22 replaces arrow-key holding with one glide per press.
  assert.doesNotMatch(script, /\bgo\(page\s*[+-]/, 'arrows no longer jump a page');
});

test('18 · a synthesised tick plays as each ghost passes the centre', () => {
  assert.match(script, /import\s*\{[^}]*\bticksBetween\b[^}]*\}\s*from\s*'\.\.\/src\/lib\/v2-scroll\.js'/);
  assert.match(script, /\bAudioContext\b/, 'Web Audio');
  assert.match(script, /create(Oscillator|Buffer)\(/, 'sound is generated, not loaded');
  assert.doesNotMatch(html, /<audio\b|\.(mp3|wav|ogg|m4a)\b/, 'no audio files');
  assert.match(script, /'scroll'|onscroll/, 'ticks follow the scroll position');
  assert.match(script, /'(pointerdown|keydown|click)'[^;]*once:\s*true/, 'audio starts on the first user gesture');
});

test('19 · a visible mute toggle exists', () => {
  const button = html.match(/<button\b[^>]*\bid="sound"[^>]*>/)?.[0] ?? '';
  assert.ok(button, '<button id="sound"> exists');
  assert.match(button, /aria-pressed="(true|false)"/, 'toggle state is exposed');
  assert.match(button, /aria-label="[^"]+"/, 'toggle is labelled');
  assert.match(script, /\$\('sound'\)/, 'toggle is wired up');
});

const block = (re) => script.match(re)?.[1] ?? '';
const fromLib = (name) => new RegExp(`import\\s*\\{[^}]*\\b${name}\\b[^}]*\\}\\s*from\\s*'\\.\\.\\/src\\/lib\\/v2-scroll\\.js'`);

test('20 · the row fades softly into the left and right edges of the stage', () => {
  const s = decl('#stage');
  for (const p of ['-webkit-mask-image', 'mask-image']) {
    assert.match(s, new RegExp(`(^|;)\\s*${p}:\\s*linear-gradient\\(\\s*(90deg|to right)\\s*,\\s*transparent\\b[^;]*,\\s*transparent\\s*\\)`),
      `#stage ${p} fades to transparent at both sides`);
  }
  const start = rules.filter((r) => r.sels.some((x) => /#stage$/.test(x) && /:has\(#prev\[hidden\]\)|\.at-start\b/.test(x)));
  assert.ok(start.length, 'a #stage rule for "row is at its start" exists');
  assert.match(start.map((r) => r.body).join(';'), /--fade-l:\s*0(px)?\s*(;|$)/, 'no left fade while nothing is scrolled off to the left');
});

test('21 · edges glide on click, tap or Enter/Space, never on hover', () => {
  for (const name of ['glideAt', 'clickStep']) assert.match(script, fromLib(name), `${name} imported`);
  assert.doesNotMatch(script, /edge\.(onpointerenter|onpointerover|onmouseenter|onmouseover|onpointerdown)\s*=/, 'hover/press on an edge does not scroll');
  assert.doesNotMatch(script, /edge\.addEventListener\('(pointerenter|pointerover|mouseenter|mouseover|pointerdown)'/);
  assert.match(script, /edge\.(onclick\s*=|addEventListener\('click',)[^\n]*\bstepRow\(dir\)/, 'a click on an edge calls stepRow(dir)');
  assert.match(script, /function stepRow\(dir\)[\s\S]{0,400}?\bclickStep\(/, 'stepRow moves by clickStep');
  assert.match(script, /\bglideAt\(/, 'the glide is driven by the eased helper');
  assert.match(script, /requestAnimationFrame/);
  assert.match(script, /calm\.matches/, 'reduced motion still checked');
});

test('22 · arrow keys step like the edges; the hold loop is gone', () => {
  assert.doesNotMatch(script, /\b(nextScroll|edgeSpeed|startGlide|glideTick)\b/, 'velocity hold loop removed');
  assert.doesNotMatch(script, /'keyup'|onkeyup/, 'no hold-to-scroll on keys');
  const keys = block(/addEventListener\('keydown',\s*\(e\)\s*=>\s*\{([\s\S]*?)\n\}\)/);
  assert.match(keys, /ArrowRight/);
  assert.match(keys, /\bstepRow\(dir\)/, 'arrows call the same step as the edges');
  assert.match(keys, /Escape/, 'Escape still closes the panel');
});

test('23 · the wheel glides smoothly instead of jumping', () => {
  for (const name of ['easeOut', 'WHEEL_MS']) assert.match(script, fromLib(name), `${name} imported`);
  const wheel = block(/addEventListener\('wheel',([\s\S]*?)\{\s*passive:\s*false\s*\}/);
  assert.ok(wheel, 'wheel listener found');
  assert.match(wheel, /preventDefault\(\)/);
  assert.doesNotMatch(wheel, /scrollLeft\s*[+-]?=/, 'no instant scrollLeft jump per notch');
  assert.match(wheel, /\bglideTo\(/, 'wheel retargets the glide');
  assert.match(wheel, /wheelDelta\(e\)/);
  assert.match(wheel, /\bWHEEL_MS\b[\s\S]*\beaseOut\b/, 'short ease-out glide');
});
