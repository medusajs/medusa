import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import * as icons from "@medusajs/icons"
import { readdirSync, readFileSync, writeFileSync } from "fs"
import { basename, dirname, extname, join } from "path"
import { fileURLToPath } from "url"

const ICON_MAP = {
  bolt: "Bolt",
  cloud: "CloudSolid",
  computer: "ComputerDesktop",
  database: "CircleStack",
  folder: "Folder",
  globe: "Globe",
  key: "Key",
  search: "MagnifyingGlass",
  server: "Server",
  sync: "ArrowPath",
}

const scriptsDir = dirname(fileURLToPath(import.meta.url))
const CUSTOM_ICONS_DIR = join(scriptsDir, "mermaid-icons")
const OUTPUT_PATH = join(
  scriptsDir,
  "../src/components/MermaidDiagram/icons.json"
)

// the icons are drawn at 15px but rendered at ~48px in diagrams, where their
// original stroke width reads as too heavy
const STROKE_WIDTH_SCALE = 0.35

const VIEWBOX_REGEX = /viewBox="(-?[\d.]+) (-?[\d.]+) ([\d.]+) ([\d.]+)"/
const SVG_TAG_REGEX = /<svg([^>]*)>([\s\S]*)<\/svg>/
const ROOT_FILL_REGEX = /fill="([^"]+)"/

const lightenStrokes = (body) =>
  body.replace(
    /stroke-width="([\d.]+)"/g,
    (_, width) =>
      `stroke-width="${+(parseFloat(width) * STROKE_WIDTH_SCALE).toFixed(3)}"`
  )

const parseSvg = (markup, name) => {
  const svgTag = SVG_TAG_REGEX.exec(markup)
  const viewBox = VIEWBOX_REGEX.exec(markup)

  if (!svgTag || !viewBox) {
    throw new Error(`Couldn't extract the SVG of the ${name} icon.`)
  }

  const [, attributes, content] = svgTag

  // IDs aren't scoped per icon, so they'd clash between icons on the same page
  const body = content
    .replace(/id="([^"]+)"/g, `id="medusa-${name}-$1"`)
    .replace(/url\(#([^)]+)\)/g, `url(#medusa-${name}-$1)`)

  // the root SVG's fill is dropped with its tag, so elements relying on it to
  // inherit `none` would otherwise fall back to a black fill
  const rootFill = ROOT_FILL_REGEX.exec(attributes)?.[1]

  const [, left, top, width, height] = viewBox

  return {
    body: rootFill ? `<g fill="${rootFill}">${body}</g>` : body,
    left: parseFloat(left),
    top: parseFloat(top),
    width: parseFloat(width),
    height: parseFloat(height),
  }
}

const iconsJson = {
  prefix: "medusa",
  icons: {},
}

for (const [name, componentName] of Object.entries(ICON_MAP)) {
  const component = icons[componentName]

  if (!component) {
    throw new Error(`Icon ${componentName} isn't exported by @medusajs/icons.`)
  }

  const icon = parseSvg(renderToStaticMarkup(createElement(component)), name)

  iconsJson.icons[name] = { ...icon, body: lightenStrokes(icon.body) }
}

for (const file of readdirSync(CUSTOM_ICONS_DIR)) {
  if (extname(file) !== ".svg") {
    continue
  }

  const name = basename(file, ".svg")

  iconsJson.icons[name] = parseSvg(
    readFileSync(join(CUSTOM_ICONS_DIR, file), "utf-8"),
    name
  )
}

const sortedIcons = Object.fromEntries(
  Object.entries(iconsJson.icons).sort(([a], [b]) => a.localeCompare(b))
)

writeFileSync(
  OUTPUT_PATH,
  `${JSON.stringify({ ...iconsJson, icons: sortedIcons }, null, 2)}\n`
)

console.log(
  `Generated ${Object.keys(sortedIcons).length} Mermaid icons at ${OUTPUT_PATH}`
)
