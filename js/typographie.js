/* ─────────────────────────────────────────────────────────────
   TYPOGRAPHIE — pas de petit mot seul en fin de ligne
   ─────────────────────────────────────────────────────────────
   « Un territoire de marque ancré dans une
     tradition familiale »
   se lit mal : « une » reste suspendu en fin de ligne. On colle
   ces mots outils au mot suivant avec une espace insécable, ce
   qui force le retour à la ligne un mot plus tôt :
   « Un territoire de marque ancré
     dans une tradition familiale ».

   Traitement sur les nœuds de texte, et non sur la source HTML :
   les attributs, les scripts et les styles ne sont jamais
   touchés, et les contenus injectés plus tard (études de cas,
   modales) sont traités à leur arrivée.

   text-wrap: balance / pretty (css/globals.css) équilibre les
   lignes ; il ne garantit pas l'attachement de ces mots. Les deux
   se complètent.
   ───────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var INSECABLE = ' ';

  /* Liste volontairement courte : articles, prépositions et
     conjonctions d'une à trois lettres. L'élargir (par, pour,
     avec…) contraindrait trop la justification et créerait des
     lignes trop courtes. */
  var MOTS = ['un', 'une', 'le', 'la', 'les', 'de', 'du', 'des',
              'à', 'au', 'aux', 'en', 'et', 'ou', 'ne', 'ce', 'se'];

  var MOTIF = new RegExp(
    '(^|[\\s(«"\'’“])(' + MOTS.join('|') + ') (?=[^\\s])',
    'gi'
  );

  var IGNORER = { SCRIPT: 1, STYLE: 1, CODE: 1, PRE: 1, TEXTAREA: 1, NOSCRIPT: 1, SVG: 1 };

  function traiterTexte(t) {
    if (t.indexOf(' ') === -1) return t;
    var precedent;
    // Deux mots outils qui se suivent (« de la ») demandent deux
    // passes : la première consomme l'espace que la seconde vise.
    do {
      precedent = t;
      t = t.replace(MOTIF, function (_, avant, mot) {
        return avant + mot + INSECABLE;
      });
    } while (t !== precedent);
    return t;
  }

  function traiter(racine) {
    if (!racine || racine.nodeType === 8) return;
    var marcheur = document.createTreeWalker(racine, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentNode;
        if (!p || IGNORER[p.nodeName]) return NodeFilter.FILTER_REJECT;
        if (p.closest && p.closest('[data-relecture-edit], [contenteditable="true"]')) {
          return NodeFilter.FILTER_REJECT;
        }
        return n.nodeValue && /\S/.test(n.nodeValue)
          ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    var noeuds = [], n;
    while ((n = marcheur.nextNode())) noeuds.push(n);
    for (var i = 0; i < noeuds.length; i++) {
      var neuf = traiterTexte(noeuds[i].nodeValue);
      if (neuf !== noeuds[i].nodeValue) noeuds[i].nodeValue = neuf;
    }
  }

  function demarrer() {
    traiter(document.body);

    /* Les études de cas sont rendues à l'ouverture d'une modale :
       on retraite les sous-arbres ajoutés, en différé pour ne pas
       repasser à chaque mutation. */
    var enAttente = [], minuteur = null;
    new MutationObserver(function (lots) {
      for (var i = 0; i < lots.length; i++) {
        var ajouts = lots[i].addedNodes;
        for (var j = 0; j < ajouts.length; j++) {
          if (ajouts[j].nodeType === 1 || ajouts[j].nodeType === 3) enAttente.push(ajouts[j]);
        }
      }
      if (!enAttente.length) return;
      clearTimeout(minuteur);
      minuteur = setTimeout(function () {
        var lot = enAttente.splice(0, enAttente.length);
        for (var k = 0; k < lot.length; k++) {
          if (lot[k].nodeType === 3) {
            var neuf = traiterTexte(lot[k].nodeValue || '');
            if (neuf !== lot[k].nodeValue) lot[k].nodeValue = neuf;
          } else {
            traiter(lot[k]);
          }
        }
      }, 60);
    }).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', demarrer);
  } else {
    demarrer();
  }
})();
