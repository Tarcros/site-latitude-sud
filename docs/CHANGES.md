## 2026-07-01 — Asset organization and sticky bar disable

### Reorganization — CSS/JS/favicons/docs

- Moved `globals.css` and `style.css` into `css/` for a cleaner asset structure.
- Moved `components.js` and `Support-Latitude-Sud.js` into `js/`.
- Moved favicon files into `assets/favicons/` and updated HTML/manifest references.
- Moved `CHANGES.md` and `PROJECT_CONTEXT.md` into `docs/` to reduce root clutter.
- Disabled the sticky bottom bar by default in `components.js`; it can be re-enabled later with `initComponents(..., { stickyBar: true })`.
- Added beginner-friendly comments in `globals.css` and `components.js` for changeable site values and init options.

# Changelog — Latitude Sud v2

Journal des modifications, par session de travail. Une entrée = une session avec Claude Code.

---

## 2026-07-01 — Asset organization and sticky bar disable

### Reorganization — CSS/JS/favicons/docs

- Moved `globals.css` and `style.css` into `css/` for a cleaner asset structure.
- Moved `components.js` and `Support-Latitude-Sud.js` into `js/`.
- Moved favicon files into `assets/favicons/` and updated HTML/manifest references.
- Moved `CHANGES.md` and `PROJECT_CONTEXT.md` into `docs/` to reduce root clutter.
- Disabled the sticky bottom bar by default in `js/components.js`; it can be re-enabled later with `initComponents(..., { stickyBar: true })`.
- Added beginner-friendly comments in `css/globals.css` and `js/components.js` for changeable values and init options.
- Modifié par GitHub Copilot.

---

## 2026-07-01 — Home page (index.html)

Session consacrée entièrement à `index.html`, en deux passes : une première liste de corrections, puis une passe de retouches suite aux retours après vérification visuelle par rapport au prototype `assets/prototypes/pages/Home-Page-horizontale.png`.

### Passe 1 — Corrections initiales

- **Nav** : fond blanc 80% opacité toujours visible (`rgba(255,255,255,0.82)` + `backdrop-filter: blur(10px)`), "AGENCE DE COMMUNICATION" repassé en noir, badge logo agrandi (40px → 50px).
- **Hero** : "dans le Sud" en vert foncé `#605e32` avec le trait `trait-ls-3.svg` sous "le Sud" uniquement.
- **`.ls-accent` (global)** : couleur des mots avec trait harmonisée en `#605e32` (trait SVG distinct, plus clair).
- **Cocotier / arc "CRÉATION · STRATÉGIE · DIGITAL"** : agrandi une première fois.
- **Cartes expertises** : ratio image passé en carré (1:1 au lieu de 4:3).
- **Grenat** entre expertises et clients : supprimé.
- **Section clients** : fond `#f5eee6`, logos en deux lignes défilant en marquee (au lieu d'une grille statique).
- **CTA "Un projet en tête ?"** : nouvelle section ajoutée en bas de page.
- **Footer** : remplacement du footer "carte arrondie avec marges" par un séparateur en arc de cercle (SVG) directement raccordé au footer.
- **Barre collante en bas** : apparition au scroll (>350px) avec adresse / email / téléphone / réseaux sociaux.
- **Réseaux sociaux (barre collante)** : icônes en version cercle, fond transparent.

### Passe 2 — Corrections après vérification visuelle

- **Cartes horizontales** : vérifié que le grid 4 colonnes fonctionnait déjà correctement à largeur desktop (le rendu "vertical" observé venait d'une capture d'écran prise à une largeur d'aperçu trop étroite, pas d'un bug réel).
- **CTA repositionné** : déplacé avant la section clients, dans une forme "carte" dont le fond fusionne avec le fond de la section clients (`#f5eee6`) ; titre forcé sur une seule ligne (`white-space: nowrap`) ; image `img-bg-cta.png` recadrée pour déborder de la carte ; sur mobile (<700px) la forme disparaît et repasse au fond de la page.
- **Cocotier / arc** : réduit une seconde fois et rapproché du texte (le texte était trop éloigné de l'icône, pas "caché" par elle comme initialement décrit) ; couleur du texte fixée à `#56522d`.
- **Trait sous "marquent." / "durables."** : couleur changée en `#9fa34e` (fichier `assets/icons/ui/trait-ls.svg`).
- **Image hero** : passage à un système dynamique (`background-size: cover` + `background-position` en `clamp()` basé sur le viewport) pour garantir zéro espace blanc à n'importe quelle taille d'écran, au lieu de valeurs fixes par breakpoint.
- **Logos clients** : ajout d'un cercle noir autour de chaque logo (tentative, revert en passe 3).
- **Espacements section expertises** : plus d'air entre le titre "Des projets qui parlent et qui marquent." et la grille de cartes ; espace réduit entre le bouton "Voir tous nos projets" et la section suivante.

### Passe 3 — Alignement strict sur le prototype `Home-Page-horizontale.png`

- **Logos clients — retour en arrière** : suppression des cercles noirs ajoutés en passe 2 (erreur d'interprétation — la demande de cercle concernait uniquement les icônes réseaux sociaux). Logos remis à plat (grayscale), zone élargie (logos plus grands, plus d'espacement, wrapper étendu à 1500px).
- **Icônes réseaux sociaux en cercle** : appliquées à la nav ET au footer (elles ne l'étaient que sur la barre collante jusqu'ici) — même style contour transparent partout.
- **Espace blanc avant l'arc du footer supprimé** : la zone transparente à l'intérieur du SVG de l'arc laissait apparaître le fond crème de la page ; elle a maintenant le fond tan de la section clients (`#f5eee6`), la transition est continue.
- **CTA reconstruit en barre compacte** : abandon de la "grande carte" de la passe 2 au profit d'une pastille courte (titre + description + bouton sur une ligne), avec le livreur à moto affiché en grand à côté — copie fidèle de la disposition du prototype.
- **Affinement du filtre image** : overlay beige appliqué par défaut uniquement sur les vignettes `.video-thumb`, `.print-card-thumb`, `.social-card-thumb` et `.web-card-thumb`, avec une transition plus douce au hover pour rendre le passage plus fluide.
- **Bug réel corrigé** : `globals.css` était servi sans `charset=utf-8` dans l'en-tête HTTP du serveur de dev, ce qui cassait par intermittence l'affichage du caractère flèche (`→` s'affichait parfois `â†'`). Ajout de `@charset "UTF-8";` en première ligne du fichier — fix permanent, indépendant du serveur.

### Mise en place workflow (cette session)

- Modifié par GitHub Copilot.

- `git init` du projet (aucun dépôt existant auparavant) + `.gitignore` (`.DS_Store`, `.vscode/`, `.continue/`, `graphify-out/cache/`).
- Création de ce fichier `CHANGES.md`.

### Passe 4 — Retours après le premier commit

- **Email barre collante** : corrigé en `regis.malotaux@latitudesud.gp` (était `contact@latitudesud.com`).
- **Cartes expertises agrandies** : la grille utilisait un double padding (`.container` + `.expertises-grid`) qui rendait les cartes trop petites ; grille recentrée sur un `max-width: 980px` propre (1060px ≥1600px), cartes ~227px au lieu de ~185px.
- **Section clients élargie** : le marquee était toujours emprisonné dans `.container` (max-width 1280) malgré un `max-width` posé sur le mauvais élément ; sorti du `.container` pour occuper toute la largeur de la section (fade en bord de zone déjà en place).
- **CTA — proportions revues** : la pastille est passée de `clamp(300,40vw,560)` à `clamp(280px,28vw,430px)` pour laisser plus de place au livreur à moto, qui se rapproche ainsi davantage des proportions du prototype.
- **Pages légales (`mentions-legales.html`, `politique-de-confidentialite.html`)** : remplacement de l'arc "bulle blanche" improvisé par la vague SVG standard (identique aux autres pages) + arc cocotier ; titres `h2` recolorés en olive avec puce carrée ; encart de note redessiné (fond beige, bordure olive, icône SVG au lieu d'emoji) ; barre collante désactivée sur ces deux pages via un nouveau paramètre `initComponents(activePage, { stickyBar: false })`.
- **Cache busting** : `components.js` bumpé à `?v=4` sur toutes les pages (le fichier a changé : email, icônes sociales nav/footer, signature `initComponents`).
