import { mkdir, writeFile } from "node:fs/promises"
import { resolve } from "node:path"

import { bannerOf, type BannerInput, type BannerType } from "./banners/index.js"
import { renderPng } from "./render.js"

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
  .boost { filter: brightness(6) }
  label { display: inline-flex; gap: 8px; align-items: center;
          color: #a1a1aa; font-size: 13px }
`

const SCRIPT = `
  const boost = document.querySelector("#boost")
  const diff = document.querySelector(".diff")
  boost?.addEventListener("change", () =>
    diff.classList.toggle("boost", boost.checked))
`

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function figure(caption: string, src: string): string {
  const safe = escapeHtml(caption)

  return (
    `<figure><figcaption>${safe}</figcaption>` +
    `<img src="${escapeHtml(src)}" alt="${safe}"></figure>`
  )
}

type Rendered = { caption: string; file: string }

/**
 * Builds the review page.
 *
 * The reference comparison is only rendered for types whose design reproduces
 * an existing banner; the rest get the grid alone.
 */
function page({
  type,
  reference,
  rendered,
}: {
  type: BannerType
  reference?: { url: string; caption: string; file: string }
  rendered: Rendered[]
}): string {
  const others = rendered
    .filter(({ file }) => file !== reference?.file)
    .map(({ caption, file }) => figure(caption, file))
    .join("\n    ")

  const comparison = reference
    ? `<h2>Reference vs generated (${escapeHtml(reference.caption)})</h2>
    <div class="grid">
      ${figure("reference", reference.url)}
      ${figure("generated", reference.file)}
    </div>

    <h2>Difference overlay</h2>
    <p>Black means identical.
      <label><input type="checkbox" id="boost"> amplify 6&times;</label></p>
    <div class="diff">
      <img src="${escapeHtml(reference.url)}" alt="reference">
      <img src="${escapeHtml(reference.file)}" alt="generated">
    </div>

    <h2>Other banners</h2>`
    : `<h2>Banners</h2>`

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${type} banner preview</title>
  <style>${STYLES}</style>
</head>
<body>
  <main>
    <h1>${escapeHtml(type)} banner preview</h1>
    <p>Rendered with satori and resvg.</p>

    ${comparison}
    ${others}
  </main>
  <script>${SCRIPT}</script>
</body>
</html>
`
}

/**
 * Renders a spread of banners of one type and writes an HTML page for eyeballing
 * them, including a side-by-side and a difference overlay for types that have a
 * reference banner to reproduce.
 *
 * @param inputs Banners to render *alongside* the reference, which is always
 *   included when the type has one — the comparison at the top of the page is
 *   the point of it, and it renders as a broken image if that banner is missing.
 * @returns Path to the written page.
 */
export async function writePreview({
  type,
  outDir,
  inputs,
  onRender,
}: {
  type: BannerType
  outDir: string
  inputs?: BannerInput[]
  onRender?: (file: string) => void
}): Promise<string> {
  await mkdir(outDir, { recursive: true })

  const definition = bannerOf(type)
  const { reference } = definition.preview
  const queue = [
    ...(reference ? [reference.input as BannerInput] : []),
    ...(inputs?.length ? inputs : (definition.preview.inputs as BannerInput[])),
  ]

  const rendered: Rendered[] = []
  const seen = new Set<string>()

  for (const input of queue) {
    const normalized = definition.normalize(input)
    const caption = definition.label(normalized)
    const file = `${caption}.png`

    if (seen.has(file)) {
      continue
    }

    seen.add(file)

    await writeFile(resolve(outDir, file), await renderPng(input))

    rendered.push({ caption, file })
    onRender?.(file)
  }

  const out = resolve(outDir, "preview.html")

  await writeFile(
    out,
    page({
      type,
      reference: reference && {
        url: reference.url,
        caption: rendered[0].caption,
        file: rendered[0].file,
      },
      rendered,
    })
  )

  return out
}
