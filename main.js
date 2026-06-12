/* Tanja Koller — interaktivnost (Aurora III: GSAP + Three.js + i18n) */
'use strict';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;
const staticMode = location.search.includes('static');
const noAnim = reduceMotion || staticMode;

if (staticMode) document.documentElement.classList.add('no-anim');

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const LANG = () => (window.TKI18N ? TKI18N.lang : 'sl');


if (!noAnim && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ---------- flower-of-life generator (hero + loader) ---------- */
function buildFlowerOfLife(host, { withGradient = false } = {}) {
  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '-110 -110 220 220');
  if (withGradient) {
    const defs = document.createElementNS(NS, 'defs');
    defs.innerHTML = `<linearGradient id="folGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#d4a853"/><stop offset=".5" stop-color="#7a6fd0"/><stop offset="1" stop-color="#5aa7d6"/>
      </linearGradient>`;
    svg.appendChild(defs);
  }
  const R = 26;
  const pts = [[0, 0]];
  for (let ring = 1; ring <= 2; ring++) {
    for (let i = 0; i < 6; i++) {
      const a = Math.PI / 3 * i;
      pts.push([Math.cos(a) * R * ring, Math.sin(a) * R * ring]);
      if (ring === 2) {
        const a2 = a + Math.PI / 6;
        pts.push([Math.cos(a2) * R * ring * Math.cos(Math.PI / 6), Math.sin(a2) * R * ring * Math.cos(Math.PI / 6)]);
      }
    }
  }
  pts.forEach(([x, y], i) => {
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', x.toFixed(2)); c.setAttribute('cy', y.toFixed(2)); c.setAttribute('r', R);
    c.setAttribute('pathLength', '1');
    c.style.setProperty('--i', i);
    svg.appendChild(c);
  });
  const outer = document.createElementNS(NS, 'circle');
  outer.setAttribute('cx', 0); outer.setAttribute('cy', 0); outer.setAttribute('r', R * 3.05);
  outer.setAttribute('pathLength', '1');
  outer.style.setProperty('--i', pts.length);
  svg.appendChild(outer);
  host.appendChild(svg);
}

/* ============================================================
   1 · PRELOADER
   ============================================================ */
const loaderDone = (function loader() {
  const el = document.getElementById('loader');
  if (!el || document.documentElement.classList.contains('tk-seen')) {
    if (el) el.remove();
    return Promise.resolve();
  }
  buildFlowerOfLife(document.getElementById('loaderFol'));
  document.body.style.overflow = 'hidden';
  sessionStorage.setItem('tk-seen', '1');
  return new Promise(resolve => {
    const finish = () => {
      el.classList.add('is-done');
      document.body.style.overflow = '';
      resolve();
      setTimeout(() => el.remove(), 1100);
    };
    setTimeout(finish, 2300);
    el.addEventListener('click', finish, { once: true });
  });
})();

/* ============================================================
   2 · KINETIC TYPE — char split (hero) + word split (h2),
   rebuilt on every language switch
   ============================================================ */
const TKSplit = (function splitType() {
  const revealed = new WeakSet();
  let wordObs;

  function splitCharsIn(node, lineIdx, counter) {
    [...node.childNodes].forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        /* chars are grouped per word so lines can only break between words */
        child.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          const word = document.createElement('span');
          word.className = 'chw';
          for (const ch of part) {
            const s = document.createElement('span');
            s.className = 'ch';
            s.textContent = ch;
            s.style.setProperty('--i', counter.i++);
            s.style.setProperty('--l', lineIdx);
            word.appendChild(s);
          }
          frag.appendChild(word);
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        splitCharsIn(child, lineIdx, counter);
      }
    });
  }

  function splitAll({ instant = false } = {}) {
    document.querySelectorAll('.hero__title .splitline').forEach((line, li) => {
      line.classList.remove('is-in');
      splitCharsIn(line, li, { i: 0 });
      if (instant) requestAnimationFrame(() => line.classList.add('is-in'));
    });

    if (wordObs) wordObs.disconnect();
    wordObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        revealed.add(e.target);
        wordObs.unobserve(e.target);
      });
    }, { threshold: .3 });

    document.querySelectorAll('[data-i18n-split]').forEach(h => {
      if (h.classList.contains('splitline')) return;
      const words = h.textContent.trim().split(/\s+/);
      h.classList.remove('reveal');
      h.classList.add('split-ready');
      h.innerHTML = words.map((w, i) =>
        `<span class="w"><span class="wi" style="--i:${i}">${w}</span></span>`).join(' ');
      if (revealed.has(h) || instant) h.classList.add('is-in');
      else { h.classList.remove('is-in'); wordObs.observe(h); }
    });
  }

  splitAll();
  /* setTimeout (not rAF): must also fire in throttled/background contexts */
  loaderDone.then(() => setTimeout(() =>
    document.querySelectorAll('.hero__title .splitline').forEach(l => l.classList.add('is-in')), 30));
  addEventListener('tk:lang', () => splitAll({ instant: true }));
  return { splitAll };
})();

/* ============================================================
   3 · CUSTOM CURSOR
   ============================================================ */
(function cursor() {
  if (!finePointer || noAnim) return;
  const ring = document.getElementById('cursor');
  const dot = document.getElementById('cursorDot');
  let tx = innerWidth / 2, ty = innerHeight / 2, x = tx, y = ty;
  addEventListener('pointermove', e => {
    tx = e.clientX; ty = e.clientY;
    dot.style.transform = `translate(${tx}px, ${ty}px) translate(-50%, -50%)`;
    ring.classList.remove('is-gone'); dot.classList.remove('is-gone');
  });
  document.documentElement.addEventListener('mouseleave', () => {
    ring.classList.add('is-gone'); dot.classList.add('is-gone');
  });
  addEventListener('pointerdown', () => ring.classList.add('is-down'));
  addEventListener('pointerup', () => ring.classList.remove('is-down'));
  const HOVER = 'a, button, summary, .chip, .energy__legend li, .gallery__grid figure';
  document.addEventListener('mouseover', e => {
    ring.classList.toggle('is-hover', !!e.target.closest(HOVER));
  });
  (function follow() {
    x += (tx - x) * .16; y += (ty - y) * .16;
    ring.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    requestAnimationFrame(follow);
  })();
})();

/* ============================================================
   4 · MAGNETIC BUTTONS
   ============================================================ */
(function magnetic() {
  if (!finePointer || noAnim) return;
  document.querySelectorAll('.btn, .voices__nav > button').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${dx * .25}px, ${dy * .35}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transition = 'transform .6s cubic-bezier(.22,.9,.3,1)';
      el.style.transform = '';
      setTimeout(() => { el.style.transition = ''; }, 600);
    });
  });
})();

/* ============================================================
   5 · HERO BACKGROUND — Three.js (hero3d.js) with 2D fallback
   ============================================================ */
(function aurora2dFallback() {
  if (window.TK_HERO3D_OK) return;
  const canvas = document.getElementById('aurora');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const hues = [355, 25, 48, 150, 205, 248, 280];
  let w, h, particles = [], mouseX = 0.5;

  function size() {
    w = canvas.width = canvas.offsetWidth * devicePixelRatio;
    h = canvas.height = canvas.offsetHeight * devicePixelRatio;
  }
  size();
  addEventListener('resize', size);

  function spawn(initial) {
    const hue = hues[Math.floor(Math.random() * hues.length)];
    return {
      x: Math.random() * w,
      y: initial ? Math.random() * h : h + 20,
      r: (Math.random() * 2.2 + .6) * devicePixelRatio,
      v: (Math.random() * .35 + .12) * devicePixelRatio,
      drift: Math.random() * .6 - .3,
      hue,
      alpha: Math.random() * .5 + .25,
      phase: Math.random() * Math.PI * 2,
    };
  }
  const COUNT = Math.min(110, Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 16000));
  for (let i = 0; i < COUNT; i++) particles.push(spawn(true));

  addEventListener('pointermove', e => { mouseX = e.clientX / innerWidth; });

  if (noAnim) {
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 70%, 70%, ${p.alpha * .6})`;
      ctx.fill();
    });
    return;
  }

  let t = 0;
  (function frame() {
    ctx.clearRect(0, 0, w, h);
    t += .004;
    const sway = (mouseX - .5) * .8;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.y -= p.v;
      p.x += Math.sin(t * 2 + p.phase) * .3 + p.drift + sway;
      if (p.y < -20 || p.x < -30 || p.x > w + 30) particles[i] = spawn(false);
      const tw = .75 + Math.sin(t * 6 + p.phase) * .25;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 72%, 72%, ${p.alpha * tw})`;
      ctx.shadowColor = `hsla(${p.hue}, 80%, 65%, .8)`;
      ctx.shadowBlur = 9 * devicePixelRatio;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    requestAnimationFrame(frame);
  })();
})();

/* hero flower of life overlay */
(function heroFol() {
  const host = document.getElementById('flowerOfLife');
  if (host && host.style.display !== 'none') buildFlowerOfLife(host, { withGradient: true });
})();

/* ============================================================
   6 · NAV
   ============================================================ */
(function nav() {
  const nav = document.getElementById('nav');
  const burger = document.getElementById('navBurger');
  const links = document.getElementById('navLinks');
  const progress = document.getElementById('navProgress');
  let lastY = scrollY;

  function onScroll() {
    const y = scrollY;
    nav.classList.toggle('is-solid', y > 40);
    if (!links.classList.contains('is-open')) {
      nav.classList.toggle('is-hidden', y > lastY && y > 500);
    }
    lastY = y;
    const total = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${total > 0 ? y / total : 0})`;
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  burger.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open);
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('is-open');
    burger.classList.remove('is-open');
  }));

  const sections = [...document.querySelectorAll('section[id]')];
  const navAnchors = [...links.querySelectorAll('a[href^="#"]')];
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      navAnchors.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => spy.observe(s));
})();

/* ============================================================
   7 · REVEAL + COUNTERS — registered immediately so they also
   work when the page loads in a throttled/background tab; the
   above-fold entrance simply completes beneath the preloader
   ============================================================ */
(function revealAndCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      obs.unobserve(e.target);
    });
  }, { threshold: .15 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  const iObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      iObs.unobserve(e.target);
    });
  }, { threshold: .25 });
  document.querySelectorAll('.imgReveal').forEach(el => iObs.observe(el));

  const counters = document.querySelectorAll('[data-count]');
  const cObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, end = +el.dataset.count, dur = 1400, t0 = performance.now();
      if (noAnim) { el.textContent = end; cObs.unobserve(el); return; }
      (function tick(now) {
        const k = Math.min(1, (now - t0) / dur);
        el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(tick);
      })(t0);
      cObs.unobserve(el);
    });
  }, { threshold: .6 });
  counters.forEach(c => cObs.observe(c));
})();

/* ============================================================
   8 · PARALLAX
   ============================================================ */
(function parallax() {
  if (noAnim) return;
  const layers = [
    { el: document.getElementById('flowerOfLife'), speed: .12 },
    { el: document.querySelector('.hero__inner'), speed: .22 },
    { el: document.querySelector('.location__media img'), speed: -.12 },
  ].filter(l => l.el);
  let ticking = false;
  function apply() {
    layers.forEach(({ el, speed }) => {
      const r = el.getBoundingClientRect();
      const mid = r.top + r.height / 2 - innerHeight / 2;
      el.style.setProperty('--plx', `${(mid * speed).toFixed(1)}px`);
    });
    ticking = false;
  }
  addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(apply); }
  }, { passive: true });
  apply();
})();

/* ============================================================
   9 · ENERGY RING
   ============================================================ */
(function energyRing() {
  const ring = document.getElementById('energyRing');
  if (!ring) return;
  const C = 2 * Math.PI * 92;
  const seg = C / 3 - 10;
  const segs = ['seg1', 'seg2', 'seg3'].map(id => document.getElementById(id));
  segs.forEach((s, i) => {
    s.style.stroke = s.dataset.col;
    s.style.strokeDasharray = `0 ${C}`;
    s.style.strokeDashoffset = -(C / 3) * i - 5;
  });
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      segs.forEach((s, i) => setTimeout(() => { s.style.strokeDasharray = `${seg} ${C - seg}`; }, i * 260));
      obs.disconnect();
    });
  }, { threshold: .4 });
  obs.observe(ring);

  document.querySelectorAll('.energy__legend li').forEach(li => {
    const target = document.getElementById(li.dataset.seg);
    li.addEventListener('mouseenter', () => {
      segs.forEach(s => s.classList.add('is-dim'));
      target.classList.remove('is-dim');
      target.classList.add('is-hot');
    });
    li.addEventListener('mouseleave', () => {
      segs.forEach(s => { s.classList.remove('is-dim'); s.classList.remove('is-hot'); });
    });
  });
})();

/* ============================================================
   10 · CHAKRA JOURNEY — GSAP ScrollTrigger pin on desktop
   (short travel, never traps the scroll); tap-to-explore on
   mobile / touch / reduced motion
   ============================================================ */
(function chakraJourney() {
  const nodesHost = document.getElementById('chakraNodes');
  const panel = document.getElementById('chakraPanel');
  const section = document.getElementById('cakre');
  const rail = document.getElementById('chakraRail');
  const sticky = document.getElementById('chakraSticky');
  if (!nodesHost || !panel) return;

  /* ordered root → crown */
  const DATA = [
    { id: 1, col: '#e25c5c', y: 50,
      sl: { name: 'Korenska čakra', sanskrit: 'Muladhara', gland: 'nadledvični žlezi',
            vodi: 'varnost, stabilnost, preživetje in zaupanje v življenje',
            ner: 'strah in tesnoba, utrujenost, bolečine v hrbtu, nogah in sklepih' },
      de: { name: 'Wurzelchakra', sanskrit: 'Muladhara', gland: 'Nebennieren',
            vodi: 'Sicherheit, Stabilität, Überleben und Urvertrauen ins Leben',
            ner: 'Angst und Unruhe, Müdigkeit, Schmerzen in Rücken, Beinen und Gelenken' } },
    { id: 2, col: '#ec8f4e', y: 42,
      sl: { name: 'Sakralna čakra', sanskrit: 'Svadhisthana', gland: 'spolne žleze',
            vodi: 'ustvarjalnost, čustva, veselje in pretok energije',
            ner: 'hormonsko neravnovesje, čustvena otopelost, pomanjkanje ustvarjalnosti' },
      de: { name: 'Sakralchakra', sanskrit: 'Svadhisthana', gland: 'Keimdrüsen',
            vodi: 'Kreativität, Gefühle, Lebensfreude und den Energiefluss',
            ner: 'hormonelles Ungleichgewicht, emotionale Taubheit, fehlende Kreativität' } },
    { id: 3, col: '#e8c34e', y: 34.5,
      sl: { name: 'Čakra sončnega pleteža', sanskrit: 'Manipura', gland: 'trebušna slinavka',
            vodi: 'osebno moč, samozavest in prebavo',
            ner: 'prebavne težave, nizka samopodoba, kopičenje stresa in jeze' },
      de: { name: 'Solarplexuschakra', sanskrit: 'Manipura', gland: 'Bauchspeicheldrüse',
            vodi: 'persönliche Kraft, Selbstvertrauen und Verdauung',
            ner: 'Verdauungsprobleme, geringes Selbstwertgefühl, angestauter Stress und Ärger' } },
    { id: 4, col: '#5fbf8a', y: 26.5,
      sl: { name: 'Srčna čakra', sanskrit: 'Anahata', gland: 'priželjc (timus)',
            vodi: 'ljubezen, sočutje, odpuščanje in odnose',
            ner: 'zaprtost vase, težave v odnosih, oslabljen imunski sistem' },
      de: { name: 'Herzchakra', sanskrit: 'Anahata', gland: 'Thymusdrüse',
            vodi: 'Liebe, Mitgefühl, Vergebung und Beziehungen',
            ner: 'Verschlossenheit, Beziehungsprobleme, geschwächtes Immunsystem' } },
    { id: 5, col: '#5aa7d6', y: 17,
      sl: { name: 'Grlena čakra', sanskrit: 'Vishuddha', gland: 'ščitnica in obščitnice',
            vodi: 'izražanje, komunikacijo in resnico do sebe',
            ner: 'težave z grlom in ščitnico, težko izražanje čustev, govorne težave' },
      de: { name: 'Halschakra', sanskrit: 'Vishuddha', gland: 'Schilddrüse und Nebenschilddrüsen',
            vodi: 'Ausdruck, Kommunikation und die Treue zu sich selbst',
            ner: 'Hals- und Schilddrüsenbeschwerden, Schwierigkeiten, Gefühle auszudrücken' } },
    { id: 6, col: '#7a6fd0', y: 9.5,
      sl: { name: 'Čakra tretjega očesa', sanskrit: 'Ajna', gland: 'hipofiza',
            vodi: 'intuicijo, jasnost misli, koncentracijo in spomin',
            ner: 'glavoboli in migrene, motnje učenja in koncentracije, nemirne misli' },
      de: { name: 'Stirnchakra (Drittes Auge)', sanskrit: 'Ajna', gland: 'Hirnanhangdrüse (Hypophyse)',
            vodi: 'Intuition, klare Gedanken, Konzentration und Gedächtnis',
            ner: 'Kopfschmerzen und Migräne, Lern- und Konzentrationsstörungen, unruhige Gedanken' } },
    { id: 7, col: '#b06fd0', y: 4.5,
      sl: { name: 'Kronska čakra', sanskrit: 'Sahasrara', gland: 'češarika (epifiza)',
            vodi: 'povezanost, zaupanje, duhovno ravnovesje in občutek smisla',
            ner: 'izčrpanost, občutek izgubljenosti, nespečnost, pomanjkanje življenjske radosti' },
      de: { name: 'Kronenchakra', sanskrit: 'Sahasrara', gland: 'Zirbeldrüse (Epiphyse)',
            vodi: 'Verbundenheit, Vertrauen, geistiges Gleichgewicht und Sinnempfinden',
            ner: 'Erschöpfung, Gefühl der Verlorenheit, Schlaflosigkeit, fehlende Lebensfreude' } },
  ];
  const L = {
    sl: { of: 'od', gland: 'Usmerja žlezo', vodi: 'Vodi', ner: 'Znaki neravnovesja', cakra: 'čakra' },
    de: { of: 'von', gland: 'Steuert die Drüse', vodi: 'Lenkt', ner: 'Zeichen eines Ungleichgewichts', cakra: 'Chakra' },
  };

  let current = -1;
  function render(idx, force) {
    if (idx === current && !force) return;
    current = idx;
    const d = DATA[idx], tr = d[LANG()], lab = L[LANG()];
    panel.style.setProperty('--col', d.col);
    sticky.style.setProperty('--glow', d.col);
    panel.innerHTML = `
      <div class="cp-fade">
        <p class="cp-eyebrow">${d.id}. ${lab.cakra} · ${d.id} ${lab.of} 7</p>
        <h3>${tr.name}</h3>
        <p class="cp-sanskrit">${tr.sanskrit}</p>
        <dl>
          <div><dt>${lab.gland}</dt><dd>${tr.gland}</dd></div>
          <div><dt>${lab.vodi}</dt><dd>${tr.vodi}</dd></div>
          <div><dt>${lab.ner}</dt><dd>${tr.ner}</dd></div>
        </dl>
      </div>`;
    nodesHost.querySelectorAll('.chakraNode').forEach((n, i) => {
      n.classList.toggle('is-active', i === idx);
      n.classList.toggle('is-passed', i < idx);
    });
    if (rail) [...rail.children].forEach((dot, i) => dot.classList.toggle('is-lit', i <= idx));
  }

  /* desktop: GSAP pin with a short, non-trapping travel */
  let st = null;
  const canPin = !noAnim && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined'
    && matchMedia('(min-width: 981px)').matches;
  if (canPin) {
    st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=180%',
      pin: true,
      anticipatePin: 1,
      onUpdate(self) { render(Math.min(DATA.length - 1, Math.floor(self.progress * DATA.length))); },
    });
  }

  DATA.forEach((d, i) => {
    const b = document.createElement('button');
    b.className = 'chakraNode';
    b.style.setProperty('--col', d.col);
    b.style.left = '44%';
    b.style.top = d.y + '%';
    b.setAttribute('aria-label', d[LANG()].name);
    b.addEventListener('click', () => {
      if (st) {
        const target = st.start + ((i + .5) / DATA.length) * (st.end - st.start);
        scrollTo({ top: target, behavior: 'smooth' });
      } else {
        render(i);
      }
    });
    nodesHost.appendChild(b);
    if (rail) {
      const dot = document.createElement('i');
      dot.style.setProperty('--rc', d.col);
      rail.appendChild(dot);
    }
  });

  render(0);
  addEventListener('tk:lang', () => {
    render(current, true);
    nodesHost.querySelectorAll('.chakraNode').forEach((n, i) =>
      n.setAttribute('aria-label', DATA[i][LANG()].name));
  });
})();

/* ============================================================
   11 · SYMPTOM FINDER (bilingual)
   ============================================================ */
(function finder() {
  const chipsHost = document.getElementById('finderChips');
  const result = document.getElementById('finderResult');
  const card = document.getElementById('finderCard');
  if (!chipsHost) return;

  const AREAS = {
    bolecine: { col: '#e25c5c',
      sl: { t: 'Bolečine', p: 'Vaši odgovori kažejo na področje bolečin — težave s hrbtenico in organi, glavobole, migrene ali boleče sklepe. Pri terapiji poiščemo vzrok bolečine in ga energetsko odpravimo.' },
      de: { t: 'Schmerzen', p: 'Ihre Antworten deuten auf den Bereich Schmerzen hin — Beschwerden an Wirbelsäule und Organen, Kopfschmerzen, Migräne oder schmerzende Gelenke. In der Therapie suchen wir die Ursache und lösen sie energetisch.' } },
    alergije: { col: '#ec8f4e',
      sl: { t: 'Alergije', p: 'Vaši odgovori kažejo na alergije. Z energetskim brisanjem odpravljam alergije, povezane s prehrano, pršicami, cvetnim prahom, travami, težkimi kovinami in soljudmi.' },
      de: { t: 'Allergien', p: 'Ihre Antworten deuten auf Allergien hin. Mit energetischem Löschen behandle ich Allergien gegen Nahrungsmittel, Hausstaubmilben, Pollen, Gräser, Schwermetalle und Mitmenschen.' } },
    psiho: { col: '#e8c34e',
      sl: { t: 'Psihološke težave', p: 'Vaši odgovori kažejo na duševno raven — izgorelost, stres, nihanje razpoloženja ali težave v odnosih. Vzrok pogosto najdemo v življenjskem koledarju in ga skupaj ozavestimo.' },
      de: { t: 'Seelische Themen', p: 'Ihre Antworten deuten auf die seelische Ebene hin — Burn-out, Stress, Stimmungsschwankungen oder Beziehungsthemen. Die Ursache finden wir oft im Lebenskalender und machen sie gemeinsam bewusst.' } },
    razstrup: { col: '#5fbf8a',
      sl: { t: 'Razstrupljanje', p: 'Vaši odgovori kažejo na obremenitev s težkimi kovinami, ki se nakopičijo od cepiv, amalgamskih zalivk in zobnih aparatov. Pomagam pri razstrupljanju in odvajanju.' },
      de: { t: 'Entgiftung', p: 'Ihre Antworten deuten auf eine Belastung mit Schwermetallen hin, die sich durch Impfungen, Amalgamfüllungen und Zahnspangen ansammeln. Ich helfe beim Entgiften und Ausleiten.' } },
    testiranje: { col: '#5aa7d6',
      sl: { t: 'Testiranje spalnih prostorov', p: 'Vaši odgovori kažejo na možen vpliv prostora, v katerem spite — vodni tokovi, zemeljska sevanja ali elektrosmog. Vaše ležišče pregledam na vašem domu.' },
      de: { t: 'Schlafplatz-Untersuchung', p: 'Ihre Antworten deuten auf einen möglichen Einfluss Ihres Schlafplatzes hin — Wasseradern, Erdstrahlen oder Elektrosmog. Ich untersuche Ihren Schlafplatz bei Ihnen zu Hause.' } },
    harmon: { col: '#9a6fd0',
      sl: { t: 'Harmoniziranje', p: 'Vašemu telesu bo najbolj koristilo celostno uravnovešanje čaker, meridianov in življenjskega koledarja — nežna pot do več energije in notranjega miru.' },
      de: { t: 'Harmonisierung', p: 'Ihrem Körper hilft am meisten ein ganzheitlicher Ausgleich der Chakren, Meridiane und des Lebenskalenders — ein sanfter Weg zu mehr Energie und innerer Ruhe.' } },
  };

  const SYMPTOMS = [
    ['bolecine', 'Glavoboli ali migrene', 'Kopfschmerzen oder Migräne'],
    ['bolecine', 'Bolečine v hrbtenici', 'Rückenschmerzen'],
    ['bolecine', 'Bolečine v sklepih', 'Gelenkschmerzen'],
    ['bolecine', 'Kronična bolečinska stanja', 'Chronische Schmerzzustände'],
    ['alergije', 'Alergija na cvetni prah ali trave', 'Pollen- oder Gräserallergie'],
    ['alergije', 'Preobčutljivost na hrano', 'Nahrungsmittelunverträglichkeit'],
    ['alergije', 'Alergija na pršice', 'Hausstaubmilbenallergie'],
    ['psiho', 'Izgorelost ali stalen stres', 'Burn-out oder Dauerstress'],
    ['psiho', 'Potrtost, nihanje razpoloženja', 'Niedergeschlagenheit, Stimmungsschwankungen'],
    ['psiho', 'Težave v odnosih', 'Beziehungsprobleme'],
    ['psiho', 'Težave z učenjem ali koncentracijo', 'Lern- oder Konzentrationsprobleme'],
    ['razstrup', 'Amalgamske zalivke ali zobni aparat', 'Amalgamfüllungen oder Zahnspange'],
    ['razstrup', 'Občutek zastrupljenosti, težke kovine', 'Gefühl von Belastung durch Schwermetalle'],
    ['testiranje', 'Slab ali nemiren spanec', 'Schlechter oder unruhiger Schlaf'],
    ['testiranje', 'Zjutraj se zbujam utrujen/a', 'Morgens erschöpft aufwachen'],
    ['testiranje', 'Po selitvi se počutim slabše', 'Seit dem Umzug fühle ich mich schlechter'],
    ['harmon', 'Pomanjkanje energije', 'Energiemangel'],
    ['harmon', 'Želim preventivno uravnovešenje', 'Vorbeugend ins Gleichgewicht kommen'],
  ];
  const TXT = {
    sl: { btn: 'Rezervirajte termin', small: 'Svetovalec je informativne narave — natančen vzrok poiščeva skupaj na terapiji.' },
    de: { btn: 'Termin vereinbaren', small: 'Der Berater dient zur Orientierung — die genaue Ursache finden wir gemeinsam in der Therapie.' },
  };

  const picked = new Set();
  const chips = SYMPTOMS.map(([area], i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.addEventListener('click', () => {
      b.classList.toggle('is-on');
      picked.has(i) ? picked.delete(i) : picked.add(i);
      update();
    });
    chipsHost.appendChild(b);
    return b;
  });

  function relabel() {
    const col = LANG() === 'de' ? 2 : 1;
    chips.forEach((b, i) => { b.textContent = SYMPTOMS[i][col]; });
  }

  function update() {
    if (!picked.size) { result.hidden = true; return; }
    const score = {};
    picked.forEach(i => { const a = SYMPTOMS[i][0]; score[a] = (score[a] || 0) + 1; });
    const top = Object.entries(score).sort((a, b) => b[1] - a[1])[0][0];
    const area = AREAS[top], tr = area[LANG()], txt = TXT[LANG()];
    card.style.setProperty('--accent', area.col);
    card.innerHTML = `
      <h3>${tr.t}</h3>
      <p>${tr.p}</p>
      <a class="btn btn--gold" href="#rezervacija">${txt.btn}</a>
      <small>${txt.small}</small>`;
    result.hidden = false;
  }

  relabel();
  addEventListener('tk:lang', () => { relabel(); update(); });
})();

/* ============================================================
   12 · TESTIMONIALS SLIDER (bilingual)
   ============================================================ */
(function voices() {
  const track = document.getElementById('sliderTrack');
  if (!track) return;
  const DATA = [
    { a: 'Sonja',
      sl: { q: 'Dve leti sem imela težave s kroničnim zaprtjem. Tekom zdravljenja smo ugotovili, da vzrok ni povezan s prehrano, ampak je duševne narave. S Tanjo sva uspešno pozdravili duševno travmo, prebava pa je sedaj popolnoma urejena.', m: '36 let' },
      de: { q: 'Zwei Jahre lang litt ich an chronischer Verstopfung. Während der Behandlung stellten wir fest, dass die Ursache nicht in der Ernährung lag, sondern seelischer Natur war. Gemeinsam mit Tanja habe ich ein seelisches Trauma geheilt — meine Verdauung ist heute völlig in Ordnung.', m: '36 Jahre' } },
    { a: 'Martina',
      sl: { q: 'Pri Tanji sem pozdravila migreno, ki me je neprestano spremljala štiri leta. Ko sem ozavestila njen vzrok, ki mi ga je Tanja pomagala izbrisati, je po tretji terapiji migrena izginila.', m: '16 let' },
      de: { q: 'Bei Tanja habe ich meine Migräne geheilt, die mich vier Jahre lang ständig begleitete. Als mir die Ursache bewusst wurde und Tanja mir half, sie zu löschen, war die Migräne nach der dritten Therapie verschwunden.', m: '16 Jahre' } },
    { a: 'Daniel',
      sl: { q: 'Zaradi stresne službe sem se soočal z veliko izčrpanostjo. Ko me je Tanja sharmonizirala, napolnila z novo energijo in mi pomagala ozavestiti potrebne spremembe, se je moje stanje nepričakovano izboljšalo.', m: '57 let' },
      de: { q: 'Wegen meines stressigen Berufs war ich völlig erschöpft. Als Tanja mich harmonisierte, mit neuer Energie auffüllte und mir half zu erkennen, welche Veränderungen nötig waren, verbesserte sich mein Zustand überraschend schnell.', m: '57 Jahre' } },
    { a: 'Alex & Nina',
      sl: { q: 'Po selitvi so se sinu Alexu nenadoma pojavile alergije na trave, cvetni prah in pršice. Tanja je Alexu harmonizirala življenjski koledar, v katerem je bil vtisnjen šok dogodek — po terapiji so izginile tudi vse alergije.', m: '7 in 35 let' },
      de: { q: 'Nach dem Umzug entwickelte unser Sohn Alex plötzlich Allergien gegen Gräser, Pollen und Hausstaubmilben. Tanja harmonisierte Alex’ Lebenskalender, in dem ein Schock-Ereignis eingeprägt war — nach der Therapie verschwanden auch alle Allergien.', m: '7 und 35 Jahre' } },
    { a: 'Marija',
      sl: { q: 'Odkar sem se preselila v novo stanovanje, sem imela zastoj limfe. Tanja je na mojem domu ugotovila, da pod posteljo teče vodni tok. Ko sem posteljo prestavila in opravila dve terapiji, se je spanje in zdravje bistveno izboljšalo.', m: '64 let' },
      de: { q: 'Seit dem Umzug in eine neue Wohnung hatte ich einen Lymphstau. Tanja stellte bei mir zu Hause fest, dass unter meinem Bett eine Wasserader verläuft. Nachdem ich das Bett umgestellt und zwei Therapien gemacht hatte, verbesserten sich Schlaf und Gesundheit deutlich.', m: '64 Jahre' } },
  ];
  const dots = document.getElementById('sliderDots');

  function build() {
    track.innerHTML = '';
    DATA.forEach(d => {
      const tr = d[LANG()];
      track.insertAdjacentHTML('beforeend', `
        <figure class="voice">
          <blockquote>${tr.q}</blockquote>
          <figcaption><strong>${d.a}</strong> · ${tr.m}</figcaption>
        </figure>`);
    });
  }

  DATA.forEach((d, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `${i + 1}`);
    dot.addEventListener('click', () => go(i));
    dots.appendChild(dot);
  });

  let idx = 0, timer;
  function go(i) {
    idx = (i + DATA.length) % DATA.length;
    track.style.transform = `translateX(-${idx * 100}%)`;
    [...dots.children].forEach((d, j) => d.classList.toggle('is-on', j === idx));
    restart();
  }
  function restart() {
    clearInterval(timer);
    if (!noAnim) timer = setInterval(() => go(idx + 1), 7500);
  }
  document.getElementById('slidePrev').addEventListener('click', () => go(idx - 1));
  document.getElementById('slideNext').addEventListener('click', () => go(idx + 1));
  const slider = document.getElementById('slider');
  slider.addEventListener('mouseenter', () => clearInterval(timer));
  slider.addEventListener('mouseleave', restart);
  let touchX = null;
  slider.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
    touchX = null;
  }, { passive: true });

  build();
  go(0);
  addEventListener('tk:lang', () => { build(); go(idx); });
})();

/* ============================================================
   13 · GALLERY + LIGHTBOX (bilingual captions)
   ============================================================ */
(function gallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  const IMGS = [
    ['DSC_0013a.jpg', 'Terapevtski prostor', 'Therapieraum'],
    ['DSC_0021.jpg', 'Tibetanska pojoča skleda', 'Tibetische Klangschale'],
    ['DSC_0086.jpg', 'Meritev z viva metrom', 'Messung mit dem Viva-Meter'],
    ['DSC_0019.jpg', 'Sivka iz domačega vrta', 'Lavendel aus dem eigenen Garten'],
    ['DSC_0091.jpg', 'Terapija v praksi', 'Therapie in der Praxis'],
    ['DSC_0118.jpg', 'Meritev meridianov na prstih', 'Meridian-Messung an den Fingern'],
    ['DSC_0028.jpg', 'Testni komplet viva metra', 'Test-Set des Viva-Meters'],
    ['DSC_0407.jpg', 'Delo z energijsko palico', 'Arbeit mit der Einhandrute'],
    ['DSC_0056-2592x1800.jpg', 'Kristali v vodi', 'Kristalle im Wasser'],
    ['DSC_0133.jpg', 'Kotiček za sprostitev', 'Ecke zum Entspannen'],
    ['DSC_0166.jpg', 'Jesen pred prakso', 'Herbst vor der Praxis'],
    ['DSC_0238.jpg', 'Vhod v prakso', 'Eingang zur Praxis'],
  ];
  const cap = i => IMGS[i][LANG() === 'de' ? 2 : 1];

  IMGS.forEach(([f], i) => {
    const fig = document.createElement('figure');
    fig.className = 'reveal';
    fig.innerHTML = `<img src="assets/img/gallery/${f}" alt="" loading="lazy"><figcaption></figcaption>`;
    fig.addEventListener('click', () => openLb(i));
    grid.appendChild(fig);
  });
  function relabel() {
    grid.querySelectorAll('figure').forEach((fig, i) => {
      fig.querySelector('img').alt = cap(i);
      fig.querySelector('figcaption').textContent = cap(i);
    });
  }
  document.querySelectorAll('#galleryGrid .reveal').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 3) * .1}s`;
    new IntersectionObserver((entries, o) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); o.disconnect(); } });
    }, { threshold: .1 }).observe(el);
  });

  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCap = document.getElementById('lbCaption');
  let cur = 0;
  function openLb(i) { cur = i; show(); lb.hidden = false; document.body.style.overflow = 'hidden'; }
  function closeLb() { lb.hidden = true; document.body.style.overflow = ''; }
  function show() {
    lbImg.src = `assets/img/gallery/${IMGS[cur][0]}`;
    lbImg.alt = cap(cur);
    lbCap.textContent = `${cur + 1} / ${IMGS.length} — ${cap(cur)}`;
  }
  document.getElementById('lbClose').addEventListener('click', closeLb);
  document.getElementById('lbPrev').addEventListener('click', () => { cur = (cur - 1 + IMGS.length) % IMGS.length; show(); });
  document.getElementById('lbNext').addEventListener('click', () => { cur = (cur + 1) % IMGS.length; show(); });
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') { cur = (cur - 1 + IMGS.length) % IMGS.length; show(); }
    if (e.key === 'ArrowRight') { cur = (cur + 1) % IMGS.length; show(); }
  });

  relabel();
  addEventListener('tk:lang', () => { relabel(); if (!lb.hidden) show(); });
})();

/* ============================================================
   14 · BOOKING FORM → prefilled e-mail (bilingual)
   ============================================================ */
(function booking() {
  const form = document.getElementById('bookingForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const v = id => document.getElementById(id).value.trim();
    let subject, body;
    if (LANG() === 'de') {
      subject = `Terminanfrage — ${v('fName')}`;
      body =
`Liebe Frau Koller!

Vor- und Nachname: ${v('fName')}
E-Mail: ${v('fMail')}
Telefon: ${v('fTel') || '—'}
Bereich: ${v('fTopic') || '—'}

Nachricht:
${v('fMsg') || '—'}

Mit freundlichen Grüßen`;
    } else {
      subject = `Povpraševanje za termin — ${v('fName')}`;
      body =
`Pozdravljeni, Tanja!

Ime in priimek: ${v('fName')}
E-naslov: ${v('fMail')}
Telefon: ${v('fTel') || '—'}
Področje: ${v('fTopic') || '—'}

Sporočilo:
${v('fMsg') || '—'}

Lep pozdrav`;
    }
    location.href = `mailto:kollertanja@gmx.net?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
})();

/* ============================================================
   15 · MISC
   ============================================================ */
document.getElementById('year').textContent = new Date().getFullYear();
