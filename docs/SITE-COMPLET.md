# Site Latitude Sud — rapport complet

Document de reprise en main. À lire en entier avant toute modification.
Généré le 11 août 2026.

---

## 1. Ce qu'est ce projet

Site vitrine de **Latitude Sud**, agence de communication en Guadeloupe.
Il présente l'agence et son portfolio, organisé en quatre expertises :
photographie, charte graphique, réseaux sociaux, catalogue.

- **Production** : https://site-latitude-sud.vercel.app
- **Dépôt** : https://github.com/Tarcros/site-latitude-sud (branche `main`)
- **Hébergement** : Vercel, déploiement automatique à chaque push sur `main`.
  Les URLs conservent l'extension `.html` (pas de `cleanUrls`, aucun `vercel.json`).

---

## 2. Nature technique

**Site statique, sans build, sans framework, sans dépendance npm.**
Pas de `package.json`, pas de bundler. On édite les fichiers, on pousse, c'est en ligne.

| | |
| --- | --- |
| Pages HTML | 14 (`index.html` + 13 dans `pages/`) |
| CSS | `css/globals.css` (6 934 lignes, 313 Ko) · `css/portfolio-pages.css` (189 l.) · `css/hero-wave.css` |
| JS | `js/components.js` (4 050 lignes, 241 Ko) · `js/relecture.js` · `js/Support-Latitude-Sud.js` (hérité) |
| Assets | 547 fichiers, 241 Mo sous `assets/` |

### Cache-busting — règle impérative

Chaque page charge les fichiers partagés avec un numéro de version :

```html
<link rel="stylesheet" href="/css/globals.css?v=156">
<script src="/js/components.js?v=106"></script>
```

**Après toute modification de `globals.css` ou `components.js`, il faut
incrémenter ce numéro dans les 14 pages**, sinon les navigateurs servent
l'ancienne version. Le numéro doit rester identique partout.

```bash
# exemple : passer components.js de 106 à 107 partout
for f in index.html pages/*.html; do
  sed -i '' 's/components\.js?v=106/components.js?v=107/g' "$f"
done
```

---

## 3. Architecture des pages

| Page | Rôle |
| --- | --- |
| `index.html` | accueil |
| `pages/agence.html` | présentation de l'agence |
| `pages/realisations.html` | porte d'entrée du portfolio |
| `pages/photos.html` | expertise photographie |
| `pages/charte-graphique.html` | expertise identité visuelle |
| `pages/social.html` | expertise réseaux sociaux — **la page la plus riche** |
| `pages/catalogue.html` | expertise catalogue / print |
| `pages/contact.html` | contact |
| `pages/latitude-sud-news.html` | actualités |
| `pages/mentions-legales.html`, `pages/politique-de-confidentialite.html` | légal |
| `pages/print.html`, `pages/video.html`, `pages/web.html` | pages de redirection d'anciennes URLs |

---

## 4. Le point le plus important à comprendre : où vit le contenu

C'est la particularité du projet. **Le texte est à deux endroits.**

### 4.1 Dans le HTML des pages — environ 25 600 caractères

Structure des pages, intros de section, mentions légales. Éditable directement.

### 4.2 Dans `js/components.js` — 559 chaînes, environ 32 000 caractères

**La majorité du contenu rédactionnel du site.** Toutes les études de cas
détaillées vivent dans des objets JavaScript de configuration, rendues à
l'exécution dans des pop-ups.

Le mécanisme, systématique :

```
const XXX_CASE = { … }              ← le contenu (textes + chemins d'images)
function renderXxxCaseHTML(cfg)     ← génère le HTML à partir du contenu
function initXxxCaseStudy()         ← remplit <template id="tpl-…"> au chargement
<article data-project-custom-template="tpl-…">   ← la carte qui ouvre la pop-up
```

Études de cas et emplacements dans `js/components.js` :

| Constante | Renderer | Ligne ~ |
| --- | --- | --- |
| `CATALOGUE_CASE_STUDIES` (Carrefour, Gamm Vert, La Foir'Fouille…) | `renderCatalogueCaseHTML` | 2446 / 2796 |
| `DIGILIFE_CASE_STUDY` | `renderDigilifeCaseHTML` | 2836 / 2944 |
| `DECATHLON_CASE_STUDY` | `renderDecathlonCaseHTML` | 3079 / 3195 |
| `MRB_CASE` (Mr Bricolage) | `renderMrBricolageCaseHTML` | 3317 / 3495 |
| `LBE_CASE` (Les Belles Envies) | `renderLesBellesEnviesCaseHTML` | 3636 / 3715 |
| `CCR_CASE` (Cap Créole) | `renderCapCreoleCaseHTML` | 3826 / 3883 |

**Conséquence pratique** : pour changer un texte d'étude de cas, il ne faut pas
chercher dans le HTML — c'est dans `components.js`.

### 4.3 Templates par page

| Page | `<template>` déclarés |
| --- | --- |
| `pages/catalogue.html` | `tpl-cat-decathlon`, `tpl-cat-mr-bricolage`, `tpl-cat-gamm-vert`, `tpl-cat-foirfouille`, `tpl-cat-carrefour`, `tpl-cat-digilife` |
| `pages/photos.html` | `tpl-cat-lbe`, `tpl-cap-creole-photo` |
| `pages/social.html` | `tpl-cat-lbe`, `tpl-lifeon`, `tpl-digilife-catalogue`, `tpl-digilife-influence`, `tpl-auto-discount`, `tpl-cap-creole-social` |

**Piège connu** : sur `pages/photos.html`, les cartes Les Belles Envies et
Cap Créole portent l'attribut `hidden` (commentaire « conservée en cache »).
Les Belles Envies reste accessible depuis `pages/social.html` ; **Cap Créole
photo n'est accessible depuis aucune page** — son étude de cas existe mais
aucun lien ne l'ouvre. À trancher : retirer le `hidden` ou assumer le retrait.

---

## 5. Conventions CSS

`css/globals.css` est découpé en blocs par client, chacun avec son préfixe.
**Ne jamais faire déborder un préfixe sur un autre client.**

| Préfixe | Client |
| --- | --- |
| `.lbe-*` | Les Belles Envies |
| `.ccr-*` | Cap Créole |
| `.adc-*` | Auto Discount |
| `.dgi-*` / `.digilife-*` | Digilife |
| `.mrb-*` | Mr Bricolage |
| `.lifeon-*` | Lifeon |

Chaque bloc définit ses couleurs en variables locales, par exemple :

```css
.lbe-case {
  --lbe-black:#0b0b0b; --lbe-red:#e3202a; --lbe-pink:#f9dfe2;
  --lbe-cream:#faf7f3; --lbe-border:#ece8e6; --lbe-muted:#706d6c;
}
```

Breakpoints utilisés partout : `max-width:980px` puis `max-width:640px`.

---

## 6. Assets

Arborescence :

```
assets/
├── global/         backgrounds, branding (logos, favicons), icons, illustrations
├── projects/
│   ├── photos/<client>/
│   ├── branding/<client>/
│   ├── social/<client>/
│   └── catalogue/<client>/
├── shared/         placeholders génériques
└── fonts/
```

**Règles** :
- Format `.webp` pour les images du site.
- Les fichiers sources (PSD, originaux haute définition) vivent **hors du dépôt**,
  dans `/Users/tarry/Documents/LATITUDE SUD/contents/`.
- Le dossier `to-del/` est une quarantaine : on n'y supprime jamais en dur, on y
  déplace. Ses artefacts de QA ne doivent pas être commités.
- Ne jamais déformer une image : préférer `width:100%; height:auto`, et si un
  cadre contraint est nécessaire, `object-fit` + `object-position` maîtrisés.
- **Ne jamais recadrer une image dont le texte est incrusté** (les compositions
  clients portent titre et signature dans le fichier même).

---

## 7. Vérifications obligatoires après modification

```bash
node scripts/check-local-assets.mjs   # 0 asset référencé manquant
node --check js/components.js         # syntaxe JS
graphify update .                     # met à jour le graphe de connaissance
```

Puis contrôle visuel à ~1440 px, ~1024 px et ~390 px, et incrément des `?v=`.

Note : `scripts/qa-browser.cjs` automatise le parcours des routes et l'ouverture
des pop-ups, mais nécessite Playwright (non installé par défaut).

### Vérification visuelle en local

Le serveur local tourne sur le port 4253 :

```bash
python3 -m http.server 4253
```

Capture pleine page en ligne de commande :

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new \
  --disable-gpu --user-data-dir="$(mktemp -d)" --window-size=1440,5600 \
  --screenshot=/tmp/qa.png "http://localhost:4253/pages/social.html"
```

**Piège vérifié** : en headless, Chrome ignore `width=device-width`. Une capture
à `--window-size=390,…` rend en fait la page sur une largeur de 980 px et donne
l'illusion d'un débordement horizontal. Pour tester le mobile, utiliser un vrai
navigateur avec viewport redimensionné, et mesurer
`document.documentElement.scrollWidth` plutôt que se fier à l'image.

---

## 8. Système de relecture des textes

Mis en place pour permettre à une personne non technique (le dirigeant) de
corriger tous les textes du site sans toucher au code.

| Fichier | Rôle |
| --- | --- |
| `js/relecture.js` | mode d'édition en place, activé par `?relecture` dans l'URL |
| `js/components.js` (fin de fichier) | chargeur conditionnel : n'injecte `relecture.js` que si le paramètre est présent |
| `scripts/apply-corrections.mjs` | réinjecte le fichier de corrections dans les sources |
| `docs/RELECTURE.md` | notice destinée au relecteur |

Fonctionnement : le relecteur ouvre `…/?relecture`, double-clique un texte,
le corrige. Il peut aussi signaler une image ou un bloc à changer/supprimer.
Tout est sauvegardé en continu dans `localStorage` (rien n'est perdu au
rafraîchissement ni au changement de page), et le paramètre `?relecture` est
réinjecté automatiquement dans les liens internes. À la fin, un unique
`corrections-site.json` regroupe tout le site.

Réinjection côté développeur :

```bash
node scripts/apply-corrections.mjs corrections-site.json            # simulation
node scripts/apply-corrections.mjs corrections-site.json --write    # application
```

Le script cherche chaque texte par motif souple (tolérant aux retours à la ligne
du code, aux `<br>`, aux entités `&amp;`/`&nbsp;`) dans le HTML **et** dans
`components.js`, puis réécrit en respectant l'encodage trouvé sur place.

**Vigilance** : un texte court peut exister à plusieurs endroits. Exemple réel
mesuré, « Réseaux sociaux » apparaît **16 fois dans 5 fichiers** (libellé de
menu, titre de page, titres de section) — une correction dessus les change
toutes. D'où la simulation par défaut et la relecture de `git diff` avant commit.
Les corrections introuvables (phrase coupée par une balise) sont listées pour
traitement manuel. Les remarques ne sont jamais appliquées automatiquement :
elles sont imprimées comme liste de tâches.

---

## 9. Contexte de travail à connaître

- **Deux assistants travaillent sur ce dépôt** (Claude Code et Codex). Les
  collisions sur `js/components.js`, `css/globals.css` et `pages/social.html`
  sont fréquentes. **Toujours relire l'état du fichier avant d'éditer**, ne
  jamais présumer que la version en contexte est à jour.
- Le propriétaire travaille **en français** : commentaires de code, messages de
  commit et échanges en français.
- Ne jamais utiliser `git add -A` : ne mettre en index que les fichiers
  réellement modifiés, et vérifier qu'aucun artefact de `to-del/` n'y entre.
- Les images sont des **assets téléchargés**, jamais recréées en CSS ou en
  dégradés : si un visuel manque, on prévoit un emplacement propre et on le
  documente plutôt que d'improviser.

---

## 10. État actuel et points ouverts

**Fait récemment** : refonte de l'étude de cas Les Belles Envies (hero sans
bandes de remplissage, cellules de workflow égalisées, galerie ramenée à
6 produits distincts, cartes Instagram en véritables intégrations, bloc final
en bande large, responsive revu sur trois largeurs) ; mise en place du système
de relecture.

**Points ouverts** :

1. **Cap Créole photo inaccessible** — carte `hidden` dans `pages/photos.html`,
   aucun autre point d'entrée (§ 4.3).
2. **Légendes incrustées en double** — deux paires de fichiers partagent le même
   texte gravé dans l'image :
   `workflow-rocher-03-composition.webp` et `workflow-eclair-03-composition.webp`
   portent tous deux « Un moment raffiné, une part rien que pour vous. » ;
   `gallery-brioche-composition.webp` et `gallery-croissant-composition.webp`
   portent tous deux « Laissez-vous tenter par un moment d'exception ».
   De plus le fichier Éclair affiche « L'Eclair » sans accent.
   Contourné par réordonnancement (les doublons ne sont plus voisins), mais
   **non corrigé** : cela demande une retouche des fichiers image.
3. **Conclusion Les Belles Envies en attente** — le visuel final porte
   `data-codex-image-slot="lbe-editorial-final"` et `pending: true` ; une image
   éditoriale large définitive est attendue.
4. **`to-del/` dans le dépôt** — les suppressions sont en cours mais de nouveaux
   artefacts de QA y réapparaissent. Envisager `to-del/` dans `.gitignore`.
5. **Textes invisibles non couverts** par le mode relecture : attributs `alt`,
   balises `<title>`, `meta description`.
