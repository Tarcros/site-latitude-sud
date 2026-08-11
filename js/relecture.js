/* ============================================================
   MODE RELECTURE — correction des textes directement dans la page.
   Activé uniquement par ?relecture dans l'URL (chargé à la demande
   depuis components.js). Aucun impact sur le site public.

   Principe : double-clic sur un texte → on le corrige sur place.
   Les corrections sont mémorisées dans le navigateur puis exportées
   dans un fichier .json que le développeur réinjecte automatiquement
   avec scripts/apply-corrections.mjs.
   ============================================================ */
(function () {
  'use strict';
  if (window.__lsRelecture) return;
  window.__lsRelecture = true;

  const STORAGE = 'ls-relecture-v1';
  /* Balises « en ligne » tolérées à l'intérieur d'un bloc éditable :
     leur présence n'empêche pas de traiter le bloc comme un seul texte. */
  const INLINE = new Set(['BR', 'B', 'STRONG', 'EM', 'I', 'SPAN', 'SMALL', 'SUP', 'SUB', 'U', 'A']);
  const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG', 'PATH', 'TEMPLATE', 'IFRAME', 'VIDEO', 'SOURCE']);

  /** Corrections en cours : clé = texte d'origine, valeur = { avant, apres, page, contexte } */
  let corrections = new Map();

  /* ---------- persistance ---------- */
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) corrections = new Map(JSON.parse(raw).map(c => [c.avant, c]));
    } catch (_) { /* stockage indisponible : on continue en mémoire */ }
  }
  function save() {
    try { localStorage.setItem(STORAGE, JSON.stringify([...corrections.values()])); } catch (_) {}
    renderPanel();
  }

  /* ---------- lecture / écriture du contenu d'un bloc ---------- */
  // Le texte manipulé conserve les retours à la ligne (les <br> des titres).
  function readBlock(el) {
    return el.innerHTML
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n))
      .replace(/[ \t]+/g, ' ')
      .replace(/ *\n */g, '\n')
      .trim();
  }
  function writeBlock(el, texte) {
    const html = texte
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
    el.innerHTML = html;
  }

  /* ---------- repérage des blocs de texte corrigeables ---------- */
  function estCandidat(el) {
    if (SKIP.has(el.tagName)) return false;
    if (el.closest('[data-relecture-ui]')) return false;
    if (el.dataset.relectureBloc) return true;
    if (!el.childNodes.length) return false;
    // Un bloc est « feuille » si tous ses enfants sont du texte ou des balises en ligne.
    let aDuTexte = false;
    for (const n of el.childNodes) {
      if (n.nodeType === 3) { if (n.nodeValue.trim()) aDuTexte = true; }
      else if (n.nodeType === 1) { if (!INLINE.has(n.tagName)) return false; if (n.textContent.trim()) aDuTexte = true; }
    }
    if (!aDuTexte) return false;
    const t = readBlock(el);
    // On ignore les micro-libellés purement décoratifs (flèches, puces, compteurs).
    return t.length >= 2 && /[a-zA-ZÀ-ÿ]/.test(t);
  }

  // Fil d'Ariane lisible par un non-technicien : « Page › Pop-up › Section ».
  function contexteDe(el) {
    const propre = n => readBlock(n).replace(/\n/g, ' ').slice(0, 55);
    const bouts = [(document.title || '').split('—')[0].trim() || location.pathname];

    const modale = el.closest('.ls-modal-dialog, .ls-modal');
    if (modale) {
      const t = modale.querySelector('h1') || modale.querySelector('h2');
      if (t && t !== el) bouts.push('pop-up « ' + propre(t) + ' »');
    } else if (el.closest('nav, .ls-nav, header')) {
      bouts.push('menu');
    } else if (el.closest('footer')) {
      bouts.push('pied de page');
    }

    const sec = el.closest('section, article');
    if (sec) {
      const h = sec.querySelector('h1, h2, h3');
      if (h && h !== el && !el.contains(h)) bouts.push(propre(h));
    }
    if (/^H[1-6]$/.test(el.tagName)) bouts.push('titre');
    return bouts.filter(Boolean).join(' › ');
  }

  /* ---------- activation de l'édition ---------- */
  function preparer(el) {
    if (el.dataset.relecturePret) return;
    el.dataset.relecturePret = '1';
    el.dataset.relectureOrigine = readBlock(el);
    el.classList.add('ls-relecture-cible');
  }

  function editer(el) {
    if (el.isContentEditable) return;
    const avant = readBlock(el);
    el.contentEditable = 'plaintext-only';
    if (el.contentEditable !== 'plaintext-only') el.contentEditable = 'true'; // repli navigateurs anciens
    el.classList.add('ls-relecture-actif');
    el.focus();

    const fin = (annuler) => {
      el.removeEventListener('blur', onBlur);
      el.removeEventListener('keydown', onKey);
      el.contentEditable = 'false';
      el.classList.remove('ls-relecture-actif');
      if (annuler) { writeBlock(el, avant); return; }
      const apres = readBlock(el);
      if (apres === avant) return;
      const origine = el.dataset.relectureOrigine || avant;
      if (apres === origine) corrections.delete(origine);
      else corrections.set(origine, {
        page: location.pathname,
        contexte: contexteDe(el),
        avant: origine,
        apres
      });
      el.classList.add('ls-relecture-modifie');
      save();
    };
    const onBlur = () => fin(false);
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); fin(true); el.blur(); }
      // Ctrl/Cmd+Entrée valide sans attendre la perte de focus.
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); el.blur(); }
      e.stopPropagation(); // n'active pas les raccourcis du site pendant la frappe
    };
    el.addEventListener('blur', onBlur);
    el.addEventListener('keydown', onKey);
  }

  /* ---------- réapplication des corrections déjà saisies ---------- */
  // Les pop-ups se régénèrent à chaque ouverture : on réinjecte ce qui a déjà été corrigé.
  function reappliquer(racine) {
    if (!corrections.size) return;
    racine.querySelectorAll('[data-relecture-pret]').forEach(el => {
      const o = el.dataset.relectureOrigine;
      const c = o && corrections.get(o);
      if (c && readBlock(el) !== c.apres) { writeBlock(el, c.apres); el.classList.add('ls-relecture-modifie'); }
    });
  }

  function scanner(racine) {
    let cibles = [];
    racine.querySelectorAll('*').forEach(el => { if (estCandidat(el)) cibles.push(el); });
    // On ne garde que les blocs les plus internes : sinon un conteneur et son
    // enfant seraient tous deux surlignés, ce qui brouille la lecture.
    cibles = cibles.filter(el => !cibles.some(autre => autre !== el && el.contains(autre)));
    cibles.forEach(preparer);
    reappliquer(racine);
    renderPanel();
  }

  /* ---------- export ---------- */
  function exporter() {
    const liste = [...corrections.values()];
    if (!liste.length) { alert('Aucune correction pour le moment.'); return; }
    const contenu = JSON.stringify({
      genere_le: new Date().toISOString(),
      nombre: liste.length,
      corrections: liste
    }, null, 2);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([contenu], { type: 'application/json' }));
    a.download = 'corrections-textes.json';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  /* ---------- panneau flottant ---------- */
  let panneau;
  function renderPanel() {
    if (!panneau) return;
    const n = corrections.size;
    panneau.querySelector('[data-compteur]').textContent =
      n === 0 ? 'Aucune correction' : n === 1 ? '1 correction' : n + ' corrections';
    panneau.querySelector('[data-export]').disabled = n === 0;
  }

  function construirePanneau() {
    panneau = document.createElement('div');
    panneau.setAttribute('data-relecture-ui', '');
    panneau.innerHTML = `
      <div class="ls-rl-titre">Mode relecture</div>
      <p class="ls-rl-aide"><b>Double-cliquez</b> sur un texte pour le corriger.<br>
      <span>Échap annule · les pop-ups s'ouvrent normalement d'un simple clic.</span></p>
      <div class="ls-rl-compteur" data-compteur>Aucune correction</div>
      <button class="ls-rl-btn ls-rl-btn--primaire" data-export>Télécharger les corrections</button>
      <button class="ls-rl-btn" data-reset>Tout effacer</button>`;
    document.body.appendChild(panneau);
    panneau.querySelector('[data-export]').addEventListener('click', exporter);
    panneau.querySelector('[data-reset]').addEventListener('click', () => {
      if (!confirm('Effacer toutes les corrections saisies ?')) return;
      corrections.clear();
      try { localStorage.removeItem(STORAGE); } catch (_) {}
      location.reload();
    });
    renderPanel();
  }

  function injecterStyles() {
    const s = document.createElement('style');
    s.textContent = `
      [data-relecture-ui]{position:fixed;right:18px;bottom:18px;z-index:2147483647;width:236px;
        padding:16px;border-radius:14px;background:#111;color:#fff;box-shadow:0 18px 44px rgba(0,0,0,.4);
        font-family:system-ui,-apple-system,"Segoe UI",sans-serif;}
      [data-relecture-ui] .ls-rl-titre{font-size:13px;font-weight:700;letter-spacing:.02em;margin-bottom:8px;}
      [data-relecture-ui] .ls-rl-aide{margin:0 0 12px;font-size:11.5px;line-height:1.5;color:rgba(255,255,255,.72);}
      [data-relecture-ui] .ls-rl-aide span{color:rgba(255,255,255,.45);}
      [data-relecture-ui] .ls-rl-compteur{margin-bottom:10px;padding:7px 10px;border-radius:8px;
        background:rgba(255,255,255,.1);font-size:12px;font-weight:600;text-align:center;}
      [data-relecture-ui] .ls-rl-btn{display:block;width:100%;margin-top:7px;padding:9px 12px;border:0;
        border-radius:8px;background:rgba(255,255,255,.13);color:#fff;font-size:12px;font-weight:600;cursor:pointer;}
      [data-relecture-ui] .ls-rl-btn--primaire{background:#e3202a;}
      [data-relecture-ui] .ls-rl-btn:disabled{opacity:.4;cursor:not-allowed;}
      .ls-relecture-cible:hover{outline:1px dashed rgba(227,32,42,.55);outline-offset:3px;cursor:text;}
      .ls-relecture-actif{outline:2px solid #e3202a !important;outline-offset:3px;background:rgba(227,32,42,.05);}
      .ls-relecture-modifie{background:rgba(255,214,0,.22);box-shadow:0 0 0 2px rgba(255,214,0,.22);}
      @media print{[data-relecture-ui]{display:none;}}`;
    document.head.appendChild(s);
  }

  function demarrer() {
    injecterStyles();
    construirePanneau();
    load();
    scanner(document.body);
    // Les études de cas s'affichent dans des pop-ups générées à la volée :
    // on surveille le DOM pour rendre corrigeable tout contenu nouvellement inséré.
    let t;
    new MutationObserver(() => { clearTimeout(t); t = setTimeout(() => scanner(document.body), 180); })
      .observe(document.body, { childList: true, subtree: true });
    // Double-clic global : plus robuste que d'attacher un écouteur par bloc.
    document.addEventListener('dblclick', (e) => {
      const el = e.target.closest('[data-relecture-pret]');
      if (!el || el.closest('[data-relecture-ui]')) return;
      e.preventDefault(); e.stopPropagation();
      editer(el);
    }, true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer);
  else demarrer();
})();
