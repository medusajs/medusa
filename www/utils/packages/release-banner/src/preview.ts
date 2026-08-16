import { mkdir, writeFile } from "node:fs/promises"
import { resolve } from "node:path"

import { normalizeVersion, renderPng } from "./render.js"

const REFERENCE_VERSION = "v2.13.0"
const REFERENCE_URL =
  "https://gh-release-images.s3.eu-north-1.amazonaws.com/v-2-13-0.jpg"

/**
 * A short version and two longer ones — enough to see that the pill sizes
 * correctly around whatever the version string turns out to be. The reference is
 * rendered on top of these, always.
 */
export const PREVIEW_VERSIONS = ["v2.9.0", "v2.19.0", "v2.100.0"]

const STYLES = `
  :root { color-scheme: dark }
  body {
    margin: 0; padding: 48px; background: #0c0c0e; color: #e4e4e7;
    font: 15px/1.6 ui-sans-serif, system-ui, sans-serif;
  }
  main { max-width: 1200px; margin: 0 auto }
  h1 { font-size: 22px; margin: 0 0 4px }
  h2 { font-size: 16px; margin: 48px 0 12px; font-weight: 600 }
  p { color: #a1a1aa; margin: 0 0 8px }
  img { display: block; width: 100%; border-radius: 10px }
  figure { margin: 0 0 24px }
  figcaption {
    font: 12px ui-monospace, monospace; color: #a1a1aa;
    margin-bottom: 8px; letter-spacing: .04em; text-transform: uppercase;
  }
  .grid { display: grid; gap: 20px; grid-template-columns: 1fr 1fr }
  .diff { position: relative; border-radius: 10px; overflow: hidden;
          background: #000 }
  .diff img { position: absolute; inset: 0; height: 100% }
  /* Stacked and multiplied, so any misalignment glows. */
  .diff img + img { mix-blend-mode: difference }
  .diff::after { content: ""; display: block; padding-top: 52.25% }
  .boost { filter: brightness(6) }
  label { display: inline-flex; gap: 8px; align-items: center;
          color: #a1a1aa; font-size: 13px }
`

const SCRIPT = `
  const boost = document.querySelector("#boost")
  const diff = document.querySelector(".diff")
  boost.addEventListener("change", () =>
    diff.classList.toggle("boost", boost.checked))
`

function figure(caption: string, src: string): string {
  return (
    `<figure><figcaption>${caption}</figcaption>` +
    `<img src="${src}" alt="${caption}"></figure>`
  )
}

function page(rendered: { version: string; file: string }[]): string {
  const others = rendered
    .filter(({ version }) => version !== REFERENCE_VERSION)
    .map(({ version, file }) => figure(version, file))
    .join("\n    ")

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Release banner preview</title>
  <style>${STYLES}</style>
</head>
<body>
  <main>
    <h1>Release banner preview</h1>
    <p>Rendered with satori and resvg. The reference is the ${REFERENCE_VERSION}
      banner used in the release notes.</p>

    <h2>Reference vs generated (${REFERENCE_VERSION})</h2>
    <div class="grid">
      ${figure("reference", REFERENCE_URL)}
      ${figure("generated", `${REFERENCE_VERSION}.png`)}
    </div>

    <h2>Difference overlay</h2>
    <p>Black means identical.
      <label><input type="checkbox" id="boost"> amplify 6&times;</label></p>
    <div class="diff">
      <img src="${REFERENCE_URL}" alt="reference">
      <img src="${REFERENCE_VERSION}.png" alt="generated">
    </div>

    <h2>Other versions</h2>
    ${others}
  </main>
  <script>${SCRIPT}</script>
</body>
</html>
`
}

/**
 * Renders a spread of versions and writes an HTML page for eyeballing them,
 * including a side-by-side and a difference overlay against the reference.
 *
 * @param versions Versions to render *alongside* the reference, which is always
 *   included — the comparison at the top of the page is the point of it, and it
 *   renders as a broken image if that banner is missing.
 * @returns Path to the written page.
 */
export async function writePreview({
  outDir,
  versions = PREVIEW_VERSIONS,
  onRender,
}: {
  outDir: string
  versions?: string[]
  onRender?: (file: string) => void
}): Promise<string> {
  await mkdir(outDir, { recursive: true })

  const rendered: { version: string; file: string }[] = []
  const queue = new Set(
    [REFERENCE_VERSION, ...versions].map((version) => normalizeVersion(version))
  )

  for (const version of queue) {
    const file = `${version}.png`

    await writeFile(resolve(outDir, file), await renderPng({ version }))

    rendered.push({ version, file })
    onRender?.(file)
  }

  const out = resolve(outDir, "preview.html")

  await writeFile(out, page(rendered))

  return out
}
