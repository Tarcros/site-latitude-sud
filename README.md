# Site Latitude Sud

Portfolio statique de Latitude Sud, réalisé en HTML, CSS et JavaScript vanilla. Le site ne nécessite ni framework ni étape de build.

## Lancer le site

```bash
python3 -m http.server 4253
```

Puis ouvrir `http://localhost:4253/`.

## Pages principales

- `/` : accueil
- `/pages/agence.html` : agence
- `/pages/realisations.html` : vue d’ensemble des réalisations
- `/pages/photos.html` : projets photo
- `/pages/charte-graphique.html` : identité et charte graphique
- `/pages/social.html` : réseaux sociaux
- `/pages/catalogue.html` : catalogues
- `/pages/contact.html` : contact

Les routes historiques `video.html`, `print.html` et `web.html` sont conservées comme redirections.

## Contrôles rapides

```bash
node --check js/components.js
node --check js/Support-Latitude-Sud.js
node scripts/check-local-assets.mjs
```

Le dernier contrôle doit afficher `Missing local assets: 0`.

## Documentation

- [Architecture du site](docs/site-architecture.md)
- [Carte des assets](docs/asset-map.md)
- [Résultats du nettoyage](docs/cleanup-results.md)
- [Conventions des assets](assets/README.md)
- [Éléments à valider manuellement](docs/manual-review.md)
