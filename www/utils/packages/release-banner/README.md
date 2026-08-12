# release-banner

Generates the banner image embedded in the CMS block of a GitHub release's notes —
the dark pill holding the Medusa logomark and the version, as used on
[v2.13.0](https://github.com/medusajs/medusa/releases/tag/v2.13.0).

The banner is rendered with [satori](https://github.com/vercel/satori) (element
tree → SVG) and [resvg](https://github.com/yisibl/resvg-js) (SVG → PNG). Neither
needs a browser, so a render is a plain `node` step that takes well under a
second — the four banners the preview produces take about 0.6s in total.

## Usage

```bash
cd www/utils
yarn install
yarn workspace release-banner build
```

Then, from `www/utils/packages/release-banner`:

```bash
# Render to out/v2.19.0.png
yarn render --version 2.19.0

# Or straight from dist
node dist/cli.js render --version 2.19.0 --width 1600 --out /tmp/banner.png
```

### `render`

| Flag | Description |
| --- | --- |
| `-v, --version <version>` | Version to render, with or without the `v` prefix. Required. |
| `-o, --out <path>` | Output file. Defaults to `out/<version>.png`. |
| `-f, --format <format>` | `png` or `svg`. Inferred from `--out` when it ends in `.svg`. |
| `-w, --width <px>` | Canvas width. Defaults to 3200; the height and every dimension in the spec scale with it. |
| `--font-size <px>` | Override the version text size. |
| `--gap <px>` | Override the space between the logomark and the version text. |

### `preview`

```bash
yarn preview
```

Renders a spread of versions, writes a page that puts the generated `v2.13.0`
next to the original — plus a difference overlay, where black means identical and
an amplify toggle brings out the small stuff — and opens it.

Pass versions to render them alongside the default spread:

```bash
yarn preview v2.20.0 v3.0.0
```

The reference version is always rendered, since the comparison at the top of the
page needs it.

| Flag | Description |
| --- | --- |
| `-o, --out-dir <path>` | Output directory. Defaults to `out`. |
| `--no-open` | Write the page without opening it. Also skipped when `CI` is set. |

### `upload`

Renders a banner and uploads it to the `Releases` folder in Cloudinary, printing
the delivery URL — the only thing it writes to stdout, so a caller can read it
straight off:

```bash
node dist/cli.js upload --version 2.19.0
# https://res.cloudinary.com/<cloud>/image/upload/v.../Releases/v2-19-0.png
```

| Flag | Description |
| --- | --- |
| `-v, --version <version>` | Version to render and upload. Required. |
| `--folder <folder>` | Cloudinary folder. Defaults to `Releases`. |
| `--dry-run` | Render and report the target public ID without uploading. |

Credentials come from the environment — either `CLOUDINARY_URL`, which is the
SDK's own convention and keeps this to a single secret, or all three of
`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET`.

The public ID is the version with dots replaced by dashes — `v2.19.0` becomes
`Releases/v2-19-0`. Cloudinary reads the segment after a public ID's last dot as
the file format, so `v2.19.0` would otherwise deliver as `v2.19` in a `0` format.
Dashes also match the banners uploaded by hand before this was automated.

Re-running for the same version **overwrites in place**, so regenerating a draft
updates the existing image instead of piling up variants, and invalidates the CDN
copy so the new one is actually served.

## Programmatic use

```ts
import { renderPng } from "release-banner"

const png = await renderPng({ version: "v2.19.0" })
```

`renderSvg` returns the intermediate SVG, and both accept a partial `spec` to
override any measurement for a single render.

## In the Draft Release workflow

[`.github/workflows/draft-release.yml`](../../../../.github/workflows/draft-release.yml)
renders and uploads the banner, then inserts it into the notes:

1. `upload` runs **before** the Claude step, so a misconfigured upload surfaces
   before spending a Claude run. It needs the `CLOUDINARY_URL` repository secret.
2. After Claude writes the notes, a step splices `![<tag>](<url>)` into the CMS
   block, above the title heading — matching where the v2.13.0 banner sits. The
   banner is consumed by the CMS and never renders on the release page itself.

The upload step is `continue-on-error` and warns rather than failing: the notes
are the deliverable and the banner is decoration, so a Cloudinary outage should
not block a release. When it is skipped, the insertion step is skipped too and the
notes go out unchanged. Flip `continue-on-error` to `false` if a missing banner
should fail the run instead.

## Editing the design

[`src/spec.ts`](./src/spec.ts) holds every measurement — canvas size, the pill's
geometry and gradients, the rim, type size, and the sheen on the logomark and
text. The numbers are in pixels at the reference resolution of 3200×1672 and are
scaled proportionally when `width` differs, so the spec is the only place to
touch when the design changes.

The spec was derived by sampling the v2.13.0 banner rather than by eye, and
matches it to within 1–2px on pill geometry, padding, logomark size, type size,
and gradient colours. Against the original the render measures an RMSE of
10.1/255, with 0.47% of pixels differing by more than 24/255 — all of it 1px
antialiasing along glyph edges.

Two implementation notes, both consequences of satori supporting a subset of CSS:

- **The rim is a nested element, not a border.** Satori has no `border-image`, so
  the gradient rim is an outer element whose gradient background is exposed by
  `borderWidth` worth of padding around the inner surface.
- **The logomark is an `<img>` holding an SVG data URI**, since that is how
  satori takes SVG. Its gradient lives inside that SVG.

## Fonts

Inter is read from `packages/admin/dashboard/src/assets/fonts`, found by walking
up to the monorepo root. Nothing is downloaded at render time and there is no
second copy of the typeface to keep in step. System fonts are disabled in resvg
so output cannot drift between a laptop and CI.

## Known deviation from the reference

The two `.` separators sit a little tighter against the following digit in the
original than Inter's default metrics produce — around 20px at 3200px wide.
Overall text width, type size, and every other measurement match, and the
difference is only visible in an amplified diff. The original was most likely
kerned by hand in the design tool.
