import { AST_NODE_TYPES, TSESLint, TSESTree } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import { findProperty, findVariableInScope } from "../../util/ast"

type MessageIds = "missingConfigExport" | "missingEventProperty"

/**
 * Resolves an expression to the object literal it denotes, when that can be
 * determined without type information:
 * - An `ObjectExpression` is returned as-is.
 * - An `Identifier` is resolved through scope to a `const x = { ... }` binding.
 *
 * Returns `null` when the value can't be statically resolved to an object
 * literal (call expressions, spreads of unknown bindings, re-exports, etc.) —
 * in which case the `event` check is skipped to avoid false positives.
 */
function resolveObjectExpression(
  node: TSESTree.Node | null | undefined,
  scope: TSESLint.Scope.Scope | null
): TSESTree.ObjectExpression | null {
  if (!node) {
    return null
  }
  if (node.type === AST_NODE_TYPES.ObjectExpression) {
    return node
  }
  if (node.type === AST_NODE_TYPES.Identifier) {
    const variable = findVariableInScope(scope, node.name)
    if (variable) {
      for (const def of variable.defs) {
        if (
          def.node.type === AST_NODE_TYPES.VariableDeclarator &&
          def.node.init?.type === AST_NODE_TYPES.ObjectExpression
        ) {
          return def.node.init
        }
      }
    }
  }
  return null
}

/**
 * Whether a resolved config object is known to carry an `event` property.
 * Returns `"unknown"` when the object spreads another value — `event` could be
 * supplied by the spread, so the rule must not flag it.
 */
function objectHasEvent(
  obj: TSESTree.ObjectExpression
): boolean | "unknown" {
  if (findProperty(obj, "event")) {
    return true
  }
  if (
    obj.properties.some((p) => p.type === AST_NODE_TYPES.SpreadElement)
  ) {
    return "unknown"
  }
  return false
}

export const rule = createRule<[], MessageIds>({
  name: "subscriber-config-export-required",
  meta: {
    type: "problem",
    docs: {
      description:
        "Subscriber files must export a `config` object with at least an `event` property.",
    },
    messages: {
      missingConfigExport:
        "Subscriber files must have a named export `config` (a `SubscriberConfig`) with at least an `event` property.",
      missingEventProperty:
        "The subscriber `config` export must declare an `event` property naming the event(s) to subscribe to.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode()

    let hasConfigExport = false
    // The resolved config object literal, used for the `event` check. Stays
    // null when `config` is exported but can't be resolved to an object (e.g.
    // a re-export or a non-object initializer) — the `event` check is skipped.
    let configObject: TSESTree.ObjectExpression | null = null

    return {
      ExportNamedDeclaration(node: TSESTree.ExportNamedDeclaration) {
        // export const config = { ... } | export const config: SubscriberConfig = { ... }
        if (
          node.declaration &&
          node.declaration.type === AST_NODE_TYPES.VariableDeclaration
        ) {
          for (const decl of node.declaration.declarations) {
            if (
              decl.id.type === AST_NODE_TYPES.Identifier &&
              decl.id.name === "config"
            ) {
              hasConfigExport = true
              const resolved = resolveObjectExpression(
                decl.init,
                sourceCode.getScope(node)
              )
              if (resolved) {
                configObject = resolved
              }
            }
          }
        }

        // export { config } | export { foo as config } | export { config } from "./x"
        for (const spec of node.specifiers) {
          if (
            spec.exported.type !== AST_NODE_TYPES.Identifier ||
            spec.exported.name !== "config"
          ) {
            continue
          }

          hasConfigExport = true
          // A re-export from another module can't be resolved locally — skip
          // the `event` check (no false positive).
          if (node.source) {
            continue
          }

          const resolved = resolveObjectExpression(
            spec.local,
            sourceCode.getScope(node)
          )
          if (resolved) {
            configObject = resolved
          }
        }
      },
      "Program:exit"(node: TSESTree.Program) {
        if (!hasConfigExport) {
          context.report({ node, messageId: "missingConfigExport" })
          return
        }

        if (configObject && objectHasEvent(configObject) === false) {
          context.report({
            node: configObject,
            messageId: "missingEventProperty",
          })
        }
      },
    }
  },
})

export default rule
