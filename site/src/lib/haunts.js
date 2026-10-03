// The first ten entries get a hover "encounter" in the style of their pixel-art
// portraits: stepped, frame-by-frame motion and an RPG dialog box over the label.
// Each effect is drawn from the entry's own claims (dusk, hound bells, full moon,
// headless water ghost, tiger roar, whirlwind, captive wealth, raised bamboo,
// a finished ghostly term, favour-or-feast, a gunin's summoning, sleep and
// drained blood, road accidents, lights that follow and change colour,
// possession, a woman behind the unsourced cat, backward feet, harvest
// offerings, a shapeless form, two traditions under one name, a practitioner's
// summoning, a possessing spirit changing bodies, dark fur, the horse the
// headless rider's portrait left out, one leg, a one-legged hop shedding the
// invented foliage, vengeance, divine music, lamps for a spirit denied its rites,
// a disguise, a dwarf, suffocation in the dark, a still pond, a fetched throne,
// a tree-sitter's droppings, a bird that hears names, smokeless flame, long arms
// and shapeshifting, a lost traveller, rag-washing at a pond, a curse, a search
// for the living, embers in the mouth, thrown stones, and a white-horse rider
// out late, a ghost that lingers, rebellion, cemetery mist, fish, anklets and
// scent, a stolen face, a guardian's tree, wooden sandals, a disturbed peepal,
// "come tomorrow", a call that comes only twice, a bidi request, a name told in
// many tales, invisibility and red eyes, a runny nose, former lovers, hunger
// that is never sated, a guise over a demoness, stolen sweets, an owl's false directions, a fighter of two alignments,
// a predator that stirs, avalanches, a head that differs by text, a deceased
// Brahmin turned fiend, conch bangles, a battle death, wet hair, and a
// shapeshifter that keeps animal traits).
// The fx strings are static markup rendered with {@html}; nothing user-supplied.
const leaves = [0, 0.15, 0.3, 0.45].map((d, i) => `<span class="haunt-leaf" style="--r:${60 + i * 12}px;animation-delay:${d}s"></span>`).join('');
const coins = [-34, -6, 26].map((dx, i) => `<span class="haunt-coin" style="--dx:${dx}px;animation-delay:${0.25 + i * 0.2}s"></span>`).join('');
const blossoms = [14, 32, 70, 86].map((x, i) => `<span class="haunt-blossom" style="left:${x}%;animation-delay:${i * 0.35}s"></span>`).join('');
const sparks = [[38, 0], [62, 0.25], [50, 0.5]].map(([x, d]) => `<span class="haunt-spark" style="left:${x}%;animation-delay:${0.3 + d}s"></span>`).join('');
const zs = [[64, 34, 11, 0], [73, 25, 14, 0.4], [82, 16, 17, 0.8]].map(([x, y, size, d]) => `<span class="haunt-z" style="left:${x}%;top:${y}%;font-size:${size}px;animation-delay:${d}s">Z</span>`).join('');
const headlights = [6, 17].map((x) => `<span class="haunt-headlight" style="left:${x}%"></span>`).join('');
const eyelids = [50.2, 58.1].map((x) => `<span class="haunt-eyelid" style="left:${x}%"></span>`).join('');
const footprints = [[40, 77, 0.3], [28, 80, 0.55], [16, 77, 0.8], [4, 80, 1.05]].map(([x, y, d]) => `<span class="haunt-footprint" style="left:${x}%;top:${y}%;animation-delay:${d}s"></span>`).join('');
const grains = [[22, 66, 0], [36, 33, 0.2], [64, -33, 0.4], [78, -66, 0.6]].map(([x, dx, d]) => `<span class="haunt-grain" style="left:${x}%;--dx:${dx}px;animation-delay:${d}s"></span>`).join('');
const shapes = [[18, 30, 0], [74, 22, 0.4], [80, 56, 0.8]].map(([x, y, d]) => `<span class="haunt-shape" style="left:${x}%;top:${y}%;animation-delay:${d}s">?</span>`).join('');
const pines = [0, 86].map((x, i) => `<span class="haunt-pine" style="left:${x}%;animation-delay:${0.2 + i * 0.15}s"></span>`).join('');
const hooves = [[8, 79, 0.2], [20, 76, 0.4], [74, 79, 0.6], [86, 76, 0.8]].map(([x, y, d]) => `<span class="haunt-hoof" style="left:${x}%;top:${y}%;animation-delay:${d}s"></span>`).join('');
const shed = [[34, 26, 0], [60, 38, 0.45], [44, 50, 0.9]].map(([x, y, d]) => `<span class="haunt-shed" style="left:${x}%;top:${y}%;animation-delay:${d}s"></span>`).join('');
const melody = [[80, 28, '♪', 0], [70, 40, '♫', 0.4], [88, 44, '♪', 0.8]].map(([x, y, n, d]) => `<span class="haunt-melody" style="left:${x}%;top:${y}%;animation-delay:${d}s">${n}</span>`).join('');
const lamps = [3, 88].map((x, i) => `<span class="haunt-lamp" style="left:${x}%;animation-delay:${0.4 + i * 0.3}s"></span>`).join('');
const countdown = [3, 2, 1].map((n, i) => `<span class="haunt-count" style="animation-delay:${0.4 + i * 0.6}s">${n}</span>`).join('');
const embers = [[30, 0], [46, 0.3], [60, 0.6], [72, 0.15]].map(([x, d]) => `<span class="haunt-ember" style="left:${x}%;animation-delay:${d}s"></span>`).join('');
const hearts = [[72, 40, 0], [82, 28, 0.6]].map(([x, y, d]) => `<span class="haunt-heart" style="left:${x}%;top:${y}%;animation-delay:${d}s"></span>`).join('');
const cinders = [[60, 0], [66, 0.4], [56, 0.8]].map(([x, d]) => `<span class="haunt-cinder" style="left:${x}%;animation-delay:${0.4 + d}s"></span>`).join('');
const arrows = ['→', '↑', '←', '↓'].map((a, i) => `<span class="haunt-arrow" style="animation-delay:${i * 0.4}s">${a}</span>`).join('');
const reechEyes = [52.5, 59.5].map((x) => `<span class="haunt-reech-eye" style="left:${x}%"></span>`).join('');
const boulders = [[6, 0], [20, 0.35], [72, 0.15], [86, 0.5], [30, 0.7]].map(([x, d]) => `<span class="haunt-boulder" style="left:${x}%;animation-delay:${d}s"></span>`).join('');
const fiendEyes = [43.5, 50.5].map((x) => `<span class="haunt-fiend-eye" style="left:${x}%"></span>`).join('');
const clinks = [[31, 56, 0.2], [71.5, 54, 0.6]].map(([x, y, d]) => `<span class="haunt-clink" style="left:${x}%;top:${y}%;animation-delay:${d}s"></span>`).join('');
const hairdrips = [[12, 0], [22, 0.5], [80, 0.25], [90, 0.75]].map(([x, d]) => `<span class="haunt-hairdrip" style="left:${x}%;animation-delay:${d}s"></span>`).join('');
const rings = [0, 0.5, 1].map((d) => `<span class="haunt-ring" style="animation-delay:${d}s"></span>`).join('');
const sand = [[16, 0], [34, 0.3], [52, 0.15], [68, 0.45]].map(([y, d]) => `<span class="haunt-sand" style="top:${y}%;animation-delay:${d}s"></span>`).join('');
const stones = [[96, 22, -150, 0.2], [96, 34, -110, 0.7], [-4, 28, 130, 1.2]].map(([x, y, dx, d]) => `<span class="haunt-stone" style="left:${x}%;top:${y}%;--dx:${dx}px;animation-delay:${d}s"></span>`).join('');
const mists = [[0, 0], [52, 0.6]].map(([x, d]) => `<span class="haunt-mist" style="left:${x}%;animation-delay:${d}s"></span>`).join('');
const chimes = [[38, 76, 0], [54, 78, 0.25], [46, 74, 0.5]].map(([x, y, d]) => `<span class="haunt-chime" style="left:${x}%;top:${y}%;animation-delay:${d}s">✦</span>`).join('');
const scents = [[24, 48, 0], [74, 40, 0.6]].map(([x, y, d]) => `<span class="haunt-scent" style="left:${x}%;top:${y}%;animation-delay:${d}s">~</span>`).join('');
const sprouts = [[10, 54, 0.2], [22, 62, 0.4], [80, 52, 0.6], [90, 62, 0.8]].map(([x, y, d]) => `<span class="haunt-sprout" style="left:${x}%;top:${y}%;animation-delay:${d}s"></span>`).join('');
const clacks = [[18, 70], [68, 70]].map(([x, y]) => `<span class="haunt-clack" style="left:${x}%;top:${y}%">CLACK</span>`).join('');
const peepal = [[74, 36, 0], [86, 44, 0.45], [80, 52, 0.9]].map(([x, y, d]) => `<span class="haunt-peepal" style="left:${x}%;top:${y}%;animation-delay:${d}s"></span>`).join('');
const knocks = [[64, 40], [72, 54]].map(([x, y]) => `<span class="haunt-knock" style="left:${x}%;top:${y}%">KNOCK</span>`).join('');
const calls = ['CALL 1', 'CALL 2'].map((t) => `<span class="haunt-call">${t}</span>`).join('');
const twinkles = [[8, 10, 0], [88, 8, 0.3], [12, 58, 0.6], [86, 54, 0.9]].map(([x, y, d]) => `<span class="haunt-twinkle" style="left:${x}%;top:${y}%;animation-delay:${d}s">✦</span>`).join('');
const glints = [36, 44].map((x) => `<span class="haunt-glint" style="left:${x}%"></span>`).join('');
const drips = [0, 0.6].map((d) => `<span class="haunt-drip" style="animation-delay:${d}s"></span>`).join('');
const laddoos = [[8, 66, 0.5], [16, 66, 0.9], [12, 61, 1.3]].map(([x, y, d]) => `<span class="haunt-laddoo" style="left:${x}%;top:${y}%;animation-delay:${d}s"></span>`).join('');
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
  chanda: {
    line: 'SUMMONED BY A GUNIN…',
    fx: `<span class="haunt-ring"></span>${sparks}`,
  },
  chedipe: {
    line: 'ZZZ… CHEDIPE DRAINS YOUR HP',
    fx: `<span class="haunt-tint"></span>${zs}<span class="haunt-hp">HP<span class="haunt-hp-bar"></span></span>`,
  },
  chetkin: {
    line: 'DRIVE SAFE. CHETKIN WAITS.',
    fx: `<span class="haunt-road"></span>${headlights}<span class="haunt-flash"></span>`,
  },
  chirbatti: {
    line: 'THE LIGHTS ARE FOLLOWING…',
    fx: '<span class="haunt-tint"></span>',
  },
  chiroguni: {
    line: 'POSSESSED! CONTROLS SWAPPED',
    fx: '<span class="haunt-tint"></span><span class="haunt-p2">P2</span>',
  },
  chordewa: {
    line: 'THE CAT IS A LIE…',
    fx: `<span class="haunt-tint"></span>${eyelids}`,
  },
  chudail: {
    line: 'HER FEET FACE BACKWARD…',
    fx: `<span class="haunt-tint"></span>${footprints}`,
  },
  daag: {
    line: 'DAAG DEMANDS YOUR HARVEST.',
    fx: `<span class="haunt-tint"></span>${grains}`,
  },
  'dakan-sakan': {
    line: 'DAKAN SAKAN HAS NO SHAPE…',
    fx: shapes,
  },
  dakini: {
    line: 'ONE NAME, TWO TRADITIONS.',
    fx: '<span class="haunt-half"></span><span class="haunt-half"></span>',
  },
  damori: {
    line: 'GO, DAMORI! I CHOOSE YOU!',
    fx: '<span class="haunt-orb"></span><span class="haunt-burst"></span>',
  },
  dayani: {
    line: 'BODY SWAP! DAYANI MOVES ON',
    fx: '<span class="haunt-wisp"></span>',
  },
  drakshi: {
    line: 'DRAKSHI: DARK FUR, NOT ICE',
    fx: `<span class="haunt-tint"></span>${pines}`,
  },
  dund: {
    line: 'CLOP CLOP… DUND RIDES BY.',
    fx: hooves,
  },
  ekanore: {
    line: 'EKANORE: 1 EAR, 1 LEG.',
    fx: '<span class="haunt-dust"></span><span class="haunt-dust"></span>',
  },
  ekthengo: {
    line: 'ONE LEG, NO TREE. HOP!',
    fx: shed,
  },
  galasi: {
    line: 'GALASI WANTS VENGEANCE…',
    fx: '<span class="haunt-tint"></span>',
  },
  gandharva: {
    line: 'DIVINE MUSIC… PERFECT!',
    fx: `<span class="haunt-tint"></span>${melody}<span class="haunt-perfect">PERFECT!</span>`,
  },
  gayal: {
    line: 'NO RITES. LIGHT THE LAMPS.',
    fx: `<span class="haunt-tint"></span>${lamps}`,
  },
  ghoul: {
    line: 'HI! I AM A NORMAL PERSON.',
    fx: '<span class="haunt-tint"></span><span class="haunt-tag">HELLO<b>HUMAN</b></span>',
  },
  'gutiya-deo': {
    line: 'TINY BUT HAUNTING. GUTIYA!',
    fx: '<span class="haunt-ruler"></span><span class="haunt-marker">◄</span>',
  },
  guyasi: {
    line: 'AIR RUNNING OUT… GUYASI.',
    fx: `<span class="haunt-dark"></span>${countdown}`,
  },
  hara: {
    line: 'NOT A FOREST. A STILL POND',
    fx: '<span class="haunt-tint"></span><span class="haunt-pond"></span>',
  },
  ifrit: {
    line: 'THE THRONE? I’LL FETCH IT.',
    fx: '<span class="haunt-puff"></span><span class="haunt-throne"></span>',
  },
  jhapri: {
    line: 'LOOK UP! …TOO LATE.',
    fx: '<span class="haunt-drop"></span><span class="haunt-splat"></span>',
  },
  jilaiya: {
    line: 'DON’T SAY YOUR NAME…',
    fx: '<span class="haunt-tint"></span><span class="haunt-name">NAME?<span class="haunt-cursor">_</span></span>',
  },
  jinn: {
    line: 'NOT EVERY JINN IS EVIL.',
    fx: embers,
  },
  kalpurush: {
    line: 'LONG ARMS. MANY SHAPES.',
    fx: '<span class="haunt-tint"></span>',
  },
  kanavulo: {
    line: 'WHICH WAY? YOU’RE LOST…',
    fx: '<span class="haunt-tint"></span><span class="haunt-compass"><span class="haunt-needle"></span></span>',
  },
  kanipishachi: {
    line: 'TORN CLOTHES? SHE SEES YOU',
    fx: '<span class="haunt-ripple"></span><span class="haunt-ripple"></span><span class="haunt-alert">!</span>',
  },
  khabish: {
    line: 'PASSING BY? YOU’RE CURSED',
    fx: '<span class="haunt-tint"></span><span class="haunt-status">CURSED</span>',
  },
  kichin: {
    line: 'KICHIN SEEKS THE LIVING…',
    fx: `<span class="haunt-tint"></span>${hearts}`,
  },
  'kollivai-pisaasu': {
    line: 'WILL-O’-WISP? NOT QUITE.',
    fx: `<span class="haunt-tint"></span><span class="haunt-maw"></span>${cinders}`,
  },
  'kutti-chaathan': {
    line: 'WHO THREW THAT STONE?',
    fx: stones,
  },
  malandu: {
    line: 'TOO LATE TO BE OUTSIDE…',
    fx: '<span class="haunt-tint"></span><span class="haunt-clock">11<span class="haunt-colon">:</span>59</span>',
  },
  mamdo: {
    line: 'MAMDO LINGERS IN BENGAL…',
    fx: '<span class="haunt-tint"></span>',
  },
  marid: {
    line: 'COMMAND: OBEY? MARID: NO.',
    fx: '<span class="haunt-menu"><span class="haunt-pick">▶</span>OBEY<br>REFUSE</span>',
  },
  masan: {
    line: 'THE CEMETERY IS NOT EMPTY',
    fx: `<span class="haunt-tint"></span>${mists}`,
  },
  'mechho-bhoot': {
    line: 'FISH SPOTTED! +1 MECHHO',
    fx: '<span class="haunt-fish"></span><span class="haunt-plus">+1</span>',
  },
  mohini: {
    line: 'ANKLETS JINGLE… MOHINI.',
    fx: chimes + scents,
  },
  munchowa: {
    line: 'HP FULL. FACE… GONE.',
    fx: '<span class="haunt-tint"></span><span class="haunt-face">☺</span>',
  },
  'muni-pei': {
    line: 'MUNI PEI GUARDS THE TREE.',
    fx: `${sprouts}<span class="haunt-def">DEF ▲</span>`,
  },
  munish: {
    line: 'WOODEN SANDALS… IT’S FAMILY',
    fx: clacks,
  },
  munjya: {
    line: 'DON’T TOUCH HIS PEEPAL TREE',
    fx: `${peepal}<span class="haunt-stone"></span>`,
  },
  'nali-ba': {
    line: 'NAALE BA! COME TOMORROW.',
    fx: `<span class="haunt-tint"></span>${knocks}`,
  },
  nishidaak: {
    line: 'IT CALLS TWICE. WAIT FOR 3',
    fx: `<span class="haunt-tint"></span>${calls}`,
  },
  pandabba: {
    line: 'GOT A BIDI? HAND IT OVER.',
    fx: '<span class="haunt-menu">GIVE BIDI?<br><span class="haunt-pick">▶</span>YES&nbsp;&nbsp;NO</span>',
  },
  pari: {
    line: 'A NAME FROM MANY TALES…',
    fx: twinkles,
  },
  pishachas: {
    line: 'NOW YOU SEE IT… NOW YOU…',
    fx: glints,
  },
  potachunni: {
    line: '*SNIFF*… POTACHUNNI.',
    fx: '<span class="haunt-snot"></span><span class="haunt-sniff">*SNIFF*</span>',
  },
  prapti: {
    line: 'FORMER LOVERS, BEWARE…',
    fx: '<span class="haunt-tint"></span><span class="haunt-heart"></span><span class="haunt-crack"></span>',
  },
  preta: {
    line: 'NEVER FULL. NEVER SATED.',
    fx: `${drips}<span class="haunt-hunger">FOOD<span class="haunt-pips"></span></span>`,
  },
  putana: {
    line: 'A FAIR GUISE… A DEMONESS.',
    fx: '<span class="haunt-tint"></span>',
  },
  puwali: {
    line: 'WHERE DID THE SWEETS GO?',
    fx: `<span class="haunt-plate"></span>${laddoos}<span class="haunt-plus">+1</span>`,
  },
  pyachapechi: {
    line: 'WHOO? THIS WAY, TRAVELLER.',
    fx: arrows,
  },
  rakshasa: {
    line: 'SHAPE-CHANGER. FRIEND? FOE?',
    fx: '<span class="haunt-foe">ALIGN: HOSTILE</span><span class="haunt-ally">ALIGN: HELPFUL</span>',
  },
  reech: {
    line: 'A WILD REECH APPEARED!',
    fx: `<span class="haunt-tint"></span>${reechEyes}<span class="haunt-alert">!</span>`,
  },
  runia: {
    line: 'WATCH OUT! AVALANCHE!',
    fx: boulders,
  },
  sakini: {
    line: 'LION OR CAT? ASK THE TEXT.',
    fx: '<span class="haunt-mane"></span><span class="haunt-lion">LION<br>SRIMATOTTARA</span><span class="haunt-cat">CAT<br>KULARNAVA</span>',
  },
  samandha: {
    line: 'BRAHMIN… NOW A FIEND.',
    fx: `<span class="haunt-tint"></span>${fiendEyes}`,
  },
  shankhchunni: {
    line: 'CLINK! SHE WANTS HER HOME.',
    fx: `<span class="haunt-tint"></span>${clinks}<span class="haunt-clinktext">CLINK!</span>`,
  },
  shayeed: {
    line: 'KILLED IN BATTLE… SHAYEED.',
    fx: '<span class="haunt-glint"></span><span class="haunt-clang">CLANG!</span>',
  },
  'sheekol-buri': {
    line: 'DRIP… DRIP… SHEEKOL BURI.',
    fx: `${rings}${hairdrips}`,
  },
  sila: {
    line: 'SHAPESHIFTER… MIND THE EARS.',
    fx: `<span class="haunt-tint"></span>${sand}<span class="haunt-ear-l"></span><span class="haunt-ear-r"></span>`,
  },
};

export const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
