// Screenshot haunted cards mid-animation so you can check them visually.
//
// Usage:
//   node shoot.mjs <out-dir> [--url http://localhost:5173/] [--ids id1,id2] [--dark] [--at 500,1500]
//
// Without --ids it captures every haunted card. Each card is hovered for real
// (not via the Konami code) and captured at each --at delay in milliseconds.
// Writes <out-dir>/<id>-<delay>[-dark].png and prints console errors, failed
// requests and the HAUNT-OK / HAUNT-FAIL checks for each card.
import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const args = process.argv.slice(2);
const out = args[0];
if (!out || out.startsWith('--')) {
  console.error('usage: node shoot.mjs <out-dir> [--url URL] [--ids a,b] [--dark] [--at 500,1500]');
  process.exit(2);
}
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const url = opt('url', 'http://localhost:5173/');
const ids = opt('ids', '')?.split(',').filter(Boolean);
const delays = opt('at', '500,1500').split(',').map(Number);
const dark = args.includes('--dark');

// Prefer an already-downloaded Playwright Chromium so nothing needs installing.
function cachedChromium() {
  const base = join(homedir(), '.cache', 'ms-playwright');
  if (!existsSync(base)) return undefined;
  for (const dir of readdirSync(base).filter((d) => d.startsWith('chromium-')).sort().reverse()) {
    for (const rel of ['chrome-linux/chrome', 'chrome-linux64/chrome', 'chrome-mac/Chromium.app/Contents/MacOS/Chromium']) {
      const p = join(base, dir, rel);
      if (existsSync(p)) return p;
    }
  }
  return undefined;
}

const browser = await chromium.launch({ executablePath: cachedChromium() });
const page = await browser.newPage({ viewport: { width: 1300, height: 900 }, colorScheme: dark ? 'dark' : 'light' });
const errors = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text()}`));
page.on('requestfailed', (r) => errors.push(`requestfailed: ${r.url()}`));

await page.goto(url);
await page.waitForSelector('.haunt', { timeout: 15000 });

const all = await page.$$eval('.haunt', (els) => els.map((e) => [...e.classList].find((c) => c.startsWith('haunt--')).slice(7)));
console.log(`haunted cards on page: ${all.length} (${all.join(', ')})`);
const targets = ids?.length ? ids : all;

for (const id of targets) {
  const card = await page.$(`.haunt--${id}`);
  if (!card) { console.log(`HAUNT-FAIL ${id}: no card with class haunt--${id} (typo in HAUNTS key, or no portrait crop?)`); continue; }
  await page.mouse.move(1, 1);
  await card.scrollIntoViewIfNeeded();
  await card.hover();
  let elapsed = 0;
  for (const at of delays) {
    await page.waitForTimeout(at - elapsed);
    elapsed = at;
    await card.screenshot({ path: join(out, `${id}-${at}${dark ? '-dark' : ''}.png`) });
  }
  const check = await card.evaluate((el) => {
    const media = el.querySelector('.card-media').getBoundingClientRect();
    const say = el.querySelector('.haunt-say');
    const text = el.querySelector('.haunt-text');
    const fx = [...el.querySelectorAll('.haunt-fx > *')];
    return {
      haunting: el.classList.contains('is-haunting'),
      mediaSquare: Math.abs(media.width - media.height) < 2,
      fitsDialog: text.getBoundingClientRect().width <= say.clientWidth,
      visibleFx: fx.filter((n) => getComputedStyle(n).opacity !== '0').length,
      totalFx: fx.length,
    };
  });
  const problems = [];
  if (!check.haunting) problems.push('is-haunting class not set on hover');
  if (!check.mediaSquare) problems.push('card-media is not square');
  if (!check.fitsDialog) problems.push('dialog line overflows; shorten it');
  if (check.totalFx && !check.visibleFx) problems.push('no fx element is visible at the last capture (check selectors / nth-of-type)');
  console.log(problems.length ? `HAUNT-FAIL ${id}: ${problems.join('; ')}` : `HAUNT-OK ${id} (${check.visibleFx}/${check.totalFx} fx visible)`);
}

console.log(errors.length ? `ERRORS:\n${errors.join('\n')}` : 'no console errors');
await browser.close();
