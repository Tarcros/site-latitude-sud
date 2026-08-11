# Prompt de briefing — à copier-coller au début d'une nouvelle session

Copiez le bloc ci-dessous tel quel dans une nouvelle session Claude Code
ouverte sur le dossier du site.

---

```
Tu reprends le site vitrine de Latitude Sud, agence de communication en
Guadeloupe. Avant toute chose, lis docs/SITE-COMPLET.md en entier : c'est le
rapport de reprise en main du projet. Lis aussi AGENTS.md et CLAUDE.md s'ils
existent.

Points que tu dois avoir en tête avant de proposer quoi que ce soit :

1. Site 100 % statique : pas de build, pas de framework, pas de npm. On édite
   des fichiers, on pousse sur GitHub, Vercel déploie automatiquement.
   Production : https://site-latitude-sud.vercel.app

2. LE TEXTE EST À DEUX ENDROITS. Environ 25 600 caractères dans le HTML des
   14 pages, et 559 chaînes (~32 000 caractères) dans js/components.js. Toutes
   les études de cas clients (Digilife, Mr Bricolage, Decathlon, Cap Créole,
   Les Belles Envies, catalogues) vivent dans des objets de configuration
   JavaScript rendus dans des pop-ups, pas dans le HTML. Si on te demande de
   changer un texte d'étude de cas, cherche dans components.js.

3. Après toute modification de css/globals.css ou js/components.js, il faut
   incrémenter le paramètre ?v= dans LES 14 PAGES, avec le même numéro partout.
   Sans ça les navigateurs servent l'ancienne version.

4. Vérifications obligatoires avant de considérer une tâche terminée :
   node scripts/check-local-assets.mjs   (doit afficher 0 asset manquant)
   node --check js/components.js
   puis un contrôle visuel réel à ~1440, ~1024 et ~390 px.
   Ne jamais conclure « c'est bon » sur la seule absence d'erreur.

5. Le CSS est cloisonné par client avec des préfixes : .lbe-* Les Belles Envies,
   .ccr-* Cap Créole, .adc-* Auto Discount, .dgi-*/.digilife-* Digilife,
   .mrb-* Mr Bricolage, .lifeon-* Lifeon. Ne fais jamais déborder un préfixe
   sur un autre client.

6. Sur les images : jamais de déformation, jamais de visuel recréé en CSS ou en
   dégradé pour remplacer une photo manquante. Plusieurs compositions clients
   ont leur titre et leur signature INCRUSTÉS dans le fichier image : ne les
   recadre jamais, tu couperais le texte. Si un asset manque, prépare un
   emplacement propre et documente-le au lieu d'improviser.

7. Un deuxième assistant (Codex) travaille parfois sur le même dépôt en
   parallèle. Relis toujours l'état réel d'un fichier avant de l'éditer, ne
   présume pas que ta version en contexte est à jour. Ne fais jamais
   git add -A : ne mets en index que ce que tu as réellement modifié, et
   vérifie qu'aucun artefact de to-del/ n'y entre.

8. Il existe un mode relecture pour que le dirigeant corrige les textes sans
   toucher au code : ouvrir n'importe quelle page avec ?relecture, double-cliquer
   un texte, le corriger. Il produit un corrections-site.json réinjecté par
   node scripts/apply-corrections.mjs <fichier> --write
   (sans --write, le script simule). Voir docs/RELECTURE.md.

9. Réponds en français, commente le code en français, rédige les messages de
   commit en français.

Il y a des points ouverts listés à la fin de docs/SITE-COMPLET.md, notamment
une étude de cas Cap Créole devenue inaccessible et des légendes dupliquées
incrustées dans des fichiers image. Ne les traite pas d'office : signale-les si
c'est pertinent pour la tâche demandée.

Commence par lire les documents cités, puis dis-moi en quelques lignes ce que
tu as compris de l'état du site et attends ma demande.
```
