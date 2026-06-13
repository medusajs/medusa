import path from "path"
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
  if (!variable || variable.defs.length === 0) return { kind: "unresolvable" }
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
  if (moduleRoot === null) return true
  const resolved = path.resolve(path.dirname(filename), source)
  const root = moduleRoot + "/"
  return resolved === moduleRoot || resolved.startsWith(root)
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
        if (node.source.value !== FRAMEWORK_UTILS_SOURCE) return
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
        if (modelLocalNames.size === 0) return
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
        if (!returned) return

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
        if (target.kind === "local") return
        if (target.kind === "unresolvable") {
          context.report({
            node: returned,
            messageId: "unresolvableTarget",
            data: { method },
          })
          return
        }
        if (
          isRelativeImport(target.source) &&
          relativeImportStaysInModule(
            context.filename,
            target.source,
            moduleRoot
          )
        ) {
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
