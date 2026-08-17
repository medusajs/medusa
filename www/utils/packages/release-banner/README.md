# release-banner

Generates the banner images used around Medusa releases and the Cloud changelog.
Two types are supported:

| Type | What it is |
| --- | --- |
| `release` | The banner embedded in the CMS block of a GitHub release's notes — the dark pill holding the Medusa logomark and the version, as used on [v2.13.0](https://github.com/medusajs/medusa/releases/tag/v2.13.0). |
| `cloud-changelog` | The banner heading an entry in the Medusa Cloud changelog — a pill holding the logomark, the Cloud wordmark and the entry's date. |

Banners are rendered with [satori](https://github.com/vercel/satori) (element
tree → SVG) and [resvg](https://github.com/yisibl/resvg-js) (SVG → PNG). Neither
needs a browser, so a render is a plain `node` step that takes well under a
second — the four banners the release preview produces take about 0.6s in total.

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

# A Cloud changelog banner
node dist/cli.js render --type cloud-changelog --date "Aug 17"
```

Every command takes `--type <release | cloud-changelog>`, defaulting to
`release`.

### `render`

| Flag | Description |
| --- | --- |
| `--type <type>` | Banner type. Defaults to `release`. |
| `-v, --version <version>` | `release`: version to render, with or without the `v` prefix. Required. |
| `-d, --date <date>` | `cloud-changelog`: date shown after the wordmark, rendered exactly as given. Required. |
| `-o, --out <path>` | Output file. Defaults to `out/<label>.png` — the version, or the date slugified. |
| `-f, --format <format>` | `png` or `svg`. Inferred from `--out` when it ends in `.svg`. |
| `-w, --width <px>` | Canvas width. Defaults to the type's reference width; the height and every dimension in the spec scale with it. |
| `--font-size <px>` | Override the main text size — the version, or the Cloud wordmark. |
| `--gap <px>` | Override the space between the logomark and the text. |

### `preview`

```bash
yarn preview
yarn preview --type cloud-changelog
```

Renders the type's default spread and writes a page to review it on. For
`release` — which reproduces an existing banner — the page also puts the
generated `v2.13.0` next to the original, plus a difference overlay where black
means identical and an amplify toggle brings out the small stuff.

Pass values to render them alongside the default spread — versions for
`release`, dates for `cloud-changelog`:

```bash
yarn preview v2.20.0 v3.0.0
```

For `release`, the reference version is rendered whatever you pass, since the
comparison at the top of the page needs it. `cloud-changelog` has no hosted
reference to compare against, so its page is the grid alone.

| Flag | Description |
| --- | --- |
| `--type <type>` | Banner type. Defaults to `release`. |
| `-o, --out-dir <path>` | Output directory. Defaults to `out`. |
| `--no-open` | Write the page without opening it. Also skipped when `CI` is set. |

### `upload`

Renders a banner and uploads it to the type's folder in Cloudinary, printing the
delivery URL — the only thing it writes to stdout, so a caller can read it
straight off:

```bash
node dist/cli.js upload --version 2.19.0
# https://res.cloudinary.com/<cloud>/image/upload/v.../Releases/v2-19-0-6df68c.png
```

| Flag | Description |
| --- | --- |
| `--type <type>` | Banner type. Defaults to `release`. |
| `-v, --version <version>` | `release`: version to render and upload. Required. |
| `-d, --date <date>` | `cloud-changelog`: date to render. Required. |
| `--folder <folder>` | Cloudinary folder. Defaults to the type's own: `Releases` or `Cloud Changelog`. |
| `--dry-run` | Render and report the target public ID without uploading. |

Credentials come from the environment — either `CLOUDINARY_URL`, which is the
SDK's own convention and keeps this to a single secret, or all three of
`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET`.

For local runs the CLI reads a `.env` in the working directory, which is
gitignored:

```bash
# www/utils/packages/release-banner/.env
CLOUDINARY_URL=cloudinary://<key>:<secret>@<cloud>
```

A variable that is already set always wins, so this changes nothing in CI, where
the credentials arrive as real environment variables. Nothing else in the package
reads `.env` — importing it as a library leaves your process environment alone.

Public IDs are slugified and then given a **random six-character suffix**:
`v2.19.0` uploads as `Releases/v2-19-0-6df68c`. Slugifying is what makes the ID
safe — Cloudinary reads the segment after a public ID's last dot as the file
format, so `v2.19.0` would otherwise deliver as `v2.19` in a `0` format, and
dashes match the banners uploaded by hand before this was automated.

The suffix means **every upload gets its own URL**. A URL that has been published
therefore keeps showing the image it showed when it was published, since nothing
later can be uploaded over it. The trade-off is that re-running for the same
version no longer updates the asset in place — it adds another one, and the
previous one stays in the media library until someone clears it out.

`--dry-run` draws a fresh suffix like any other run, so it reports the shape of
the target rather than the ID a real upload would land on.

## Programmatic use

```ts
import { renderPng } from "release-banner"

const release = await renderPng({ type: "release", version: "v2.19.0" })
const changelog = await renderPng({
  type: "cloud-changelog",
  date: "Aug 17",
})
```

`renderSvg` returns the intermediate SVG, and both accept a partial `spec` to
override any measurement for a single render. The input is a union discriminated
by `type`, so the fields and the spec each type accepts are checked at the call
site.

## In the Draft Release workflow

[`.github/workflows/draft-release.yml`](../../../../.github/workflows/draft-release.yml)
renders and uploads the release banner, then inserts it into the notes:

1. `upload` runs **before** the Claude step, so a misconfigured upload surfaces
   before spending a Claude run. It needs the `CLOUDINARY_URL` repository secret.
   Each run uploads a new asset, so re-running the workflow for a version leaves
   the earlier banner behind in Cloudinary.
2. After Claude writes the notes, a step splices `![<tag>](<url>)` into the CMS
   block, above the title heading — matching where the v2.13.0 banner sits. The
   banner is consumed by the CMS and never renders on the release page itself.

The upload step is `continue-on-error` and warns rather than failing: the notes
are the deliverable and the banner is decoration, so a Cloudinary outage should
not block a release. When it is skipped, the insertion step is skipped too and the
notes go out unchanged. Flip `continue-on-error` to `false` if a missing banner
should fail the run instead.

## Adding or changing a banner type

Each type lives in its own directory under [`src/banners`](./src/banners) and is
described by one `BannerDefinition`:

```
src/banners/<type>/
  spec.ts      # the spec's shape, and its default values
  template.ts  # the input type, and the element tree built from it
  index.ts     # the definition: spec, folder, publicId, label, preview inputs
```

Register the definition in [`src/banners/index.ts`](./src/banners/index.ts) and
that is it — the renderer, the preview page, the uploader and the CLI all read
the type off the registry. The CLI is the one place that maps flags to a type's
input, in `inputFrom`.

A type's public ID is whatever its definition says identifies one banner: the
version for `release`, the date for `cloud-changelog`. Dates without a year
collide a year apart, so pass one that carries the year when two entries must not
overwrite each other.

## Editing the design

A type's `spec.ts` holds every measurement — canvas size, geometry, gradients,
type size, and the sheen on the logomark and text. The numbers are in pixels at
the design's reference resolution and are scaled proportionally when `width`
differs, so the spec is the only place to touch when a design changes.

The release spec was derived by sampling the v2.13.0 banner rather than by eye,
and matches it to within 1–2px on pill geometry, padding, logomark size, type
size, and gradient colours. Against the original the render measures an RMSE of
10.1/255, with 0.47% of pixels differing by more than 24/255 — all of it 1px
antialiasing along glyph edges.

Satori supports a subset of CSS, which shapes how the templates are written:

- **Flexbox only.** No grid, no absolute positioning tricks; every container
  needs an explicit `display: flex`.
- **The release rim is a nested element, not a border.** Satori has no
  `border-image`, so the gradient rim is an outer element whose gradient
  background is exposed by `borderWidth` worth of padding around the inner
  surface.
- **The logomark is an `<img>` holding an SVG data URI**, since that is how
  satori takes SVG. Its gradient lives inside that SVG.
- **Type does not auto-shrink.** Anything variable makes its container wider
  rather than shrinking to fit — both pills size around their contents.
- **Shadow spread cannot be negative.** Satori draws spread as a stroke around
  the shadow's shape, so a negative one emits a negative `stroke-width` that
  panics resvg. The Cloud banner clamps it at zero and pulls the blur in to
  compensate.

## Fonts

Inter and Roboto Mono — the Cloud banner sets its date in mono — are read from
`packages/admin/dashboard/src/assets/fonts`, found by walking up to the monorepo
root. Nothing is downloaded at render time and there is no second copy of either
typeface to keep in step. System fonts are disabled in resvg so output cannot
drift between a laptop and CI.

Only the files listed in [`src/fonts.ts`](./src/fonts.ts) are loaded — both
families at weights 400 and 500. A design asking for anything else needs the file
added there first. Every loaded font goes to satori together and is picked by
`fontFamily`, so a template only names the one it wants.

## Known deviations from the references

The two `.` separators sit a little tighter against the following digit in the
original than Inter's default metrics produce — around 20px at 3200px wide.
Overall text width, type size, and every other measurement match, and the
difference is only visible in an amplified diff. The original was most likely
kerned by hand in the design tool.

The Cloud banner matches the approved design to an RMSE of 3.63/255, with 0.14%
of pixels differing by more than 24/255 — all of it in the top half of the pill,
where the browser's inset highlight and the gradient it sits on rasterise a hair
differently in satori.
