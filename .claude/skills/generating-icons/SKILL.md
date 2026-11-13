---
name: generating-icons
description: Draws new icons for @medusajs/icons (packages/design-system/icons) that match the existing set, then emits the React component, smoke test, and index export into src/custom in the exact generated format. Covers the 15x15 canvas, 1.5 round stroke outline style, fill-only solid variants, the #18181B themeable color, grid and sizing metrics, naming suffixes (-solid, -mini, -ex, -badge), and fixed-color brand icons. Use when asked to add, create, draw, design, or generate an icon, add a solid or outline variant of an existing icon, or convert an SVG into a Medusa icon component.
---

# Generating Medusa Icons

Draws an SVG that matches the existing icon set, validates it, and converts it with the same SVGR pipeline as `yarn generate`.

## Constraints

> **CRITICAL:** Icons from this skill go in `src/custom/`, never `src/components/`. `yarn generate` deletes `src/components/` and rebuilds it from Figma; `src/custom/` is untouched by it.

- **Never hand-write the `.tsx`:** write an SVG, then run `icon.mjs emit`. The script writes the component, the spec, and `index.ts` in `src/custom/`.
- **Names are unique across both directories:** `emit` refuses a name Figma already exports. If Figma later adds an icon with the same name, the build fails on the duplicate export: delete the `src/custom/` copy, its spec, and its line in `src/custom/index.ts`.
- **`#18181B` is the only themeable color:** uppercase, exactly. It becomes `{color}`. `currentColor` and any other hex stay hardcoded.
- **Outline is the default style:** live strokes, `stroke-width="1.5"`, `stroke-linecap="round"`, `stroke-linejoin="round"`, no fill.
- **Solid is fill-only:** `-solid` icons use `fill="#18181B"` shapes, no strokes.
- **Canvas is 15x15:** `width="15" height="15" viewBox="0 0 15 15" fill="none"` on the root.
- **Style is decided by the markup, not by how a usage site renders it:** an icon whose paths are `stroke` only is an outline. If it looks filled in the app, the call site is forcing a fill (see step 9). Never describe an icon as outline or solid without checking both the SVG and the rendered usage.
- **Study siblings first:** export 2-3 related existing icons and reuse their metrics instead of inventing proportions.

## CRITICAL: Load the Reference First

**Before drawing any path, MUST load `reference/conventions.md`.** It has the grid, the exact coordinates the set snaps to, solid-variant rules, naming, and the exceptions (badges, brands, illustrations).

## Workflow

Run commands from the repo root. `ICON=.claude/skills/generating-icons/scripts/icon.mjs`.

1. **Name it.** kebab-case, following the suffix rules in the reference. Check `packages/design-system/icons/src/components/` and `src/custom/` for an existing icon or a sibling family.
2. **Export siblings** as SVG to study their geometry (the outline twin when drawing a solid, the same family otherwise):
   ```bash
   node $ICON export trash
   node $ICON export envelope-solid --out=<scratch>/envelope-solid.svg
   ```
3. **Write the SVG** to `<scratch>/<icon-name>.svg`. The file name becomes the component name.
   ```svg
   <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
     <path stroke="#18181B" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7.5 13.056V1.944M11.278 9.278 7.5 13.056 3.722 9.278"/>
   </svg>
   ```
4. **Validate.** Fix every error; a warning needs a reason from the reference's exceptions.
   ```bash
   node $ICON check <scratch>/<icon-name>.svg
   ```
5. **Preview next to siblings**, at 8x and at real size, then look at the PNG. Compare stroke weight, optical size, padding, and corner radii. Iterate on the SVG until it is indistinguishable in style.
   ```bash
   node $ICON sheet <scratch>/sheet.svg <scratch>/<icon-name>.svg trash envelope archive-box
   qlmanage -t -s 1200 -o <scratch> <scratch>/sheet.svg   # macOS, writes sheet.svg.png
   ```
6. **Emit** the component, spec, and index entry:
   ```bash
   node $ICON emit <scratch>/<icon-name>.svg
   ```
   Flags: `--fixed` (brand icon, keeps its colors, no `color` prop), `--multicolor` (badge/illustration mixing `#18181B` with fixed colors), `--force` (overwrite).
7. **Test:** `cd packages/design-system/icons && yarn test src/custom/__tests__/<icon-name>.spec.tsx`
8. **Changeset:** `"@medusajs/icons": patch`.
9. **Wire it in, if the task includes a usage site.** Color an icon only through `text-ui-fg-*` (or the `color` prop).
   - Remove any fill override on the element or its ancestors: `fill-current`, `[&_path]:fill-*`, `fill-ui-*`, `fill="..."`. They fill every open stroked path and turn an outline icon into a solid blob.
   - When swapping one icon for another, re-read the old icon's `className`. Overrides written for a brand or solid icon (e.g. `<Medusa className="[&_path]:fill-current" />`) must not carry over.
   - Grep the call site: `rg "fill-" <file>`.
10. **Report:** state the style you actually shipped (outline or solid), give the user the source SVG so design can add it to Figma, and mention any call-site class you removed.

## Common Mistakes

- [ ] Writing or editing a `.tsx`, spec, or `index.ts` by hand
- [ ] Emitting into `src/components/` (wiped by `yarn generate`)
- [ ] Using `currentColor`, lowercase `#18181b`, or black instead of `#18181B`
- [ ] Butt caps or miter joins, or a stroke width other than 1.5
- [ ] Mixing strokes into a `-solid` icon, or expanding strokes to fills in an outline icon
- [ ] Strokes touching the canvas edge (centerlines stay within 1.056-13.944)
- [ ] `transform`, `style`, `class`, `<text>`, or `<image>` in the SVG
- [ ] Adding Figma clipPath wrappers by hand
- [ ] Creating a new `-mini` twin that duplicates the base icon
- [ ] Skipping the side-by-side preview, or judging only the 8x cell and not the real-size one
- [ ] Leaving `fill-current` / `[&_path]:fill-*` on the usage site of an outline icon
- [ ] Closed counters too small to read at 15px (they close up and the icon looks solid)
