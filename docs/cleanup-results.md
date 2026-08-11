# Résultats du nettoyage

Nettoyage réalisé le 11 août 2026 à partir du checkpoint Git `8229b74`.

## Résultat mesuré

| Mesure | Avant | Après |
| --- | ---: | ---: |
| Fichiers dans les dossiers d’assets runtime | 718 | 465 |
| Poids des assets runtime | 226 339 651 octets | 196 318 727 octets |
| Assets locaux réellement référencés | 453 | 464 |
| Références locales manquantes | 0 | 0 |

La légère hausse du nombre de références détectées vient de l’amélioration de l’audit : prise en charge des URLs absolues, des favicons `.ico`, des accents Unicode décomposés et exclusion des blocs HTML commentés.

## Actions réalisées

- regroupement des fonds sous `assets/global/backgrounds/` ;
- regroupement des logos, favicons, icônes et illustrations partagés sous `assets/global/` ;
- classement des projets dans les quatre catégories réelles du site ;
- harmonisation de `catalogues/` vers `catalogue/` ;
- déplacement de 253 fichiers non consommés hors du runtime ;
- conservation de tous ces fichiers dans `to-del/unused-assets/` ;
- déplacement des anciens fichiers de QA et de travail dans `to-del/qa/` et `to-del/work-files/` ;
- ajout d’un audit automatisé des références ;
- conservation des routes historiques et des éléments incertains documentés.

## Contrôles exécutés

- toutes les pages publiques principales répondent en HTTP 200 ;
- `node --check js/components.js` passe ;
- `node --check js/Support-Latitude-Sud.js` passe ;
- `node scripts/check-local-assets.mjs` indique zéro asset manquant ;
- navigation headless des pages principales sans image locale cassée ;
- ouverture de 34 pop-ups projet en bureau et en mobile, sans réponse HTTP en erreur ;
- contrôle bureau et mobile de la nouvelle miniature Cap Créole.

## Éléments volontairement conservés

- `pages/latitude-sud-news.html` et son CSS dédié ;
- `js/Support-Latitude-Sud.js` ;
- la fonte locale historique `assets/fonts/harabara-mais-bold.otf` ;
- `graphify-out/`, requis par les instructions de maintenance ;
- les anciennes routes de redirection.
