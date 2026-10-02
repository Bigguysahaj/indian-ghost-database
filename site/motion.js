// Character motion for portrait cards: a spring-driven 3D tilt with parallax,
// glare and a moving shadow, plus overlays tuned to each ghost's demeanour.
// Opt-in per ghost id via PERSONAS; every other card keeps the plain hover.
// Overlay coordinates are fractions of the 234x217 portrait crop.
(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

  // tilt: max degrees; k/d: spring stiffness/damping (low k = heavy or floaty,
  // low d relative to k = overshoot); parallax: px the art slides toward the
  // cursor (negative = shies away); invert: tilts the wrong way; delay: ms
  // before the ghost reacts at all.
  const PERSONAS = {
    // Learned Brahmin turned demon: heavy, slow to move, eyes kindle and
    // sacred syllables lift off the manuscript.
    brahmarakshasa: {
      tilt: 6, k: 55, d: 13, parallax: 3,
      build(fx) {
        eyes(fx, [[0.49, 0.224], [0.565, 0.223]], '#ff5a1f', 0.09, 'm-eye-kindle');
        const glyphs = add(fx, 'div', 'm-glyphs');
        ['ॐ', 'श्री', 'क', 'ज्ञ', 'ह्रीं', 'अ'].forEach((g, i) => {
          const s = add(glyphs, 'span', 'm-glyph');
          s.textContent = g;
          s.style.setProperty('--i', i);
        });
      },
    },
    // Shrouded figure: floats, lags and overshoots, drifts away from you,
    // and the rags ripple as if in a wind.
    chanda: {
      tilt: 5, k: 20, d: 4.5, parallax: -5,
      build(fx, card) {
        eyes(fx, [[0.538, 0.072], [0.566, 0.07]], '#e8f2ff', 0.05);
        wind(card);
      },
      tick(st) {
        const scale = (st.hot.x * 7).toFixed(2);
        if (scale !== st.windScale) {
          st.windScale = scale;
          st.windMap.setAttribute('scale', scale);
          st.img.style.filter = st.hot.x > 0.02 ? `url(#${st.windId})` : '';
        }
      },
    },
    // Rides a tiger into homes at night and induces sleep: a smooth,
    // critically damped prowl sideways, night falling, the tiger's eye catching light.
    chedipe: {
      tilt: 6, tiltX: 0.35, k: 80, d: 17, parallax: 8, parallaxY: 0.15,
      build(fx) {
        add(fx, 'div', 'm-night');
        eyes(fx, [[0.777, 0.565], [0.845, 0.567]], '#ffc23d', 0.05, 'm-eye-glint');
        eyes(fx, [[0.504, 0.072], [0.525, 0.072]], '#bfe0ff', 0.04);
      },
    },
    // Causes road accidents: twitchy, underdamped jolts, headlights sweeping past.
    chetkin: {
      tilt: 9, k: 380, d: 9, parallax: 3,
      build(fx) {
        eyes(fx, [[0.601, 0.177], [0.65, 0.177]], '#ffe14a', 0.07);
        add(fx, 'div', 'm-headlights');
      },
      enter(st) {
        kick(st, 260);
        st.nextKick = performance.now() + 500;
      },
      tick(st, now) {
        if (st.hovered && now > st.nextKick) {
          kick(st, 70 + Math.random() * 120);
          st.nextKick = now + 350 + Math.random() * 900;
        }
      },
    },
    // Ghost lights over wetlands that move, pause and follow observers,
    // changing colour.
    chirbatti: {
      tilt: 5, k: 150, d: 12, parallax: 2,
      build(fx, card, st) {
        const orbs = add(fx, 'div', 'm-orbs');
        [[0.30, 0.50, '#4aa8ff'], [0.515, 0.32, '#5bb8ff'], [0.71, 0.58, '#ff7a2e']].forEach(([x, y, c], i) => {
          const o = add(orbs, 'span', 'm-orb');
          o.style.cssText = `--x:${x * 100}%;--y:${y * 100}%;--c:${c};--i:${i}`;
        });
        st.ox = spring(); st.oy = spring();
        st.phaseEnd = 0; st.moving = false;
      },
      tick(st, now, dt) {
        if (now > st.phaseEnd) {
          st.moving = !st.moving;
          st.phaseEnd = now + (st.moving ? 650 : 550) + Math.random() * 400;
        }
        if (!st.hovered) { st.ox.t = 0; st.oy.t = 0; }
        else if (st.moving) { st.ox.t = st.nx * 9; st.oy.t = st.ny * 9; }
        step(st.ox, 40, 9, dt); step(st.oy, 40, 9, dt);
        st.el.style.setProperty('--ox', `${st.ox.x.toFixed(2)}px`);
        st.el.style.setProperty('--oy', `${st.oy.x.toFixed(2)}px`);
        return settled(st.ox) && settled(st.oy);
      },
    },
    // Possesses people: utterly still, then late, convulsive seizures, and
    // she tilts the wrong way.
    chiroguni: {
      tilt: 7, k: 420, d: 10, parallax: -3, invert: true, delay: 650,
      enter(st) { st.nextSeize = performance.now() + 650; },
      tick(st, now) {
        if (st.hovered && now > st.nextSeize) {
          kick(st, 420);
          st.el.classList.add('m-seized');
          clearTimeout(st.seizeTimer);
          st.seizeTimer = setTimeout(() => st.el.classList.remove('m-seized'), 420);
          st.nextSeize = now + 1800 + Math.random() * 1600;
        }
      },
      leave(st) {
        clearTimeout(st.seizeTimer);
        st.el.classList.remove('m-seized');
      },
    },
    // Shape-shifter that stalks mothers and newborns (here drawn as a cat
    // and smoke): quick, feline, crouches, green eyes that blink, smoke curling.
    chordewa: {
      tilt: 10, k: 240, d: 16, parallax: 4,
      build(fx) {
        const smoke = add(fx, 'div', 'm-smoke');
        for (let i = 0; i < 5; i++) add(smoke, 'span', 'm-puff').style.setProperty('--i', i);
        eyes(fx, [[0.525, 0.482], [0.598, 0.482]], '#7dff5a', 0.075, 'm-eye-blink');
      },
    },
  };

  function add(parent, tag, cls) {
    const el = document.createElement(tag);
    el.className = cls;
    parent.appendChild(el);
    return el;
  }

  function eyes(fx, points, color, size, extra = '') {
    for (const [x, y] of points) {
      const e = add(fx, 'span', `m-eye ${extra}`);
      e.style.cssText = `--x:${x * 100}%;--y:${y * 100}%;--c:${color};--s:${size * 100}%`;
    }
  }

  let windCount = 0;
  function wind(card) {
    const st = card._motion;
    st.windId = `m-wind-${++windCount}`;
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'm-defs');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = `<filter id="${st.windId}" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.012 0.05" numOctaves="2" seed="3">
        <animate attributeName="baseFrequency" dur="5s" repeatCount="indefinite"
          values="0.012 0.05;0.016 0.07;0.012 0.05"/>
      </feTurbulence>
      <feDisplacementMap in="SourceGraphic" scale="0" xChannelSelector="R" yChannelSelector="G"/>
    </filter>`;
    card.appendChild(svg);
    st.windMap = svg.querySelector('feDisplacementMap');
  }

  const spring = () => ({ x: 0, v: 0, t: 0 });

  function step(s, k, d, dt) {
    s.v += (k * (s.t - s.x) - d * s.v) * dt;
    s.x += s.v * dt;
  }

  const settled = (s) => Math.abs(s.t - s.x) < 0.01 && Math.abs(s.v) < 0.01;

  function kick(st, strength) {
    st.ry.v += (Math.random() - 0.5) * strength;
    st.rx.v += (Math.random() - 0.5) * strength * 0.6;
  }

  const active = new Set();
  let last = 0;
  let raf = 0;

  function wake(st) {
    active.add(st);
    if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
  }

  function frame(now) {
    const dt = Math.min(0.032, (now - last) / 1000);
    last = now;
    for (const st of active) {
      if (!st.el.isConnected) { active.delete(st); continue; }
      const p = st.p;
      const reacting = st.hovered && now - st.enteredAt >= (p.delay || 0);
      const dir = p.invert ? -1 : 1;
      const nx = reacting ? st.nx : 0;
      const ny = reacting ? st.ny : 0;
      st.ry.t = nx * p.tilt * dir;
      st.rx.t = -ny * p.tilt * (p.tiltX ?? 1) * dir;
      st.px.t = nx * p.parallax;
      st.py.t = ny * p.parallax * (p.parallaxY ?? 1);
      st.hot.t = reacting || st.focused ? 1 : 0;
      for (const s of [st.rx, st.ry, st.px, st.py]) step(s, p.k, p.d, dt);
      step(st.hot, 60, 15, dt);

      const css = st.el.style;
      css.setProperty('--rx', `${st.rx.x.toFixed(2)}deg`);
      css.setProperty('--ry', `${st.ry.x.toFixed(2)}deg`);
      css.setProperty('--px', `${st.px.x.toFixed(2)}px`);
      css.setProperty('--py', `${st.py.x.toFixed(2)}px`);
      css.setProperty('--sx', `${(-st.ry.x * 1.2).toFixed(1)}px`);
      css.setProperty('--sy', `${(8 + st.rx.x * 1.2).toFixed(1)}px`);
      css.setProperty('--hot', st.hot.x.toFixed(3));
      css.setProperty('--gx', `${(50 + st.nx * 40).toFixed(1)}%`);
      css.setProperty('--gy', `${(50 + st.ny * 40).toFixed(1)}%`);

      const customDone = p.tick ? p.tick(st, now, dt) !== false : true;
      const done = !st.hovered && !st.focused && customDone
        && [st.rx, st.ry, st.px, st.py, st.hot].every(settled);
      if (done) {
        active.delete(st);
        st.el.classList.remove('m-live');
      }
    }
    raf = active.size ? requestAnimationFrame(frame) : 0;
  }

  function attach(card, id) {
    const p = PERSONAS[id];
    const media = card.querySelector('.card-media');
    const img = media && media.querySelector('img');
    if (!p || !img || reduceMotion.matches) return;

    const st = {
      el: card, p, img,
      rx: spring(), ry: spring(), px: spring(), py: spring(), hot: spring(),
      nx: 0, ny: 0, hovered: false, focused: false, enteredAt: 0,
    };
    card._motion = st;
    card.classList.add('m-card');
    media.dataset.motion = id;

    const stage = add(media, 'div', 'm-stage');
    const idle = add(stage, 'div', 'm-idle');
    idle.appendChild(img);
    const fx = add(idle, 'div', 'm-fx');
    add(media, 'div', 'm-glare');
    if (p.build) p.build(fx, card, st);

    card.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'touch') return;
      st.rect = card.getBoundingClientRect();
      st.hovered = true;
      st.enteredAt = performance.now();
      card.classList.add('m-live');
      if (p.enter) p.enter(st);
      wake(st);
    });
    card.addEventListener('pointermove', (e) => {
      if (!st.hovered) return;
      const r = st.rect;
      st.nx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      st.ny = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
    });
    card.addEventListener('pointerleave', () => {
      if (!st.hovered) return;
      st.hovered = false;
      st.nx = 0; st.ny = 0;
      if (p.leave) p.leave(st);
      wake(st);
    });
    card.addEventListener('focus', () => {
      st.focused = true;
      card.classList.add('m-live');
      wake(st);
    });
    card.addEventListener('blur', () => { st.focused = false; wake(st); });
  }

  window.GhostMotion = { attach };
})();
