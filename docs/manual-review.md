# Validation manuelle

Ces éléments ne sont pas déplacés automatiquement tant que leur rôle n’est pas certain.

| Chemin | Motif du doute | Hypothèse |
| --- | --- | --- |
| `pages/latitude-sud-news.html` | Absente de la navigation et du sitemap, mais page complète | Ancienne landing page encore accessible par URL directe |
| `js/Support-Latitude-Sud.js` | Aucun import dans les pages, mais fichier historique important | Script destiné à une intégration externe ou à un ancien prototype |
| `css/style.css` | Utilisé uniquement par `latitude-sud-news.html` | À conserver tant que la route ci-dessus reste en place |
| `assets/fonts/harabara-mais-bold.otf` | Aucune déclaration `@font-face` active trouvée | Source typographique historique |
| `graphify-out/` | Non chargé par le site, mais requis par `CLAUDE.md` | Outil de navigation et de maintenance du code |

Les variantes non référencées de Decathlon, Digilife et des autres projets ont été déplacées dans `to-del/unused-assets/`. Elles restent récupérables et n’ont pas été supprimées.
