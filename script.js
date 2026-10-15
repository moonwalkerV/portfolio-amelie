// ============================================
// Amélie Philippon — Portfolio (v2)
// ============================================

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  // ---------- Sections activables ----------
  // SHOW_OFFERS : true = section « Mes formules » + lien « Offres » dans le menu ; false = bandeau de contact à la place.
  var SHOW_OFFERS = false;
  var setHidden = function (sel, hide) { $$(sel).forEach(function (el) { el.hidden = hide; }); };
  setHidden('#offres, .nav-links a[href="#offres"]', !SHOW_OFFERS);
  setHidden('.cta-band', SHOW_OFFERS);
  // SHOW_STATS : true = bande des chiffres (4 / 4 / 2) ; false = section « Comment je travaille » à la place.
  var SHOW_STATS = false;
  setHidden('.stats', !SHOW_STATS);
  setHidden('.how', SHOW_STATS);

  // ---------- Marquee d'outils ----------
  var tools = ['Figma', 'Canva', 'Photoshop', 'Illustrator', 'InDesign', 'After Effects', 'Premiere Pro', 'Notion', 'Trello', 'ClickUp', 'Glide', 'Outils Google', 'Visual Studio Code', 'Outils IA'];
  var track = $('#marqueeTrack');
  if (track) {
    var html = '';
    for (var r = 0; r < 2; r++) { // 2 copies suffisent (boucle à -50 %), vitesse quasi inchangée
      for (var i = 0; i < tools.length; i++) {
        html += '<span>' + tools[i] + '</span>';
      }
    }
    track.innerHTML = html;
    // Vitesse constante (95 px/s, celle de l'ancienne bande) : la durée suit la largeur réelle de la liste
    var MARQUEE_SPEED = 94.875;
    var setMarqueeSpeed = function () {
      track.style.animationDuration = ((track.scrollWidth / 2) / MARQUEE_SPEED).toFixed(2) + 's';
    };
    setMarqueeSpeed();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(setMarqueeSpeed);
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
    // Le texte tapé et « Défiler » n'appartiennent qu'à l'accueil : ils s'effacent dès qu'on le quitte
    if (hero) hero.classList.toggle('is-away', y > hero.offsetHeight * 0.3);
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

    // Le comptage se déclenche avec l'apparition de la carte (.stat) qui le contient, au même seuil que sa révélation
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var num = en.target.hasAttribute('data-count') ? en.target : en.target.querySelector('[data-count]');
        if (num) countUp(num);
        io2.unobserve(en.target);
      });
    }, { threshold: 0.2 });
    countEls.forEach(function (el) {
      el.textContent = '0';
      io2.observe(el.closest('.stat') || el);
    });
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

    // Survol : la carte visée s'agrandit tout de suite et se centre (souris uniquement, hors mouvement réduit)
    if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
      var cards = Array.prototype.slice.call(wt.querySelectorAll('.proj'));
      var active = null, autoScroll = false, raf = 0;
      var lastX = -1, lastY = -1, anchorX = -1, anchorY = -1;
      var DURATION = 850;
      var ease = function (t) { return 1 - Math.pow(1 - t, 4); }; // easeOutQuart

      var setActive = function (card) {
        active = card;
        cards.forEach(function (c) { c.classList.toggle('is-active', c === card); });
        wt.classList.toggle('has-focus', !!card);
      };
      var endAuto = function () {
        cancelAnimationFrame(raf);
        wt.classList.remove('auto-scroll');
        autoScroll = false;
        anchorX = lastX; anchorY = lastY; // on attend un vrai mouvement avant de réagir à nouveau
      };
      var centerOn = function (card) {
        var tr = wt.getBoundingClientRect(), cr = card.getBoundingClientRect();
        var max = wt.scrollWidth - wt.clientWidth;
        var from = wt.scrollLeft;
        var target = Math.max(0, Math.min(max, from + (cr.left + cr.width / 2) - (tr.left + tr.width / 2)));
        if (Math.abs(target - from) < 2) return;
        cancelAnimationFrame(raf);
        autoScroll = true;
        wt.classList.add('auto-scroll'); // coupe le magnétisme le temps de l'animation
        var t0 = performance.now();
        var step = function (now) {
          var p = Math.min(1, (now - t0) / DURATION);
          wt.scrollLeft = from + (target - from) * ease(p);
          if (p < 1) raf = requestAnimationFrame(step); else endAuto();
        };
        raf = requestAnimationFrame(step);
      };

      // Une action de l'utilisateur sur le défilement reprend la main
      ['wheel', 'touchstart', 'mousedown'].forEach(function (ev) {
        wt.addEventListener(ev, function () { if (autoScroll) endAuto(); }, { passive: true });
      });

      wt.addEventListener('pointermove', function (e) {
        if (e.pointerType && e.pointerType !== 'mouse') return;
        var moved2 = e.clientX !== lastX || e.clientY !== lastY;
        lastX = e.clientX; lastY = e.clientY;
        if (!moved2 || down || autoScroll) return; // ignore survols fantômes, glisser et défilement auto
        if (anchorX >= 0 && Math.abs(e.clientX - anchorX) + Math.abs(e.clientY - anchorY) < 6) return;
        anchorX = -1;
        var card = e.target.closest ? e.target.closest('.proj') : null;
        if (!card || card === active) return;
        setActive(card);
        centerOn(card);
      });

      wt.addEventListener('pointerleave', function () {
        lastX = lastY = anchorX = anchorY = -1;
        setActive(null);
      });
    }
  }
  // ---------- Panneau de détails des projets ----------
  // Contenus modifiables ici : un objet par projet. Un champ vide ou absent n'est pas affiché.
  var PROJECTS = {
    kalikana: {
      title: 'Kalikana',
      status: 'Expérience',
      period: '2022 – 2026',
      role: 'Alternante responsable marketing (2 ans), puis cheffe de projet (2 ans)',
      contextLabel: 'Contexte',
      context: 'Marque de produits au CBD, avec une boutique en ligne pour les particuliers et un espace réservé aux professionnels. Deux diplômes obtenus pendant cette alternance : responsable marketing, puis cheffe de projet.',
      did: [
        'Création du site web B2C et B2B (front-end et back-end)',
        'Design des étiquettes produit et des supports de communication',
        'Gestion des réseaux sociaux',
        'Stratégie produit, planification et coordination des projets'
      ],
      // Outils : liste de groupes { group: 'Titre', items: [...] } ; le titre est facultatif
      tools: [
        { group: 'Gestion de projet', items: ['Trello', 'ClickUp', 'Notion'] },
        { group: 'Design et vidéo', items: ['Figma', 'Canva', 'Photoshop', 'Illustrator', 'InDesign', 'After Effects', 'Premiere Pro'] },
        { group: 'Web et no-code', items: ['Glide'] },
        { group: 'IA', items: ['Midjourney', 'ChatGPT', 'Claude', 'Perplexity', 'Nano Banana'] },
        { group: 'Marketing et analyse', items: ['Outils Google'] }
      ]
    },
    camping: {
      title: 'Camping Clairac',
      status: 'Projet client',
      period: 'Septembre – octobre 2026',
      contextLabel: 'Mission',
      context: 'Refondre entièrement le site de cette aire naturelle : mieux présenter le lieu et les séjours, faciliter la préparation de la venue et donner envie de réserver.',
      did: [
        'Refonte totale du site web (structure, contenus, design)',
        'Mise en ligne d\'un site clair, pensé pour donner envie de séjourner'
      ]
    }
  };

  var modal = $('#pjModal');
  if (modal && wt) {
    var panel = modal.querySelector('.pj-panel');
    var closeBtn = modal.querySelector('.pj-close');
    var pjImg = $('#pjImg'), pjLink = $('#pjLink');
    var opener = null, hideT = null, isOpen = false;

    var fillList = function (box, items) {
      var ul = box.querySelector('ul');
      ul.innerHTML = '';
      (items || []).forEach(function (t) {
        var li = document.createElement('li'); li.textContent = t; ul.appendChild(li);
      });
      box.hidden = !(items && items.length);
    };
    var fillTools = function (groups) {
      var box = $('#pjTools'), body = $('#pjToolsBody');
      body.innerHTML = '';
      (groups || []).forEach(function (g) {
        if (!g.items || !g.items.length) return;
        var wrap = document.createElement('div'); wrap.className = 'pj-toolgroup';
        if (g.group) { var h = document.createElement('h5'); h.textContent = g.group; wrap.appendChild(h); }
        var ul = document.createElement('ul'); ul.className = 'pj-tools';
        g.items.forEach(function (t) {
          var li = document.createElement('li'); li.textContent = t; ul.appendChild(li);
        });
        wrap.appendChild(ul); body.appendChild(wrap);
      });
      box.hidden = !body.children.length;
    };
    var fillFacts = function (d) {
      var dl = $('#pjFacts');
      dl.innerHTML = '';
      [['Rôle', d.role], ['Période', d.period]].forEach(function (f) {
        if (!f[1]) return;
        var row = document.createElement('div'), dt = document.createElement('dt'), dd = document.createElement('dd');
        dt.textContent = f[0]; dd.textContent = f[1];
        row.appendChild(dt); row.appendChild(dd); dl.appendChild(row);
      });
      dl.hidden = !dl.children.length;
    };
    var focusables = function () {
      return Array.prototype.slice.call(panel.querySelectorAll('a[href], button:not([disabled])'))
        .filter(function (el) { return el.offsetParent !== null; });
    };
    var lockScroll = function () {
      var sbw = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      if (sbw > 0) document.body.style.paddingRight = sbw + 'px';
    };
    var unlockScroll = function () {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };

    var openProject = function (card) {
      var d = PROJECTS[card.getAttribute('data-project')];
      if (!d) return false;
      clearTimeout(hideT);
      opener = card;
      var img = card.querySelector('img');
      pjImg.src = img ? img.getAttribute('src') : '';
      pjImg.alt = img ? img.getAttribute('alt') : '';
      pjImg.style.display = '';
      $('#pjTitle').textContent = d.title;
      var st = $('#pjStatus'); st.textContent = d.status || ''; st.hidden = !d.status;
      fillFacts(d);
      var ctx = $('#pjContext'); ctx.querySelector('h4').textContent = d.contextLabel || 'Contexte'; ctx.querySelector('p').textContent = d.context || ''; ctx.hidden = !d.context;
      fillList($('#pjDid'), d.did);
      fillTools(d.tools);
      pjLink.href = card.href;
      panel.scrollTop = 0;
      modal.hidden = false;
      lockScroll();
      void modal.offsetWidth; // force le calcul de style pour lancer la transition
      modal.classList.add('is-open');
      isOpen = true;
      closeBtn.focus({ preventScroll: true });
      return true;
    };
    var closeProject = function () {
      if (!isOpen) return;
      isOpen = false;
      modal.classList.remove('is-open');
      unlockScroll();
      if (opener) opener.focus({ preventScroll: true });
      hideT = setTimeout(function () { modal.hidden = true; }, reduceMotion ? 0 : 500);
    };

    pjImg.addEventListener('error', function () { pjImg.style.display = 'none'; });

    // La carte entière ouvre le panneau (clic souris, Entrée ou Espace sur le lien)
    wt.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var card = e.target.closest ? e.target.closest('.proj') : null;
      if (card && openProject(card)) e.preventDefault();
    });

    modal.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('[data-close]')) closeProject();
    });

    document.addEventListener('keydown', function (e) {
      if (!isOpen) return;
      if (e.key === 'Escape') { e.preventDefault(); closeProject(); return; }
      if (e.key !== 'Tab') return;
      var f = focusables();
      if (!f.length) { e.preventDefault(); panel.focus(); return; }
      var first = f[0], last = f[f.length - 1], cur = document.activeElement;
      if (!panel.contains(cur)) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && cur === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && cur === last) { e.preventDefault(); first.focus(); }
    });
    document.addEventListener('focusin', function (e) {
      if (isOpen && !modal.contains(e.target)) closeBtn.focus({ preventScroll: true });
    });
  }
  // ---------- Offres : prix (modifiables ici, un objet par offre) ----------
  // SHOW_PRICES : false = les offres « fixed » affichent « Devis gratuit sous 24 h » au lieu du prix.
  // price_mode : 'fixed' = prix affiché (selon SHOW_PRICES) ; 'quote' = « Sur devis », toujours.
  var SHOW_PRICES = false;
  var QUOTE_LABEL = 'Sur devis';
  var HIDDEN_PRICE_LABEL = 'Devis gratuit sous 24 h';
  var OFFERS = {
    'vitrine-essentiel': { price_mode: 'fixed', price: 'dès 990 € HT' },
    'mini-identite':     { price_mode: 'fixed', price: 'dès 590 € HT' },
    'pack-lancement':    { price_mode: 'fixed', price: 'dès 1 490 € HT' },
    'vitrine-complete':  { price_mode: 'quote', price: 'dès 1 490 € HT' }, // price ignoré tant que price_mode = 'quote'
    'suivi-mensuel':     { price_mode: 'quote', price: 'dès 39 € HT par mois' },
    'gestion-de-projet': { price_mode: 'quote' }
  };
  $$('.offre[data-offer]').forEach(function (card) {
    var o = OFFERS[card.getAttribute('data-offer')];
    var el = card.querySelector('.offre-price');
    if (!o || !el) return;
    var text;
    if (o.price_mode === 'quote') text = QUOTE_LABEL;
    else if (!SHOW_PRICES) text = HIDDEN_PRICE_LABEL;
    else text = o.price || QUOTE_LABEL;
    // espaces insécables : « 1 490 € HT » ne se coupe pas en fin de ligne
    el.textContent = text.replace(/(\d) (?=\d)/g, '$1\u00a0').replace(/ (?=[€])/g, '\u00a0').replace(/€ HT/g, '€\u00a0HT').replace(/(\d) (?=h\b)/g, '$1\u00a0');
  });

  // ---------- Contact : prise de rendez-vous ----------
  // Colle ici l'URL de réservation (Calendly, Cal.com…). Vide : le bouton ouvre un e-mail « Appel découverte ».
  var BOOKING_URL = '';
  if (BOOKING_URL) {
    $$('[data-book]').forEach(function (a) {
      a.href = BOOKING_URL;
      a.target = '_blank';
      a.rel = 'noopener';
    });
  }
})();
