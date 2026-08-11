/* ============================================================
   MODE RELECTURE — corriger les textes et signaler les problèmes
   directement dans la page. Activé par ?relecture dans l'URL
   (chargé à la demande depuis components.js). Le site public ne
   télécharge jamais ce fichier.

   Deux choses possibles :
     • CORRIGER un texte  → double-clic dessus, on écrit par-dessus.
     • SIGNALER un souci  → mode remarque, on clique un élément
       (image, bloc, section) et on laisse une note.

   Tout est sauvegardé en continu dans le navigateur : un
   rafraîchissement, une fermeture d'onglet ou un changement de page
   ne fait rien perdre. Un seul téléchargement à la fin regroupe
   l'ensemble du site.
   ============================================================ */
(function () {
  'use strict';
  if (window.__lsRelecture) return;
  window.__lsRelecture = true;

  const CLE_TEXTES = 'ls-relecture-v1';
  const CLE_NOTES = 'ls-relecture-notes-v1';
  const INLINE = new Set(['BR', 'B', 'STRONG', 'EM', 'I', 'SPAN', 'SMALL', 'SUP', 'SUB', 'U', 'A']);
  const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG', 'PATH', 'TEMPLATE', 'IFRAME', 'SOURCE']);

  let corrections = new Map();  // clé = texte d'origine
  let notes = [];               // remarques libres (images, blocs, divers)
  let modeNote = false;

  /* ---------- persistance : écriture immédiate à chaque changement ---------- */
  function charger() {
    try {
      const t = localStorage.getItem(CLE_TEXTES);
      if (t) corrections = new Map(JSON.parse(t).map(c => [c.avant, c]));
      const n = localStorage.getItem(CLE_NOTES);
      if (n) notes = JSON.parse(n);
    } catch (_) {}
  }
  function sauver() {
    try {
      localStorage.setItem(CLE_TEXTES, JSON.stringify([...corrections.values()]));
      localStorage.setItem(CLE_NOTES, JSON.stringify(notes));
    } catch (_) {}
    majPanneau();
  }

  /* ---------- lecture / écriture d'un bloc de texte ---------- */
  function lire(el) {
    return el.innerHTML
      .replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
      .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n))
      .replace(/[ \t]+/g, ' ').replace(/ *\n */g, '\n').trim();
  }
  function ecrire(el, texte) {
    el.innerHTML = texte
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
  }

  /* ---------- repérage des blocs corrigeables ---------- */
  function estCandidat(el) {
    if (SKIP.has(el.tagName) || el.closest('[data-relecture-ui]')) return false;
    if (!el.childNodes.length) return false;
    let aDuTexte = false;
    for (const n of el.childNodes) {
      if (n.nodeType === 3) { if (n.nodeValue.trim()) aDuTexte = true; }
      else if (n.nodeType === 1) { if (!INLINE.has(n.tagName)) return false; if (n.textContent.trim()) aDuTexte = true; }
    }
    if (!aDuTexte) return false;
    const t = lire(el);
    return t.length >= 2 && /[a-zA-ZÀ-ÿ]/.test(t);
  }

  function contexteDe(el) {
    const propre = n => lire(n).replace(/\n/g, ' ').slice(0, 55);
    const bouts = [(document.title || '').split('—')[0].trim() || location.pathname];
    const modale = el.closest('.ls-modal-dialog, .ls-modal');
    if (modale) {
      const t = modale.querySelector('h1') || modale.querySelector('h2');
      if (t && t !== el) bouts.push('pop-up « ' + propre(t) + ' »');
    } else if (el.closest('nav, .ls-nav, header')) bouts.push('menu');
    else if (el.closest('footer')) bouts.push('pied de page');
    const sec = el.closest('section, article');
    if (sec) {
      const h = sec.querySelector('h1, h2, h3');
      if (h && h !== el && !el.contains(h)) bouts.push(propre(h));
    }
    if (/^H[1-6]$/.test(el.tagName)) bouts.push('titre');
    return bouts.filter(Boolean).join(' › ');
  }

  function preparer(el) {
    if (el.dataset.relecturePret) return;
    el.dataset.relecturePret = '1';
    el.dataset.relectureOrigine = lire(el);
    el.classList.add('ls-relecture-cible');
  }

  /* ---------- édition d'un texte ---------- */
  function editer(el) {
    if (el.isContentEditable) return;
    const avant = lire(el);
    el.contentEditable = 'plaintext-only';
    if (el.contentEditable !== 'plaintext-only') el.contentEditable = 'true';
    // Correcteur orthographique natif du navigateur : soulignés rouges +
    // suggestions au clic droit, sans dépendance externe.
    el.setAttribute('spellcheck', 'true');
    el.setAttribute('lang', 'fr');
    el.classList.add('ls-relecture-actif');
    el.focus();

    const fin = (annuler) => {
      el.removeEventListener('blur', onBlur);
      el.removeEventListener('keydown', onKey);
      el.contentEditable = 'false';
      el.classList.remove('ls-relecture-actif');
      if (annuler) { ecrire(el, avant); return; }
      const apres = lire(el);
      if (apres === avant) return;
      const origine = el.dataset.relectureOrigine || avant;
      if (apres === origine) { corrections.delete(origine); el.classList.remove('ls-relecture-modifie'); }
      else {
        corrections.set(origine, { page: location.pathname, contexte: contexteDe(el), avant: origine, apres });
        el.classList.add('ls-relecture-modifie');
      }
      sauver();
      flash('Correction enregistrée');
    };
    const onBlur = () => fin(false);
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); fin(true); el.blur(); }
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); el.blur(); }
      e.stopPropagation();
    };
    el.addEventListener('blur', onBlur);
    el.addEventListener('keydown', onKey);
  }

  /* ---------- remarques (images, blocs, divers) ---------- */
  function decrireElement(el) {
    if (el.tagName === 'IMG') {
      const f = (el.getAttribute('src') || '').split('/').pop().split('?')[0];
      return { type: 'image', fichier: f, alt: el.getAttribute('alt') || '' };
    }
    if (el.tagName === 'VIDEO' || el.querySelector?.('video')) {
      const v = el.tagName === 'VIDEO' ? el : el.querySelector('video');
      const s = v.querySelector('source');
      return { type: 'vidéo', fichier: ((s && s.getAttribute('src')) || v.getAttribute('src') || '').split('/').pop() };
    }
    const img = el.querySelector?.('img');
    const texte = lire(el).replace(/\n/g, ' ').slice(0, 90);
    return {
      type: 'bloc',
      apercu: texte || '(sans texte)',
      image: img ? (img.getAttribute('src') || '').split('/').pop() : undefined
    };
  }

  function ajouterNote(el, categorie, message) {
    const d = decrireElement(el);
    notes.push({
      page: location.pathname,
      contexte: contexteDe(el.tagName === 'IMG' ? (el.parentElement || el) : el),
      categorie, message,
      element: d
    });
    el.classList.add('ls-relecture-note');
    sauver();
    flash('Remarque enregistrée');
  }

  function ouvrirDialogueNote(el) {
    fermerDialogue();
    const d = decrireElement(el);
    const boite = document.createElement('div');
    boite.setAttribute('data-relecture-ui', '');
    boite.className = 'ls-rl-dialogue';
    const quoi = d.type === 'image' ? `Image : ${d.fichier}` : d.type === 'vidéo' ? `Vidéo : ${d.fichier}` : `Bloc : « ${d.apercu} »`;
    boite.innerHTML = `
      <div class="ls-rl-dlg-titre">Signaler quelque chose</div>
      <div class="ls-rl-dlg-quoi">${quoi.replace(/</g, '&lt;')}</div>
      <div class="ls-rl-dlg-choix">
        <button data-cat="Image à remplacer">Image à remplacer</button>
        <button data-cat="Image à supprimer">Image à supprimer</button>
        <button data-cat="Bloc à supprimer">Bloc à supprimer</button>
        <button data-cat="Autre">Autre remarque</button>
      </div>
      <textarea placeholder="Précisez si besoin (facultatif)…" rows="3"></textarea>
      <div class="ls-rl-dlg-actions">
        <button class="ls-rl-btn" data-annuler>Annuler</button>
        <button class="ls-rl-btn ls-rl-btn--primaire" data-valider>Enregistrer</button>
      </div>`;
    document.body.appendChild(boite);
    let categorie = 'Autre';
    boite.querySelectorAll('[data-cat]').forEach(b => b.addEventListener('click', () => {
      categorie = b.dataset.cat;
      boite.querySelectorAll('[data-cat]').forEach(x => x.classList.toggle('actif', x === b));
    }));
    boite.querySelector('[data-annuler]').addEventListener('click', fermerDialogue);
    boite.querySelector('[data-valider]').addEventListener('click', () => {
      ajouterNote(el, categorie, boite.querySelector('textarea').value.trim());
      fermerDialogue();
    });
    boite.querySelector('textarea').focus();
  }
  function fermerDialogue() {
    document.querySelectorAll('.ls-rl-dialogue').forEach(n => n.remove());
  }

  /* ---------- réapplication après régénération d'une pop-up ---------- */
  function reappliquer(racine) {
    if (!corrections.size) return;
    racine.querySelectorAll('[data-relecture-pret]').forEach(el => {
      const o = el.dataset.relectureOrigine;
      const c = o && corrections.get(o);
      if (c && lire(el) !== c.apres) { ecrire(el, c.apres); el.classList.add('ls-relecture-modifie'); }
      else if (c) el.classList.add('ls-relecture-modifie');
    });
  }

  function scanner(racine) {
    let cibles = [];
    racine.querySelectorAll('*').forEach(el => { if (estCandidat(el)) cibles.push(el); });
    cibles = cibles.filter(el => !cibles.some(a => a !== el && el.contains(a)));
    cibles.forEach(preparer);
    reappliquer(racine);
    majPanneau();
  }

  /* ---------- conserver ?relecture en changeant de page ---------- */
  function garderParametre() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href]');
      if (!a || a.target === '_blank') return;
      let url;
      try { url = new URL(a.getAttribute('href'), location.href); } catch (_) { return; }
      if (url.origin !== location.origin) return;
      if (url.searchParams.has('relecture')) return;
      url.searchParams.set('relecture', '');
      a.setAttribute('href', url.pathname + url.search + url.hash);
    }, true);
  }

  /* ---------- export ---------- */
  function exporter() {
    const t = [...corrections.values()];
    if (!t.length && !notes.length) { alert('Aucune correction ni remarque pour le moment.'); return; }
    const contenu = JSON.stringify({
      genere_le: new Date().toISOString(),
      site: location.origin,
      nombre_corrections: t.length,
      nombre_remarques: notes.length,
      corrections: t,
      remarques: notes
    }, null, 2);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([contenu], { type: 'application/json' }));
    a.download = 'corrections-site.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    flash('Fichier téléchargé');
  }

  /* ---------- aide ChatGPT ---------- */
  function copierPourChatGPT() {
    const blocs = [...document.querySelectorAll('[data-relecture-pret]')]
      .map(el => lire(el)).filter(t => t.length > 12);
    if (!blocs.length) { alert('Aucun texte à copier sur cette page.'); return; }
    const texte =
      "Corrige uniquement l'orthographe, la grammaire et la ponctuation des textes ci-dessous.\n" +
      "Ne change pas le sens, ne reformule pas, ne raccourcis pas.\n" +
      "Réponds avec exactement la même liste numérotée, rien d'autre.\n\n" +
      blocs.map((t, i) => `${i + 1}. ${t.replace(/\n/g, ' ')}`).join('\n');
    navigator.clipboard.writeText(texte)
      .then(() => alert(`${blocs.length} textes copiés.\n\nCollez-les dans ChatGPT, puis revenez ici et cliquez sur « Coller la réponse de ChatGPT ».`))
      .catch(() => alert('Copie impossible : sélectionnez et copiez le texte à la main.'));
  }

  function collerDepuisChatGPT() {
    const blocs = [...document.querySelectorAll('[data-relecture-pret]')].filter(el => lire(el).length > 12);
    const reponse = prompt(`Collez ici la réponse de ChatGPT (liste numérotée de ${blocs.length} lignes) :`);
    if (!reponse) return;
    const lignes = new Map();
    reponse.split('\n').forEach(l => {
      const m = l.match(/^\s*(\d+)\s*[.)]\s*(.+)$/);
      if (m) lignes.set(+m[1], m[2].trim());
    });
    if (!lignes.size) { alert("Aucune ligne numérotée reconnue. Vérifiez que la réponse est bien au format « 1. texte »."); return; }
    let n = 0;
    const aFaire = [];
    blocs.forEach((el, i) => {
      const nouveau = lignes.get(i + 1);
      if (!nouveau) return;
      const avant = lire(el);
      if (nouveau === avant) return;
      aFaire.push({ el, avant, nouveau });
      n++;
    });
    if (!n) { alert('Aucune différence détectée : rien à modifier.'); return; }
    if (!confirm(`${n} texte(s) seront modifiés sur cette page.\n\nAppliquer ?`)) return;
    aFaire.forEach(({ el, avant, nouveau }) => {
      const origine = el.dataset.relectureOrigine || avant;
      ecrire(el, nouveau);
      corrections.set(origine, { page: location.pathname, contexte: contexteDe(el), avant: origine, apres: nouveau });
      el.classList.add('ls-relecture-modifie');
    });
    sauver();
    flash(`${n} corrections appliquées`);
  }

  /* ---------- panneau ---------- */
  let panneau, minute = null;
  function flash(msg) {
    const z = panneau && panneau.querySelector('[data-flash]');
    if (!z) return;
    z.textContent = msg;
    z.classList.add('visible');
    clearTimeout(minute);
    minute = setTimeout(() => z.classList.remove('visible'), 2200);
  }

  function majPanneau() {
    if (!panneau) return;
    const nc = corrections.size, nn = notes.length;
    panneau.querySelector('[data-compteur]').innerHTML =
      `<b>${nc}</b> correction${nc > 1 ? 's' : ''} &nbsp;·&nbsp; <b>${nn}</b> remarque${nn > 1 ? 's' : ''}`;
    panneau.querySelector('[data-export]').disabled = (nc + nn) === 0;
    panneau.querySelector('[data-reset]').disabled = (nc + nn) === 0;
  }

  let effacementArme = false, minuteurArme = null;
  function construirePanneau() {
    panneau = document.createElement('div');
    panneau.setAttribute('data-relecture-ui', '');
    panneau.className = 'ls-rl-panneau';
    panneau.innerHTML = `
      <button class="ls-rl-replier" data-replier title="Réduire">–</button>
      <div class="ls-rl-titre">Mode relecture</div>
      <div class="ls-rl-corps">
        <p class="ls-rl-aide"><b>Double-cliquez</b> sur un texte pour le corriger.<br>
        <span>Échap annule · clic droit = suggestions d'orthographe</span></p>
        <div class="ls-rl-compteur" data-compteur></div>
        <div class="ls-rl-sauve">Sauvegarde automatique — vous ne pouvez rien perdre</div>
        <button class="ls-rl-btn" data-note>📌 Signaler une image / un bloc</button>
        <button class="ls-rl-btn" data-gpt-copier>Copier les textes pour ChatGPT</button>
        <button class="ls-rl-btn" data-gpt-coller>Coller la réponse de ChatGPT</button>
        <hr>
        <button class="ls-rl-btn ls-rl-btn--primaire" data-export>Télécharger tout (site entier)</button>
        <button class="ls-rl-btn ls-rl-btn--danger" data-reset>Tout effacer</button>
      </div>
      <div class="ls-rl-flash" data-flash></div>`;
    document.body.appendChild(panneau);

    panneau.querySelector('[data-export]').addEventListener('click', exporter);
    panneau.querySelector('[data-gpt-copier]').addEventListener('click', copierPourChatGPT);
    panneau.querySelector('[data-gpt-coller]').addEventListener('click', collerDepuisChatGPT);
    panneau.querySelector('[data-replier]').addEventListener('click', () => {
      panneau.classList.toggle('replie');
      panneau.querySelector('[data-replier]').textContent = panneau.classList.contains('replie') ? '+' : '–';
    });

    const btnNote = panneau.querySelector('[data-note]');
    btnNote.addEventListener('click', () => {
      modeNote = !modeNote;
      document.body.classList.toggle('ls-rl-mode-note', modeNote);
      btnNote.classList.toggle('actif', modeNote);
      btnNote.textContent = modeNote ? '✕ Quitter le mode signalement' : '📌 Signaler une image / un bloc';
      flash(modeNote ? 'Cliquez sur l’élément concerné' : 'Mode signalement désactivé');
    });

    // Double sécurité sur l'effacement : il faut cliquer deux fois puis confirmer.
    const btnReset = panneau.querySelector('[data-reset]');
    btnReset.addEventListener('click', () => {
      if (!effacementArme) {
        effacementArme = true;
        btnReset.textContent = '⚠ Cliquez encore pour tout effacer';
        btnReset.classList.add('arme');
        clearTimeout(minuteurArme);
        minuteurArme = setTimeout(() => {
          effacementArme = false;
          btnReset.textContent = 'Tout effacer';
          btnReset.classList.remove('arme');
        }, 6000);
        return;
      }
      clearTimeout(minuteurArme);
      const total = corrections.size + notes.length;
      if (!confirm(`Supprimer définitivement vos ${total} correction(s) et remarque(s) ?\n\nCette action est irréversible.`)) {
        effacementArme = false;
        btnReset.textContent = 'Tout effacer';
        btnReset.classList.remove('arme');
        return;
      }
      corrections.clear(); notes = [];
      try { localStorage.removeItem(CLE_TEXTES); localStorage.removeItem(CLE_NOTES); } catch (_) {}
      location.reload();
    });

    majPanneau();
  }

  function injecterStyles() {
    const s = document.createElement('style');
    s.textContent = `
      .ls-rl-panneau{position:fixed;right:18px;bottom:18px;z-index:2147483647;width:250px;padding:15px;
        border-radius:14px;background:#111;color:#fff;box-shadow:0 18px 44px rgba(0,0,0,.45);
        font-family:system-ui,-apple-system,"Segoe UI",sans-serif;}
      .ls-rl-panneau.replie .ls-rl-corps{display:none;}
      .ls-rl-replier{position:absolute;top:10px;right:10px;width:22px;height:22px;border:0;border-radius:6px;
        background:rgba(255,255,255,.14);color:#fff;font-size:15px;line-height:1;cursor:pointer;}
      .ls-rl-titre{font-size:13px;font-weight:700;margin-bottom:10px;}
      .ls-rl-aide{margin:0 0 11px;font-size:11.5px;line-height:1.5;color:rgba(255,255,255,.74);}
      .ls-rl-aide span{color:rgba(255,255,255,.45);}
      .ls-rl-compteur{padding:8px 10px;border-radius:8px;background:rgba(255,255,255,.1);font-size:12px;text-align:center;}
      .ls-rl-compteur b{font-size:14px;}
      .ls-rl-sauve{margin:6px 0 10px;font-size:10.5px;text-align:center;color:#7ddc9a;}
      .ls-rl-panneau hr{border:0;border-top:1px solid rgba(255,255,255,.14);margin:11px 0;}
      .ls-rl-btn{display:block;width:100%;margin-top:6px;padding:9px 11px;border:0;border-radius:8px;
        background:rgba(255,255,255,.13);color:#fff;font-size:11.5px;font-weight:600;cursor:pointer;text-align:center;}
      .ls-rl-btn:hover{background:rgba(255,255,255,.2);}
      .ls-rl-btn--primaire{background:#e3202a;}
      .ls-rl-btn--danger{background:rgba(255,255,255,.08);color:rgba(255,255,255,.6);}
      .ls-rl-btn--danger.arme{background:#c0392b;color:#fff;}
      .ls-rl-btn.actif{background:#2d7ef7;}
      .ls-rl-btn:disabled{opacity:.35;cursor:not-allowed;}
      .ls-rl-flash{max-height:0;overflow:hidden;text-align:center;font-size:11px;color:#7ddc9a;transition:max-height .2s,margin .2s;}
      .ls-rl-flash.visible{max-height:30px;margin-top:9px;}

      .ls-relecture-cible:hover{outline:1px dashed rgba(227,32,42,.55);outline-offset:3px;cursor:text;}
      .ls-relecture-actif{outline:2px solid #e3202a !important;outline-offset:3px;background:rgba(227,32,42,.05);}
      .ls-relecture-modifie{background:rgba(255,214,0,.22);box-shadow:0 0 0 2px rgba(255,214,0,.22);}
      .ls-relecture-note{outline:2px dashed #2d7ef7 !important;outline-offset:2px;}

      body.ls-rl-mode-note *:hover{outline:2px solid #2d7ef7 !important;outline-offset:2px;cursor:crosshair !important;}
      body.ls-rl-mode-note [data-relecture-ui] *:hover{outline:0 !important;cursor:pointer !important;}

      .ls-rl-dialogue{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:2147483647;
        width:min(94vw,420px);padding:20px;border-radius:14px;background:#fff;color:#111;
        box-shadow:0 30px 70px rgba(0,0,0,.4);font-family:system-ui,-apple-system,sans-serif;}
      .ls-rl-dlg-titre{font-size:15px;font-weight:700;margin-bottom:6px;}
      .ls-rl-dlg-quoi{font-size:12px;color:#666;margin-bottom:14px;word-break:break-word;}
      .ls-rl-dlg-choix{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-bottom:12px;}
      .ls-rl-dlg-choix button{padding:9px;border:1px solid #ddd;border-radius:8px;background:#fafafa;
        font-size:11.5px;font-weight:600;cursor:pointer;}
      .ls-rl-dlg-choix button.actif{background:#2d7ef7;border-color:#2d7ef7;color:#fff;}
      .ls-rl-dialogue textarea{width:100%;padding:10px;border:1px solid #ddd;border-radius:8px;
        font-family:inherit;font-size:13px;resize:vertical;box-sizing:border-box;}
      .ls-rl-dlg-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px;}
      .ls-rl-dlg-actions .ls-rl-btn{margin:0;background:#eee;color:#333;}
      .ls-rl-dlg-actions .ls-rl-btn--primaire{background:#e3202a;color:#fff;}
      @media print{[data-relecture-ui]{display:none;}}`;
    document.head.appendChild(s);
  }

  function demarrer() {
    injecterStyles();
    construirePanneau();
    charger();
    garderParametre();
    scanner(document.body);

    let t;
    new MutationObserver(() => { clearTimeout(t); t = setTimeout(() => scanner(document.body), 180); })
      .observe(document.body, { childList: true, subtree: true });

    // Mode signalement : un simple clic capture l'élément visé.
    document.addEventListener('click', (e) => {
      if (!modeNote) return;
      if (e.target.closest('[data-relecture-ui]')) return;
      e.preventDefault(); e.stopPropagation();
      ouvrirDialogueNote(e.target);
    }, true);

    // Correction d'un texte : double-clic (le simple clic reste la navigation).
    document.addEventListener('dblclick', (e) => {
      if (modeNote) return;
      const el = e.target.closest('[data-relecture-pret]');
      if (!el || el.closest('[data-relecture-ui]')) return;
      e.preventDefault(); e.stopPropagation();
      editer(el);
    }, true);

    // Filet de sécurité : on resauvegarde avant toute fermeture ou rechargement.
    window.addEventListener('beforeunload', () => { try { sauver(); } catch (_) {} });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer);
  else demarrer();
})();
