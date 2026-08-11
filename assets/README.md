# Organisation des assets

Tous les fichiers chargés par le site doivent rester dans ce dossier. Les sources brutes externes ne doivent jamais être appelées directement par le HTML, le CSS ou le JavaScript.

## Arborescence

```text
assets/
├── global/
│   ├── backgrounds/     fonds et visuels communs aux pages
│   ├── branding/        logo Latitude Sud, favicons et logos clients partagés
│   ├── icons/           icônes d’interface réellement utilisées
│   └── illustrations/   illustrations Latitude Sud partagées
├── projects/
│   ├── photos/
│   ├── branding/
│   ├── social/
│   └── catalogue/
├── shared/              ressources mutualisées entre plusieurs cartes ou pages
└── fonts/               fontes locales conservées à titre de source
```

## Règles

1. Ranger chaque nouveau média dans sa catégorie puis dans son projet.
2. Créer un sous-dossier fonctionnel (`hero`, `gallery`, `workflow`, `campaigns`, etc.) seulement lorsqu’il correspond à une vraie section.
3. Employer des noms descriptifs en minuscules avec des tirets.
4. Préférer WebP pour les photos et SVG pour les logos/icônes lorsqu’un original vectoriel existe.
5. Ne jamais déformer ou recadrer un logo.
6. Ne pas dupliquer un fichier déjà partagé ; utiliser `global/` ou `shared/` si plusieurs pages le consomment.
7. Après tout déplacement, mettre à jour les chemins puis lancer `node scripts/check-local-assets.mjs`.
8. Un fichier écarté n’est pas supprimé : il est déplacé vers `/to-del/unused-assets/` en conservant son ancien chemin relatif.
