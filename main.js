(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  gsap.registerPlugin(ScrollTrigger);
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  // ---------- Lenis (Smooth Scroll) ----------
  let lenis;
  if (!reduce) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const scrollToEl = (el, off = -40) => lenis ? lenis.scrollTo(el, { offset: off, duration: 1.4 }) : el.scrollIntoView({ behavior: 'smooth' });
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href'); if (id.length < 2) return;
    const el = document.querySelector(id); if (!el) return;
    e.preventDefault(); closeMenu(); scrollToEl(el);
  }));

  // ---------- Menü ----------
  const burger = document.getElementById('burger'), menu = document.getElementById('menu');
  const closeMenu = () => { document.body.classList.remove('menu-open'); menu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); lenis && lenis.start(); };
  burger.addEventListener('click', () => {
    const open = !menu.classList.contains('open');
    document.body.classList.toggle('menu-open', open); menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open)); lenis && (open ? lenis.stop() : lenis.start());
    if (open) menu.querySelector('a').focus();
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('open')) { closeMenu(); burger.focus(); } });
  document.querySelectorAll('.nav a.active').forEach(a => a.setAttribute('aria-current', 'page'));

  // Glas-Navigation: beim Runterscrollen ausblenden
  let last = 0; const nav = document.getElementById('nav');
  // Über der Foto-Szene ist die Leiste transparent (weiße Schrift), danach Glas
  const sceneEl = document.querySelector('.scene');
  if (sceneEl) {
    nav.classList.add('over');
    const overCheck = () => nav.classList.toggle('over', window.scrollY < sceneEl.offsetHeight - innerHeight * .65);
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: overCheck, onRefresh: overCheck });
    overCheck();
  }
  // Leiste bleibt beim Scrollen immer sichtbar (kein Ausblenden).

  // Wort-für-Wort-Reveals vorbereiten
  document.querySelectorAll('.split').forEach(el => {
    const words = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', words.join(' '));
    el.innerHTML = words.map(w => `<span class="line" aria-hidden="true"><span class="word">${w}</span></span>`).join(' ');
  });
  document.querySelectorAll('.layer h1, .layer h2').forEach(el => {
    const words = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', words.join(' '));
    el.innerHTML = words.map(w => `<span class="lw" aria-hidden="true"><span class="w">${w}</span></span>`).join(' ');
  });

  // ---------- Seitenübergang (Vorhang) + Brand-Intro nur beim ersten Besuch ----------
  const introCurtain = document.querySelector('.curtain.intro');
  let seen = false; try { seen = sessionStorage.getItem('lup-intro'); } catch (e) {}
  if (introCurtain && !seen && !reduce) {
    try { sessionStorage.setItem('lup-intro', '1'); } catch (e) {}
    document.body.classList.add('intro-on');
    setTimeout(() => document.body.classList.add('ready'), 1300);
  } else requestAnimationFrame(() => document.body.classList.add('ready'));
  document.querySelectorAll('a[href$=".html"], a[href*=".html#"]').forEach(a => a.addEventListener('click', e => {
    if (e.metaKey || e.ctrlKey || a.target === '_blank' || reduce) return;
    const href = a.getAttribute('href'), [path, hash] = href.split('#');
    const here = location.pathname.split('/').pop() || 'index.html';
    if (path === here) {
      const el = hash && document.getElementById(hash);
      e.preventDefault(); closeMenu(); if (el) scrollToEl(el); else scrollToEl(document.body, 0); return;
    }
    e.preventDefault(); document.body.classList.add('leaving');
    setTimeout(() => location.href = href, 650);
  }));
  window.addEventListener('pageshow', e => { if (e.persisted) document.body.classList.remove('leaving'); });

  // Scroll-Fortschritt oben
  const prog = document.getElementById('progress');
  if (prog) ScrollTrigger.create({ onUpdate: s => prog.style.transform = `scaleX(${s.progress})` });

  // Mobile Sticky-CTA: auf der Startseite erst nach der Szene
  const sticky = document.querySelector('.sticky-cta'), scene = document.querySelector('.scene');
  if (sticky && scene && !reduce) { sticky.classList.add('off'); ScrollTrigger.create({ start: () => scene.offsetHeight - innerHeight * .6, end: 'max', onToggle: t => sticky.classList.toggle('off', !t.isActive) }); }
  document.querySelectorAll('.totop').forEach(a => a.addEventListener('click', e => { e.preventDefault(); lenis ? lenis.scrollTo(0, { duration: 1.4 }) : scrollTo({ top: 0, behavior: 'smooth' }); }));

  // ---------- Interaktive Elemente (auch bei reduzierter Bewegung) ----------
  // FAQ: nur eins offen
  document.querySelectorAll('.q').forEach(d => d.addEventListener('toggle', () => { if (d.open) document.querySelectorAll('.q[open]').forEach(o => { if (o !== d) o.open = false; }); ScrollTrigger.refresh(); }));

  // Karte erst per Klick (OpenStreetMap, keine Drittanbieter-Verbindung ohne Zustimmung)
  document.querySelectorAll('[data-map]').forEach(btn => btn.addEventListener('click', () => {
    const m = document.getElementById(btn.dataset.map); const [lat, lon] = btn.dataset.pos.split(',').map(Number);
    const d = .012; const bbox = `${lon - d * 1.6}%2C${lat - d}%2C${lon + d * 1.6}%2C${lat + d}`;
    m.innerHTML = `<iframe title="Karte: ${btn.dataset.title}" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}"></iframe>`;
  }));

  // Kontaktformular: Prüfung vor dem Senden (Netlify Forms übernimmt den Versand)
  const form = document.getElementById('contactForm');
  if (form) form.addEventListener('submit', e => {
    const ok = form.checkValidity();
    if (!ok) { e.preventDefault(); form.reportValidity(); }
    else form.querySelector('button[type=submit]').textContent = 'Wird gesendet …';
  });

  // Ertragsrechner Photovoltaik (Richtwerte – siehe LAUNCH-CHECKLISTE)
  const pvArea = document.getElementById('pvArea');
  if (pvArea) {
    const $ = id => document.getElementById(id);
    const use = $('pvUse'), dir = $('pvDir'), bat = $('pvBat');
    const eur = n => Math.round(n).toLocaleString('de-DE') + ' €';
    const kwh = n => Math.round(n).toLocaleString('de-DE') + ' kWh';
    // Richtwerte: 1 kWp je ~5 m² Dachfläche, ~950 kWh je kWp und Jahr in der Region Aachen, Ausrichtungsfaktor, Strompreis 0,35 €/kWh, Einspeisevergütung 0,08 €/kWh
    const PRICE = .35, FEED = .08, YIELD = 950, M2 = 5;
    const num = { kwp: 0, yr: 0, self: 0, feed: 0, save: 0, co2: 0 };
    const paint = () => { $('pvKwp').textContent = (Math.round(num.kwp * 10) / 10).toLocaleString('de-DE'); $('pvYr').textContent = kwh(num.yr); $('pvSelf').textContent = kwh(num.self); $('pvFeed').textContent = kwh(num.feed); $('pvSave').textContent = eur(num.save); $('pvCo2').textContent = (Math.round(num.co2 * 10) / 10).toLocaleString('de-DE') + ' t'; };
    const calc = () => {
      const a = +pvArea.value, u = +use.value, f = +dir.querySelector('[aria-pressed=true]').dataset.f, withBat = bat.checked;
      const kwp = a / M2, yr = kwp * YIELD * f;
      // Eigenverbrauchsanteil grob: ohne Speicher ~30 %, mit Speicher ~60 % – begrenzt durch den eigenen Verbrauch
      const share = withBat ? .6 : .3; const self = Math.min(yr * share, u * (withBat ? .8 : .45)); const feed = yr - self;
      const save = self * PRICE + feed * FEED; const co2 = yr * .38 / 1000;
      $('pvAreaOut').value = a + ' m²'; $('pvUseOut').value = u.toLocaleString('de-DE') + ' kWh';
      const pct = Math.round(self / yr * 100); $('pvBarSelf').style.width = pct + '%'; $('pvBarFeed').style.width = (100 - pct) + '%';
      $('pvHint').textContent = withBat ? `Mit Speicher nutzen Sie rund ${pct} % Ihres Solarstroms selbst – der Rest wird eingespeist.` : `Ohne Speicher nutzen Sie rund ${pct} % direkt selbst. Ein Batteriespeicher hebt den Anteil deutlich – probieren Sie es aus.`;
      const t = { kwp, yr, self, feed, save, co2 };
      if (reduce) { Object.assign(num, t); paint(); } else gsap.to(num, { ...t, duration: .7, ease: 'power3.out', overwrite: true, onUpdate: paint });
    };
    [pvArea, use].forEach(el => el.addEventListener('input', calc)); bat.addEventListener('change', calc);
    dir.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { dir.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', 'false')); b.setAttribute('aria-pressed', 'true'); calc(); }));
    calc();
  }

  // Beispiel-Ablauf Großanlage (fiktives Beispielprojekt, klickbare Schritte, Live-Zahlen)
  const planSteps = document.getElementById('planSteps');
  if (planSteps) {
    const steps = [
      { kicker: 'Schritt 1 · Erstgespräch vor Ort', kwp: 0, mod: 0, wk: 0, txt: 'Dachstatik, Ausrichtung, Verschattung, Netzanschluss: Wir nehmen das Objekt auf und klären, was das Dach tragen kann und was der Netzbetreiber zulässt.' },
      { kicker: 'Schritt 2 · Planung & Berechnung', kwp: 480, mod: 1100, wk: 3, txt: 'Belegungsplan, Stringplanung, Ertragssimulation und Wirtschaftlichkeit. Das Ergebnis: eine Anlage, die zum Lastprofil des Betriebs passt – nicht nur zum Dach.' },
      { kwp: 480, mod: 1100, wk: 9, kicker: 'Schritt 3 · Anträge & Netzanschluss', txt: 'Netzanschlussbegehren, Marktstammdatenregister, Förderung und Genehmigungen. Wir übernehmen den Papierkram und stimmen die Gewerke ab.' },
      { kwp: 480, mod: 1100, wk: 14, kicker: 'Schritt 4 · Montage & Abnahme', txt: 'Unterkonstruktion, Module, Wechselrichter, Verkabelung, Zählerschrank. Eigene Montage-Teams, koordinierte Partner, dokumentierte Abnahme.' },
      { kwp: 480, mod: 1100, wk: 16, kicker: 'Schritt 5 · Inbetriebnahme & Monitoring', txt: 'Anlage geht ans Netz, Monitoring-App wird eingerichtet, Einweisung vor Ort. Danach: Pflege, Wartung und Fernüberwachung – auf Wunsch von uns.' },
    ];
    const el = { kwp: document.getElementById('planKwp'), yr: document.getElementById('planYr'), mod: document.getElementById('planMod'), wk: document.getElementById('planWk'), kicker: document.getElementById('planKicker'), txt: document.getElementById('planText'), bar: document.getElementById('planBar') };
    const num = { kwp: 0, yr: 0, mod: 0, wk: 0 };
    const show = i => {
      const s = steps[i];
      planSteps.querySelectorAll('.pstep').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.i === i)));
      el.kicker.textContent = s.kicker; el.txt.textContent = s.txt; el.bar.style.width = ((i + 1) / steps.length * 100) + '%';
      const target = { kwp: s.kwp, yr: s.kwp * 950, mod: s.mod, wk: s.wk };
      const paint = () => { el.kwp.textContent = Math.round(num.kwp).toLocaleString('de-DE'); el.yr.textContent = Math.round(num.yr).toLocaleString('de-DE'); el.mod.textContent = Math.round(num.mod).toLocaleString('de-DE'); el.wk.textContent = Math.round(num.wk); };
      if (reduce) { Object.assign(num, target); paint(); }
      else gsap.to(num, { ...target, duration: .8, ease: 'power3.out', overwrite: true, onUpdate: paint });
    };
    planSteps.querySelectorAll('.pstep').forEach(b => b.addEventListener('click', () => show(+b.dataset.i)));
    show(0);
  }

  // Quiz (3 Fragen): Antworten tragen data-v, Ergebnisse stehen in <template data-res="...">
  const quiz = document.getElementById('quizBox');
  if (quiz) {
    const qs = quiz.querySelectorAll('.qq'), bar = document.getElementById('quizBar'), res = document.getElementById('quizRes');
    const ans = []; let idx = 0;
    const go = i => { idx = i; qs.forEach((q, k) => q.classList.toggle('on', k === i)); bar.style.width = ((i + 1) / qs.length * 100) + '%'; };
    const finish = () => {
      qs.forEach(q => q.classList.remove('on')); bar.style.width = '100%'; res.classList.add('on');
      const key = ans.join('|');
      const tpl = [...quiz.querySelectorAll('template')].find(t => t.dataset.res.split(',').some(p => new RegExp('^' + p.replace(/\|/g, '\\|').replace(/\*/g, '[^|]*') + '$').test(key))) || quiz.querySelector('template[data-res="*"]');
      document.getElementById('resTitle').textContent = tpl.dataset.title; document.getElementById('resText').textContent = tpl.content.textContent.trim();
      document.getElementById('resLink').href = tpl.dataset.href;
      if (!reduce) gsap.from(res, { y: 20, opacity: 0, duration: .6, ease: 'power3.out' });
    };
    quiz.querySelectorAll('.opts button').forEach(b => b.addEventListener('click', () => {
      ans[idx] = b.dataset.v; idx < qs.length - 1 ? go(idx + 1) : finish();
    }));
    document.getElementById('quizAgain').addEventListener('click', () => { ans.length = 0; res.classList.remove('on'); go(0); });
  }

  // Gebäude als System (Ebenen anklicken)
  const sysList = document.getElementById('sysList');
  if (sysList) {
    const view = { h: document.getElementById('sysTitle'), p: document.getElementById('sysText'), k: document.getElementById('sysKicker') };
    const rings = document.querySelectorAll('.rings circle');
    const pick = b => {
      sysList.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      const i = +b.dataset.i; rings.forEach((c, k) => c.classList.toggle('on', k === i));
      view.k.textContent = `Ebene ${String(i + 1).padStart(2, '0')} / ${String(rings.length).padStart(2, '0')}`; view.h.textContent = b.dataset.title; view.p.textContent = b.dataset.text;
      if (!reduce) gsap.fromTo([view.h, view.p], { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: .5, stagger: .06, ease: 'power3.out' });
    };
    sysList.querySelectorAll('button').forEach(b => b.addEventListener('click', () => pick(b)));
    pick(sysList.querySelector('button'));
  }

  // FAQ-Suche
  const faqSearch = document.getElementById('faqSearch');
  if (faqSearch) {
    const items = [...document.querySelectorAll('.q')].map(q => ({ q, s: q.querySelector('summary span'), a: q.querySelector('.a p'), st: q.querySelector('summary span').textContent, at: q.querySelector('.a p').textContent }));
    const count = document.getElementById('faqCount'), empty = document.getElementById('faqEmpty');
    const esc = t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const mark = (el, text, term) => { el.innerHTML = term ? text.replace(new RegExp('(' + esc(term) + ')', 'gi'), '<mark>$1</mark>') : text; };
    faqSearch.addEventListener('input', () => {
      const term = faqSearch.value.trim().toLowerCase(); let n = 0;
      items.forEach(it => { const hit = !term || it.st.toLowerCase().includes(term) || it.at.toLowerCase().includes(term); it.q.classList.toggle('hide', !hit); if (hit) n++; mark(it.s, it.st, term); mark(it.a, it.at, term); if (term && hit) it.q.open = true; if (!term) it.q.open = false; });
      count.textContent = term ? `${n} von ${items.length}` : ''; empty.hidden = n > 0; ScrollTrigger.refresh();
    });
  }

  // Kontakt: Thema per Kachel wählen (auch per ?thema=… in der Adresse)
  const pick = document.getElementById('pick');
  if (pick) {
    const sel = document.getElementById('thema');
    const choose = v => { pick.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === v))); sel.value = v; };
    pick.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { choose(b.dataset.v); if (!reduce) gsap.fromTo(b, { scale: .94 }, { scale: 1, duration: .5, ease: 'elastic.out(1,.5)' }); }));
    sel.addEventListener('change', () => choose(sel.value));
    const q = new URLSearchParams(location.search).get('thema'); if (q) { const b = [...pick.querySelectorAll('button')].find(x => x.dataset.v.toLowerCase().includes(q.toLowerCase())); if (b) choose(b.dataset.v); }
  }

  // Live-Zähler: rechnerischer Solarstrom der von uns gebauten Anlagen seit Seitenaufruf (20.000.000 kWh / Jahr)
  const liveKwh = document.getElementById('liveKwh');
  if (liveKwh) {
    const PER_SEC = 20000000 / (365 * 24 * 3600); const t0 = performance.now();
    const km = document.getElementById('liveKm'), cups = document.getElementById('liveCups');
    const tick = () => {
      const k = (performance.now() - t0) / 1000 * PER_SEC;
      liveKwh.textContent = k.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
      if (km) km.textContent = Math.round(k / 17 * 100).toLocaleString('de-DE');
      if (cups) cups.textContent = Math.round(k / .1).toLocaleString('de-DE');
      requestAnimationFrame(tick);
    };
    tick();
  }
  // Sticky-Sektionsnavigation auf Unterseiten
  const subnav = document.querySelector('.subnav');
  if (subnav) {
    const links = [...subnav.querySelectorAll('a')];
    const secs = links.map(a => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id)); }), { rootMargin: '-30% 0px -60% 0px' });
    secs.forEach(x => io.observe(x));
  }

  if (reduce) return;

  // ---------- Scroll-Reveals ----------
  document.querySelectorAll('.split').forEach(el => {
    gsap.to(el.querySelectorAll('.word'), { y: 0, duration: 1.1, ease: 'power4.out', stagger: 0.04, scrollTrigger: { trigger: el, start: 'top 85%' } });
  });
  document.querySelectorAll('.reveal').forEach(el => {
    gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
  });
  document.querySelectorAll('.count').forEach(el => {
    const to = +el.dataset.to, o = { v: 0 };
    gsap.to(o, { v: to, duration: 2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' }, onUpdate: () => el.textContent = Math.round(o.v).toLocaleString('de-DE') });
  });
  // 3D-Tilt auf Karten
  if (window.matchMedia('(hover:hover)').matches) document.querySelectorAll('.card, .post, .loc, .tm').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      gsap.to(card, { rotateY: x * 6, rotateX: -y * 6, transformPerspective: 900, duration: .6, ease: 'power3' });
    });
    card.addEventListener('pointerleave', () => gsap.to(card, { rotateY: 0, rotateX: 0, duration: .8, ease: 'power3' }));
  });
  // Magnetische Buttons + Lichtreflex
  if (window.matchMedia('(hover:hover)').matches) document.querySelectorAll('.btn').forEach(b => {
    b.addEventListener('pointermove', e => {
      const r = b.getBoundingClientRect();
      b.style.setProperty('--mx', (e.clientX - r.left) + 'px'); b.style.setProperty('--my', (e.clientY - r.top) + 'px');
      gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .18, y: (e.clientY - r.top - r.height / 2) * .3, duration: .5, ease: 'power3' });
    });
    b.addEventListener('pointerleave', () => gsap.to(b, { x: 0, y: 0, duration: .8, ease: 'elastic.out(1,.5)' }));
  });
  // Parallax für Seiten-Header-Bilder und Detail-Bilder
  document.querySelectorAll('.page-hero img').forEach(im => gsap.fromTo(im, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: im, start: 'top bottom', end: 'bottom top', scrub: true } }));
  document.querySelectorAll('.detail .media img').forEach(im => gsap.fromTo(im, { yPercent: -6, scale: 1.12 }, { yPercent: 6, scale: 1.12, ease: 'none', scrollTrigger: { trigger: im.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));
  // Horizontaler Ablauf
  const track = document.getElementById('track');
  if (track) ScrollTrigger.matchMedia({ '(min-width: 821px)': () => {
    const dist = () => track.scrollWidth - track.parentElement.clientWidth;
    gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.process', start: 'center center', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true } });
  }});


  // ---------- V2-Bausteine ----------
  // Outline-Laufschrift: läuft von selbst, Scrollen beschleunigt und neigt sie
  document.querySelectorAll('.bigwords .row').forEach(row => {
    const half = () => row.scrollWidth / 2; let x = 0, vel = 0;
    ScrollTrigger.create({ onUpdate: st => { vel += st.getVelocity() / 900; } });
    gsap.ticker.add(() => { x -= (.6 + Math.min(Math.abs(vel), 14)); vel *= .92; if (x <= -half()) x += half(); gsap.set(row, { x, skewX: gsap.utils.clamp(-8, 8, -vel) }); });
  });
  // Energiefluss: Linien zeichnen sich, Schritte schalten Knoten ein
  const flow = document.querySelector('.flow');
  if (flow) {
    const paths = flow.querySelectorAll('.p'), nodes = flow.querySelectorAll('.node'), steps = flow.querySelectorAll('.fstep'), dot = flow.querySelector('.dot'), main = flow.querySelector('#flowMain');
    paths.forEach(p => { const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; });
    gsap.to(paths, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: flow.querySelector('.steps'), start: 'top 70%', end: 'bottom 60%', scrub: .6 } });
    if (dot && main) gsap.to(dot, { opacity: 1, ease: 'none', scrollTrigger: { trigger: flow.querySelector('.steps'), start: 'top 70%', end: 'bottom 60%', scrub: .6, onUpdate: st => { const pt = main.getPointAtLength(main.getTotalLength() * st.progress); dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y); } } });
    steps.forEach((st, i) => ScrollTrigger.create({ trigger: st, start: 'top 60%', end: 'bottom 40%', onToggle: t => { st.classList.toggle('on', t.isActive); if (t.isActive) nodes.forEach((n, k) => n.classList.toggle('on', k <= i)); } }));
  }
  // Sonnenbogen im Live-Zähler
  const ringy = document.querySelector('.arc .ringy');
  if (ringy) { const L = ringy.getTotalLength(); ringy.style.strokeDasharray = L; ringy.style.strokeDashoffset = L; gsap.to(ringy, { strokeDashoffset: 0, duration: 2.4, ease: 'power3.inOut', scrollTrigger: { trigger: '.arc', start: 'top 80%' } }); }
  // Horizontale Vollbild-Panels (Desktop gepinnt, Mobile wischen)
  const rail = document.querySelector('.hp .rail');
  if (rail) ScrollTrigger.matchMedia({ '(min-width: 821px)': () => {
    const dist = () => rail.scrollWidth - innerWidth + 16;
    const bar = document.querySelector('.hp .foot .bar i');
    gsap.to(rail, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.hp', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true, onUpdate: st => bar && (bar.style.width = st.progress * 100 + '%') } });
    rail.querySelectorAll('.panel img').forEach(im => gsap.fromTo(im, { xPercent: -6 }, { xPercent: 6, ease: 'none', scrollTrigger: { trigger: '.hp', start: 'top top', end: () => '+=' + dist(), scrub: 1 } }));
  }});
  // Karten-Stapel: jede Karte schrumpft leicht, wenn die nächste darüber schiebt
  const scards = document.querySelectorAll('.scard');
  if (scards.length) ScrollTrigger.matchMedia({ '(min-width: 821px)': () => {
    scards.forEach((c, i) => { if (i === scards.length - 1) return; gsap.to(c, { scale: .92 - (scards.length - 2 - i) * .02, opacity: .55, ease: 'none', scrollTrigger: { trigger: scards[i + 1], start: 'top 80%', end: 'top 12%', scrub: true } }); });
  }});
  // Scrub-Text
  document.querySelectorAll('.scrub p').forEach(p => {
    const ws = p.querySelectorAll('.sw');
    ScrollTrigger.create({ trigger: p, start: 'top 75%', end: 'bottom 45%', scrub: true, onUpdate: st => { const n = Math.floor(st.progress * ws.length); ws.forEach((w, i) => w.classList.toggle('on', i <= n)); } });
  });
  // Parallax-Kolonnen
  document.querySelectorAll('.cols .col').forEach((c, i) => gsap.fromTo(c, { y: [40, -60, 20][i] }, { y: [-60, 60, -30][i], ease: 'none', scrollTrigger: { trigger: c.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));
  // Split-Header: Foto-Parallax
  document.querySelectorAll('.ph2 .media img').forEach(im => gsap.fromTo(im, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: im.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));
  // Editorial-Kopf: Index-Linie wächst
  document.querySelectorAll('.ed .idx').forEach(el => gsap.from(el, { clipPath: 'inset(0 100% 0 0)', duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } }));

  // ---------- Foto-Scroll-Through (Startseite) ----------
  if (scene) {
    const $ = s => scene.querySelector(s), $$ = s => [...scene.querySelectorAll(s)];
    const layers = $$('.layer');
    const shot1 = $('.shot-1'), shot4 = $('.shot-4'), shot5 = $('.shot-5');
    const maskText = $('#maskText'), maskSvg = $('.mask-svg');
    const strips = $$('.strip'), stripsWrap = $('.strips'), tiles = $$('.tile'), tilesWrap = $('.tiles-wrap');
    const flash = $('.flash');
    const textIn = (layer, at, tl) => {
      const words = layer.querySelectorAll('.w');
      tl.set(layer, { opacity: 1, y: 0 }, at);
      tl.fromTo(words, { yPercent: 110 }, { yPercent: 0, duration: 3, stagger: .35, ease: 'power3.out' }, at);
      tl.fromTo(layer.querySelectorAll('.lead, .actions, .eyebrow'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 3, stagger: .5, ease: 'power3.out' }, at + 1);
    };
    const textOut = (layer, at, tl) => tl.to(layer, { opacity: 0, y: -40, duration: 3, ease: 'power2.in' }, at);

    // Hero-Text sofort einblenden (nicht scroll-gebunden)
    gsap.set(layers[0], { opacity: 1 });
    gsap.fromTo(layers[0].querySelectorAll('.w'), { yPercent: 110 }, { yPercent: 0, duration: 1.2, stagger: .08, ease: 'power4.out', delay: seen ? .2 : 1.2 });
    gsap.fromTo(layers[0].querySelectorAll('.lead, .actions, .eyebrow'), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, stagger: .12, ease: 'power3.out', delay: seen ? .6 : 1.6 });

    const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: scene, start: 'top top', end: 'bottom bottom', scrub: .7 } });
    // Zeitachse 0 … 100
    // 1) Aachener Dach: langsamer Zoom, dann Text raus
    tl.fromTo(shot1.querySelector('img'), { scale: 1 }, { scale: 1.14, duration: 24 }, 0);
    textOut(layers[0], 9, tl);
    // 1 → 2  Kachel-Montage: das Montage-Team setzt sich aus neun Kacheln zusammen
    tl.set(tilesWrap, { opacity: 1 }, 10);
    tiles.forEach((t, i) => {
      const c = i % 3 - 1, r = Math.floor(i / 3) - 1;
      const far = (c === 0 && r === 0);
      tl.fromTo(t, { xPercent: c * 170, yPercent: r * 170, opacity: 0, rotate: (c - r) * 7, scale: far ? .3 : 1 }, { xPercent: 0, yPercent: 0, opacity: 1, rotate: 0, scale: 1, duration: 9, ease: 'power3.out' }, 11 + (far ? 5 : (Math.abs(c) + Math.abs(r)) * 1.2));
    });
    tl.fromTo(tiles.map(t => t.firstElementChild), { scale: 1.15 }, { scale: 1, duration: 22 }, 11);
    textIn(layers[1], 21, tl);
    textOut(layers[1], 31, tl);
    // 2 → 3  Text-Maske: „WÄRME“ wächst und wird zum Fenster auf die Wärmepumpe
    tl.fromTo(maskText, { attr: { 'font-size': 0.1 } }, { attr: { 'font-size': 760 }, duration: 15, ease: 'power2.in' }, 32);
    tl.set(stripsWrap, { opacity: 1 }, 46.5);
    tl.set(maskSvg, { opacity: 0 }, 46.6);
    textIn(layers[2], 44, tl);
    textOut(layers[2], 54, tl);
    // 3 → 4  Lamellen: die Wärmepumpe teilt sich in Streifen, die den Solarpark freigeben
    tl.set(shot4, { opacity: 1 }, 55);
    strips.forEach((s, i) => tl.to(s, { yPercent: (i % 2 ? 1 : -1) * 105, duration: 7 + (i % 3) * 2, ease: 'power2.in' }, 56 + i * .6));
    tl.fromTo(shot4.querySelector('img'), { scale: 1.25 }, { scale: 1.02, duration: 22 }, 56);
    textIn(layers[3], 66, tl);
    textOut(layers[3], 76, tl);
    // 4 → 5  Zoom-Dive + Lichtblitz, dann 3D-Kartenwechsel nach Aachen
    tl.to(shot4.querySelector('img'), { scale: 1.9, transformOrigin: '58% 45%', duration: 8, ease: 'power2.in' }, 78);
    tl.fromTo(flash, { opacity: 0 }, { opacity: .9, duration: 1.2, ease: 'power2.in' }, 85.5).to(flash, { opacity: 0, duration: 2.5 }, 86.7);
    tl.set([tilesWrap, shot1], { opacity: 0 }, 86);
    tl.to(shot4, { scale: .55, borderRadius: 40, rotateY: -38, xPercent: -40, opacity: 0, duration: 8, ease: 'power2.inOut' }, 86);
    tl.fromTo(shot5, { scale: .32, borderRadius: 40, rotateY: 28, xPercent: 45, opacity: 0 }, { scale: 1, borderRadius: 0, rotateY: 0, xPercent: 0, opacity: 1, duration: 9, ease: 'power2.inOut' }, 86);
    tl.fromTo(shot5.querySelector('img'), { scale: 1.2 }, { scale: 1, duration: 14 }, 86);
    textIn(layers[4], 93, tl);
    tl.to({}, { duration: 1 }, 100);
  }

  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
    const el = location.hash && document.getElementById(location.hash.slice(1));
    if (el) setTimeout(() => scrollToEl(el), 300);
  });
})();
