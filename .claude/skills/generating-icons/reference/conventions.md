# Icon Conventions

Derived from the 464 icons in `packages/design-system/icons/src/components/`.

## Contents

- [Canvas and root](#canvas-and-root)
- [Color](#color)
- [Outline style](#outline-style)
- [Solid style](#solid-style)
- [Grid and metrics](#grid-and-metrics)
- [Markup](#markup)
- [Naming](#naming)
- [Special families](#special-families)
- [Legacy patterns not to copy](#legacy-patterns-not-to-copy)

## Canvas and root

| Attribute | Value |
| --- | --- |
| `width` / `height` | `15` (447 of 464 icons) |
| `viewBox` | `0 0 15 15` |
| root `fill` | `none` (every icon) |

20x20 is used only by brand tiles (`stripe`, `paypal`, `slack`). Other sizes are Figma export accidents.

## Color

- Source SVGs use `#18181B`. The pipeline replaces that exact string with `{color}` (default `currentColor`).
- Icons are single-color. Never use opacity for a second tone in a regular icon.
- `fill="#fff"` appears only inside `<clipPath>` or as the glyph on a colored badge/brand tile.

## Outline style

Default style, no suffix.

```svg
<path stroke="#18181B" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="..."/>
```

- `stroke-width="1.5"`, round caps, round joins: 335 / 329 / 329 occurrences. No dashes, no miter.
- No fill on stroked shapes. Shapes are open or closed centerlines.
- Fill is allowed only for details too small to stroke:
  - dots: circle of r `0.889` (calendar days, tag hole is r `1.111`), ellipsis dots r `1.194`
  - solid triangles/carets (`triangle-down-mini`, `chevron-up-down`)
- One stroke weight per icon. The single exception is a punctuation dot drawn as a `0.9` stroke (`exclamation-circle`); prefer a filled dot.
- Keep at least ~1.3 of clear space between open parallel strokes (centerlines >= 2.8 apart) so they don't merge at 15px.
- A closed counter (the hole inside an enclosed shape) needs >= 2 of clear space in both directions (centerlines >= 3.5 apart). Below that it closes up at real size and the outline icon reads as solid. Leave the shape open, merge it into its neighbor, or drop the detail (`bell-alert` has no clapper outline, `trash` bars are open lines).
- An outline icon only stays an outline if nothing fills it. `fill-current` or `[&_path]:fill-*` at a usage site fills every stroked path.

## Solid style

Suffix `-solid`. 97 icons, 50 with an outline twin.

```svg
<path fill="#18181B" d="..."/>
```

- Fill only, no strokes. Same silhouette and footprint as the outline twin, grown to the stroke's outer edge.
- Inner details are knocked out as negative space, either as a hole in the same path with `fill-rule="evenodd" clip-rule="evenodd"`, or by splitting the shape into separate paths with a gap (`envelope-solid`: flap and body are two paths).
- Knocked-out lines and standalone bars are `1.333` thick with fully rounded ends (radius `0.667`), e.g. the check in `check-circle-solid`, the base in `bell-alert-solid`.
- Gaps between separate solid parts are ~`0.9-1.3`.
- Container corner radius `2.444`.
- A ring plus filled core (`circle-half-solid`, progress circles) is the only solid family that keeps a stroke (`1.333`).

## Grid and metrics

Icons are drawn on an 18-unit grid scaled by 8/9 and centered on `7.5, 7.5`. One unit `u = 0.889`. Coordinates snap to quarter units: `7.5 ± n × 0.222`.

Snap values (mirror around 7.5):

```
0.389  1.056  1.278  1.944  2.167  2.833  3.278  3.722  4.167  4.611
5.056  5.5    5.944  6.389  6.611  7.056  7.5
7.944  8.389  8.611  9.056  9.5    9.944  10.389 10.833 11.278 11.722
12.167 12.833 13.056 13.722 13.944 14.611
```

| Metric | Value | Seen in |
| --- | --- | --- |
| Outline centerline limit | `1.056` to `13.944` | circle r `6.444` (`check-circle`), `envelope`, `credit-card` |
| Inset centerline for arrows, chevrons, narrow bodies | `1.944` to `13.056` | `arrow-down`, `chevron-down`, `trash` lid, `document-text` |
| Solid outer edge | `0.389` to `14.611` | circle r `7.111` (`circle-solid`), `envelope-solid` |
| Outline container corner radius | `1.778` (2u) | `envelope`, `credit-card`, `trash` body |
| Small part corner radius | `0.889` (1u) | `trash` handle, `document-text` fold |
| Arrowhead | legs span `3.778` each way from the tip | `arrow-down`: `M11.278 9.278 7.5 13.056 3.722 9.278` |
| Chevron | `5.556` half-width, `5.555` rise | `chevron-down`: `M13.056 5.278 7.5 10.833 1.944 5.278` |
| Magnifier lens | r `4.444` | `magnifying-glass` |
| Inner detail lines | length `2.667-4`, spaced `3.111` apart | `trash` bars, `credit-card` |

- Balance optically: the painted area should fill roughly the same box as its siblings. Wide shapes use the full `1.056-13.944` width and less height (`envelope`: y `2.389-12.611`).
- Center the glyph on `7.5, 7.5` unless the shape is deliberately asymmetric.
- Simple geometric glyphs may use plain quarter-pixel coordinates instead (`plus`: `M7.5 2.5v10M2.5 7.5h10`; `x-mark`: `3.75` to `11.25`).

## Markup

- Use `<path>` for everything (888 paths vs 63 circles, 20 rects). `<circle>` is fine for plain dots and rings.
- Combine subpaths that share attributes into one `d`. SVGO hoists shared attributes onto a `<g>` when there are several paths.
- Max 3 decimals.
- No `transform`, `style`, `class`, `id` (outside `<defs>`), `<text>`, `<image>`, masks, or filters in regular icons.
- Do not add `<g clip-path>` + `<defs><clipPath>` wrappers. They appear in 170 icons as Figma export artifacts and will come back on their own after a Figma sync.
- Output path data may differ from older icons in command style (`m` vs `M`); the geometry is what matters.

## Naming

File name = Figma component name = kebab-case. Component name is its PascalCase (`chat-bubble-left-right` exports `ChatBubbleLeftRight`).

Order: `<object>[-<modifier>][-<direction>][-mini][-solid]`

| Part | Examples |
| --- | --- |
| object, Heroicons-style | `archive-box`, `shopping-cart`, `magnifying-glass`, `x-mark` |
| modifier | `-plus`, `-minus`, `-check`, `-circle`, `-sparkle`, `-slash`, `-stack` |
| direction | `-up`, `-down`, `-left`, `-right`, `-up-right`, `-diagonal` |
| `-solid` | filled variant, always last (`check-circle-mini-solid`) |
| `-mini` | legacy, see below |
| `-ex` | monochrome, themeable version of a brand logo (`javascript-ex`, `klarna-ex`) |
| `-badge` | multi-color badge (`verified-badge`) |
| `-illustration` | multi-color illustration (`folder-illustration`) |

Check the family before naming: both `check-circle` and `circle-check` style names exist; follow the nearest sibling (`circle-plus`, `circle-minus-solid`, `circle-xmark-solid` are the newer form).

## Special families

Use these only when the request is explicitly for one.

**Brands** (`--fixed`): original brand colors, no `#18181B`, props type omits `color`. Either a bare logo on the 15x15 canvas (`apple`, `vercel`) or a 20x20 colored tile with a white glyph and a white-to-transparent `linearGradient` overlay at `fill-opacity="0.2"` (`stripe`). A themeable brand glyph is named `<brand>-ex` and emitted without `--fixed`.

**Badges** (`--multicolor`): colored shape + the same shape with a white vertical `linearGradient` at `fill-opacity="0.2"` + a `#18181B` inner border `stroke-width="0.5" stroke-opacity="0.24"` + white glyph in the standard 1.5 round stroke. Copy `verified-badge`.

**Status dots** (`ellipse-<color>-solid`, `square-<color>-solid`): white 10x10 base with a drop-shadow filter and a Tailwind-500 colored core (`#3B82F6`, `#10B981`, `#F97316`, `#8B5CF6`, `#F43F5E`). Copy an existing one and change the color.

## Legacy patterns not to copy

- **Outline icons expanded to fills** (38 icons: `calendar`, `tag`, `bell-alert`, `folder`): strokes converted to `fill` + `evenodd`. They look identical to stroked icons; new icons keep live strokes.
- **`-mini`** (34 icons): same 15x15 canvas and 1.5 stroke as the base icon, often byte-identical paths (`plus` / `plus-mini`, `user` / `user-mini`). Only create one when asked, and then reuse the base geometry.
- **Odd sizes** (8-16px roots), names with spaces (`draft orders`), `WIP`, and stroke widths `0.2`-`0.75` outside badges.
- **Nested clipPaths** (`chevron-down-mini`).
