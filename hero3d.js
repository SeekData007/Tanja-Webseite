/* Tanja Koller — Three.js hero: chakra particle field + nebula.
   Sets window.TK_HERO3D_OK so main.js knows whether to run the 2D fallback. */
'use strict';

window.TK_HERO3D_OK = (function () {
  const noAnim = location.search.includes('static')
    || matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (noAnim || typeof THREE === 'undefined') return false;

  const hero = document.querySelector('.hero');
  const holder = document.getElementById('aurora');
  if (!hero || !holder) return false;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' });
  } catch (e) {
    return false;
  }

  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.domElement.className = 'hero__canvas';
  renderer.domElement.setAttribute('aria-hidden', 'true');
  hero.insertBefore(renderer.domElement, holder);
  holder.style.display = 'none'; // 2D canvas not needed

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 1, 2000);
  camera.position.z = 420;

  /* chakra spectrum */
  const HUES = [355, 25, 48, 150, 205, 248, 280];

  /* soft round sprite texture, generated — no asset needed */
  function discTexture(stops) {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    stops.forEach(([o, col]) => grad.addColorStop(o, col));
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(c);
    return tex;
  }
  const pointTex = discTexture([[0, 'rgba(255,255,255,1)'], [.35, 'rgba(255,255,255,.55)'], [1, 'rgba(255,255,255,0)']]);
  const fogTex = discTexture([[0, 'rgba(255,255,255,.28)'], [.55, 'rgba(255,255,255,.08)'], [1, 'rgba(255,255,255,0)']]);

  /* ---- particle field (two depth layers) ---- */
  const BOUND = { x: 900, y: 560, z: 420 };
  function makeLayer(count, size, opacity) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const vel = new Float32Array(count);
    const color = new THREE.Color();
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() * 2 - 1) * BOUND.x;
      pos[i * 3 + 1] = (Math.random() * 2 - 1) * BOUND.y;
      pos[i * 3 + 2] = (Math.random() * 2 - 1) * BOUND.z;
      const hue = HUES[Math.floor(Math.random() * HUES.length)];
      color.setHSL(hue / 360, .72, .68);
      col[i * 3] = color.r; col[i * 3 + 1] = color.g; col[i * 3 + 2] = color.b;
      vel[i] = Math.random() * .35 + .12;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const mat = new THREE.PointsMaterial({
      size, map: pointTex, vertexColors: true, transparent: true, opacity,
      depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true,
    });
    const points = new THREE.Points(geo, mat);
    points.userData = { vel, count };
    scene.add(points);
    return points;
  }
  const isSmall = innerWidth < 760;
  const near = makeLayer(isSmall ? 380 : 900, 7.5, .85);
  const far = makeLayer(isSmall ? 700 : 1700, 4, .5);

  /* ---- nebula: 7 large soft sprites, one per chakra colour ---- */
  const nebula = new THREE.Group();
  HUES.forEach((hue, i) => {
    const mat = new THREE.SpriteMaterial({
      map: fogTex, transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending, opacity: .16,
      color: new THREE.Color().setHSL(hue / 360, .6, .45),
    });
    const s = new THREE.Sprite(mat);
    const a = (i / HUES.length) * Math.PI * 2;
    s.position.set(Math.cos(a) * 300, Math.sin(a) * 170, -160 - i * 18);
    const sc = 520 + Math.random() * 260;
    s.scale.set(sc, sc, 1);
    s.userData = { a, r: 260 + Math.random() * 120, speed: .02 + Math.random() * .02 };
    nebula.add(s);
  });
  scene.add(nebula);

  /* ---- sizing ---- */
  function size() {
    const w = hero.clientWidth, h = hero.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  size();
  addEventListener('resize', size);

  /* ---- interaction + loop ---- */
  let mx = 0, my = 0, running = true, inView = true;
  addEventListener('pointermove', e => {
    mx = (e.clientX / innerWidth - .5) * 2;
    my = (e.clientY / innerHeight - .5) * 2;
  });
  new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting;
  }).observe(hero);
  document.addEventListener('visibilitychange', () => { running = !document.hidden; });

  let t = 0;
  (function animate() {
    requestAnimationFrame(animate);
    if (!running || !inView) return;
    t += .004;

    [near, far].forEach((layer, li) => {
      const pos = layer.geometry.attributes.position;
      const { vel, count } = layer.userData;
      for (let i = 0; i < count; i++) {
        let y = pos.getY(i) + vel[i] * (li === 0 ? 1 : .6);
        if (y > BOUND.y) y = -BOUND.y;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
      layer.rotation.y = Math.sin(t * .35) * .05 + (li === 0 ? t * .012 : -t * .008);
    });

    nebula.children.forEach((s, i) => {
      const u = s.userData;
      u.a += u.speed * .016;
      s.position.x = Math.cos(u.a) * u.r * 1.4;
      s.position.y = Math.sin(u.a * .8) * u.r * .55;
      s.material.opacity = .12 + Math.sin(t * 2 + i) * .045;
    });

    camera.position.x += (mx * 36 - camera.position.x) * .04;
    camera.position.y += (-my * 26 - camera.position.y) * .04;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  })();

  return true;
})();
