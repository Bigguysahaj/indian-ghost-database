// The first ten entries get a hover "encounter" in the style of their pixel-art
// portraits: stepped, frame-by-frame motion and an RPG dialog box over the label.
// Each effect is drawn from the entry's own claims (dusk, hound bells, full moon,
// headless water ghost, tiger roar, whirlwind, captive wealth, raised bamboo,
// a finished ghostly term, favour-or-feast).
// The fx strings are static markup rendered with {@html}; nothing user-supplied.
const leaves = [0, 0.15, 0.3, 0.45].map((d, i) => `<span class="haunt-leaf" style="--r:${60 + i * 12}px;animation-delay:${d}s"></span>`).join('');
const coins = [-34, -6, 26].map((dx, i) => `<span class="haunt-coin" style="--dx:${dx}px;animation-delay:${0.25 + i * 0.2}s"></span>`).join('');
const blossoms = [14, 32, 70, 86].map((x, i) => `<span class="haunt-blossom" style="left:${x}%;animation-delay:${i * 0.35}s"></span>`).join('');
const pages = [[30, -50], [46, -26], [16, -70]].map(([dx, dy], i) => `<span class="haunt-page" style="--dx:${dx}px;--dy:${dy}px;animation-delay:${i * 0.3}s"></span>`).join('');

export const HAUNTS = {
  aacheri: {
    line: 'AACHERI DESCENDS AT DUSK…',
    fx: '<span class="haunt-tint"></span><span class="haunt-shadow"></span>',
  },
  aayeri: {
    line: 'BELLS RING. AAYERI HUNTS.',
    fx: '<span class="haunt-note">♪</span><span class="haunt-note">♫</span>'
      + '<span class="haunt-paw"></span><span class="haunt-paw"></span><span class="haunt-paw"></span><span class="haunt-paw"></span>',
  },
  'adam-bhediya': {
    line: 'FULL MOON! BHEDIYA TURNS.',
    fx: '<span class="haunt-tint"></span><span class="haunt-moon"></span>',
  },
  ateswar: {
    line: 'ATESWAR RISES. HEAD: 404',
    fx: '<span class="haunt-ripple"></span><span class="haunt-ripple"></span><span class="haunt-ripple"></span><span class="haunt-head">?</span>',
  },
  'bagowa-bhoot': {
    line: 'THIS WAY, TRAVELLER… ROAR!',
    fx: '<span class="haunt-tint"></span><span class="haunt-claw"></span><span class="haunt-claw"></span><span class="haunt-claw"></span>',
  },
  barul: {
    line: 'A WHIRLWIND! BARUL PASSES.',
    fx: leaves,
  },
  bayangi: {
    line: 'BAYANGI BRINGS WEALTH! +₹1',
    fx: `${coins}<span class="haunt-plus">+1</span>`,
  },
  'besho-bhoot': {
    line: 'YOU STEPPED OVER BAMBOO…',
    fx: '<span class="haunt-bamboo"></span><span class="haunt-alert">!</span>',
  },
  brahmadaitya: {
    line: 'HELP GIVEN. QUEST COMPLETE!',
    fx: `${blossoms}<span class="haunt-sparkle">✦</span><span class="haunt-sparkle">✦</span>`,
  },
  brahmarakshasa: {
    line: 'FAVOUR OR FEAST? CHOOSE.',
    fx: `<span class="haunt-tint"></span>${pages}`,
  },
};

export const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
