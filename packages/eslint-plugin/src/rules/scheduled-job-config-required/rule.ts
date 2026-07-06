import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import { objectHasProperty, resolveObjectExpression } from "../../util/ast"
import { isIndexFile } from "../../util/filename"

type MessageIds =
  | "missingConfigExport"
  | "missingNameProperty"
  | "missingScheduleProperty"

export const rule = createRule<[], MessageIds>({
  name: "scheduled-job-config-required",
  meta: {
    type: "problem",
    docs: {
      description:
        "Scheduled job files must export a `config` object with `name` and `schedule` properties.",
    },
    messages: {
      missingConfigExport:
        "Scheduled job files must have a named export `config` with both a `name` and a `schedule` property.",
      missingNameProperty:
        "The scheduled job `config` export must declare a `name` property (a unique identifier for the job).",
      missingScheduleProperty:
        "The scheduled job `config` export must declare a `schedule` property (a cron expression string, or an object with an `interval` in milliseconds).",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    // `index.<ext>` files in a jobs directory are barrels/re-exports, not job
    // definitions — they don't declare a `config`, so skip them.
    if (isIndexFile(context.filename)) {
      return {}
    }

    const sourceCode = context.sourceCode ?? context.getSourceCode()

    let hasConfigExport = false
    // The resolved config object literal, used for the property checks. Stays
    // null when `config` is exported but can't be resolved to an object (e.g.
    // a re-export or a non-object initializer) — the property checks are
    // skipped.
    let configObject: TSESTree.ObjectExpression | null = null

    return {
      ExportNamedDeclaration(node: TSESTree.ExportNamedDeclaration) {
        // export const config = { ... } | export const config: ConfigType = { ... }
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
          // the property checks (no false positive).
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

        if (!configObject) {
          return
        }

        if (objectHasProperty(configObject, "name") === false) {
          context.report({
            node: configObject,
            messageId: "missingNameProperty",
          })
        }

        if (objectHasProperty(configObject, "schedule") === false) {
          context.report({
            node: configObject,
            messageId: "missingScheduleProperty",
          })
        }
      },
    }
  },
})

export default rule
