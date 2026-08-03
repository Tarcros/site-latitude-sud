# 📋 Project Context — Latitude Sud v2

> **Dernière mise à jour** : 01/07/2026
> **Avancement global** : ~90%
> **Historique détaillé des modifications** : voir [CHANGES.md](CHANGES.md)
> **Suivi de version** : git initialisé le 01/07/2026 (dépôt local uniquement, pas de remote)

---

## 🗓️ Session du 01/07/2026

Home page (`index.html`) uniquement — voir le détail complet dans [CHANGES.md](CHANGES.md#2026-07-01---home-page-indexhtml).
Résumé : nav (opacité/logo), hero (couleur + trait + zoom dynamique), cocotier/arc, cartes carrées, section clients (marquee + logos élargis), nouvelle section CTA "Un projet en tête ?" (barre compacte + illustration, calée sur le prototype `Home-Page-horizontale.png`), footer en arc (sans coupure blanche), barre collante bas de page, icônes réseaux sociaux en cercle (nav + footer + barre collante), correctif d'encodage `@charset "UTF-8"` dans `globals.css`.

Session secondaire : correction d'asset paths et de logo header sur pages internes, ajout d'un effet hover beige sur les cartes, bordure arrondie du footer global, et désactivation par défaut de la barre sticky inférieure.

---

## ✅ Demandes TRAITÉES

| # | Demande | Statut |
|---|---------|--------|
| 1 | Retirer "Tout voir" du dropdown | ✅ |
| 2 | Mots .ls-accent en noir (pas vert) | ✅ |
| 3 | "Des idées ancrées" moins bold (500) | ✅ |
| 4 | Image header non zoomée + fond crème | ✅ |
| 5 | Icône cocotier en vert #7A8B6F (partout) | ✅ |
| 6 | Animation vague à l'arrivée | ✅ |
| 7 | Vague identique home sur toutes les pages | ✅ |
| 8 | "Clips" → "Productions & Motion Design" | ✅ |
| 9 | Pages légales stylisées (arc + cocotier) | ✅ |
| 10 | Logos clients grid responsive | ✅ |
| 11 | Footer amélioré (arrondi 40px + icônes contact + margin 20px) | ✅ |
| 12 | Cartes adaptatives (auto-fill, minmax) | ✅ |
| 13 | 96% clients satisfaits dans Agence | ✅ |
| 14 | Cartes nombre pair uniquement | ✅ |
| 15 | Cartes vidéo verticales (3/4) | ✅ |
| 16 | Footer arrondi visible (margin 20px) | ✅ |
| 17 | Corriger le chemin du logo du header sur pages internes | ✅ |
| 18 | Ajouter un aperçu beige sur hover des cartes | ✅ |
| 19 | Désactiver la barre sticky inférieure par défaut | ✅ |

## 🔍 Analyse du projet

**Points forts** :
- Design system cohérent (Poppins + Playfair, palette crème/olive/beige/noir)
- SEO complet (meta, OG, JSON-LD, canoniques, CSP)
- JS bien structuré (components.js : header, footer, modale, animations)
- Responsive sur toutes les pages
- Animations fluides (scroll reveal, stagger, page transition, wave)

**Points à améliorer** :
- Images externes (Unsplash) → risque de liens cassés, remplacer par locales
- Formulaire contact frontend-only → ajouter backend
- `style.css` orphelin (ancien parallax) → à supprimer ou archiver
- Pas de minification → ajouter build step
- Footer : l'arrondi nécessite un fond contrastant derrière pour être visible

## 📁 Fichiers

```
index.html, agence.html, contact.html, realisations.html,
video.html, print.html, social.html, web.html,
mentions-legales.html, politique-de-confidentialite.html
globals.css, components.js, style.css (orphelin), PROJECT_CONTEXT.md