import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils"
import { parseExpression } from "cron-parser"
import { createRule } from "../../create-rule"
import {
  findProperty,
  resolveObjectExpression,
  resolveStaticStringValue,
} from "../../util/ast"
import { isIndexFile } from "../../util/filename"

type MessageIds = "invalidCron"

/**
 * Returns true when `value` parses as a valid cron expression under the same
 * parser Medusa uses at runtime to schedule jobs (`cron-parser`'s
 * `parseExpression`). Invalid expressions throw; we treat any throw as invalid.
 */
const isValidCron = (value: string): boolean => {
  try {
    parseExpression(value)
    return true
  } catch {
    return false
  }
}

export const rule = createRule<[], MessageIds>({
  name: "scheduled-job-schedule-valid-cron",
  meta: {
    type: "problem",
    docs: {
      description:
        "A scheduled job `config.schedule` string must be a valid cron expression.",
    },
    messages: {
      invalidCron:
        "`{{value}}` is not a valid cron expression. The scheduled job `config.schedule` must be a valid cron expression (e.g. `0 0 * * *`).",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    // `index.<ext>` files in a jobs directory are barrels/re-exports, not job
    // definitions.
    if (isIndexFile(context.filename)) {
      return {}
    }

    const sourceCode = context.sourceCode ?? context.getSourceCode()

    // The resolved `config` object literal. Stays null when `config` is
    // exported but can't be resolved to an object (re-export, non-object
    // initializer) — nothing to validate then.
    let configObject: TSESTree.ObjectExpression | null = null

    const trackConfig = (
      init: TSESTree.Node | null | undefined,
      node: TSESTree.Node
    ) => {
      const resolved = resolveObjectExpression(init, sourceCode.getScope(node))
      if (resolved) {
        configObject = resolved
      }
    }

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
              trackConfig(decl.init, node)
            }
          }
        }

        // export { config } | export { foo as config }
        for (const spec of node.specifiers) {
          if (
            spec.exported.type !== AST_NODE_TYPES.Identifier ||
            spec.exported.name !== "config"
          ) {
            continue
          }
          // A re-export from another module can't be resolved locally.
          if (node.source) {
            continue
          }
          trackConfig(spec.local, node)
        }
      },
      "Program:exit"() {
        if (!configObject) {
          return
        }

        const scheduleProp = findProperty(configObject, "schedule")
        if (!scheduleProp) {
          // Presence of `schedule` is enforced by `scheduled-job-config-required`.
          return
        }

        // Interval-based schedules (`schedule: { interval: 60000 }`) aren't cron
        // strings — only validate when the value resolves to a string.
        const resolved = resolveStaticStringValue(
          scheduleProp.value,
          sourceCode.getScope(scheduleProp.value)
        )
        if (!resolved) {
          return
        }

        if (!isValidCron(resolved.value)) {
          context.report({
            node: resolved.reportNode,
            messageId: "invalidCron",
            data: { value: resolved.value },
          })
        }
      },
    }
  },
})

export default rule
