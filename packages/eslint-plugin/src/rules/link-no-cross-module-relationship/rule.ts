import path from "path"
import ts from "typescript"
import type { TSESLint, TSESTree } from "@typescript-eslint/utils"
import { AST_NODE_TYPES } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import { FRAMEWORK_UTILS_SOURCE } from "../../constants"
import { findVariableInScope, getReturnedExpression } from "../../util/ast"

type MessageIds = "crossModuleRelationship" | "unresolvableTarget"

const MODEL_IMPORT = "model"
const RELATION_METHODS = new Set([
  "hasOne",
  "belongsTo",
  "hasMany",
  "manyToMany",
])

type ResolvedTarget =
  | { kind: "import"; source: string }
  | { kind: "local" }
  | { kind: "unresolvable" }

/**
 * Classifies what an Identifier refers to:
 * - `import` with the source path, when the identifier resolves to an
 *   `ImportBinding`.
 * - `local`, when it resolves to a same-file declaration (variable, class,
 *   function, etc.) — same module by definition.
 * - `unresolvable`, when no enclosing scope binds the name.
 */
function classifyIdentifier(
  node: TSESTree.Identifier,
  scope: TSESLint.Scope.Scope
): ResolvedTarget {
  const variable = findVariableInScope(scope, node.name)
  if (!variable || variable.defs.length === 0) {
    return { kind: "unresolvable" }
  }
  const def = variable.defs[0]
  if (def.type === "ImportBinding") {
    const parent = def.parent
    if (
      parent &&
      parent.type === AST_NODE_TYPES.ImportDeclaration &&
      typeof parent.source.value === "string"
    ) {
      return { kind: "import", source: parent.source.value }
    }
    return { kind: "unresolvable" }
  }
  return { kind: "local" }
}

function isRelativeImport(source: string): boolean {
  return source.startsWith("./") || source.startsWith("../") || source === "."
}

/**
 * Returns the absolute path of the `modules/<name>/` directory containing the
 * given file, or `null` if the file isn't under a recognizable module root.
 */
function getModuleRoot(filename: string): string | null {
  const norm = filename.replace(/\\/g, "/")
  const match = norm.match(/^(.*\/modules\/[^/]+)\//)
  return match ? match[1] : null
}

/** True when the absolute `resolved` path is inside (or equal to) `moduleRoot`. */
function pathStaysInModule(
  resolved: string,
  moduleRoot: string | null
): boolean {
  if (moduleRoot === null) {
    return true
  }
  const root = moduleRoot + "/"
  return resolved === moduleRoot || resolved.startsWith(root)
}

/**
 * True when the relative import `source` resolved against `filename` stays
 * within `moduleRoot`. Returns `true` (allowed) when we can't determine a
 * module root — defensive default for files outside the expected layout.
 */
function relativeImportStaysInModule(
  filename: string,
  source: string,
  moduleRoot: string | null
): boolean {
  if (moduleRoot === null) {
    return true
  }
  return pathStaysInModule(
    path.resolve(path.dirname(filename), source),
    moduleRoot
  )
}

/**
 * A tsconfig's `compilerOptions.paths` mapping together with the base directory
 * its substitutions resolve against.
 */
interface TsconfigPaths {
  baseDir: string
  paths: Record<string, string[]>
}

/**
 * Parsed `paths` per absolute tsconfig path (`null` = no `paths` declared).
 * tsconfigs don't change during a lint run, so each is read at most once.
 */
const tsconfigPathsCache = new Map<string, TsconfigPaths | null>()

/**
 * Reads `compilerOptions.paths` from a single tsconfig. Uses `ts.readConfigFile`
 * so JSONC comments are tolerated — this is plain config reading, not type-aware
 * linting, so the rule still works without `parserOptions.project`.
 *
 * Substitutions resolve against `baseUrl` when set, otherwise the tsconfig's own
 * directory (matching TypeScript's handling of `paths` declared without a
 * `baseUrl`). `extends` is intentionally not followed: Medusa modules declare
 * their aliases locally.
 */
function loadTsconfigPaths(configPath: string): TsconfigPaths | null {
  const cached = tsconfigPathsCache.get(configPath)
  if (cached !== undefined) {
    return cached
  }
  let result: TsconfigPaths | null = null
  const { config } = ts.readConfigFile(configPath, ts.sys.readFile)
  const paths = config?.compilerOptions?.paths
  if (paths && typeof paths === "object") {
    const configDir = path.dirname(configPath)
    const baseUrl = config.compilerOptions.baseUrl
    result = {
      baseDir: baseUrl ? path.resolve(configDir, baseUrl) : configDir,
      paths,
    }
  }
  tsconfigPathsCache.set(configPath, result)
  return result
}

/** Nearest tsconfig with `paths` per start directory. */
const nearestTsconfigCache = new Map<string, TsconfigPaths | null>()

/**
 * Walks up from `startDir` to the filesystem root, returning the first tsconfig
 * that declares `compilerOptions.paths`, or `null` if none does.
 */
function findTsconfigPaths(startDir: string): TsconfigPaths | null {
  const cached = nearestTsconfigCache.get(startDir)
  if (cached !== undefined) {
    return cached
  }
  let result: TsconfigPaths | null = null
  let dir = startDir
  while (true) {
    const candidate = path.join(dir, "tsconfig.json")
    if (ts.sys.fileExists(candidate)) {
      const loaded = loadTsconfigPaths(candidate)
      if (loaded) {
        result = loaded
        break
      }
    }
    const parent = path.dirname(dir)
    if (parent === dir) {
      break
    }
    dir = parent
  }
  nearestTsconfigCache.set(startDir, result)
  return result
}

/**
 * Resolves `source` through a tsconfig `paths` alias to an absolute path, or
 * `null` when no pattern matches. Supports exact (`@models`) and wildcard
 * (`@models/*`) patterns, taking the first substitution like TypeScript does.
 */
function resolveTsconfigAlias(
  source: string,
  cfg: TsconfigPaths
): string | null {
  for (const pattern of Object.keys(cfg.paths)) {
    const substitution = cfg.paths[pattern]?.[0]
    if (!substitution) {
      continue
    }
    const star = pattern.indexOf("*")
    if (star === -1) {
      if (source === pattern) {
        return path.resolve(cfg.baseDir, substitution)
      }
      continue
    }
    const prefix = pattern.slice(0, star)
    const suffix = pattern.slice(star + 1)
    if (
      source.length >= prefix.length + suffix.length &&
      source.startsWith(prefix) &&
      source.endsWith(suffix)
    ) {
      const matched = source.slice(prefix.length, source.length - suffix.length)
      return path.resolve(cfg.baseDir, substitution.replace("*", matched))
    }
  }
  return null
}

/**
 * True when `source` is a tsconfig `paths` alias (e.g. `@models`) that resolves
 * to a location inside `moduleRoot` — i.e. an in-module reference written
 * through an alias rather than a relative path. Returns `false` when `source`
 * isn't a configured alias (real package imports stay flagged).
 */
function aliasStaysInModule(
  filename: string,
  source: string,
  moduleRoot: string | null
): boolean {
  const cfg = findTsconfigPaths(path.dirname(filename))
  if (!cfg) {
    return false
  }
  const resolved = resolveTsconfigAlias(source, cfg)
  return resolved !== null && pathStaysInModule(resolved, moduleRoot)
}

export const rule = createRule<[], MessageIds>({
  name: "link-no-cross-module-relationship",
  meta: {
    type: "problem",
    docs: {
      description:
        "Data model relationships (`hasOne`/`belongsTo`/`hasMany`/`manyToMany`) must reference a data model defined in the same module. Use module links for cross-module references.",
    },
    messages: {
      crossModuleRelationship:
        "`model.{{method}}` references `{{name}}` imported from `{{source}}`, which is outside the current module. Use `defineLink` for cross-module relationships.",
      unresolvableTarget:
        "`model.{{method}}` must reference a data model defined in the same module (returning an identifier imported via a relative path or declared in the same file).",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const modelLocalNames = new Set<string>()
    const moduleRoot = getModuleRoot(context.filename)

    return {
      ImportDeclaration(node) {
        if (node.source.value !== FRAMEWORK_UTILS_SOURCE) {
          return
        }
        for (const specifier of node.specifiers) {
          if (
            specifier.type === AST_NODE_TYPES.ImportSpecifier &&
            specifier.imported.type === AST_NODE_TYPES.Identifier &&
            specifier.imported.name === MODEL_IMPORT
          ) {
            modelLocalNames.add(specifier.local.name)
          }
        }
      },

      CallExpression(node) {
        if (modelLocalNames.size === 0) {
          return
        }
        const callee = node.callee
        if (
          callee.type !== AST_NODE_TYPES.MemberExpression ||
          callee.computed ||
          callee.property.type !== AST_NODE_TYPES.Identifier ||
          !RELATION_METHODS.has(callee.property.name) ||
          callee.object.type !== AST_NODE_TYPES.Identifier ||
          !modelLocalNames.has(callee.object.name)
        ) {
          return
        }
        const fn = node.arguments[0]
        if (
          !fn ||
          (fn.type !== AST_NODE_TYPES.ArrowFunctionExpression &&
            fn.type !== AST_NODE_TYPES.FunctionExpression)
        ) {
          return
        }
        const method = callee.property.name
        const returned = getReturnedExpression(fn)
        if (!returned) {
          return
        }

        if (returned.type !== AST_NODE_TYPES.Identifier) {
          context.report({
            node: returned,
            messageId: "unresolvableTarget",
            data: { method },
          })
          return
        }

        const target = classifyIdentifier(
          returned,
          context.sourceCode.getScope(returned)
        )
        if (target.kind === "local") {
          return
        }
        if (target.kind === "unresolvable") {
          context.report({
            node: returned,
            messageId: "unresolvableTarget",
            data: { method },
          })
          return
        }
        const staysInModule = isRelativeImport(target.source)
          ? relativeImportStaysInModule(
              context.filename,
              target.source,
              moduleRoot
            )
          : aliasStaysInModule(context.filename, target.source, moduleRoot)
        if (staysInModule) {
          return
        }

        context.report({
          node: returned,
          messageId: "crossModuleRelationship",
          data: {
            method,
            name: returned.name,
            source: target.source,
          },
        })
      },
    }
  },
})

export default rule
