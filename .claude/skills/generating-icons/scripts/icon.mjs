#!/usr/bin/env node
import fs from "node:fs"
import path from "node:path"
import { createRequire } from "node:module"
import { fileURLToPath } from "node:url"

const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../.."
)
const ICONS_PKG = path.join(ROOT, "packages/design-system/icons")
const COMPONENTS = path.join(ICONS_PKG, "src/components")
const CUSTOM = path.join(ICONS_PKG, "src/custom")
const TOOLBOX = path.join(ROOT, "packages/design-system/toolbox")

const BASE_COLOR = "#18181B"
const KEBAB_ATTRS = [
  "strokeWidth",
  "strokeLinecap",
  "strokeLinejoin",
  "strokeOpacity",
  "strokeMiterlimit",
  "strokeDasharray",
  "strokeDashoffset",
  "fillRule",
  "fillOpacity",
  "clipRule",
  "clipPath",
  "stopColor",
  "stopOpacity",
  "floodColor",
  "floodOpacity",
  "colorInterpolationFilters",
]

const [command, ...rest] = process.argv.slice(2)
const flags = new Set(rest.filter((a) => a.startsWith("--") && !a.includes("=")))
const options = Object.fromEntries(
  rest
    .filter((a) => a.startsWith("--") && a.includes("="))
    .map((a) => a.slice(2).split("="))
)
const args = rest.filter((a) => !a.startsWith("--"))

function fail(message) {
  console.error(message)
  process.exit(1)
}

function getComponentName(name) {
  return name
    .replace(/[-_]+/g, " ")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+(.)(\w*)/g, (_m, a, b) => a.toUpperCase() + b.toLowerCase())
    .replace(/\w/, (s) => s.toUpperCase())
}

function iconToSvg(name) {
  const file = [COMPONENTS, CUSTOM]
    .map((dir) => path.join(dir, `${name}.tsx`))
    .find((candidate) => fs.existsSync(candidate))
  if (!file) {
    fail(`No icon named "${name}" in ${COMPONENTS} or ${CUSTOM}`)
  }

  const source = fs.readFileSync(file, "utf8")
  let svg = source.slice(source.indexOf("<svg"), source.indexOf("</svg>") + 6)

  svg = svg
    .replace(/^\s*ref=\{ref\}\n/m, "")
    .replace(/^\s*\{\.\.\.props\}\n/m, "")
    .replace(/=\{color\}/g, `="${BASE_COLOR}"`)
    .replace(/=\{([^{}]+)\}/g, '="$1"')

  for (const attr of KEBAB_ATTRS) {
    const kebab = attr.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)
    svg = svg.replace(new RegExp(`(\\s)${attr}=`, "g"), `$1${kebab}=`)
  }

  return (
    svg
      .split("\n")
      .map((line) => line.replace(/^ {6}/, ""))
      .join("\n") + "\n"
  )
}

function readSvg(input) {
  return input.endsWith(".svg") ? fs.readFileSync(input, "utf8") : iconToSvg(input)
}

function check(file, { fixed, multicolor }) {
  const name = path.basename(file, ".svg")
  const code = fs.readFileSync(file, "utf8")
  const errors = []
  const warnings = []

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) {
    errors.push(`File name "${name}" must be kebab-case`)
  }

  const root = code.match(/<svg\b[^>]*>/)?.[0]
  if (!root) {
    fail(`${file} has no <svg> root`)
  }

  const rootAttr = (attr) =>
    root.match(new RegExp(`\\b${attr}="([^"]*)"`))?.[1]
  const size =
    (fixed || multicolor) && rootAttr("width") === "20" ? "20" : "15"
  if (rootAttr("width") !== size || rootAttr("height") !== size) {
    errors.push(`Root width/height must be ${size}`)
  }
  if (rootAttr("viewBox") !== `0 0 ${size} ${size}`) {
    errors.push(`Root viewBox must be "0 0 ${size} ${size}"`)
  }
  if (rootAttr("fill") !== "none") {
    errors.push('Root must set fill="none"')
  }

  for (const tag of ["text", "image", "style", "script", "foreignObject"]) {
    if (new RegExp(`<${tag}\\b`).test(code)) {
      errors.push(`<${tag}> is not allowed`)
    }
  }
  for (const attr of ["style", "class"]) {
    if (new RegExp(`\\s${attr}=`).test(code)) {
      errors.push(`${attr} attributes are not allowed, use presentation attributes`)
    }
  }
  if (/\stransform=/.test(code)) {
    warnings.push("transform found: bake transforms into the path data")
  }
  if (/currentColor/i.test(code)) {
    errors.push(`Use ${BASE_COLOR}, not currentColor: only ${BASE_COLOR} becomes {color}`)
  }

  const body = code.replace(/<defs>[\s\S]*?<\/defs>/g, "")
  const paints = [...body.replace(root, "").matchAll(/\b(fill|stroke)="([^"]+)"/g)]
  const colors = new Set(paints.map(([, , value]) => value))
  const foreign = [...colors].filter(
    (c) => c !== "none" && c.toUpperCase() !== BASE_COLOR.toUpperCase()
  )
  if (!fixed && !multicolor && foreign.length) {
    errors.push(
      `Only ${BASE_COLOR} is themeable, found ${foreign.join(", ")} (pass --multicolor for badges/illustrations, --fixed for brands)`
    )
  }
  if (!fixed && [...colors].includes(BASE_COLOR.toLowerCase())) {
    errors.push(`${BASE_COLOR} must be uppercase to be replaced with {color}`)
  }

  const hasStroke = paints.some(([, kind, value]) => kind === "stroke" && value !== "none")
  const hasFill = paints.some(([, kind, value]) => kind === "fill" && value !== "none")
  if (!fixed && !multicolor) {
    const widths = [...code.matchAll(/stroke-width="([^"]+)"/g)].map((m) => m[1])
    if (hasStroke && (!widths.length || widths.some((w) => w !== "1.5"))) {
      warnings.push(`Stroke width should be 1.5, found ${widths.join(", ") || "none"}`)
    }
    if (hasStroke && /<path\b/.test(body)) {
      if (!/stroke-linecap="round"/.test(code) || !/stroke-linejoin="round"/.test(code)) {
        warnings.push('Stroked paths need stroke-linecap="round" and stroke-linejoin="round"')
      }
    }
    if (name.endsWith("-solid") && hasStroke) {
      warnings.push("Solid icons are fill-only (strokes only for ring + filled core shapes)")
    }
    if (!name.endsWith("-solid") && hasFill && !hasStroke) {
      warnings.push("Outline icon has fills and no strokes: use live 1.5 strokes unless it is dots/triangles")
    }
  }

  return { name, code, errors, warnings }
}

function report({ errors, warnings }) {
  warnings.forEach((w) => console.warn(`warning: ${w}`))
  errors.forEach((e) => console.error(`error: ${e}`))
}

function ensureViewBox(code) {
  if (/viewBox\s*=/.test(code)) {
    return code
  }
  const tag = code.match(/<svg\b[^>]*>/i)?.[0]
  const width = tag?.match(/\bwidth\s*=\s*["']([^"']+)["']/i)?.[1]
  const height = tag?.match(/\bheight\s*=\s*["']([^"']+)["']/i)?.[1]
  if (!width || !height) {
    return code
  }
  return code.replace(
    /<svg\b([^>]*?)>/i,
    (_m, attrs) => `<svg${attrs} viewBox="0 0 ${parseFloat(width)} ${parseFloat(height)}">`
  )
}

// Mirrors packages/design-system/toolbox/src/transformers/transform-svg.ts
// and templates/icon-templates.ts. Keep in sync so output matches `yarn generate`.
async function transformSvg({ code, componentName, fixed }) {
  const require = createRequire(path.join(TOOLBOX, "package.json"))
  const { transform } = require("@svgr/core")
  const plugins = ["svgo", "jsx", "prettier"].map((p) => {
    const mod = require(`@svgr/plugin-${p}`)
    return mod.default ?? mod
  })

  const template = ({ jsx, componentName }, { tpl }) =>
    fixed
      ? tpl`
  import * as React from "react"

  import type { IconProps } from "../types"

  const ${componentName} = React.forwardRef<SVGSVGElement, Omit<IconProps, "color">>((props, ref) => {
    return (
      ${jsx}
    )
  })
  ${componentName}.displayName = "${componentName}"

  export default ${componentName}
  `
      : tpl`
  import * as React from "react"

  import type { IconProps } from "../types"

  const ${componentName} = React.forwardRef<SVGSVGElement, IconProps>(({ color = "currentColor", ...props }, ref) => {
    return (
      ${jsx}
    )
  })
  ${componentName}.displayName = "${componentName}"

  export default ${componentName}
  `

  return await transform(
    ensureViewBox(code),
    {
      typescript: true,
      replaceAttrValues: fixed ? undefined : { [BASE_COLOR]: "{color}" },
      svgProps: { ref: "{ref}" },
      expandProps: "end",
      plugins,
      jsxRuntime: "classic",
      prettierConfig: { semi: false, parser: "typescript" },
      svgoConfig: {
        plugins: [
          {
            name: "preset-default",
            // The toolbox config lets svgo 3 strip the viewBox; committed
            // icons carry one, patched in after generation (#14700).
            params: { overrides: { removeTitle: false, removeViewBox: false } },
          },
        ],
      },
      template,
    },
    { componentName }
  )
}

function writeIndex(dir) {
  const lines = fs
    .readdirSync(dir)
    .filter((entry) => entry !== "index.ts" && entry !== "__tests__")
    .sort()
    .map((entry) => {
      const name = entry.replace(/\.tsx?$/, "")
      return `export { default as ${getComponentName(name)} } from "./${name}"`
    })

  fs.writeFileSync(
    path.join(dir, "index.ts"),
    [
      "// This file is generated automatically.",
      ...(lines.length ? lines : ["export {}"]),
      "",
    ].join("\n")
  )
}

async function emit(file) {
  const fixed = flags.has("--fixed")
  const result = check(file, { fixed, multicolor: flags.has("--multicolor") })
  report(result)
  if (result.errors.length) {
    process.exit(1)
  }

  const outDir = options.out ? path.resolve(options.out) : CUSTOM
  const { name } = result
  const componentName = getComponentName(name)
  const componentFile = path.join(outDir, `${name}.tsx`)

  const figmaExports = fs.readFileSync(path.join(COMPONENTS, "index.ts"), "utf8")
  if (figmaExports.includes(`{ default as ${componentName} }`)) {
    fail(`${componentName} is already exported from src/components (Figma)`)
  }
  if (fs.existsSync(componentFile) && !flags.has("--force")) {
    fail(`${componentFile} already exists (pass --force to overwrite)`)
  }

  // Prettier config is resolved from the cwd, as it is when `yarn generate` runs.
  process.chdir(ICONS_PKG)
  const component = (
    await transformSvg({ code: result.code, componentName, fixed })
  ).replace(/(\n\s*fill="none")(\n\s*viewBox="[^"]*")/, "$2$1")

  const spec = fs
    .readFileSync(path.join(COMPONENTS, "__tests__/academic-cap.spec.tsx"), "utf8")
    .replaceAll("AcademicCap", componentName)
    .replaceAll("academic-cap", name)

  fs.mkdirSync(path.join(outDir, "__tests__"), { recursive: true })
  fs.writeFileSync(componentFile, component)
  fs.writeFileSync(path.join(outDir, "__tests__", `${name}.spec.tsx`), spec)
  writeIndex(outDir)

  console.log(`Wrote ${componentName} to ${path.relative(ROOT, componentFile)}`)
}

function sheet(out, inputs) {
  const cell = 150
  const scale = 8
  const cells = inputs.map((input, i) => {
    const svg = readSvg(input)
    const size = Number(svg.match(/viewBox="0 0 (\d+)/)?.[1] ?? 15)
    const inner = svg
      .replace(/^[\s\S]*?<svg\b[^>]*>/, "")
      .replace(/<\/svg>\s*$/, "")
      .replace(/\bid="([^"]+)"/g, `id="i${i}-$1"`)
      .replace(/url\(#([^)]+)\)/g, `url(#i${i}-$1)`)
    const x = i * cell
    const big = size * scale
    return `
  <rect x="${x + 15}" y="15" width="${big}" height="${big}" fill="none" stroke="#E4E4E7" stroke-width="0.5"/>
  <svg x="${x + 15}" y="15" width="${big}" height="${big}" viewBox="0 0 ${size} ${size}" fill="none">${inner}</svg>
  <svg x="${x + 15}" y="${big + 30}" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none">${inner}</svg>
  <text x="${x + 40}" y="${big + 42}" font-family="monospace" font-size="9" fill="#52525B">${path.basename(input, ".svg")}</text>`
  })

  const width = inputs.length * cell
  fs.writeFileSync(
    out,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="200" viewBox="0 0 ${width} 200">
  <rect width="${width}" height="200" fill="#fff"/>${cells.join("")}
</svg>
`
  )
  console.log(`Wrote ${out}`)
}

switch (command) {
  case "export":
    if (!args[0]) fail("Usage: icon.mjs export <icon-name> [--out=file.svg]")
    if (options.out) {
      fs.writeFileSync(options.out, iconToSvg(args[0]))
    } else {
      process.stdout.write(iconToSvg(args[0]))
    }
    break
  case "check": {
    if (!args[0]) fail("Usage: icon.mjs check <file.svg> [--fixed] [--multicolor]")
    const result = check(args[0], {
      fixed: flags.has("--fixed"),
      multicolor: flags.has("--multicolor"),
    })
    report(result)
    if (result.errors.length) process.exit(1)
    console.log(`${result.name}: ok`)
    break
  }
  case "emit":
    if (!args[0]) fail("Usage: icon.mjs emit <file.svg> [--fixed] [--multicolor] [--force] [--out=dir]")
    await emit(args[0])
    break
  case "sheet":
    if (args.length < 2) fail("Usage: icon.mjs sheet <out.svg> <icon-name|file.svg>...")
    sheet(args[0], args.slice(1))
    break
  default:
    fail("Usage: icon.mjs <export|check|emit|sheet> ...")
}
