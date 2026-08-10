---
name: latitude-ui
description: Reproduce reference UI accurately and make focused responsive, asset, and visual-QA corrections for Latitude Sud.
---

# Latitude UI

Use for page reproduction, UI corrections, responsive integration, asset placement, and visual QA.

## Workflow

1. Treat the supplied capture as the composition authority.
2. Identify the existing page/component, relevant CSS, and a few likely real assets before reading files in depth.
3. Make the smallest local correction; do not rebuild a page when a targeted edit is enough.
4. Compare block widths, alignment, spacing, type scale, image proportions, radii, shadows, and responsive behavior.
5. Preserve asset ratios. Use `object-fit: contain` when the full asset must remain visible; never default to `cover`.
6. For source assets, search by client/project and extension first; inspect only candidates. Reuse existing optimized assets when available.
7. Verify with a short loop: implement, render, capture, compare, correct identified differences, then stop when the criteria are met.

Do not repeat available questions, scan the full `contents` library, or run extra iterations without a specific visual discrepancy.
