import { compile } from "@tailwindcss/node"
import { Scanner } from "@tailwindcss/oxide"
import path from "path"
import postcss from "postcss"
import tailwindcssV3 from "tailwindcss-v3"

import { generateThemeCSS } from "../../ui-preset/src/theme-css"

type Declarations = Record<string, string>
type Setup = {
  name: string
  classes: Map<string, Declarations>
  vars: Declarations
}

const UI_SRC = path.join(__dirname, "../src")
const CONFIG = path.join(__dirname, "tailwind.config.ts")

const COMPARED_FAMILIES = /^-?(rounded|outline|ring|shadow|blur)(-|$)/
const COMPARED_PROPERTIES =
  /^(border(-[a-z]+)*-radius|outline(-[a-z]+)?|--tw-ring-color|--tw-ring-width|--tw-shadow(-color)?|--tw-blur)$/

const unescape = (value: string) =>
  value.replace(/\\([0-9a-f]{1,6} ?|.)/gi, (_, char: string) =>
    /^[0-9a-f]{1,6} ?$/i.test(char) && char.length > 1
      ? String.fromCodePoint(parseInt(char, 16))
      : char
  )

const isBaseLayer = (node: postcss.Node): boolean => {
  const parent = node.parent
  if (!parent) {
    return false
  }
  return (
    (parent.type === "atrule" &&
      (parent as postcss.AtRule).name === "layer" &&
      (parent as postcss.AtRule).params === "base") ||
    isBaseLayer(parent)
  )
}

const parseCSS = (css: string) => {
  const classes = new Map<string, Declarations>()
  const vars: Declarations = {}

  postcss.parse(css).walkRules((rule) => {
    const declarations: Declarations = {}
    rule.walkDecls((decl) => {
      declarations[decl.prop] = decl.value
    })

    if (rule.selector.includes(":root")) {
      Object.assign(vars, declarations)
    }

    if (isBaseLayer(rule)) {
      return
    }

    for (const selector of rule.selectors) {
      const match = selector.match(/^\.((?:\\[0-9a-f]{1,6} ?|\\.|[\w-])+)$/i)
      const names = selector.match(/\.((?:\\[0-9a-f]{1,6} ?|\\.|[\w-])+)/gi)

      for (const name of names ?? []) {
        const className = unescape(name.slice(1))
        const existing = classes.get(className) ?? {}
        classes.set(
          className,
          match && unescape(match[1]) === className
            ? { ...existing, ...declarations }
            : existing
        )
      }
    }
  })

  return { classes, vars }
}

const resolveValue = (value: string, vars: Declarations, depth = 0): string =>
  value
    .replace(/var\((--[\w-]+)(?:,\s*([^()]*))?\)/g, (whole, name: string) =>
      vars[name] !== undefined && depth < 5
        ? resolveValue(vars[name], vars, depth + 1)
        : whole
    )
    .replace(
      /calc\(\s*var\(--spacing\)\s*\*\s*([\d.]+)\s*\)/g,
      (_, n) => `${parseFloat(n) * 0.25}rem`
    )
    .replace(
      /color-mix\(in oklab, (.+) var\(--tw-[\w-]+-alpha\), transparent\)/g,
      "$1"
    )
    .replace(/calc\(infinity \* 1px\)/g, "9999px")
    .replace(/ var\(--tw-shadow-color, currentcolor\)/g, "")
    .replace(/\b0px\b/g, "0")
    .replace(/\s+/g, " ")
    .trim()

const comparedDeclarations = (
  declarations: Declarations,
  vars: Declarations
) => {
  const result: Declarations = {}

  for (const [property, value] of Object.entries(declarations)) {
    if (property === "--tw-ring-shadow") {
      const width = value.match(/calc\(\s*([\d.]+px)/)?.[1]
      if (width) {
        result["--tw-ring-width"] = width
      }
      continue
    }

    if (property === "--tw-shadow" && value === "var(--tw-shadow-colored)") {
      continue
    }

    if (COMPARED_PROPERTIES.test(property)) {
      result[property] = resolveValue(value, vars)
    }
  }

  return Object.fromEntries(
    Object.entries(result).sort(([a], [b]) => a.localeCompare(b))
  )
}

const utilityOf = (candidate: string) => {
  let depth = 0
  let start = 0
  for (let i = 0; i < candidate.length; i++) {
    const char = candidate[i]
    if (char === "[" || char === "(") depth++
    if (char === "]" || char === ")") depth--
    if (char === ":" && depth === 0) start = i + 1
  }
  return candidate.slice(start).replace(/^!|!$/g, "")
}

describe("Tailwind CSS 3 and 4 compatibility", () => {
  let candidates: string[]
  let setups: Setup[]

  beforeAll(async () => {
    candidates = new Scanner({
      sources: [{ base: UI_SRC, pattern: "**/*.{ts,tsx}", negated: false }],
    }).scan()

    const v3 = await postcss([tailwindcssV3({ config: CONFIG })]).process(
      "@tailwind base; @tailwind components; @tailwind utilities;",
      { from: undefined }
    )

    const v4WithConfig = await compile(
      `@import "tailwindcss";\n@config "./tailwind.config.ts";`,
      { base: __dirname, onDependency: () => {} }
    )

    const v4WithThemeCSS = await compile(
      `@import "tailwindcss";\n${generateThemeCSS()}`,
      {
        base: path.join(__dirname, "../../ui-preset"),
        onDependency: () => {},
      }
    )

    setups = [
      { name: "v3 + JS preset", ...parseCSS(v3.css) },
      { name: "v4 + JS preset", ...parseCSS(v4WithConfig.build(candidates)) },
      { name: "v4 + theme.css", ...parseCSS(v4WithThemeCSS.build(candidates)) },
    ]
  }, 60_000)

  it("generates every class used by @medusajs/ui in all setups", () => {
    const missing = candidates
      .filter((candidate) =>
        setups.some((setup) => setup.classes.has(candidate))
      )
      .flatMap((candidate) =>
        setups
          .filter((setup) => !setup.classes.has(candidate))
          .map((setup) => `${candidate} (missing in ${setup.name})`)
      )

    expect(missing).toEqual([])
  })

  it("generates the same values for classes whose scale changed between versions", () => {
    const mismatches: string[] = []

    for (const candidate of candidates) {
      if (!COMPARED_FAMILIES.test(utilityOf(candidate))) {
        continue
      }

      const [reference, ...others] = setups.map((setup) =>
        comparedDeclarations(setup.classes.get(candidate) ?? {}, setup.vars)
      )

      others.forEach((declarations, index) => {
        if (JSON.stringify(declarations) !== JSON.stringify(reference)) {
          mismatches.push(
            `${candidate}: ${setups[0].name} ${JSON.stringify(reference)} vs ${
              setups[index + 1].name
            } ${JSON.stringify(declarations)}`
          )
        }
      })
    }

    expect(mismatches).toEqual([])
  })
})
