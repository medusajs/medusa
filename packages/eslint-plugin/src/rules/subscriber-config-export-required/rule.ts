import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import { objectHasProperty, resolveObjectExpression } from "../../util/ast"

type MessageIds = "missingConfigExport" | "missingEventProperty"

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

        if (configObject && objectHasProperty(configObject, "event") === false) {
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
