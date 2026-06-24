import * as fs from "fs"
import * as path from "path"
import { parse } from "@typescript-eslint/typescript-estree"
import { createRule } from "../../create-rule"
import { FRAMEWORK_UTILS_SOURCE } from "../../constants"

type MessageIds = "loaderNotRegistered"

const MODULE_NAME = "Module"
const INDEX_CANDIDATES = ["index.ts", "index.tsx", "index.js", "index.mjs", "index.cjs"]
const SUPPORTED_EXTENSIONS = [".ts", ".tsx", ".js", ".mjs", ".cjs"]

function toPosix(p: string): string {
  return p.replace(/\\/g, "/")
}

function stripExt(p: string): string {
  const ext = path.extname(p)
  return SUPPORTED_EXTENSIONS.includes(ext) ? p.slice(0, -ext.length) : p
}

function locateModuleIndex(filename: string): {
  indexPath: string
  loaderKey: string
} | null {
  const posix = toPosix(filename)
  const match = posix.match(/^(.*\/modules\/[^/]+)\/loaders\/(.+)$/)
  if (!match) return null
  const moduleDir = match[1]
  const loaderAbs = stripExt(posix)
  for (const candidate of INDEX_CANDIDATES) {
    const indexPath = `${moduleDir}/${candidate}`
    if (fs.existsSync(indexPath)) {
      return { indexPath, loaderKey: loaderAbs }
    }
  }
  return null
}

function resolveImportSource(
  source: string,
  fromDir: string
): string | null {
  if (!source.startsWith(".")) return null
  const resolved = toPosix(path.resolve(fromDir, source))
  return stripExt(resolved)
}

function collectRegisteredLoaders(indexPath: string): Set<string> | null {
  let source: string
  try {
    source = fs.readFileSync(indexPath, "utf8")
  } catch {
    return null
  }

  let ast: ReturnType<typeof parse>
  try {
    ast = parse(source, { jsx: indexPath.endsWith("x"), loc: false, range: false })
  } catch {
    return null
  }

  const moduleLocalNames = new Set<string>()
  const importLocalToSource = new Map<string, string>()
  const indexDir = path.dirname(indexPath)

  for (const node of ast.body) {
    if (node.type !== "ImportDeclaration") continue
    const src = typeof node.source.value === "string" ? node.source.value : ""
    if (src === FRAMEWORK_UTILS_SOURCE) {
      for (const spec of node.specifiers) {
        if (
          spec.type === "ImportSpecifier" &&
          spec.imported.type === "Identifier" &&
          spec.imported.name === MODULE_NAME
        ) {
          moduleLocalNames.add(spec.local.name)
        }
      }
    }
    const resolved = resolveImportSource(src, indexDir)
    if (!resolved) continue
    for (const spec of node.specifiers) {
      importLocalToSource.set(spec.local.name, resolved)
    }
  }

  const registered = new Set<string>()

  const walk = (node: unknown): void => {
    if (!node || typeof node !== "object") return
    if (Array.isArray(node)) {
      for (const child of node) walk(child)
      return
    }
    const n = node as { type?: string; [k: string]: unknown }
    if (
      n.type === "CallExpression" &&
      (n as any).callee?.type === "Identifier" &&
      moduleLocalNames.has((n as any).callee.name)
    ) {
      const args = (n as any).arguments as any[]
      const second = args?.[1]
      if (second?.type === "ObjectExpression") {
        for (const prop of second.properties) {
          if (
            prop.type !== "Property" ||
            prop.computed ||
            !(
              (prop.key.type === "Identifier" && prop.key.name === "loaders") ||
              (prop.key.type === "Literal" && prop.key.value === "loaders")
            )
          ) {
            continue
          }
          if (prop.value.type !== "ArrayExpression") continue
          for (const el of prop.value.elements) {
            if (el && el.type === "Identifier") {
              const src = importLocalToSource.get(el.name)
              if (src) registered.add(src)
            }
          }
        }
      }
    }
    for (const key of Object.keys(n)) {
      if (key === "parent" || key === "loc" || key === "range") continue
      walk(n[key])
    }
  }

  walk(ast.body)
  return registered
}

export const rule = createRule<[], MessageIds>({
  name: "loader-must-be-exported-in-module-definition",
  meta: {
    type: "problem",
    docs: {
      description:
        "Loader files under `src/modules/<m>/loaders/` must be registered in the module's `loaders` array.",
    },
    messages: {
      loaderNotRegistered:
        "Loader file is not registered in the module's `loaders` array in {{indexPath}}.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      "Program:exit"(node) {
        const filename = context.filename
        if (!filename || filename === "<input>" || filename === "<text>") return
        const located = locateModuleIndex(filename)
        if (!located) return

        const registered = collectRegisteredLoaders(located.indexPath)
        if (!registered) return

        if (registered.has(located.loaderKey)) return

        context.report({
          node,
          messageId: "loaderNotRegistered",
          data: { indexPath: located.indexPath },
        })
      },
    }
  },
})

export default rule
