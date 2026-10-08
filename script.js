// ============================================
// Amélie Philippon — Portfolio (v2)
// ============================================

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  // ---------- Marquee d'outils ----------
  var tools = ['ChatGPT', 'Notion', 'Figma', 'Canva', 'Meta Ads', 'Google Analytics', 'Asana', 'Midjourney'];
  var track = $('#marqueeTrack');
  if (track) {
    var html = '';
    for (var r = 0; r < 4; r++) {
      for (var i = 0; i < tools.length; i++) {
        html += '<span>' + tools[i] + '</span>';
      }
    }
    track.innerHTML = html;
  }

  // ---------- Codes-barres décoratifs ----------
  $$('.barcode').forEach(function (bc) {
    var h = '';
    for (var b = 0; b < 22; b++) {
      var w = (b % 3 === 0) ? 2 : 1;
      var hpx = 10 + (b % 4) * 2;
      h += '<i style="width:' + w + 'px;height:' + hpx + 'px;"></i>';
    }
    bc.innerHTML = h;
  });

  // ---------- Badge : retournement au mouvement de la souris ----------
  var badge = $('#badge');
  var hero = $('#top');
  var heroVisible = true;
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      heroVisible = es[0].isIntersecting;
    }, { threshold: 0.2 }).observe(hero);
  }

  function flip() { if (badge) badge.classList.toggle('flipped'); }

  if (badge) {
    var lastFlip = 0, moveTimer = null;
    var COOLDOWN = 1100, SETTLE = 450;

    if (finePointer && !reduceMotion) {
      window.addEventListener('mousemove', function () {
        if (!heroVisible) return;
        clearTimeout(moveTimer);
        moveTimer = setTimeout(function () {
          var now = Date.now();
          if (now - lastFlip < COOLDOWN) return;
          lastFlip = now;
          flip();
        }, SETTLE);
      });
    }

    // Clic / tap / clavier
    badge.addEventListener('click', function () { lastFlip = Date.now(); flip(); });
    badge.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); lastFlip = Date.now(); flip(); }
    });

    // Tactile : retournement automatique
    if (!finePointer && !reduceMotion) {
      setInterval(function () { if (heroVisible && !document.hidden) flip(); }, 4500);
    }
  }

  // ---------- Machine à écrire du hero ----------
  var typer = $('#typer');
  var phrases = [
    'Je transforme des idées en projets',
    'Je pilote des projets de A à Z',
    'Je crée des sites qui convertissent',
    'Marketing, gestion de projet, IA'
  ];
  if (typer) {
    if (reduceMotion) {
      typer.textContent = phrases[0];
    } else {
      var pi = 0, ci = 0, deleting = false;
      (function tick() {
        var p = phrases[pi];
        if (!deleting) {
          ci++;
          typer.textContent = p.slice(0, ci);
          if (ci === p.length) { deleting = true; return setTimeout(tick, 1600); }
          return setTimeout(tick, 55);
        }
        ci--;
        typer.textContent = p.slice(0, ci);
        if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; return setTimeout(tick, 350); }
        setTimeout(tick, 28);
      })();
    }
  }

  // ---------- Navigation : apparition + thème ----------
  var nav = $('#nav');
  var themed = $$('[data-nav]');
  function updateNav() {
    if (!nav) return;
    var y = window.scrollY || window.pageYOffset;
    var limit = hero ? hero.offsetHeight * 0.6 : 200;
    nav.classList.toggle('show', y > limit);
    var theme = 'dark';
    for (var i = 0; i < themed.length; i++) {
      var rc = themed[i].getBoundingClientRect();
      if (rc.top <= 50 && rc.bottom > 50) { theme = themed[i].getAttribute('data-nav'); break; }
    }
    if (nav.getAttribute('data-theme') !== theme) nav.setAttribute('data-theme', theme);
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { updateNav(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', updateNav);
  updateNav();

  // ---------- Machine à écrire des titres ----------
  function typeInto(wrap) {
    var ghost = $('.ghost', wrap), live = $('.live', wrap);
    if (!ghost || !live) return;
    var text = ghost.textContent.trim();
    if (reduceMotion) { live.textContent = text; return; }
    var n = 0;
    live.classList.add('typing');
    (function step() {
      n++;
      live.textContent = text.slice(0, n);
      if (n < text.length) setTimeout(step, 32);
      else setTimeout(function () { live.classList.remove('typing'); }, 1200);
    })();
  }

  // ---------- Révélations au scroll ----------
  var typeEls = $$('[data-type]');
  var revealEls = $$('.reveal, .reveal-blur');
  var countEls = $$('[data-count]');

  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (reduceMotion) { el.textContent = target; return; }
    var t0 = null, dur = 1400;
    (function frame(t) {
      if (t0 === null) t0 = t;
      var k = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(frame);
    })(performance.now());
  }

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
    typeEls.forEach(typeInto);
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.add('in-view');
        if (el.hasAttribute('data-type')) typeInto(el);
        io.unobserve(el);
      });
    }, { threshold: 0.2 });
    revealEls.concat(typeEls).forEach(function (el) { io.observe(el); });

    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        countUp(en.target);
        io2.unobserve(en.target);
      });
    }, { threshold: 0.6 });
    countEls.forEach(function (el) { el.textContent = '0'; io2.observe(el); });
  }

  // ---------- Carrousel de projets ----------
  var wt = $('#workTrack');
  if (wt) {
    var down = false, startX = 0, startLeft = 0, moved = false;
    wt.addEventListener('mousedown', function (e) {
      down = true; moved = false; startX = e.pageX; startLeft = wt.scrollLeft;
    });
    window.addEventListener('mousemove', function (e) {
      if (!down) return;
      var dx = e.pageX - startX;
      if (Math.abs(dx) > 5) { moved = true; wt.classList.add('dragging'); }
      if (moved) wt.scrollLeft = startLeft - dx;
    });
    window.addEventListener('mouseup', function () {
      if (!down) return;
      down = false;
      wt.classList.remove('dragging');
    });
    wt.addEventListener('click', function (e) {
      if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
    }, true);
    wt.addEventListener('dragstart', function (e) { e.preventDefault(); });

    var by = function (dir) {
      wt.scrollBy({ left: dir * wt.clientWidth * 0.8, behavior: reduceMotion ? 'auto' : 'smooth' });
    };
    var prev = $('#workPrev'), next = $('#workNext');
    if (prev) prev.addEventListener('click', function () { by(-1); });
    if (next) next.addEventListener('click', function () { by(1); });
  }
})();
