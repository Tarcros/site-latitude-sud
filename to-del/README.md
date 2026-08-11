# Fichiers écartés du runtime

Ce dossier contient uniquement des fichiers déplacés, jamais supprimés.

- `unused-assets/` : assets sans consommateur actif, avec leur ancien chemin relatif conservé ;
- `qa/` : anciennes captures et pages de test ;
- `work-files/` : fichiers temporaires, exports et scripts de préparation.

Avant de restaurer un fichier, vérifier qu’il n’existe pas déjà dans le runtime puis relancer `node scripts/check-local-assets.mjs`.
