# Handoff Codex — Les Belles Envies (étude de cas photo)

Préparé par Claude (rôle : UX/UI + architecture frontend). Codex prend le relais pour toute génération d'image finale. Ne pas relire ce document comme un simple compte-rendu : chaque section est actionnable telle quelle.

## 1. Objectif

La page `pages/photos.html` (ancre `#tpl-cat-lbe`, template rendu par `renderLesBellesEnviesCaseHTML()`) est une **étude de cas portfolio Latitude Sud** sur le client Les Belles Envies — pas le site/Instagram du client lui-même. Elle doit démontrer : prise de vue studio → retouche → intégration créative → déclinaison réseaux sociaux, avec la voix de Latitude Sud (« ce que nous avons produit pour eux »), jamais la voix du client (« suivez-nous »). La structure a été corrigée pour coller à cet objectif avec les assets réels disponibles ; aucune image finale manquante n'a été inventée.

## 2. Fichiers modifiés

| Fichier | Rôle |
| --- | --- |
| `js/components.js` | `LBE_CASE` (config contenu, ~L3641) + `renderLesBellesEnviesCaseHTML()` (~L3712) : galerie réduite à 3 visuels curés, section Instagram reformulée en voix case-study + fond noir, image CTA finale rediversifiée. |
| `css/globals.css` | Bloc `.lbe-instagram` (~L5291) : fond noir (`--lbe-black`), nouveau `.lbe-instagram__eyebrow`, suppression de `.lbe-instagram__btn`, contrastes texte/ombre recalculés pour le fond sombre. |
| `index.html`, `pages/agence.html`, `pages/catalogue.html`, `pages/charte-graphique.html`, `pages/contact.html`, `pages/latitude-sud-news.html`, `pages/mentions-legales.html`, `pages/photos.html`, `pages/politique-de-confidentialite.html`, `pages/print.html`, `pages/realisations.html`, `pages/video.html`, `pages/web.html` | Cache-busting uniquement : `globals.css?v=140→141`, `components.js?v=96→97`. |

**Non touché volontairement** : `pages/social.html` a un diff en cours (295 lignes, probablement Codex sur Digilife réseaux sociaux) — laissé intact, ses références de version resteront à `v=140`/`v=96` jusqu'à ce que ce chantier soit clôturé et re-bumpé par son auteur.

## 3. Structure de page (ordre exact du DOM rendu)

```
<article class="lbe-case">
  <section class="lbe-hero">           kicker + h1 + texte + slogan | visuel (photo studio + composition + logo badge)
  <section class="lbe-workflow-intro"> h2 "Notre workflow photo" + sous-texte
  <section class="lbe-workflow-sep">   séparateur "NOTRE WORKFLOW EN 3 ÉTAPES"
  <section class="lbe-workflow-rows">  3× .lbe-wf-row (Fraisier / Rocher Chocolat / Éclair chocolat), chacune : brut → retouche → composition
  <section class="lbe-gallery">        h2 "Galerie de réalisations" + grille masonry 3 images
  <section class="lbe-instagram">      fond noir | copy (eyebrow "Réseaux sociaux" + titre + texte) | 4 cartes IG
  <section class="lbe-cta">            bloc crème | copy + bouton "Voir plus de projets" | visuel
  <footer class="lbe-footer">          logo | "Projet réalisé par Latitude Sud" | CTA contact
</article>
```

Cet ordre n'a pas changé dans cette passe (il était déjà correct) — seuls les contenus des sections gallery, instagram et cta ont été corrigés.

## 4. Asset map

Base commune : `LBE = /assets/projects/photos/les-belles-envies`

| Nom logique | Chemin | Section | Rôle | Ratio original | Traitement CSS | Crop |
| --- | --- | --- | --- | --- | --- | --- |
| Logo badge | `logo/lbe-logo-mark-white.webp` | hero | badge rond sur le visuel | 1620×2140 | `object-fit:contain` | Non |
| Rocher photo studio | `hero/hero-rocher-photo.webp` | hero (top) | photo brute plein cadre | 1400×1750 (4:5) | conteneur `aspect-ratio:16/8`, `object-fit:cover` | **Oui** — portrait 4:5 recadré en bandeau 2:1 ; vérifié visuellement (screenshot desktop/1024/mobile), le produit reste bien cadré |
| Fraisier composition | `hero/hero-fraisier-composition.webp` | hero (bottom) + carte IG 1 | carte "Le Fraisier" | 1200×1500 (4:5) | conteneur `aspect-ratio:16/10`, `object-fit:contain`, fond `--lbe-pink-light` | Non (letterbox) |
| Fraisier 01 brut | `workflow/fraisier/workflow-fraisier-01-brut.webp` | workflow row 1 | étape "photo brute" | 1000×1250 (4:5) | cellule `aspect-ratio:1/1`, `object-fit:cover` | Oui — léger, portrait→carré |
| Fraisier 02 retouche | `workflow/fraisier/workflow-fraisier-02-retouche.webp` | workflow row 1 | étape "retouche" | 1000×1000 (déjà carré) | cellule `aspect-ratio:1/1`, `object-fit:cover` | Non (ratio natif identique) |
| Fraisier 03 composition | `workflow/fraisier/workflow-fraisier-03-composition.webp` | workflow row 1 | étape finale | 1000×1250 (4:5) | cellule `--final`, `object-fit:contain`, fond pink-light | Non |
| Rocher 01 brut | `workflow/rocher-chocolat/workflow-rocher-01-brut.webp` | workflow row 2 | étape "photo brute" | 1000×1250 (4:5) | idem Fraisier 01 | Oui — léger |
| Rocher 02 retouche | `workflow/rocher-chocolat/workflow-rocher-02-retouche.webp` | workflow row 2 | étape "retouche" | 1000×1000 | idem Fraisier 02 | Non |
| Rocher 03 composition | `workflow/rocher-chocolat/workflow-rocher-03-composition.webp` | workflow row 2 + carte IG 3 | étape finale | 1000×1250 (4:5) | idem Fraisier 03 | Non |
| Éclair 01 brut | `workflow/eclair-chocolat/workflow-eclair-01-brut.webp` | workflow row 3 | étape "photo brute" | 1000×1250 (4:5) | idem | Oui — léger |
| Éclair 02 retouche | `workflow/eclair-chocolat/workflow-eclair-02-retouche.webp` | workflow row 3 | étape "retouche" | 1000×1000 | idem | Non |
| Éclair 03 composition | `workflow/eclair-chocolat/workflow-eclair-03-composition.webp` | workflow row 3 + carte IG 2 | étape finale | 1000×1250 (4:5) | idem | Non |
| Tartelette Passion | `gallery/gallery-tartelette-passion.webp` | gallery + carte IG 4 | visuel galerie 1 | 1000×1250 (4:5) | `.lbe-gallery-grid img { width:100%; height:auto }`, colonnes masonry | Non — ratio naturel préservé |
| Brioche composition | `gallery/gallery-brioche-composition.webp` | gallery + cta visuel | visuel galerie 2 | 1000×1250 (4:5) | idem galerie ; en cta : `object-fit:cover` sur zone stretch | Non en galerie / léger en cta |
| Croissant composition | `gallery/gallery-croissant-composition.webp` | gallery | visuel galerie 3 | 1000×1250 (4:5) | idem galerie | Non |
| Logo horizontal | `logo/lbe-logo-horizontal-white.webp` | footer | logo pied de page | 1985×617 | `height:34px; width:auto` | Non |

**Note système** : toutes les images `02-retouche` sont nativement carrées (1000×1000) sur les 3 produits, contrairement aux `01-brut`/`03-composition` (1000×1250) — comportement cohérent et systématique côté studio, pas une anomalie isolée.

**Écartées du rendu (retirées de la galerie dans cette passe)** : `gallery/gallery-brioche-brut.webp`, `gallery/gallery-croissant-brut.webp` — doublons "brut" redondants avec le concept déjà démontré dans workflow ; fichiers conservés sur disque, juste déréférencés.

## 5. Assets manquants

1. **Variété produit** : le studio n'a shooté que 6 produits Les Belles Envies au total (Fraisier, Rocher Chocolat, Éclair chocolat, Tartelette Passion, Croissant, Brioche chocolat). Il n'existe aucune 7ᵉ photo produit brute. La galerie ne peut pas atteindre 6-8 visuels **inédits** sans nouvelle prise de vue réelle ou génération encadrée (voir §6). C'est la raison structurelle pour laquelle la galerie a été réduite à 3 (curée, zéro répétition) plutôt que gonflée artificiellement.
2. **`contents/Photos/LBE/Compositions/Untitled-2.psd`** — fichier source non lisible en l'état (Photoshop requis). Peut contenir d'autres compositions déjà réalisées manuellement par le studio. **Non exploré.** À ouvrir en priorité avant toute génération IA : s'il contient déjà 2-3 compositions exploitables, cela résout le point 1 sans génération.
3. **Logos alternatifs** : `contents/Photos/LBE/logo lbe/` contient ~20 variantes (noir/blanc/rouge, avec/sans tag Guadeloupe, wordmark, tagline "Oubliez le sucre pas vos envies"). Seules 2 sont câblées (mark blanc, horizontal blanc). Pas bloquant, juste disponible si besoin d'un traitement logo différent.
4. **Aucune vidéo** produit Les Belles Envies n'existe (contrairement à Cap Créole/Digilife) — la section Instagram reste donc 100% statique, cohérent avec les assets réels.

## 6. Images à générer par Codex

**Optionnel** — la page est complète et fonctionnelle avec 3 visuels galerie 100 % réels. Ne lancer cette étape que si l'utilisateur souhaite explicitement enrichir la galerie au-delà de 3, et seulement après avoir vérifié le point 5.2 (PSD non exploré). Objectif si lancé : ajouter 2-3 compositions éditoriales des produits **déjà shootés** (jamais un produit inventé) dans un habillage distinct de celui déjà utilisé, pour porter la galerie vers 5-6 visuels sans dupliquer une image déjà affichée ailleurs sur la page.

Gabarit à répéter pour Fraisier / Rocher Chocolat / Éclair chocolat :

- **Objectif** : variante éditoriale packshot du produit, distincte de sa composition déjà utilisée en workflow/hero.
- **Sources à utiliser** : la photo brute réelle du produit (`workflow/<produit>/workflow-<produit>-01-brut.webp`) comme référence de fidélité produit obligatoire.
- **Produit à préserver** : forme, couleur, glaçage/décor exacts visibles sur la photo brute. Ne pas réinterpréter la pâtisserie elle-même.
- **Composition** : packshot centré, mise en scène studio (assiette, nappe/texture) cohérente avec le style déjà établi sur les photos brutes — pas de décor de toutes pièces.
- **Ratio** : 1000×1250 (4:5 vertical), identique aux autres visuels de galerie.
- **Direction lumière** : douce, zénithale, cohérente avec la brute source — pas de changement de température de couleur perceptible.
- **Cadrage** : produit entier visible, espace de respiration autour (pas de crop serré sur les bords).
- **Background** : uni ou dégradé pastel dans la palette existante (`--lbe-pink-light #fff4f5`, `--lbe-pink #f9dfe2`, `--lbe-cream`) — jamais une scène narrative inventée.
- **Zone de texte** : aucune. Contrairement aux cartes "composition" (bandeau typographié), ce visuel de galerie reste un packshot pur sans texte surimposé.
- **Contraintes** : produit reconnaissable et fidèle à 100 % à la brute ; pas de packaging, logo ou étiquette inventés.
- **Éléments interdits** : tout élément de la maquette de référence non présent dans les assets réels (salade, fleurs, lapin de Pâques, sac cadeau, vitrine boutique) ; texte marketing superposé ; main/personnage absent de la brute.
- **Chemin final** : `assets/projects/photos/les-belles-envies/gallery/gallery-<produit>-editorial.webp` (webp, compression cohérente avec les fichiers voisins ~90-120 Ko).

Après génération : ajouter l'entrée correspondante dans `LBE_CASE.gallery` (js/components.js ~L3682), lancer `node scripts/check-local-assets.mjs`, bumper les versions.

## 7. Posts sociaux — mapping visuels réels → cartes Instagram

| Carte IG | Visuel utilisé | Réemployé ailleurs |
| --- | --- | --- |
| 1 — Le Fraisier | `hero/hero-fraisier-composition.webp` | hero (bottom) |
| 2 — L'Éclair chocolat | `workflow/eclair-chocolat/workflow-eclair-03-composition.webp` | workflow row 3 |
| 3 — Le Rocher Chocolat | `workflow/rocher-chocolat/workflow-rocher-03-composition.webp` | workflow row 2 |
| 4 — Tartelette Passion | `gallery/gallery-tartelette-passion.webp` | gallery |

Handle affiché : `lesbellesenvies_gp` (préexistant au code, non re-vérifié par mes soins face au compte réel — l'impact d'une erreur est faible puisque plus aucun bouton ne pointe vers ce compte, mais **à confirmer** avant mise en prod).

Aucune carte n'a de lien cliquable vers `instagram.com/lesbellesenvies_gp` : le bouton "Suivez-nous sur Instagram" a été supprimé intentionnellement (voix client → voix case-study).

## 8. Responsive — comportements attendus et vérifiés

Breakpoints existants (non modifiés) : `max-width:980px` puis `max-width:640px`.

- **≥981px (desktop, testé à 1320 et 1024)** : hero 2 colonnes, workflow avec labels d'étapes visibles, galerie masonry 3 colonnes, Instagram copy + 4 cartes en grille, CTA 2 colonnes, footer 3 colonnes (logo/texte/CTA).
- **≤980px (testé à 390, mobile)** : hero empilé, workflow empilé avec flèches pivotées à 90° et labels d'étapes masqués (`.lbe-wf-row__steps{display:none}`), galerie 2 colonnes, Instagram copy au-dessus des cartes (2×2), CTA empilé (visuel en 16:9), footer empilé centré.
- **≤640px** : cartes Instagram forcées en 2×2 (règle redondante avec 980px, sans effet négatif).

Vérifié par capture Chrome headless à 1320×3600, 1024×4200 et 390×8500 — aucune déformation, aucun débordement, footer reste une barre compacte à toutes les tailles (jamais un footer de site complet). La zone de transition exacte 768-980px (tablette portrait) n'a pas été capturée séparément ; le point de rupture est un simple swap de grille déjà utilisé ailleurs sur le site, risque jugé faible.

## 9. QA checklist

| # | Vérification | Méthode | Résultat |
| --- | --- | --- | --- |
| 1 | Site lancé localement | serveur déjà actif (`python -m http.server 4253`) | OK |
| 2 | Page inspectée | harnais QA standalone (contournement staleness Browser pane) + Chrome headless | OK |
| 3 | Comparaison à la maquette | structure/esprit appliqué avec assets réels ; imagerie de la maquette (non réelle) volontairement non reproduite | OK, conforme au brief |
| 4 | Chaque asset vérifié | `node scripts/check-local-assets.mjs` → 0 manquant sur 496 refs | OK |
| 5 | Proportions vérifiées | voir Asset map §4 (ratios + crop documentés par image) | OK |
| 6 | Workflows vérifiés | 3 lignes × 3 étapes, alignement capturé à 3 largeurs | OK |
| 7 | Ratios vérifiés | aucun `object-fit:cover` non documenté ; galerie en ratio naturel | OK |
| 8 | Galerie vérifiée | 3 visuels curés, zéro produit répété entre galerie et workflow | OK |
| 9 | Section Instagram noire | `.lbe-instagram{background:var(--lbe-black)}`, capture confirmée | OK |
| 10 | Responsive vérifié | 1320 / 1024 / 390 capturés, voir §8 | OK |
| 11 | Aucune autre page cassée | seuls fichiers listés en §2 modifiés ; `pages/social.html` (chantier tiers) non touché | OK |
| 12 | Footer reste compact | capturé à 1320, 1024, 390 — toujours logo/texte/CTA sur une barre | OK |

Syntaxe JS : `node --check js/components.js` → OK.

## 10. Definition of Done

- [x] Structure de page conforme à l'esprit de la maquette, assets 100% réels.
- [x] Aucune image finale inventée par Claude (contrainte respectée).
- [x] Galerie curée, sans doublon avec le workflow.
- [x] Section Instagram : fond noir, voix case-study, aucun lien vers le compte client.
- [x] Footer compact (logo / mention Latitude Sud / CTA), jamais un footer de site.
- [x] Responsive 1440(1320)/1024/mobile sans déformation.
- [x] `check-local-assets.mjs` : 0 référence cassée.
- [x] Versions CSS/JS bumpées sur les pages concernées.
- [ ] **Reste à faire par Codex (optionnel)** : ouvrir `Untitled-2.psd`, éventuellement générer les 2-3 variantes galerie du §6, confirmer le handle Instagram réel.

## 11. Instructions Codex

Périmètre : `assets/projects/photos/les-belles-envies/`, `LBE_CASE`/`renderLesBellesEnviesCaseHTML` dans `js/components.js`, bloc `.lbe-instagram`/`.lbe-gallery-grid`/`.lbe-cta-block` dans `css/globals.css`. Ne pas toucher aux namespaces `.ccr-*`, `.adc-*`, `.dgl-*` ni à `pages/social.html` (chantiers tiers en cours). Après toute modification : `node scripts/check-local-assets.mjs`, `node --check js/components.js`, bump des versions `?v=` sur les pages qui chargent ces fichiers, vérification visuelle desktop + mobile avant de considérer terminé.

<CodexExecutionBrief>
scope: assets/projects/photos/les-belles-envies/**, js/components.js#LBE_CASE, js/components.js#renderLesBellesEnviesCaseHTML, css/globals.css .lbe-instagram/.lbe-gallery-grid/.lbe-cta-block
state: page structurally complete, 100% real assets, no invented imagery, no client-Instagram CTA, black case-study Instagram section, 3-image curated gallery
optional_tasks:
  1. Open contents/Photos/LBE/Compositions/Untitled-2.psd — if it contains usable finished compositions, integrate those into LBE_CASE.gallery instead of generating new ones.
  2. If PSD has nothing usable and user wants a larger gallery: generate up to 3 editorial packshot variants (Fraisier, Rocher Chocolat, Éclair chocolat) per the exact spec in section 6 of this doc — same real product from the *-01-brut.webp reference, ratio 1000x1250, no invented product/scene/text, save as gallery/gallery-<produit>-editorial.webp, then add to LBE_CASE.gallery array (components.js ~L3682).
  3. Confirm the real Instagram handle for the client (currently hardcoded as lesbellesenvies_gp, unverified) and correct LBE_CASE.instagram.handle if wrong.
forbidden: inventing new products, reproducing mockup-only imagery (salad/flowers/easter bunny/gift bag/storefront), adding any CTA/link back to the client's own Instagram account, touching pages/social.html, touching .ccr-*/.adc-*/.dgl-* namespaces.
post_change_checklist: node scripts/check-local-assets.mjs (expect 0 missing) -> node --check js/components.js -> bump ?v= on every HTML page loading globals.css/components.js -> visual check at ~1320px, ~1024px, ~390px, focused on .lbe-gallery-grid and .lbe-instagram contrast.
</CodexExecutionBrief>
