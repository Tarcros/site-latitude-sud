# Architecture du site

## Runtime

Le projet est un site statique sans compilation :

- HTML dans `index.html` et `pages/` ;
- styles partagés dans `css/globals.css` ;
- styles des quatre pages portfolio dans `css/portfolio-pages.css` ;
- vagues de hero dans `css/hero-wave.css` ;
- composants, navigation, modales et études de cas dans `js/components.js` ;
- script historique autonome conservé dans `js/Support-Latitude-Sud.js`.

## Navigation et catégories

| Catégorie | Route | Dossier d’assets |
| --- | --- | --- |
| Photos | `/pages/photos.html` | `assets/projects/photos/` |
| Charte graphique | `/pages/charte-graphique.html` | `assets/projects/branding/` |
| Réseaux sociaux | `/pages/social.html` | `assets/projects/social/` |
| Catalogue | `/pages/catalogue.html` | `assets/projects/catalogue/` |

`pages/realisations.html` sert de porte d’entrée générale. Les pages `video.html`, `print.html` et `web.html` restent en place pour rediriger les anciennes URLs.

## Projets et modales

Les galeries simples utilisent l’attribut `data-project`. La fonction `initProjectModal()` de `components.js` ouvre leur modale partagée.

Deux modes coexistent volontairement :

- données `data-project-*` pour les galeries simples ;
- attributs dédiés (`data-cist-project`, `data-marina-project`, etc.) pour les études de charte détaillées ;
- `<template>` ou configuration JavaScript pour les études catalogue et social media détaillées.

Les catalogues complexes sont pilotés par `CATALOGUE_CASE_STUDIES` et assemblés par les renderers partagés de `components.js`. Un changement spécifique à un client doit rester dans sa configuration tant qu’aucune règle réellement commune n’est nécessaire.

## Dépendances entre fichiers

```text
page HTML
├── css/globals.css
├── css/hero-wave.css
├── css/portfolio-pages.css (pages portfolio)
└── js/components.js
    ├── navigation et footer
    ├── vagues et interactions globales
    ├── modale projet partagée
    └── renderers des études de cas
```

## Validation

Après une modification :

1. vérifier les références avec `node scripts/check-local-assets.mjs` ;
2. vérifier la syntaxe avec `node --check js/components.js` ;
3. servir le site localement ;
4. contrôler la page affectée en bureau et mobile ;
5. mettre à jour le graphe avec `graphify update .`.

Le script `scripts/qa-browser.cjs` automatise la navigation des routes publiques et l’ouverture des 17 pop-ups projet. Il nécessite Playwright et un navigateur Chromium disponibles dans l’environnement de maintenance.
