/* ==========================================================================
   Joe Monceballez — homesincorpus.com  |  shared behavior
   Loaded by every service page (index.html keeps its own inline copy).
   - scroll reveal
   - FormSubmit AJAX (inline bilingual success, honeypot, no captcha/redirect)
   - EN/ES toggle, persisted across pages via localStorage('himc_lang')
   ========================================================================== */
(function () {
  'use strict';

  // Netlify Forms — absolute URL so submissions land even when this page is
  // served from GitHub Pages; no-cors because Netlify's form endpoint doesn't
  // return CORS headers (the POST still records).
  var FORM_ENDPOINT = 'https://homesincorpus.netlify.app/';

  /* ---------- scroll reveal ---------- */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.rv').forEach(function (el) { io.observe(el); });

  /* ---------- FormSubmit AJAX ---------- */
  function isES() { return document.documentElement.lang === 'es'; }

  function wireForm(form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      // honeypot filled = bot, silently pretend success
      var honey = form.querySelector('input[name="_honey"]');
      var data = new FormData(form);
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.style.opacity = '.7'; }

      if (honey && honey.value) { showSuccess(form); return; }

      fetch(FORM_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString()
      }).then(function () { showSuccess(form); })
        .catch(function () {
          // network fail — don't lose the lead, point them to call/text
          form.innerHTML = isES()
            ? '<h3 style="margin-bottom:8px">Casi listo 🤙</h3><p class="f-sub">No pudimos enviar el formulario. Llama o manda texto a <a href="tel:3619601779" style="color:var(--orange);font-weight:700">(361) 960-1779</a> y Joe te atiende enseguida.</p>'
            : '<h3 style="margin-bottom:8px">Almost there 🤙</h3><p class="f-sub">We couldn\'t submit the form. Call or text <a href="tel:3619601779" style="color:var(--orange);font-weight:700">(361) 960-1779</a> and Joe will take care of you right away.</p>';
        });
    });
  }

  function showSuccess(form) {
    form.innerHTML = isES()
      ? '<h3 style="margin-bottom:8px">¡Listo! Joe se comunicará contigo. 🤙</h3><p class="f-sub">¿Lo necesitas ahora mismo? Llama o manda texto al <a href="tel:3619601779" style="color:var(--orange);font-weight:700">(361) 960-1779</a>.</p>'
      : '<h3 style="margin-bottom:8px">Got it — Joe will be in touch. 🤙</h3><p class="f-sub">Need him right now? Call or text <a href="tel:3619601779" style="color:var(--orange);font-weight:700">(361) 960-1779</a>.</p>';
  }

  document.querySelectorAll('form.lead-form').forEach(wireForm);

  /* ---------- EN/ES translation ---------- */
  // Shared chrome dictionary (nav, topbar, footer, contact, callbar).
  // Page-specific strings come from window.PAGE_ES defined inline per page.
  var CHROME_ES = {
    tb1: '⭐ <b>5.0 en Zillow</b> · 99 casas cerradas<span class="tb-tail"> · Corpus Christi y el Coastal Bend</span>',
    tb2: 'English available',
    brand2: 'Realtor · Inversionista · Contratista',
    nav0: 'Servicios <svg class="icon caret" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>',
    navHome: 'Inicio', navGallery: 'Galería', navAbout: 'Nosotros', navContact: 'Contacto',
    nav2: 'Oferta en Efectivo', nav3: 'Propiedades', nav4: 'Reseñas', nav5: 'Sobre Joe',
    smH1: 'Vende Tu Casa', smH2: 'Comprar', smH3: 'Invertir y Renovar',
    sm1: 'Vende Tu Casa', sm1s: 'Listado completo, al mejor precio',
    sm2: 'Valuación Gratis', sm2s: '¿Cuánto vale hoy?',
    sm3: 'Oferta en Efectivo', sm3s: 'Como está, en tu tiempo',
    sm4: 'Detén la Ejecución', sm4s: 'Opciones rápidas, respuestas claras',
    sm5: 'Casa Heredada', sm5s: 'Sin limpieza, sin reparaciones',
    sm6: 'Compra una Casa', sm6s: 'La comisión de Joe te cuesta $0',
    sm7: 'Compradores Primerizos', sm7s: 'Los mejores prestamistas, sin presión',
    sm8: 'Inversión y Wholesale', sm8s: 'Tratos para la red de Joe',
    sm9: 'Remodelación y Handyman', sm9s: 'Cocinas, pisos, reparaciones — estimados gratis',
    smBadge: 'HABLA CON JOE HOY',
    navCta: '(361) 960-1779',
    ctEyebrow: 'Habla con Joe', ctH2: '“Estoy disponible 24/7 para lo que necesites.”',
    ctP: 'Ya sea una valuación, una oferta en efectivo, una pregunta de renovación, o tu primera casa — la respuesta más rápida es una llamada o un texto.',
    ctRow1: 'Llama o manda texto — respuesta más rápida', ctRow2: 'Escríbele directamente',
    fH: 'Dile a Joe qué necesitas', fSub: 'Te responde el mismo día — normalmente mucho más rápido.',
    fL1: 'Estoy buscando…', fO0: 'Elige una opción', fO1: 'Vender mi casa (listarla)', fO2: 'Una oferta en efectivo por mi casa', fO3: 'Comprar una casa', fO4: 'Alertas de nuevas propiedades', fO5: 'Hablar de inversiones / wholesale',
    fL2: 'Nombre', fL3: 'Teléfono', fL4: 'Dirección de la propiedad', fL4b: '(si vendes)', fL5: '¿Algo más?',
    fBtn: 'Envíaselo a Joe',
    fFine: 'Al enviar, aceptas que Joe te llame o te mande texto al número que diste. Nada de spam, nunca.',
    ftRole: 'Realtor · Inversionista · Contratista',
    cbCall: 'Llama a Joe', cbText: 'Textea a Joe'
  };
  var CHROME_ES_PH = { phName: 'Tu nombre', phAddr: 'Calle y ciudad', phMsg: 'Tiempo, condición, preguntas…' };

  var ES = Object.assign({}, CHROME_ES, window.PAGE_ES || {});
  var ES_PH = Object.assign({}, CHROME_ES_PH, window.PAGE_ES_PH || {});
  var EN = {}, EN_PH = {};
  document.querySelectorAll('[data-i18n]').forEach(function (el) { EN[el.dataset.i18n] = el.innerHTML; });
  document.querySelectorAll('[data-ph]').forEach(function (el) { EN_PH[el.dataset.ph] = el.placeholder; });

  function applyLang(toES) {
    document.documentElement.lang = toES ? 'es' : 'en';
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.dataset.i18n;
      el.innerHTML = toES ? (ES[k] != null ? ES[k] : el.innerHTML) : EN[k];
    });
    document.querySelectorAll('[data-ph]').forEach(function (el) {
      var k = el.dataset.ph;
      el.placeholder = toES ? (ES_PH[k] != null ? ES_PH[k] : el.placeholder) : EN_PH[k];
    });
    var lbl = document.getElementById('langLabel');
    if (lbl) lbl.textContent = toES ? 'EN' : 'ES';
    try { localStorage.setItem('himc_lang', toES ? 'es' : 'en'); } catch (e) {}
  }

  window.toggleLang = function () { applyLang(document.documentElement.lang !== 'es'); };

  // restore saved language on load
  try { if (localStorage.getItem('himc_lang') === 'es') applyLang(true); } catch (e) {}

  /* ---------- mobile burger menu (drawer cloned from desktop nav links) ---------- */
  var navInEl = document.querySelector('nav .nav-in');
  var navLinksEl = document.querySelector('nav .nav-links');
  if (navInEl && navLinksEl && !document.querySelector('.mobile-menu')) {
    var BARS = '<svg class="icon" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';
    var CROSS = '<svg class="icon" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>';
    var burger = document.createElement('button');
    burger.className = 'burger'; burger.setAttribute('aria-label', 'Menu'); burger.innerHTML = BARS;
    navInEl.querySelector('.nav-right').prepend(burger);
    var drawer = document.createElement('div');
    drawer.className = 'mobile-menu'; drawer.innerHTML = navLinksEl.innerHTML;
    document.body.appendChild(drawer);
    var setMenu = function (open) {
      document.body.classList.toggle('menu-open', open);
      burger.innerHTML = open ? CROSS : BARS;
      if (open) drawer.style.top = document.querySelector('nav').getBoundingClientRect().bottom + 'px';
    };
    burger.addEventListener('click', function () { setMenu(!document.body.classList.contains('menu-open')); });
    drawer.addEventListener('click', function (e) { if (e.target.closest('a[href]')) setMenu(false); });
  }

  /* ---------- mobile callbar: slide in only after the hero scrolls out ---------- */
  var callbarEl = document.querySelector('.callbar');
  var heroEl = document.querySelector('header.hero');
  if (callbarEl) {
    if (heroEl) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { callbarEl.classList.toggle('show', !e.isIntersecting); });
      }).observe(heroEl);
    } else {
      var cbOnScroll = function () { callbarEl.classList.toggle('show', window.scrollY > 320); };
      window.addEventListener('scroll', cbOnScroll, { passive: true }); cbOnScroll();
    }
  }

  /* ---------- photo lightbox (click to zoom, prev/next, keyboard) ---------- */
  var lbImgs = Array.prototype.slice.call(document.querySelectorAll('.gal-grid img, img[data-lb]'));
  if (lbImgs.length) {
    var ov = document.createElement('div');
    ov.className = 'lb-overlay';
    ov.innerHTML = '<button class="lb-close" aria-label="Close">&times;</button>' +
      '<button class="lb-nav lb-prev" aria-label="Previous">&#8249;</button>' +
      '<img alt="">' +
      '<button class="lb-nav lb-next" aria-label="Next">&#8250;</button>';
    document.body.appendChild(ov);
    var lbBig = ov.querySelector('img'), lbI = 0;
    var lbShow = function (n) { lbI = (n + lbImgs.length) % lbImgs.length; lbBig.src = lbImgs[lbI].currentSrc || lbImgs[lbI].src; lbBig.alt = lbImgs[lbI].alt || ''; };
    var lbOpen = function (n) { lbShow(n); ov.classList.add('on'); document.body.style.overflow = 'hidden'; };
    var lbClose = function () { ov.classList.remove('on'); document.body.style.overflow = ''; };
    lbImgs.forEach(function (im, idx) { im.style.cursor = 'zoom-in'; im.addEventListener('click', function () { lbOpen(idx); }); });
    ov.querySelector('.lb-close').addEventListener('click', lbClose);
    ov.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); lbShow(lbI - 1); });
    ov.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); lbShow(lbI + 1); });
    ov.addEventListener('click', function (e) { if (e.target === ov) lbClose(); });
    document.addEventListener('keydown', function (e) {
      if (!ov.classList.contains('on')) return;
      if (e.key === 'Escape') lbClose();
      else if (e.key === 'ArrowLeft') lbShow(lbI - 1);
      else if (e.key === 'ArrowRight') lbShow(lbI + 1);
    });
  }

  /* ---------- TikTok strip arrows (desktop) ---------- */
  document.querySelectorAll('.tt-wrap').forEach(function (wrap) {
    var strip = wrap.querySelector('.tt-strip');
    var prev = wrap.querySelector('.tt-prev');
    var next = wrap.querySelector('.tt-next');
    if (!strip || !prev || !next) return;
    var step = function () { return Math.max(340, strip.clientWidth * 0.7); };
    var update = function () {
      prev.disabled = strip.scrollLeft <= 4;
      next.disabled = strip.scrollLeft >= strip.scrollWidth - strip.clientWidth - 4;
    };
    prev.addEventListener('click', function () { strip.scrollBy({ left: -step(), behavior: 'smooth' }); });
    next.addEventListener('click', function () { strip.scrollBy({ left: step(), behavior: 'smooth' }); });
    strip.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    // embeds hydrate late (embed.js swaps blockquotes for iframes, changing scrollWidth)
    setTimeout(update, 1500); setTimeout(update, 4000);
    update();
  });
})();
