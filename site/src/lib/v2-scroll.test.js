// Issues 17-23: pure scroll/tick helpers for the /v2/ row (site/src/lib/v2-scroll.js).
// Run all: node --test site/src/lib/v2-scroll.test.js
// Run one issue: node --test --test-name-pattern="^21 " site/src/lib/v2-scroll.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';

const lib = () => import('./v2-scroll.js'); // per-test import so a missing export fails only its own issue

// Issue 16's hover/hold helpers (SLOW, RAMP, edgeSpeed, nextScroll) are replaced by issues 21 and 22; see test 22 below.

test('17 · wheelDelta turns any wheel into a small, capped sideways step', async () => {
  const { WHEEL_MAX, wheelDelta } = await lib();
  assert.ok(WHEEL_MAX > 0 && WHEEL_MAX <= 48, `WHEEL_MAX: ${WHEEL_MAX}`);
  const d = wheelDelta({ deltaX: 0, deltaY: 100, deltaMode: 0 });
  assert.ok(d > 0 && d <= WHEEL_MAX, `vertical wheel scrolls right: ${d}`);
  assert.ok(wheelDelta({ deltaX: 0, deltaY: -100, deltaMode: 0 }) < 0, 'up/back scrolls left');
  assert.ok(wheelDelta({ deltaX: -40, deltaY: 5, deltaMode: 0 }) < 0, 'trackpad sideways swipe wins over a small vertical');
  assert.equal(wheelDelta({ deltaX: 0, deltaY: 1e4, deltaMode: 0 }), WHEEL_MAX, 'capped');
  assert.ok(wheelDelta({ deltaX: 0, deltaY: 3, deltaMode: 1 }) > wheelDelta({ deltaX: 0, deltaY: 3, deltaMode: 0 }), 'line mode scaled up');
  assert.equal(wheelDelta({ deltaX: 0, deltaY: 0, deltaMode: 0 }), 0);
});

test('18 · ticksBetween counts ghosts passing a fixed point', async () => {
  const { tickIndex, ticksBetween } = await lib();
  assert.equal(tickIndex(0, 100), 0);
  assert.equal(tickIndex(250, 100), 2);
  assert.equal(tickIndex(50, 100, 60), 1, 'offset moves the fixed point (e.g. stage centre)');
  assert.equal(ticksBetween(0, 99, 100), 0);
  assert.equal(ticksBetween(0, 100, 100), 1);
  assert.equal(ticksBetween(250, 40, 100), 2, 'counts both directions');
  assert.equal(ticksBetween(0, 500, 0), 0, 'zero pitch (not laid out yet) never ticks');
});

test('21 · glideAt eases from start to target over GLIDE_MS', async () => {
  const { GLIDE_MS, glideAt } = await lib();
  assert.ok(GLIDE_MS >= 600 && GLIDE_MS <= 1200, `GLIDE_MS is a calm glide: ${GLIDE_MS}`);
  assert.equal(glideAt(100, 600, 0, 900), 100, 'starts at from');
  assert.equal(glideAt(100, 600, -50, 900), 100, 'before start stays at from');
  assert.equal(glideAt(100, 600, 900, 900), 600, 'lands exactly on target');
  assert.equal(glideAt(100, 600, 5000, 900), 600, 'a late frame still lands on target, no overshoot');
  assert.equal(glideAt(100, 600, 0, 0), 600, 'zero duration (reduced motion) jumps');
  for (let t = 0; t < 900; t += 15) {
    assert.ok(glideAt(100, 600, t + 15, 900) >= glideAt(100, 600, t, 900), 'monotonic right');
    assert.ok(glideAt(600, 100, t + 15, 900) <= glideAt(600, 100, t, 900), 'monotonic left');
  }
  assert.ok(glideAt(0, 1000, 45, 900) < 50, 'eases in: first 5% of the time covers under 5% of the way');
  assert.ok(glideAt(0, 1000, 855, 900) > 950, 'eases out: last 5% of the time covers under 5% of the way');
});

test('21 · clickStep moves about half the visible row in whole figures', async () => {
  const { clickStep } = await lib();
  const step = clickStep(1150, 43);
  assert.equal(step % 43, 0, `whole figures: ${step}`);
  assert.ok(step >= 1150 * 0.35 && step <= 1150 * 0.6, `about half the row: ${step}`);
  assert.equal(clickStep(30, 43), 43, 'always at least one figure');
  assert.equal(clickStep(1150, 0), 0, 'not laid out yet: no move');
});

test('22 · the hover/hold velocity helpers are gone', async () => {
  const m = await lib();
  for (const name of ['SLOW', 'RAMP', 'edgeSpeed', 'nextScroll']) assert.equal(m[name], undefined, `${name} removed`);
});

test('23 · easeOut starts at speed so wheel notches chain without stalling', async () => {
  const { WHEEL_MS, easeOut, glideAt } = await lib();
  assert.ok(WHEEL_MS >= 120 && WHEEL_MS <= 400, `WHEEL_MS: ${WHEEL_MS}`);
  assert.equal(easeOut(0), 0);
  assert.equal(easeOut(1), 1);
  assert.ok(easeOut(0.1) > 0.2, 'moves at once instead of easing in');
  for (let t = 0; t < 1; t += 0.05) assert.ok(easeOut(t + 0.05) >= easeOut(t), 'monotonic');
  assert.ok(glideAt(0, 100, WHEEL_MS * 0.1, WHEEL_MS, easeOut) > 20, 'glideAt takes the ease as a 5th argument');
  assert.equal(glideAt(0, 100, WHEEL_MS, WHEEL_MS, easeOut), 100);
});
