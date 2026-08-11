# Relecture des textes du site

Système en deux temps : le relecteur corrige directement dans les pages,
le développeur réinjecte en une commande.

---

## Partie 1 — À envoyer au relecteur

> ### Relire et corriger les textes du site
>
> Vous allez pouvoir corriger les textes **directement sur le site**, comme si
> vous écriviez dans un document. Aucune installation, aucune connaissance
> technique. Comptez une bonne heure pour l'ensemble du site.
>
> **1. Ouvrez le lien de relecture**
>
> Ajoutez `?relecture` à la fin de l'adresse du site :
>
> ```
> https://…votre-site…/index.html?relecture
> ```
>
> Un panneau noir apparaît en bas à droite : vous êtes en mode relecture.
> Ce mode n'est visible que par vous, le site public n'est pas modifié.
>
> **2. Corrigez**
>
> - Passez la souris sur un texte : un liseré rouge en pointillés apparaît.
> - **Double-cliquez dessus** : vous pouvez écrire par-dessus.
> - Cliquez ailleurs (ou `Ctrl`+`Entrée`) pour valider. Le texte corrigé
>   devient **surligné en jaune**.
> - `Échap` annule la correction en cours.
>
> **Les pop-ups de projets** : cliquez normalement (un seul clic) sur une carte
> de projet pour l'ouvrir, puis double-cliquez sur les textes à l'intérieur.
> C'est là que se trouve la majorité du texte du site.
>
> **3. Passez d'une page à l'autre**
>
> Naviguez normalement dans le menu. **Gardez `?relecture` dans l'adresse** :
> si vous le perdez, rajoutez-le. Vos corrections sont conservées d'une page
> à l'autre et même si vous fermez le navigateur.
>
> **4. Envoyez vos corrections**
>
> Quand vous avez fini, cliquez sur **« Télécharger les corrections »** dans le
> panneau noir. Un fichier `corrections-textes.json` se télécharge. **Envoyez
> simplement ce fichier**, il contient tout.
>
> ---
>
> **À savoir**
>
> - Ne touchez pas aux images ni à la mise en page : uniquement les textes.
> - Un texte qui apparaît à plusieurs endroits (menu, pied de page) : corrigez-le
>   une seule fois, il sera changé partout.
> - Le bouton « Tout effacer » remet tout à zéro : à n'utiliser qu'en cas d'erreur.
> - Si un texte refuse de s'ouvrir au double-clic, notez-le à part : c'est un cas
>   particulier que le développeur traitera à la main.

---

## Partie 2 — Côté développement

### Réinjecter les corrections

```bash
node scripts/apply-corrections.mjs corrections-textes.json
```

Par défaut le script **simule** et n'écrit rien. Lisez le rapport, puis :

```bash
node scripts/apply-corrections.mjs corrections-textes.json --write
```

Puis systématiquement :

```bash
node scripts/check-local-assets.mjs && node --check js/components.js && git diff
```

et incrémenter `?v=` de `components.js` / `globals.css` dans les pages HTML.

### Ce que le rapport indique

| Rubrique | Signification |
| --- | --- |
| Appliquées | corrections retrouvées et remplacées |
| Présents à plusieurs endroits | le même texte existait en N exemplaires — **tous** modifiés |
| Textes très courts | moins de 12 caractères : vérifier qu'aucun bout de code n'a été touché |
| À reprendre à la main | texte introuvable dans les sources, généralement une phrase coupée en deux par une balise |

**Le point de vigilance principal** est la deuxième rubrique. Exemple réel :
« Réseaux sociaux » existe 16 fois dans 5 fichiers (libellé de menu, titre de
page, titres de section). Une correction dessus les change toutes. D'où la
simulation par défaut et la relecture de `git diff` avant commit.

### Où vit le texte

| Source | Volume | Contenu |
| --- | --- | --- |
| `index.html` + `pages/*.html` | ~25 600 caractères | structure des pages, intros, mentions légales |
| `js/components.js` | ~559 chaînes, ~32 000 caractères | **toutes les études de cas** (configs `*_CASE` et gabarits de rendu) |

Le script traite les deux indifféremment : il cherche le texte par motif souple,
tolérant aux retours à la ligne du code, aux `<br>` et aux entités (`&amp;`,
`&nbsp;`), puis réécrit en respectant l'encodage trouvé sur place.

### Fichiers du système

| Fichier | Rôle |
| --- | --- |
| `js/relecture.js` | mode relecture (édition en place, mémorisation, export) |
| `js/components.js` (fin de fichier) | chargeur : n'active le mode que si `?relecture` est présent |
| `scripts/apply-corrections.mjs` | réinjection dans les sources |

Le site public ne télécharge jamais `relecture.js` : le chargeur ne l'injecte
qu'en présence du paramètre d'URL.
