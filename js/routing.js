/* ─────────────────────────────────────────────────────────────
   ROUTING — URLs propres et partageables
   ─────────────────────────────────────────────────────────────
   Le site reste un ensemble de fichiers .html statiques : aucune
   page n'est dupliquée. Deux couches se répondent :

   1) vercel.json réécrit /photographie vers /pages/photos.html.
      L'accès direct et le rechargement fonctionnent donc sans JS.
   2) ce module tient l'URL à jour côté client quand une étude de
      cas s'ouvre ou se ferme, et rouvre la bonne étude de cas
      quand on arrive directement sur /photographie/hfwi.

   Il ne connaît aucune modale en particulier : il repère les
   cartes par leur attribut data-slug et détecte l'ouverture ou la
   fermeture via la classe .open posée sur la racine des modales.
   Ajouter un projet = ajouter un data-slug sur sa carte.
   ───────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  /* Chemin technique → URL publique. Sert aussi de table de
     réécriture pour les liens internes encore en .html. */
  var ROUTES = [
    ['/pages/catalogue.html',                    '/catalogue'],
    ['/pages/social.html',                       '/reseaux-sociaux'],
    ['/pages/charte-graphique.html',             '/identite-de-marque'],
    ['/pages/photos.html',                       '/photographie'],
    ['/pages/realisations.html',                 '/realisations'],
    ['/pages/agence.html',                       '/agence'],
    ['/pages/contact.html',                      '/contact'],
    ['/pages/mentions-legales.html',             '/mentions-legales'],
    ['/pages/politique-de-confidentialite.html', '/politique-de-confidentialite'],
    ['/pages/latitude-sud-news.html',            '/actualites'],
    ['/index.html',                              '/']
  ];

  /* Seules ces bases portent des études de cas. */
  var BASES_PROJETS = ['/catalogue', '/reseaux-sociaux', '/identite-de-marque', '/photographie'];

  function urlPublique(chemin) {
    for (var i = 0; i < ROUTES.length; i++) {
      if (ROUTES[i][0] === chemin) return ROUTES[i][1];
    }
    return chemin;
  }

  /* Base publique de la page courante, quelle que soit la façon
     dont on y est arrivé (URL propre ou ancienne URL .html). */
  function basePage() {
    var p = location.pathname.replace(/\/+$/, '') || '/';
    if (/\.html$/.test(p)) return urlPublique(p);
    for (var i = 0; i < BASES_PROJETS.length; i++) {
      if (p === BASES_PROJETS[i] || p.indexOf(BASES_PROJETS[i] + '/') === 0) return BASES_PROJETS[i];
    }
    return p;
  }

  var BASE = basePage();
  var porteProjets = BASES_PROJETS.indexOf(BASE) !== -1;

  function slugDeLURL() {
    if (!porteProjets) return null;
    var reste = location.pathname.replace(/\/+$/, '').slice(BASE.length);
    return reste.charAt(0) === '/' ? decodeURIComponent(reste.slice(1)) : null;
  }

  /* La relecture (?relecture) et tout autre paramètre doivent
     survivre aux changements d'URL : on ne touche jamais à la
     query string ni au hash. */
  function urlAvecSlug(slug) {
    return (slug ? BASE + '/' + slug : BASE) + location.search + location.hash;
  }

  // ── Cartes ────────────────────────────────────────────────
  function carte(slug) {
    return document.querySelector('[data-slug="' + (window.CSS && CSS.escape ? CSS.escape(slug) : slug) + '"]');
  }

  /* Les modales sont en position: fixed, donc offsetParent vaut
     toujours null : on teste le rendu réel, pas l'ancrage. */
  function modaleOuverte() {
    var ouvertes = document.querySelectorAll('.open');
    for (var i = 0; i < ouvertes.length; i++) {
      var el = ouvertes[i];
      var classes = typeof el.className === 'string' ? el.className : (el.getAttribute('class') || '');
      if (!/modal/i.test(classes)) continue;
      var cs = getComputedStyle(el);
      if (cs.display !== 'none' && cs.visibility !== 'hidden' &&
          el.getBoundingClientRect().height > 0) return el;
    }
    return null;
  }

  /* Chaque modale a sa propre classe de fermeture (ls-modal-close,
     cist-case-close, so-class-close, marina-case-close…) et parfois
     un attribut data-*-close. On cherche donc « close » partout
     plutôt que d'énumérer une liste qui vieillira mal. */
  function boutonFermer(m) {
    var candidats = m.querySelectorAll('button, [role="button"], a');
    for (var i = 0; i < candidats.length; i++) {
      var el = candidats[i];
      if (/close/i.test(String(el.className || ''))) return el;
      var noms = el.getAttributeNames();
      for (var j = 0; j < noms.length; j++) {
        if (/close/i.test(noms[j])) return el;
      }
    }
    return null;
  }

  function fermerModale() {
    var m = modaleOuverte();
    if (!m) return false;
    var bouton = boutonFermer(m);
    if (bouton) { bouton.click(); return true; }
    // Repli : toutes les modales écoutent Échap.
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    return true;
  }

  // ── Métadonnées ───────────────────────────────────────────
  var TITRE_ORIGINE = document.title;
  var canonical = document.querySelector('link[rel="canonical"]');
  var ogUrl = document.querySelector('meta[property="og:url"]');
  var ogTitre = document.querySelector('meta[property="og:title"]');

  /* Le domaine de référence est celui de production, jamais location.origin :
     sur le staging Vercel, la canonical pointerait sinon vers le staging. On
     le lit dans la canonical présente dans le HTML, qui fait autorité. */
  var ORIGINE = (function () {
    var href = canonical && canonical.getAttribute('href');
    var m = href && href.match(/^(https?:\/\/[^/]+)/);
    return m ? m[1] : 'https://www.latitudesud.gp';
  })();

  function majMeta(slug) {
    var el = slug && carte(slug);
    var nom = el ? (el.querySelector('h3') ? el.querySelector('h3').textContent.trim() : slug) : null;
    document.title = nom ? nom + ' — ' + TITRE_ORIGINE : TITRE_ORIGINE;
    var absolue = ORIGINE + (slug ? BASE + '/' + slug : BASE);
    /* Une étude de cas ouverte est une page à part entière : sa canonical
       se référence elle-même, sinon Google la replierait sur la catégorie. */
    if (canonical) canonical.setAttribute('href', absolue);
    if (ogUrl) ogUrl.setAttribute('content', absolue);
    if (ogTitre) ogTitre.setAttribute('content', document.title);
    var desc = el && el.querySelector('.project-body p');
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      if (!majMeta._desc) majMeta._desc = metaDesc.getAttribute('content');
      metaDesc.setAttribute('content',
        desc ? nom + ' — ' + desc.textContent.trim() : majMeta._desc);
    }
  }

  // ── Écriture de l'historique ──────────────────────────────
  var slugCourant = null;
  var enTrainDeRestaurer = false;
  /* Nombre d'entrées que NOUS avons empilées. À zéro, l'entrée
     courante vient d'un lien partagé : il n'y a rien derrière dans
     le site, donc fermer doit remplacer l'URL, pas revenir en
     arrière (ce qui ferait sortir du site). */
  var entreesEmpilees = 0;

  function pousser(slug) {
    if (slug === slugCourant) return;
    slugCourant = slug;
    history.pushState({ slug: slug, base: BASE }, '', urlAvecSlug(slug));
    entreesEmpilees++;
    majMeta(slug);
  }

  function remplacer(slug) {
    slugCourant = slug;
    history.replaceState({ slug: slug, base: BASE }, '', urlAvecSlug(slug));
    majMeta(slug);
  }

  // ── Ouverture d'une étude de cas ──────────────────────────
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-slug]');
    if (!el || !porteProjets) return;
    var slug = el.getAttribute('data-slug');
    var lien = e.target.closest('a[href]');
    if (lien && el.contains(lien)) {
      var href = lien.getAttribute('href') || '';
      if (href === BASE + '/' + slug) {
        /* Le libellé d'action de la carte est un vrai lien, pour qu'un
           crawler sans JavaScript atteigne l'étude de cas. Pour un visiteur,
           on ouvre la modale au lieu de recharger la page. */
        e.preventDefault();
      } else if (href && href.charAt(0) !== '#') {
        return;                       // lien sortant : comportement normal
      }
    }
    pousser(slug);
  }, true);

  // ── Fermeture : on observe la classe .open ────────────────
  if (porteProjets) {
    var minuteur = null;
    var observateur = new MutationObserver(function () {
      if (enTrainDeRestaurer || !slugCourant) return;
      // La fermeture passe par une transition : on laisse le DOM
      // se stabiliser avant de conclure que plus rien n'est ouvert.
      clearTimeout(minuteur);
      minuteur = setTimeout(function () {
        if (enTrainDeRestaurer || !slugCourant || modaleOuverte()) return;
        if (entreesEmpilees > 0) {
          entreesEmpilees--;
          history.back();          // rend la flèche « suivant » utilisable
        } else {
          remplacer(null);         // arrivée par lien partagé
        }
      }, 120);
    });
    observateur.observe(document.body, {
      subtree: true, attributes: true, attributeFilter: ['class', 'style']
    });
  }

  // ── Précédent / suivant du navigateur ─────────────────────
  window.addEventListener('popstate', function () {
    if (!porteProjets) return;
    var vise = slugDeLURL();
    if (vise === slugCourant) return;
    enTrainDeRestaurer = true;
    if (vise) {
      var el = carte(vise);
      if (modaleOuverte()) fermerModale();
      if (el) setTimeout(function () { el.click(); }, 0);
    } else if (modaleOuverte()) {
      fermerModale();
    }
    slugCourant = vise;
    majMeta(vise);
    setTimeout(function () { enTrainDeRestaurer = false; }, 240);
  });

  // ── Arrivée directe sur /photographie/hfwi ────────────────
  function ouvrirDepuisLURL() {
    var slug = slugDeLURL();
    if (!slug) { remplacer(null); return; }
    var el = carte(slug);
    if (!el) {
      // Slug inconnu : on retombe proprement sur la catégorie
      // plutôt que de laisser une URL qui ne montre rien.
      remplacer(null);
      return;
    }
    slugCourant = slug;
    history.replaceState({ slug: slug, base: BASE }, '', urlAvecSlug(slug));
    majMeta(slug);
    // Les modales sur mesure sont montées par initComponents ;
    // on laisse le temps au DOM d'être prêt.
    setTimeout(function () { el.click(); }, 60);
  }

  if (porteProjets) {
    if (document.readyState === 'complete') setTimeout(ouvrirDepuisLURL, 0);
    else window.addEventListener('load', function () { setTimeout(ouvrirDepuisLURL, 0); });
  }

  // ── Liens internes encore écrits en .html ─────────────────
  // Filet de sécurité : si un lien .html traîne quelque part, il
  // navigue quand même vers l'URL propre. Les redirections Vercel
  // couvrent le cas d'un accès direct.
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    var href = a.getAttribute('href');
    if (!href || href.indexOf('/pages/') !== 0) return;
    var propre = urlPublique(href.split('?')[0].split('#')[0]);
    if (propre === href) return;
    var qs = href.indexOf('?') > -1 ? href.slice(href.indexOf('?')) : location.search;
    a.setAttribute('href', propre + (qs || ''));
  }, true);

  window.LSRouting = { base: BASE, slugCourant: function () { return slugCourant; } };
})();
