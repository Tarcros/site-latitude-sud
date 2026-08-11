#!/usr/bin/env node
/* ============================================================
   Réinjecte les corrections de textes produites par le mode
   relecture (js/relecture.js) dans les sources du site.

   Usage :
     node scripts/apply-corrections.mjs corrections-textes.json
     node scripts/apply-corrections.mjs corrections-textes.json --dry-run

   Le texte du site vit à deux endroits : le HTML des pages et les
   chaînes de js/components.js (configs + gabarits `...`). On ne
   tente pas d'analyser la syntaxe JS — trop fragile sur des
   gabarits qui contiennent du HTML et des guillemets. On cherche
   le texte d'origine par motif souple, tolérant aux retours à la
   ligne du code, aux <br> et aux entités HTML.
   ============================================================ */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const RACINE = path.resolve(import.meta.dirname, '..');
// Simulation par défaut : rien n'est écrit tant que --write n'est pas demandé.
const DRY = !process.argv.includes('--write');
const fichierJson = process.argv[2];

if (!fichierJson || fichierJson.startsWith('--')) {
  console.error('Usage : node scripts/apply-corrections.mjs <corrections.json> [--write]');
  console.error('        (sans --write, le script simule et n\'écrit rien)');
  process.exit(1);
}

const echapRegex = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Motif retrouvant `texte` dans une source, en tolérant :
 *  - les retours à la ligne / indentation du code entre deux mots ;
 *  - les sauts de ligne écrits <br>, <br/> ou <br /> ;
 *  - les esperluettes écrites & ou &amp; ; les espaces insécables.
 */
function motifDe(texte) {
  const segments = texte.split('\n').map(seg =>
    seg.trim().split(/\s+/).map(mot =>
      echapRegex(mot)
        .replace(/&/g, '(?:&amp;|&)')
        .replace(/'/g, "(?:'|\\\\')")
    ).join('(?:\\s|&nbsp;)+')
  );
  return new RegExp(segments.join('\\s*(?:<br\\s*/?>|\\\\n)\\s*'), 'g');
}

/** Réécrit `apres` en imitant l'encodage réellement constaté dans le fragment trouvé. */
function encoderComme(apres, fragmentTrouve) {
  const br = fragmentTrouve.match(/<br\s*\/?>/i);
  let out = br ? apres.replace(/\n/g, br[0]) : apres.replace(/\n/g, ' ');
  if (/&amp;/.test(fragmentTrouve)) out = out.replace(/&(?!(amp|nbsp|lt|gt|quot|#\d+);)/g, '&amp;');
  if (/&nbsp;/.test(fragmentTrouve)) out = out.replace(/ /g, '&nbsp;');
  if (/\\'/.test(fragmentTrouve)) out = out.replace(/'/g, "\\'");
  return out;
}

/* ---------- chargement ---------- */
const donnees = JSON.parse(readFileSync(path.resolve(fichierJson), 'utf8'));
const corrections = donnees.corrections ?? donnees;
if (!Array.isArray(corrections) || !corrections.length) {
  console.error('Fichier vide ou format inattendu.');
  process.exit(1);
}

const fichiers = [
  path.join(RACINE, 'index.html'),
  ...readdirSync(path.join(RACINE, 'pages')).filter(f => f.endsWith('.html')).map(f => path.join(RACINE, 'pages', f)),
  path.join(RACINE, 'js', 'components.js')
];
const sources = new Map();
for (const f of fichiers) {
  try { sources.set(f, readFileSync(f, 'utf8')); } catch (_) {}
}
const original = new Map(sources);

/* ---------- application ---------- */
const applique = [], ambigu = [], introuvable = [], suspect = [];

for (const c of corrections) {
  if (!c || typeof c.avant !== 'string' || typeof c.apres !== 'string') continue;
  if (c.avant.trim() === c.apres.trim()) continue;

  const motif = motifDe(c.avant);
  let total = 0;
  const touches = [];

  for (const [f, contenu] of sources) {
    motif.lastIndex = 0;
    const trouves = [...contenu.matchAll(motif)];
    if (!trouves.length) continue;
    total += trouves.length;
    touches.push(path.relative(RACINE, f));
    // Remplacement de la fin vers le début : les index restent valides.
    let nouveau = contenu;
    for (const m of trouves.reverse()) {
      nouveau = nouveau.slice(0, m.index) + encoderComme(c.apres, m[0]) + nouveau.slice(m.index + m[0].length);
    }
    sources.set(f, nouveau);
  }

  if (!total) { introuvable.push(c); continue; }
  if (total > 1) ambigu.push({ c, n: total, touches });
  // Un texte court peut se retrouver par hasard dans du code : on le signale.
  if (c.avant.trim().length < 12) suspect.push({ c, n: total });
  applique.push({ c, n: total, touches });
}

/* ---------- écriture ---------- */
let ecrits = 0;
if (!DRY) {
  for (const [f, contenu] of sources) {
    if (contenu !== original.get(f)) { writeFileSync(f, contenu, 'utf8'); ecrits++; }
  }
}

/* ---------- rapport ---------- */
const ligne = '─'.repeat(60);
const court = s => s.replace(/\n/g, ' ⏎ ').slice(0, 64);

console.log(`\n${DRY ? 'SIMULATION — aucun fichier écrit (ajoutez --write pour appliquer)' : `Corrections appliquées — ${ecrits} fichier(s) réécrit(s)`}`);
console.log(ligne);
console.log(`  Reçues       : ${corrections.length}`);
console.log(`  Appliquées   : ${applique.length}`);
console.log(`  Introuvables : ${introuvable.length}`);
console.log(ligne);

for (const a of applique) {
  console.log(`  ✓ ${a.touches.join(', ')}${a.n > 1 ? `  (${a.n}×)` : ''}`);
  console.log(`      avant : ${court(a.c.avant)}`);
  console.log(`      après : ${court(a.c.apres)}`);
}

if (ambigu.length) {
  console.log(`\n  Présents à plusieurs endroits — corrigés partout (normal pour le menu,`);
  console.log(`  le pied de page ou un texte réutilisé ; à vérifier sinon) :`);
  for (const a of ambigu) console.log(`   • ${a.n}× ${court(a.c.avant)}`);
}

if (suspect.length) {
  console.log(`\n  Textes très courts — vérifiez qu'aucun code n'a été touché :`);
  for (const s of suspect) console.log(`   • ${s.n}× « ${s.c.avant.trim()} »`);
}

if (introuvable.length) {
  console.log(`\n  À REPRENDRE À LA MAIN — non retrouvés dans les sources :`);
  for (const c of introuvable) {
    console.log(`   • ${c.page || '?'} — ${c.contexte || ''}`);
    console.log(`     avant : ${court(c.avant)}`);
    console.log(`     après : ${court(c.apres)}`);
  }
  console.log(`     (cause habituelle : phrase coupée par une balise en plein milieu)`);
}

/* ---------- remarques (images, blocs, divers) : à traiter à la main ---------- */
const remarques = donnees.remarques ?? [];
if (remarques.length) {
  console.log(`\n${ligne}`);
  console.log(`  ${remarques.length} REMARQUE(S) — aucune n'est appliquée automatiquement`);
  console.log(ligne);
  const parPage = new Map();
  for (const r of remarques) {
    if (!parPage.has(r.page)) parPage.set(r.page, []);
    parPage.get(r.page).push(r);
  }
  for (const [page, liste] of parPage) {
    console.log(`\n  ${page}`);
    for (const r of liste) {
      const e = r.element || {};
      const quoi = e.type === 'image' || e.type === 'vidéo'
        ? `${e.type} ${e.fichier}${e.alt ? ` (alt : « ${e.alt} »)` : ''}`
        : `bloc « ${(e.apercu || '').slice(0, 60)} »${e.image ? ` [image : ${e.image}]` : ''}`;
      console.log(`   □ [${r.categorie}] ${quoi}`);
      if (r.contexte) console.log(`     emplacement : ${r.contexte}`);
      if (r.message) console.log(`     note : ${r.message}`);
    }
  }
}

console.log(`\n  Vérifications : node scripts/check-local-assets.mjs && node --check js/components.js`);
console.log(`  Puis incrémentez ?v= de components.js / globals.css dans les pages HTML.\n`);
