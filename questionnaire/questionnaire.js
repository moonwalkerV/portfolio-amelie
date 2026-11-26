(function () {
  'use strict';
  var WEB3FORMS_KEY = '438bee4e-d1ef-4373-87de-dc472d92baaf'; // même clé que le formulaire de contact (script.js)
  // Formules (mêmes identifiants que l'Atelier Glimra)
  var FORMULES = {
    essentielle: { n: 'Identité Essentielle', titre: 'Parlons de votre identité', duree: '15 à 25 minutes' },
    complete: { n: 'Identité Complète', titre: 'Parlons de votre identité', duree: '25 à 35 minutes' },
    pack: { n: 'Pack Identité + site', titre: 'Parlons de votre identité et de votre site', duree: '30 à 45 minutes' },
    unepage: { n: 'Site une page', titre: 'Parlons de votre site', duree: '10 à 15 minutes' },
    vitrine: { n: 'Site vitrine', titre: 'Parlons de votre site', duree: '15 à 25 minutes' },
    vitrineplus: { n: 'Site vitrine+', titre: 'Parlons de votre site', duree: '20 à 30 minutes' }
  };
  var F = document.body.getAttribute('data-formule');
  if (!FORMULES[F]) F = 'essentielle';
  var STORE = 'glimra-questionnaire-' + F;
  // Groupes de formules pour filtrer les questions (f absent = toutes)
  var ID = ['essentielle', 'complete', 'pack'], PLUS = ['complete', 'pack'], SITE = ['pack', 'unepage', 'vitrine', 'vitrineplus'], SEUL = ['unepage', 'vitrine', 'vitrineplus'], PAGES = ['pack', 'vitrine', 'vitrineplus'];

  var SECTIONS_ALL = [
    { id: 'vous', title: 'Vous', intro: 'Pour savoir à qui je parle.', qs: [
      { id: 'nom', type: 'text', req: 1, ac: 'name', label: 'Votre prénom et votre nom' },
      { id: 'activite', type: 'text', req: 1, ac: 'organization', label: 'Le nom de votre activité', help: 'Pas encore de nom ? Écrivez « à trouver » et vos idées.' },
      { id: 'email', type: 'email', req: 1, ac: 'email', label: 'Votre e-mail' },
      { id: 'tel', type: 'tel', ac: 'tel', label: 'Votre téléphone', help: 'Facultatif.' },
      { id: 'reseaux', type: 'long', label: 'Vos réseaux et pages en ligne', help: 'Instagram, TikTok, Facebook, fiche Google, site actuel, plateforme de réservation… Collez les liens ou les noms de compte.' }
    ]},
    { id: 'a', title: 'Votre activité', intro: 'Pour comprendre d’où vous partez.', qs: [
      { id: 'q1', type: 'long', label: 'Présentez votre activité.', help: 'Ce que vous faites, où, depuis quand, pour qui.' },
      { id: 'q1b', type: 'long', label: 'Vos prestations ou produits principaux, et vos tarifs.', help: 'Celui ou celle que vous voulez mettre en avant en premier.' },
      { id: 'q2', f: ID, type: 'one', label: 'Création ou refonte ?', opts: ['Création : je pars de zéro', 'Refonte : je veux changer ce qui existe', 'Un peu des deux'] },
      { id: 'q2s', f: SEUL, type: 'one', label: 'Création ou refonte du site ?', opts: ['Premier site', 'Refonte d’un site existant', 'Je passe d’une page Facebook ou Instagram à un vrai site'] },
      { id: 'q3', type: 'long', label: 'Pourquoi lancer ce projet maintenant ?', sugg: ['Je me lance', 'Mon image ne me ressemble plus', 'Toucher une nouvelle clientèle', 'Nouvelle offre ou nouveau métier', 'Me démarquer des autres', 'Être trouvé(e) sur Google'] },
      { id: 'i0', f: ID, type: 'long', label: 'Si vous avez déjà un logo : qu’est-ce qui fonctionne, et qu’est-ce qui ne va plus ?', help: 'Sinon, écrivez « pas de logo ».', sugg: ['Pas de logo', 'Il fait daté', 'Illisible en petit', 'Ne reflète plus l’activité', 'Je l’aime, à moderniser'] },
      { id: 'q4', type: 'text', label: 'Qui prend les décisions sur ce projet ?', sugg: ['Moi seul(e)', 'Avec mon associé(e)', 'En famille'] }
    ]},
    { id: 'strat', f: PLUS, title: 'Votre stratégie', intro: 'Pour préparer notre atelier stratégie de 2 h.', qs: [
      { id: 'c1', type: 'long', label: 'Pourquoi faites-vous ce métier ?', help: 'Ce qui vous motive, au-delà de gagner votre vie.' },
      { id: 'c2', type: 'long', label: 'Vos valeurs : 3 choses sur lesquelles vous ne transigez pas.', sugg: ['La qualité', 'L’honnêteté', 'L’écologie', 'Le fait main', 'La proximité', 'L’accessibilité', 'Le bien-être'] },
      { id: 'c3', type: 'long', label: 'Où voulez-vous être dans 3 ans ?', help: 'Nouveau lieu, nouvelles prestations, une équipe, plus de temps pour vous…' },
      { id: 'c4', type: 'long', label: 'Ce qui vous freine aujourd’hui ?', sugg: ['Pas assez visible', 'Prix trop bas', 'Clientèle qui ne me correspond pas', 'Pas le temps pour les réseaux', 'Image peu professionnelle'] },
      { id: 'c5', type: 'text', label: 'Vos disponibilités pour l’atelier (2 h, en visio ou en vrai).', help: 'Jours et créneaux qui vous arrangent.' }
    ]},
    { id: 'b', title: 'Vos clients', intro: 'Une identité réussie parle d’abord à vos clients.', qs: [
      { id: 'q5', type: 'long', label: 'Décrivez votre client idéal.', help: 'Âge, style, ce qu’il vient chercher, ce qui l’agace.', sugg: ['Particuliers', 'Professionnels', 'Jeunes actifs', 'Familles', 'Touristes', 'Habitants du coin', 'Prêts à payer pour la qualité', 'Budget serré'] },
      { id: 'q6', type: 'many', label: 'Comment vous trouvent-ils aujourd’hui ?', opts: ['Bouche-à-oreille', 'Instagram', 'TikTok', 'Facebook', 'Fiche Google', 'Site internet', 'Plateformes de réservation', 'Passage devant chez vous', 'Autre'] },
      { id: 'q7', type: 'long', label: 'Pourquoi vous choisissent-ils plutôt qu’un autre ?', sugg: ['La qualité', 'Le prix', 'L’accueil', 'La proximité', 'Le conseil', 'Le savoir-faire', 'La rapidité'] },
      { id: 'q8', f: SITE, type: 'one', label: 'Quelle est l’action n° 1 que vous voulez sur votre site ?', opts: ['Me contacter', 'Prendre rendez-vous', 'Demander une réservation', 'Demander un devis', 'Venir sur place', 'M’appeler', 'Acheter en ligne', 'Autre'] },
      { id: 'q9', type: 'long', label: 'Quelles questions vos clients vous posent-ils le plus souvent ?' }
    ]},
    { id: 'c', title: 'Votre marché', intro: 'Pour se démarquer, il faut savoir de qui.', qs: [
      { id: 'q10', type: 'long', label: 'Citez 2 ou 3 concurrents (avec leur compte ou leur site si possible).', help: 'Et ce que vous aimez ou n’aimez pas chez eux.' },
      { id: 'q11', type: 'long', label: 'Qu’est-ce qui vous rend différent(e) ?', sugg: ['Mon histoire', 'Mon savoir-faire', 'Mon style', 'Mon prix', 'Mon service', 'Mes valeurs', 'Mon lieu'] }
    ]},
    { id: 'd', title: 'Votre personnalité', intro: 'Comment votre marque doit-elle se faire ressentir ?', qs: [
      { id: 'q12', type: 'text', label: '3 mots que vos clients doivent ressentir.', sugg: ['Chaleureux', 'Élégant', 'Doux', 'Pétillant', 'Naturel', 'Moderne', 'Cocooning', 'Haut de gamme', 'Ludique', 'Rassurant', 'Audacieux', 'Authentique'] },
      { id: 'q13', type: 'text', label: '3 mots à éviter absolument.', sugg: ['Froid', 'Bas de gamme', 'Prétentieux', 'Vieillot', 'Enfantin', 'Banal', 'Compliqué', 'Médical'] },
      { id: 'q14', f: ID, type: 'scales', label: 'Placez votre marque sur ces échelles.', help: 'Choisissez d’instinct.',
        scales: [['Classique', 'Moderne'], ['Accessible', 'Haut de gamme'], ['Doux', 'Affirmé'], ['Discret', 'Expressif'], ['Artisanal', 'Industriel'], ['Local', 'International']] },
      { id: 'q15', type: 'one', label: 'Vous parlez à vos clients en…', opts: ['Vous', 'Tu', 'Ça dépend'] },
      { id: 'q16', type: 'text', label: 'Avez-vous un slogan ? Lequel ?', help: 'Sinon, écrivez « à proposer ».' },
      { id: 'q17', type: 'long', label: 'Des marques, sites ou comptes Instagram dont vous aimez le style ?', help: 'Même hors de votre secteur. Un nom ou un lien suffit.' }
    ]},
    { id: 'e', f: ID, title: 'Le visuel', intro: 'Vos goûts et vos contraintes.', qs: [
      { id: 'q18', type: 'long', label: 'Les couleurs que vous aimez, et celles que vous ne voulez pas.', sugg: ['J’aime : pastels', 'J’aime : tons naturels', 'J’aime : couleurs vives', 'J’aime : sombre et chic', 'J’aime : noir et blanc', 'J’aime : doré', 'À éviter : rose', 'À éviter : rouge', 'À éviter : vert', 'À éviter : fluo'] },
      { id: 'q19', type: 'long', label: 'Qu’est-ce qu’il faut absolument garder ?', help: 'Nom, couleur, symbole, déco de votre lieu…', sugg: ['Le nom', 'Les couleurs actuelles', 'Le symbole', 'Rien : on repart de zéro'] },
      { id: 'i1', type: 'many', label: 'Quel genre de logo vous attire ?', help: 'Plusieurs réponses possibles, je vous montrerai des exemples.', opts: ['Le nom seul, bien écrit', 'Un symbole + le nom', 'Un emblème ou un badge', 'Une mascotte', 'Des initiales (monogramme)', 'Une écriture manuscrite', 'Je ne sais pas'] },
      { id: 'i2', type: 'long', label: 'Des symboles, objets ou images liés à votre activité ?', help: 'Ce qui vous vient en tête, même si c’est un cliché.' },
      { id: 'q20', type: 'many', label: 'Où votre logo va-t-il apparaître ?', opts: ['Photo de profil des réseaux', 'Posts et stories', 'Cartes de visite', 'Cartes de fidélité', 'Grille de tarifs', 'Enseigne ou vitrine', 'Site internet', 'Factures et devis', 'Emballages', 'Vêtements', 'Véhicule', 'Autre'] }
    ]},
    { id: 'charte', f: SEUL, title: 'Votre image actuelle', intro: 'Le site s’appuie sur votre identité existante.', qs: [
      { id: 's1', type: 'many', label: 'Qu’avez-vous déjà ?', opts: ['Un logo en bon format (SVG, PDF ou PNG)', 'Un logo en photo ou capture seulement', 'Des couleurs définies', 'Des polices définies', 'Une charte graphique', 'Rien de tout ça'] },
      { id: 's2', type: 'long', label: 'Les couleurs et polices à utiliser, si vous les connaissez.', help: 'Codes couleur, noms de polices, ou « à voir ensemble ».' },
      { id: 's3', type: 'long', label: 'Les couleurs ou les styles que vous ne voulez surtout pas sur votre site.' }
    ]},
    { id: 'canva', f: PLUS, title: 'Vos supports', intro: 'Pour vos modèles Canva et vos mises en situation.', qs: [
      { id: 'c6', type: 'many', label: 'Quels modèles Canva vous serviraient le plus ?', help: 'La formule en comprend 8, on choisira ensemble.', opts: ['Post conseil', 'Post avant/après ou réalisation', 'Post promotion', 'Story annonce', 'Story à la une', 'Grille de tarifs', 'Carte de visite', 'Carte de fidélité', 'Flyer', 'Bannière Facebook ou LinkedIn', 'Signature e-mail'] },
      { id: 'c7', type: 'long', label: 'Sur quels supports voulez-vous voir votre marque en mise en situation ?', help: 'Ex. : enseigne, carte de visite, tote bag, flacon, vitrine, téléphone…' },
      { id: 'c8', type: 'one', label: 'Vous utilisez déjà Canva ?', opts: ['Oui, version gratuite', 'Oui, Canva Pro', 'Non, jamais'] }
    ]},
    { id: 'f', f: SITE, title: 'Votre site', intro: 'Ce qu’il doit contenir.', qs: [
      { id: 'q21', f: PAGES, type: 'long', label: 'Quelles pages imaginez-vous ?', help: 'Une liste suffit, je vous proposerai une arborescence.', sugg: ['Accueil', 'Prestations ou produits', 'À propos', 'Tarifs', 'Galerie', 'Avis', 'Actualités', 'Contact', 'FAQ'] },
      { id: 'q21u', f: ['unepage'], type: 'long', label: 'Que doit raconter votre page, dans l’ordre ?', help: 'Ex. : qui je suis, mes prestations, mes prix, des photos, des avis, me contacter.', sugg: ['Présentation', 'Prestations', 'Tarifs', 'Galerie photo', 'Avis clients', 'Horaires et accès', 'Contact'] },
      { id: 'q22', type: 'many', label: 'Quels contenus avez-vous déjà ?', opts: ['Photos de qualité', 'Photos à refaire', 'Textes prêts', 'Textes à écrire', 'Avis clients', 'Tarifs à jour', 'Rien encore'] },
      { id: 'q23', type: 'one', label: 'Voulez-vous que j’écrive les textes ?', help: 'Option rédaction : 90 € par page.', opts: ['Oui, toutes les pages', 'Oui, certaines pages', 'Non, je les écris'] },
      { id: 'q24', type: 'long', label: 'Une fonction particulière ?', help: 'Formulaire, prise de rendez-vous, galerie, carte, newsletter…', sugg: ['Formulaire de contact', 'Prise de rendez-vous', 'Demande de réservation', 'Galerie photo', 'Carte d’accès', 'Newsletter', 'Catalogue', 'Boutique en ligne'] },
      { id: 'q24v', f: ['vitrineplus'], type: 'long', label: 'La fonction en plus incluse : laquelle, et comment elle doit marcher ?', help: 'Réservation, catalogue, prise de rendez-vous… Dites-moi l’outil que vous utilisez déjà (Planity, Calendly…) s’il y en a un.' },
      { id: 'q24b', type: 'many', label: 'Dans quelles langues le site doit-il exister ?', help: 'Chaque langue en plus est une option du devis.', opts: ['Français', 'Anglais', 'Espagnol', 'Allemand', 'Néerlandais', 'Italien', 'Plus tard, pas tout de suite'] }
    ]},
    { id: 'g', title: 'Pour finir', intro: 'Pour organiser la suite.', qs: [
      { id: 'q25', f: SITE, type: 'long', label: 'Avez-vous un nom de domaine (adresse du site) et une fiche Google ?', help: 'Et chez qui est le domaine (OVH, Gandi, autre), si vous le savez.' },
      { id: 'q26', f: SITE, type: 'text', label: 'Qui mettra le site à jour, et quoi ?', help: 'Tarifs, horaires, actualités…', sugg: ['Moi', 'Une personne de mon équipe', 'Glimra (maintenance)'] },
      { id: 'i3', f: ID, type: 'long', label: 'Des contraintes de fabrication ?', help: 'Impression en 1 couleur, broderie, tampon, petit format…', sugg: ['Aucune contrainte connue', 'Impression 1 ou 2 couleurs', 'Tampon', 'Broderie', 'Très petit format'] },
      { id: 'i4', f: ID, type: 'text', label: 'Qui utilisera les fichiers ensuite ?', sugg: ['Moi dans Canva', 'Un imprimeur', 'Mon équipe', 'Un développeur web'] },
      { id: 'q27', type: 'text', label: 'Une date importante à tenir ?', sugg: ['Pas de date précise', 'Une ouverture', 'Les fêtes de fin d’année', 'Le début de la saison', 'Un salon ou un événement'] },
      { id: 'q28', type: 'long', label: 'Autre chose à me dire ?', help: 'Vos photos, votre logo actuel ou des captures d’inspiration : envoyez-les-moi par message ou par e-mail.' },
      { id: 'portfolio', type: 'check', label: 'J’accepte que Glimra montre ce projet dans son portfolio (site, réseaux, Malt), avec le nom de mon activité et les visuels créés, sans mes coordonnées personnelles.', help: 'Facultatif. Vous pouvez changer d’avis à tout moment en m’écrivant.' },
      { id: 'rgpd', type: 'check', req: 1, label: 'J’accepte que mes réponses soient utilisées pour préparer mon projet. Elles sont envoyées par e-mail à Glimra via le service Web3Forms (voir les mentions légales).' }
    ]}
  ];

  // Propositions à cliquer pour les questions ouvertes (un clic ajoute, un 2e retire)
  var MORE = {
    reseaux: ['Instagram', 'TikTok', 'Facebook', 'Fiche Google', 'Planity ou autre réservation', 'Site internet', 'LinkedIn', 'Rien pour l’instant'],
    q1: ['À domicile', 'Dans mon salon ou ma boutique', 'Chez les clients', 'En ligne', 'Je démarre', 'Moins de 3 ans', 'Plus de 3 ans', 'Seul(e)', 'Avec une équipe'],
    q1b: ['Je vous envoie ma grille de tarifs', 'Tarifs pas encore fixés', 'Je veux revoir mes prix'],
    q9: ['Les prix', 'Les disponibilités', 'Les délais', 'Comment ça se passe', 'Où vous trouver', 'Les horaires', 'Combien de temps ça tient', 'Les moyens de paiement'],
    q10: ['Je vous envoie leurs noms par message', 'Je ne connais pas mes concurrents'],
    q16: ['À proposer', 'J’en ai un, à garder', 'J’en ai un, à revoir'],
    q17: ['Je vous envoie des liens ou des captures', 'Pas d’idée pour l’instant'],
    i2: ['Un animal', 'Un outil du métier', 'Une fleur ou une plante', 'Une matière', 'Un lieu, un paysage', 'Une forme simple (étoile, cœur, goutte…)', 'Mes initiales', 'Rien de précis'],
    c1: ['Faire du bien aux gens', 'Créer de mes mains', 'Être mon propre patron', 'Transmettre', 'Une passion depuis toujours', 'Reconversion choisie'],
    c3: ['Un local à moi', 'De nouvelles prestations', 'Former des élèves', 'Une équipe', 'Plus de temps pour moi', 'Augmenter mes prix', 'Vendre des produits'],
    c5: ['En semaine, le matin', 'En semaine, l’après-midi', 'En soirée', 'Le week-end', 'En visio', 'En vrai, à Béziers ou autour'],
    s2: ['Je vous envoie ma charte', 'Je vous envoie mon logo', 'À voir ensemble'],
    s3: ['Trop chargé', 'Trop froid', 'Trop sombre', 'Trop coloré', 'Qui fait « modèle tout fait »', 'Aucun interdit'],
    c7: ['Enseigne ou vitrine', 'Carte de visite', 'Écran de téléphone', 'Tote bag', 'Packaging ou flacon', 'Tablier ou tenue', 'Carte cadeau'],
    q24v: ['Prise de rendez-vous', 'Réservation', 'Catalogue', 'J’utilise déjà Planity', 'J’utilise déjà Calendly', 'À voir ensemble'],
    q25: ['J’ai un nom de domaine', 'Pas de nom de domaine', 'J’ai une fiche Google', 'Pas de fiche Google', 'Je ne sais pas'],
    q28: ['Non, rien à ajouter', 'Je vous envoie des photos', 'Je préfère en parler de vive voix']
  };
  var inF = function (x) { return !x.f || x.f.indexOf(F) > -1; };
  var SECTIONS = SECTIONS_ALL.filter(inF).map(function (s) { return { id: s.id, title: s.title, intro: s.intro, qs: s.qs.filter(inF) }; }).filter(function (s) { return s.qs.length; });
  document.title = 'Questionnaire ' + FORMULES[F].n + ' | Glimra';
  var h1 = document.querySelector('.top h1'); if (h1) h1.textContent = FORMULES[F].titre;
  var dur = document.getElementById('duree'); if (dur) dur.textContent = FORMULES[F].duree;
  var fn = document.getElementById('formuleNom'); if (fn) fn.textContent = FORMULES[F].n;

  var $ = function (s) { return document.querySelector(s); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var st = { sec: 0, a: {}, sent: '' };
  try { var saved = JSON.parse(localStorage.getItem(STORE) || 'null'); if (saved) { st.a = saved.a || {}; st.sec = saved.sec | 0; st.sent = saved.sent || ''; } } catch (e) {}
  if (st.sec >= SECTIONS.length) st.sec = 0;
  function keep() { try { localStorage.setItem(STORE, JSON.stringify(st)); } catch (e) {} }

  SECTIONS.forEach(function (sc) { sc.qs.forEach(function (q) { if (MORE[q.id]) q.sugg = (q.sugg || []).concat(MORE[q.id]); }); });
  var ALL = [];
  SECTIONS.forEach(function (s) { s.qs.forEach(function (q) { ALL.push(q); }); });
  var COUNTED = ALL.filter(function (q) { return q.type !== 'check'; });

  function answered(q) {
    var v = st.a[q.id];
    if (q.type === 'many') return Array.isArray(v) && v.length > 0;
    if (q.type === 'scales') return v && typeof v === 'object' && Object.keys(v).length === q.scales.length;
    if (q.type === 'check') return v === true;
    return typeof v === 'string' && v.trim() !== '';
  }
  function rx(o) { return new RegExp(o.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'); }
  function has(t, o) { return rx(o).test(String(t || '')); }
  function tidy(t) { return t.replace(/(\s*,\s*){2,}/g, ', ').replace(/^\s*,\s*|\s*,\s*$/g, '').replace(/\s{2,}/g, ' ').trim(); }
  function toggle(t, o) { t = String(t || ''); return has(t, o) ? tidy(t.replace(rx(o), '')) : (t.trim() ? tidy(t) + ', ' : '') + o; }

  function qHtml(q, n) {
    var v = st.a[q.id], h = '<div class="q">';
    var lab = (q.type === 'check' ? '' : '<span class="n">' + n + '.</span>') + esc(q.label) + (q.req ? ' <span class="req" aria-hidden="true">*</span>' : '');
    if (q.type === 'check') {
      h += '<label class="check"><input type="checkbox" data-q="' + q.id + '"' + (v === true ? ' checked' : '') + (q.req ? ' aria-required="true"' : '') + '><span>' + lab + '</span></label>' + (q.help ? '<span class="help" style="margin:6px 0 0 30px">' + esc(q.help) + '</span>' : '');
      return h + '</div>';
    }
    h += '<label class="ql" id="l-' + q.id + '" for="in-' + q.id + '">' + lab + '</label>' + (q.help ? '<span class="help">' + esc(q.help) + '</span>' : '');
    if (q.sugg) h += '<div class="chips" role="group" aria-label="Propositions à ajouter">' + q.sugg.map(function (o) { return '<button type="button" class="chip" data-for="' + q.id + '" data-v="' + esc(o) + '" aria-pressed="' + has(v, o) + '">' + esc(o) + '</button>'; }).join('') + '</div><span class="or">Touchez une ou plusieurs propositions, et complétez avec vos mots si besoin&nbsp;:</span>';
    if (q.type === 'text' || q.type === 'email' || q.type === 'tel') h += '<input type="' + q.type + '" id="in-' + q.id + '" data-q="' + q.id + '" value="' + esc(v || '') + '" maxlength="400"' + (q.ac ? ' autocomplete="' + q.ac + '"' : '') + (q.req ? ' aria-required="true"' : '') + '>';
    else if (q.type === 'long') h += '<textarea id="in-' + q.id + '" data-q="' + q.id + '" maxlength="3000" rows="2" placeholder="' + (q.sugg ? 'Facultatif : précisez avec vos mots' : 'Écrivez comme ça vient, quelques mots suffisent') + '">' + esc(v || '') + '</textarea>';
    if (q.type === 'one' || q.type === 'many') {
      var t = q.type === 'one' ? 'radio' : 'checkbox';
      h += '<div class="opts" role="group" aria-labelledby="l-' + q.id + '">' + q.opts.map(function (o) {
        var on = q.type === 'one' ? v === o : Array.isArray(v) && v.indexOf(o) > -1;
        return '<label class="opt"><input type="' + t + '" name="' + q.id + '" data-q="' + q.id + '" value="' + esc(o) + '"' + (on ? ' checked' : '') + '><span>' + esc(o) + '</span></label>';
      }).join('') + '</div>';
    }
    if (q.type === 'scales') {
      h += q.scales.map(function (s, i) {
        var dots = [1, 2, 3, 4, 5].map(function (k) { return '<label><input type="radio" name="' + q.id + '-' + i + '" data-q="' + q.id + '" data-i="' + i + '" value="' + k + '" aria-label="' + k + ' sur 5"' + (v && v[i] == k ? ' checked' : '') + '><span></span></label>'; }).join('');
        return '<div class="scale" role="radiogroup" aria-label="' + esc(s[0]) + ' ou ' + esc(s[1]) + '"><span class="l">' + esc(s[0]) + '</span><span class="dots">' + dots + '</span><span class="r">' + esc(s[1]) + '</span></div>';
      }).join('');
    }
    return h + '</div>';
  }

  function progress() {
    var d = COUNTED.filter(answered).length;
    $('#progTxt').textContent = d + ' / ' + COUNTED.length + ' réponses';
    $('#progBar').style.width = (d * 100 / COUNTED.length) + '%';
    document.querySelectorAll('#steps button').forEach(function (b, i) { b.classList.toggle('full', SECTIONS[i].qs.filter(function (q) { return !(q.type === 'check' && !q.req); }).every(answered)); });
  }

  function render() {
    var S = SECTIONS[st.sec], off = 0;
    for (var i = 0; i < st.sec; i++) off += SECTIONS[i].qs.filter(function (q) { return q.type !== 'check'; }).length;
    $('#steps').innerHTML = SECTIONS.map(function (s, i) { return '<button type="button" data-sec="' + i + '" aria-current="' + (i === st.sec) + '">' + esc(s.title) + '</button>'; }).join('');
    var k = off;
    $('#form').innerHTML = (st.sent ? '<p class="intro" style="color:var(--ok);font-weight:700">Déjà envoyé le ' + new Date(st.sent).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' }) + '. Vous pouvez corriger et renvoyer.</p>' : '') +
      '<h2>' + esc(S.title) + '</h2><p class="intro">' + esc(S.intro) + '</p>' +
      S.qs.map(function (q) { if (q.type !== 'check') k++; return qHtml(q, k); }).join('') +
      '<input type="checkbox" class="bot" id="botcheck" tabindex="-1" autocomplete="off" aria-hidden="true">';
    $('#prev').disabled = st.sec === 0;
    $('#next').textContent = st.sec === SECTIONS.length - 1 ? (st.sent ? 'Renvoyer mes réponses' : 'Envoyer mes réponses') : 'Suivant';
    progress();
  }
  function setStatus(t, err) { var s = $('#status'); s.textContent = t; s.className = 'status' + (err ? ' err' : ''); }
  function go(i) { st.sec = i; keep(); setStatus(''); render(); window.scrollTo({ top: 0, behavior: 'smooth' }); }

  $('#form').addEventListener('input', function (e) {
    var t = e.target, id = t.dataset && t.dataset.q; if (!id) return;
    var q = ALL.filter(function (x) { return x.id === id; })[0];
    if (q.type === 'many') st.a[id] = [].slice.call(document.querySelectorAll('input[name="' + id + '"]:checked')).map(function (x) { return x.value; });
    else if (q.type === 'scales') { st.a[id] = Object.assign({}, st.a[id] || {}); st.a[id][t.dataset.i] = Number(t.value); }
    else if (q.type === 'check') st.a[id] = t.checked;
    else st.a[id] = t.value;
    if (q.sugg) document.querySelectorAll('button.chip[data-for="' + id + '"]').forEach(function (b) { b.setAttribute('aria-pressed', has(st.a[id], b.dataset.v)); });
    keep(); progress();
  });
  $('#form').addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('button.chip'); if (!b) return;
    var el = document.getElementById('in-' + b.dataset.for);
    el.value = toggle(el.value, b.dataset.v);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
  $('#steps').addEventListener('click', function (e) { var b = e.target.closest('button[data-sec]'); if (b) go(+b.dataset.sec); });
  $('#prev').addEventListener('click', function () { if (st.sec > 0) go(st.sec - 1); });

  function fmt(q) {
    var v = st.a[q.id];
    if (q.type === 'many') return (v || []).join(', ');
    if (q.type === 'scales') return v ? q.scales.map(function (s, i) { return s[0] + ' ' + (v[i] || '?') + '/5 ' + s[1]; }).join(' ; ') : '';
    if (q.type === 'check') return v === true ? 'Oui' : 'Non';
    return String(v || '').trim();
  }

  $('#next').addEventListener('click', function () {
    if (st.sec < SECTIONS.length - 1) return go(st.sec + 1);
    var missing = ALL.filter(function (q) { return q.req && !answered(q); });
    if (missing.length) {
      var m = missing[0], si = 0;
      SECTIONS.forEach(function (s, i) { if (s.qs.indexOf(m) > -1) si = i; });
      if (si !== st.sec) go(si);
      setStatus('Il manque : ' + missing.map(function (q) { return q.label.split(/[.(]/)[0].replace(/^J’accepte que mes réponses.*/, 'votre accord pour utiliser vos réponses'); }).join(', ') + '.', true);
      var f = document.querySelector('[data-q="' + m.id + '"]'); if (f) f.focus();
      return;
    }
    if (st.a.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(st.a.email.trim())) { go(0); setStatus('Votre adresse e-mail semble incomplète.', true); return; }
    if ($('#botcheck') && $('#botcheck').checked) { done(); return; }

    // Texte unique, lisible et prêt à coller dans l'Atelier Glimra
    var lines = ['QUESTIONNAIRE ' + FORMULES[F].n.toUpperCase() + ' · ' + (st.a.activite || '').trim(), 'Formule : ' + FORMULES[F].n + ' (' + F + ')', 'Reçu le ' + new Date().toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' }), ''];
    SECTIONS.forEach(function (s) {
      lines.push('== ' + s.title.toUpperCase() + ' ==');
      s.qs.forEach(function (q) { lines.push('[' + q.id + '] ' + q.label, fmt(q) || '(pas de réponse)', ''); });
    });
    var payload = {
      access_key: WEB3FORMS_KEY,
      subject: 'Questionnaire ' + FORMULES[F].n + ' : ' + (st.a.activite || st.a.nom || '').trim(),
      'Formule': FORMULES[F].n,
      from_name: 'Questionnaire glimra.fr',
      name: (st.a.nom || '').trim(),
      email: (st.a.email || '').trim(),
      'Activité': (st.a.activite || '').trim(),
      'Téléphone': (st.a.tel || '').trim() || 'Non renseigné',
      'Accord portfolio': st.a.portfolio === true ? 'Oui, donné en ligne le ' + new Date().toLocaleString('fr-FR') : 'Non',
      'Réponses': lines.join('\n')
    };
    var btn = $('#next'); btn.disabled = true; btn.textContent = 'Envoi en cours…'; setStatus('');
    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 15000);
    fetch('https://api.web3forms.com/submit', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload), signal: ctrl ? ctrl.signal : undefined
    }).then(function (r) { return r.json().then(function (d) { return !!(r.ok && d && d.success); }, function () { return false; }); })
      .catch(function () { return false; })
      .then(function (ok) {
        clearTimeout(timer); btn.disabled = false;
        if (ok) { st.sent = new Date().toISOString(); keep(); done(); }
        else { render(); setStatus('L’envoi n’a pas fonctionné. Vos réponses sont gardées : réessayez dans un instant, ou écrivez à contact@glimra.fr.', true); }
      });
  });

  function done() {
    $('#steps').innerHTML = ''; $('#nav').hidden = true; setStatus('');
    $('#form').innerHTML = '<div class="done"><svg width="34" height="44" viewBox="1271 111 541 708" aria-hidden="true"><path fill="#EC72A9" transform="matrix(1,0,0,-1,760,1145)" d="M794,1026C814.7,786.7 885.3,723.7 1060,700C913.3,673.3 820.7,632 807,318C786.3,625 705.7,679.3 519,700C701.7,723.7 767.3,784.7 794,1026Z"/></svg><p class="big">Merci&nbsp;!</p><p>Vos réponses sont bien arrivées. Je les lis et je reviens vers vous très vite avec les premières pistes.</p><p style="margin-top:14px"><button type="button" class="btn ghost" id="edit">Revoir mes réponses</button></p></div>';
    $('#edit').addEventListener('click', function () { $('#nav').hidden = false; go(0); });
  }

  render();
})();
