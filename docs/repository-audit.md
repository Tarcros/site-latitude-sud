# Audit du repository Latitude Sud

Audit réalisé le 11 août 2026, avant toute restructuration d’assets.

## Architecture actuelle

- Stack : HTML, CSS et JavaScript vanilla, sans build ni framework.
- Pages publiques principales : `index.html`, `agence.html`, `realisations.html`, `photos.html`, `charte-graphique.html`, `social.html`, `catalogue.html`, `contact.html`.
- Routes historiques conservées : `video.html` → Photos, `print.html` → Charte graphique, `web.html` → Catalogue.
- Styles actifs : `css/globals.css`, `css/portfolio-pages.css`, `css/hero-wave.css`.
- Script applicatif actif : `js/components.js`.
- Les modales projet sont créées par `initProjectModal()`. Les pages fournissent soit des attributs `data-project-*`, soit un `<template>` détaillé. Les études catalogue les plus récentes sont rendues depuis des objets de données dans `components.js`.
- Les fonds de hero actifs sont encore dans le dossier racine `backgrounds/`, tandis que les autres médias globaux sont dans `assets/`.

## Taxonomie réelle

| Catégorie | Route | Projets actifs |
| --- | --- | --- |
| Photos | `/pages/photos.html` | So Class, HFWI, Les Belles Envies, Cap Créole |
| Charte graphique | `/pages/charte-graphique.html` | CIST, Les Bonnes Épices, Marina Bas-du-Fort, SMGEAG, Le Pressing |
| Réseaux sociaux | `/pages/social.html` | Auto Discount, Digilife, Digilife Influence, Cap Créole, Les Belles Envies, LifeOn |
| Catalogue | `/pages/catalogue.html` | Digilife, Decathlon, Mr.Bricolage, Gamm vert, La Foir’Fouille, Carrefour |

## État mesuré avant nettoyage

- 866 fichiers applicatifs et de travail hors `.git`.
- 718 fichiers dans `assets/` et `backgrounds/`.
- 226 339 651 octets dans `assets/` et `backgrounds/`.
- 453 assets locaux référencés par le code.
- 144 192 729 octets d’assets directement référencés.
- 0 référence locale cassée détectée.
- 266 fichiers sans référence directe après résolution des constantes JavaScript de chemins.
- 12 groupes de doublons binaires détectés par SHA-1.

Le graphe exhaustif `asset → fichiers consommateurs` est conservé dans [asset-usage.tsv](asset-usage.tsv). Il inclut les chemins construits depuis les constantes `DGC` et `DKT` de `components.js`.

## Assets utilisés par projet

| Projet actuel | Assets actifs | Usage principal |
| --- | ---: | --- |
| Les Bonnes Épices | 33 | identité, applications, éditorial, terrain, miniature |
| Cap Créole — Photos | 7 | miniature, workflow, galerie |
| CIST | 26 | logos, guidelines, photos, applications, site web |
| HFWI | 31 | miniatures et galeries Sol, Porter, Affligem |
| Le Pressing | 20 | avant/après, charte, mockups, terrain |
| Les Belles Envies | 18 | hero, workflow et galerie |
| Marina Bas-du-Fort | 17 | identité, charte, simulations, mockups |
| SA Pressing | 1 | ancien support encore référencé |
| SMGEAG | 14 | logos, icônes et mockups |
| So Class | 12 | miniature, profil, produits, Instagram et galerie |
| Auto Discount | 21 | hero, méthode, Instagram, reels En Drive |
| Cap Créole — Social | 29 | hero, carrousels, avant/après, Instagram, Google Ads |
| Digilife — Social | 12 | miniatures, campagne Influence et making-of |
| Capaceo / Bel Air Sup | 4 | cartes et contenus simples |
| LifeOn | 19 | étude de cas social media complète : boutique, posts, banner et workflows |
| Carrefour | 20 | couvertures, pages catalogue et communication magasin |
| Decathlon | 32 | hero, méthode, couvertures et doubles-pages |
| Digilife — Catalogue | 23 | hero, personas, méthode, doubles-pages et posts |
| Gamm vert | 14 | catalogues, pages et campagnes |
| La Foir’Fouille | 19 | catalogues, pages et campagnes |
| Mr.Bricolage | 25 | hero, univers catalogue, réseaux sociaux et médias |

## Candidats au rangement

- Dossiers projet de premier niveau mélangés : les projets Photos et Charte graphique ne sont pas regroupés par catégorie.
- `assets/projects/catalogues/` emploie un pluriel différent de la route et des autres catégories.
- `backgrounds/` duplique la responsabilité de `assets/backgrounds/`.
- Fichiers de QA : `screenshots/`, `qa-responsive-frame.html`, `pages/parallax-test.html`.
- Fichiers de travail : `tmp/`, `Attached Element Context from Integrated`.
- Fichiers système `.DS_Store` présents dans plusieurs dossiers.
- Asset anormal contenant un saut de ligne : `assets/icons/player/icon-player-play.svg\n.svg`.
- Anciennes variantes et fichiers préfixés `old` dans Auto Discount et Carrefour.

Aucun candidat incertain ne sera déplacé sans preuve. Les cas qui peuvent encore être des routes publiques, des sources ou des intégrations externes sont consignés dans [manual-review.md](manual-review.md).

## Architecture cible

```text
assets/
├── global/
│   ├── backgrounds/
│   ├── branding/
│   ├── icons/
│   ├── illustrations/
│   └── ui/
├── projects/
│   ├── photos/<projet>/<section>/
│   ├── branding/<projet>/<section>/
│   ├── social/<projet>/<section>/
│   └── catalogue/<projet>/<section>/
└── shared/
```

Les sous-dossiers ne seront créés que lorsqu’une section réelle existe. Les URLs publiques resteront inchangées et les anciennes routes de redirection seront conservées.

## Contrôles disponibles

- `node scripts/check-local-assets.mjs` vérifie les références locales et les fichiers absents.
- `node --check js/components.js` valide le JavaScript actif.
- Le site est servi sans build via `python3 -m http.server 4253`.
