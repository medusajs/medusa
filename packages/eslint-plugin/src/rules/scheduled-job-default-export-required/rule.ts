import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"

type MessageIds = "missingDefaultExport"

export const rule = createRule<[], MessageIds>({
  name: "scheduled-job-default-export-required",
  meta: {
    type: "problem",
    docs: {
      description:
        "Scheduled job files must default-export the job function.",
    },
    messages: {
      missingDefaultExport:
        "Scheduled job files must have a default export. Default-export the async job function so Medusa registers and runs it.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    let hasDefaultExport = false

    return {
      ExportDefaultDeclaration() {
        hasDefaultExport = true
      },
      ExportNamedDeclaration(node: TSESTree.ExportNamedDeclaration) {
        for (const spec of node.specifiers) {
          if (
            spec.exported.type === AST_NODE_TYPES.Identifier &&
            spec.exported.name === "default"
          ) {
            hasDefaultExport = true
            return
          }
        }
      },
      "Program:exit"(node: TSESTree.Program) {
        if (hasDefaultExport) return
        context.report({
          node,
          messageId: "missingDefaultExport",
        })
      },
    }
  },
})

export default rule
