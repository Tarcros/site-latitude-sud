# Handoff Codex — Les Belles Envies

# 1. Objectif

Finaliser une étude de cas Latitude Sud premium consacrée au travail photo réalisé pour Les Belles Envies : prise de vue, retouche, intégration créative et déclinaison sociale. La structure et les assets réels sont intégrés ; seule l’image éditoriale finale large reste à produire.

# 2. Fichiers modifiés

| Fichier | Rôle |
| --- | --- |
| `js/components.js` | Source de contenu `LBE_CASE` et rendu `renderLesBellesEnviesCaseHTML()` : ordre des sections, workflows séparés, sélection de galerie, posts sociaux et emplacement de l’image finale. |
| `css/globals.css` | Système visuel `.lbe-*` : hero, workflows sans crop, galerie éditoriale, section sociale noire, conclusion et footer compact. |
| `docs/HANDOFF_CODEX_LES_BELLES_ENVIES.md` | Source de vérité pour la génération et la finalisation par Codex. |
| Pages HTML chargeant `globals.css` et `components.js` | Cache-busting homogène après la modification des deux fichiers partagés. |

# 3. Structure de page

Ordre exact du rendu :

1. `lbe-hero` — présentation du projet, texte à gauche, deux visuels réels et logo client à droite.
2. `lbe-workflow-intro` — titre, sous-texte et séparateur « Notre workflow en 3 étapes ».
3. `lbe-workflow-example` — workflow Le Rocher Chocolat : brut → retouche → intégration.
4. `lbe-workflow-example` — workflow Le Fraisier : brut → retouche → intégration.
5. `lbe-workflow-example` — workflow L’Éclair chocolat : brut → retouche → intégration.
6. `lbe-gallery` — galerie éditoriale de sept réalisations réelles, ratios naturels.
7. `lbe-instagram` — section noire « Du studio au feed », trois intégrations sociales lisibles.
8. `lbe-cta` — conclusion éditoriale ; image temporaire balisée par `data-codex-image-slot="lbe-editorial-final"`.
9. `lbe-footer` — bande projet compacte : logo, mention Latitude Sud, CTA contact.

# 4. Asset map

Base : `/assets/projects/photos/les-belles-envies/`.

| Nom logique | Chemin exact | Section | Rôle | Ratio original | Traitement CSS | Crop autorisé |
| --- | --- | --- | --- | --- | --- | --- |
| Logo vertical | `logo/lbe-logo-mark-white.webp` | Hero | Badge client chevauchant la composition | 1620×2140, env. 3:4 | `object-fit:contain`, plaque noire 4:5 | Non |
| Rocher studio | `hero/hero-rocher-photo.webp` | Hero haut | Photographie produit principale | 1400×1750, 4:5 | `object-fit:contain` dans un cadre 16:10 crème | Non |
| Fraisier composé | `hero/hero-fraisier-composition.webp` | Hero bas | Exemple d’intégration créative | 1200×1500, 4:5 | `object-fit:contain`, fond rose pâle | Non |
| Rocher brut | `workflow/rocher-chocolat/workflow-rocher-01-brut.webp` | Workflow 01 | Étape 01 | 1000×1250, 4:5 | largeur 100 %, hauteur automatique, `contain` | Non |
| Rocher retouché | `workflow/rocher-chocolat/workflow-rocher-02-retouche.webp` | Workflow 01 + galerie | Étape 02 et photographie finale | 1000×1000, 1:1 | ratio naturel, `contain` | Non |
| Rocher composé | `workflow/rocher-chocolat/workflow-rocher-03-composition.webp` | Workflow 01 + social 03 | Étape 03 et post | 1000×1250, 4:5 | ratio naturel, `contain` | Non |
| Fraisier brut | `workflow/fraisier/workflow-fraisier-01-brut.webp` | Workflow 02 | Étape 01 | 1000×1250, 4:5 | largeur 100 %, hauteur automatique, `contain` | Non |
| Fraisier retouché | `workflow/fraisier/workflow-fraisier-02-retouche.webp` | Workflow 02 + galerie | Étape 02 et photographie finale | 1000×1000, 1:1 | ratio naturel, `contain` | Non |
| Fraisier composé | `workflow/fraisier/workflow-fraisier-03-composition.webp` | Workflow 02 + social 01 | Étape 03 et post | 1000×1250, 4:5 | ratio naturel, `contain` | Non |
| Éclair brut | `workflow/eclair-chocolat/workflow-eclair-01-brut.webp` | Workflow 03 | Étape 01 | 1000×1250, 4:5 | largeur 100 %, hauteur automatique, `contain` | Non |
| Éclair retouché | `workflow/eclair-chocolat/workflow-eclair-02-retouche.webp` | Workflow 03 + galerie | Étape 02 et photographie finale | 1000×1000, 1:1 | ratio naturel, `contain` | Non |
| Éclair composé | `workflow/eclair-chocolat/workflow-eclair-03-composition.webp` | Workflow 03 + social 02 | Étape 03 et post | 1000×1250, 4:5 | ratio naturel, `contain` | Non |
| Brioche composée | `gallery/gallery-brioche-composition.webp` | Galerie + conclusion temporaire | Réalisation graphique ; placeholder de conclusion | 1000×1250, 4:5 | galerie : hauteur auto ; conclusion : `contain` | Non |
| Tartelette Passion | `gallery/gallery-tartelette-passion.webp` | Galerie | Réalisation produit | 1000×1250, 4:5 | hauteur auto dans masonry | Non |
| Brioche studio | `gallery/gallery-brioche-brut.webp` | Galerie | Photographie produit | 1000×1250, 4:5 | hauteur auto dans masonry | Non |
| Croissant studio | `gallery/gallery-croissant-brut.webp` | Galerie | Photographie produit | 1000×1250, 4:5 | hauteur auto dans masonry | Non |
| Logo horizontal | `logo/lbe-logo-horizontal-white.webp` | Footer | Signature client | 1985×617, env. 3.2:1 | largeur auto, hauteur 34 px | Non |

Les réemplois d’un même asset sont intentionnels : le workflow démontre la méthode, la galerie valorise la photographie et les intégrations sociales montrent le livrable final. Aucun fichier n’est copié ou dupliqué sur disque.

# 5. Assets manquants

Un seul asset est requis pour finaliser la page :

- `assets/projects/photos/les-belles-envies/final/lbe-editorial-fraisier-wide.webp` — photographie/construction finale large destinée à la conclusion éditoriale. Le fichier n’existe pas encore ; la page utilise temporairement `gallery/gallery-brioche-composition.webp` dans un emplacement balisé.

Le dossier source `/Users/tarry/Documents/LATITUDE SUD/contents/Photos/LBE` contient les prises de vue, compositions et variantes de logos ayant servi à produire les assets runtime. Aucun autre asset manquant n’est nécessaire à la structure actuelle.

# 6. Images à générer par Codex

### Conclusion éditoriale large

- **Objectif** : créer le visuel final de case study, spectaculaire mais crédible, centré sur le Fraisier réel.
- **Sources à utiliser** :
  - `assets/projects/photos/les-belles-envies/workflow/fraisier/workflow-fraisier-02-retouche.webp` pour l’apparence exacte du produit ;
  - `assets/projects/photos/les-belles-envies/hero/hero-fraisier-composition.webp` pour la palette et le traitement de marque ;
  - si nécessaire, les originaux du même produit dans `/Users/tarry/Documents/LATITUDE SUD/contents/Photos/LBE`.
- **Produit à préserver** : géométrie ronde, glaçage rouge brillant, décor supérieur rouge, proportions et couleur exactes. Le dessert doit rester immédiatement reconnaissable comme le produit photographié.
- **Composition** : produit entier à droite, occupant environ 40 à 48 % de la largeur ; quelques fraises réelles et une matière pâtissière discrète peuvent accompagner le produit ; large respiration à gauche.
- **Ratio** : 16:7, cible 2400×1050 px minimum avant export WebP.
- **Direction lumière** : lumière studio douce venant du haut-gauche, ombre naturelle légère, rendu premium high-key.
- **Cadrage** : angle trois-quarts légèrement plongeant ; aucun bord du gâteau coupé ; marge de sécurité de 8 % autour du produit.
- **Background** : blanc cassé / crème très pâle avec une nuance rosée subtile, sans motif décoratif fort.
- **Zone de texte** : 42 % gauche totalement calme pour le texte HTML existant ; ne générer aucun texte dans l’image.
- **Contraintes** : fidélité maximale au Fraisier source ; photographie réaliste ; cohérence avec les vrais assets ; produit entier ; contraste suffisant sur fond clair.
- **Éléments interdits** : faux logo, faux packaging, texte intégré, nouveau dessert, topping inventé, main/personne, décor de boutique, accessoires envahissants, crop du produit.
- **Chemin final** : `assets/projects/photos/les-belles-envies/final/lbe-editorial-fraisier-wide.webp`.

Après création : remplacer `LBE_CASE.cta.image.src`, retirer `pending: true`, conserver l’alt descriptif, puis vérifier l’absence de crop à 1440, 1024 et 390 px.

# 7. Posts sociaux

| Position | Asset réel | Usage |
| --- | --- | --- |
| 01 | `workflow/fraisier/workflow-fraisier-03-composition.webp` | Post Le Fraisier |
| 02 | `workflow/eclair-chocolat/workflow-eclair-03-composition.webp` | Post L’Éclair chocolat |
| 03 | `workflow/rocher-chocolat/workflow-rocher-03-composition.webp` | Post Le Rocher Chocolat |

Handle UI : `lesbellesenvies_gp`. Les cartes reproduisent uniquement les éléments Instagram utiles au storytelling ; aucun CTA « Suivez-nous » ni lien vers le compte client.

# 8. Responsive

- **1440 px et plus** : hero 2 colonnes ; trois visuels par workflow sur une ligne ; masonry 4 colonnes contrôlées ; trois posts sociaux sur une ligne ; conclusion et footer horizontaux.
- **Desktop standard / 1024 px** : les proportions restent inchangées ; le contenu s’adapte à la largeur du popup sans réduction excessive.
- **Tablette, ≤980 px** : hero empilé ; chaque workflow devient vertical avec flèches orientées vers le bas ; galerie 2 colonnes ; copy sociale au-dessus des posts ; conclusion empilée ; footer centré.
- **Mobile, ≤640 px** : marges 20 px ; galerie adaptative 1 à 2 colonnes selon la largeur réelle ; posts sociaux sur une seule colonne pour rester lisibles ; workflows en 1 colonne avec le libellé de chaque étape ; aucune largeur fixe ni débordement horizontal.
- Toutes les images conservent leur ratio source. `object-fit:contain` ou hauteur automatique uniquement dans les zones LBE ; aucun `cover` sur un produit.

# 9. QA checklist

- [x] Ouvrir la page Les Belles Envies depuis `pages/photos.html` dans le popup projet.
- [x] Vérifier l’ordre exact des neuf sections décrit au §3.
- [x] Comparer hero, rythme vertical, section noire et footer avec la maquette fournie.
- [x] Vérifier les 3 workflows, leurs libellés et leurs flèches.
- [x] Vérifier que les 4:5 restent 4:5 et que les 1:1 restent carrés.
- [x] Vérifier les 7 visuels de galerie et l’absence de déformation.
- [x] Vérifier les 3 intégrations sociales en fond noir, suffisamment grandes.
- [ ] Vérifier la conclusion avec l’asset final généré ; le placeholder actuel est propre et balisé.
- [x] Vérifier le footer compact sur desktop, tablette et mobile.
- [x] Vérifier 1440+, 1024, tablette et mobile, sans overflow horizontal.
- [x] Vérifier la console navigateur et les réponses réseau — aucune erreur ni alerte ; aucun asset projet en échec.
- [x] Exécuter `node --check js/components.js`.
- [x] Exécuter `node scripts/check-local-assets.mjs` — 499 références uniques, 0 manquante.
- [x] Exécuter `git diff --check`.

# 10. Definition of Done

La page est terminée lorsque :

- l’image finale large du §6 a remplacé le placeholder ;
- les neuf sections sont présentes dans l’ordre ;
- les trois workflows montrent clairement brut → retouche → intégration ;
- la galerie comporte 6 à 8 visuels réels et variés ;
- la section sociale noire montre exactement trois posts réels, sans voix de client ;
- aucun produit, logo ou contenu de marque n’a été inventé ;
- aucune image n’est déformée ou recadrée ;
- le responsive est validé aux quatre familles de largeur ;
- aucun asset ne retourne 404 et aucune erreur console n’est présente ;
- le footer reste une bande projet compacte.

# 11. Instructions Codex

<CodexExecutionBrief>
Finaliser uniquement Les Belles Envies. Générer un seul asset : `assets/projects/photos/les-belles-envies/final/lbe-editorial-fraisier-wide.webp`, selon le §6 et à partir du vrai Fraisier. Remplacer ensuite le placeholder dans `LBE_CASE.cta.image`, retirer `pending:true`, conserver la structure et les assets déjà intégrés. Ne pas inventer de produit, texte, logo ou packaging ; ne pas recadrer les visuels. Valider le popup à 1440+, 1024, tablette et mobile, puis lancer `node --check js/components.js`, `node scripts/check-local-assets.mjs` et `git diff --check`. Ne modifier aucune page hors du périmètre LBE, sauf le cache-busting nécessaire.
</CodexExecutionBrief>
