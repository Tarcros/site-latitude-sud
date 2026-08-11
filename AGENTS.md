# Latitude Sud

@/Users/tarry/.codex/RTK.md

- Inspect existing code, styles, and relevant assets before editing.
- A supplied reference capture is the visual source of truth; do not redesign an approved composition.
- Prefer real assets; do not invent one when an applicable asset exists.
- Preserve image ratios. Do not crop, stretch, or use `cover` unless the task explicitly calls for it.
- Make the smallest change that solves the request.
- Search narrowly before reading; never load the `contents` library wholesale.
- Validate the affected result after editing, including responsive behavior when relevant.
- Keep terminal output and final reports concise unless more detail is requested.
- Keep runtime assets inside `assets/`: shared files in `assets/global/` or `assets/shared/`, and project files in `assets/projects/{photos,branding,social,catalogue}/<project>/`.
- Never delete an unused file. Move it to `to-del/` while preserving enough of its former path to restore it safely.
- Preserve the legacy redirect routes `pages/video.html`, `pages/print.html`, and `pages/web.html`.
- After moving an asset, run `node scripts/check-local-assets.mjs`; the task is not complete if it reports a missing local asset.
- After editing `js/components.js`, run `node --check js/components.js` and keep its cache version consistent across HTML pages.
- Read `docs/site-architecture.md` and `assets/README.md` before changing the project taxonomy.
