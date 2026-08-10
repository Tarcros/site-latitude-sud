---
name: latitude-ui
description: "Règles de reproduction UI pour le site Latitude Sud (HTML/CSS/JS statique, sans build). À suivre pour toute page client, catalogue, ou composant reproduisant une maquette/référence visuelle."
---

# /latitude-ui

Règles pour toute tâche de conception/reproduction UI sur ce site.

## Avant de coder

- Inspecte l'existant avant d'écrire quoi que ce soit : composant similaire déjà présent dans `js/components.js`, classes CSS déjà namespacées par client dans `css/globals.css` (`.dgc-*`, `.dgl-*`, `.dkt-*`, `.mrb-*`, `.lbe-*`, `.ccr-*`), gabarit modal partagé (`.ls-modal*`, `applyCaseStudyContactCta`).
- Une capture de référence fournie par l'utilisateur est la source de vérité absolue : reproduis-la fidèlement, ne simplifie pas, ne réinterprète pas, ne "modernise" pas une composition déjà validée.
- Ne redesigne jamais une section déjà validée par l'utilisateur sans demande explicite.

## Assets

- N'utilise que des assets réels (photos/logos/PDF sources fournis dans `contents/`). N'invente, ne génère, ni ne fabrique jamais un asset de substitution — si une ressource manque, place un placeholder honnête et signale-le.
- Préserve les ratios d'image d'origine. Aucun recadrage ou déformation non demandé (pas de letterboxing blanc, pas d'étirement).
- Vérifie les dimensions réelles avant intégration (`sips -g pixelWidth -g pixelHeight`).

## Implémentation

- Préfère un correctif ciblé à une réécriture complète, sauf si l'utilisateur demande explicitement une refonte.
- Recherche/lecture économe : utilise `rtk` pour les commandes bruyantes (recherche, listing, git), lis les fichiers en entier uniquement quand une édition précise est nécessaire.
- Bump la query string de version (`?v=N`) sur `globals.css`/`components.js` après toute modification visible, appliqué sur tous les HTML simultanément.

## Vérification (obligatoire avant de déclarer terminé)

- Vérifie visuellement le rendu (desktop + mobile) via le navigateur avant d'annoncer une tâche finie — ne jamais livrer sans avoir vérifié.
- Contrôle l'absence d'images cassées (`naturalWidth === 0`) et d'erreurs console.
- Compare le résultat à la référence fournie, point par point, avant de conclure.
