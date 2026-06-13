import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"

type MessageIds = "zodImportSource"

const BARE_ZOD = "zod"
const MEDUSA_ZOD = "@medusajs/framework/zod"

function check(
  context: Parameters<Parameters<typeof createRule>[0]["create"]>[0],
  source: TSESTree.StringLiteral | null | undefined
) {
  if (!source) return
  if (source.value !== BARE_ZOD) return
  context.report({
    node: source,
    messageId: "zodImportSource",
    fix(fixer) {
      const quote = source.raw[0]
      return fixer.replaceText(source, `${quote}${MEDUSA_ZOD}${quote}`)
    },
  })
}

export const rule = createRule<[], MessageIds>({
  name: "zod-import-source",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Zod should be imported from `@medusajs/framework/zod` (Medusa v2.13+), not the bare `zod` package.",
    },
    messages: {
      zodImportSource:
        "Import Zod from `@medusajs/framework/zod` instead of `zod`.",
    },
    fixable: "code",
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      ImportDeclaration(node) {
        check(context, node.source)
      },
      ExportNamedDeclaration(node) {
        if (node.source && node.source.type === AST_NODE_TYPES.Literal) {
          check(context, node.source as TSESTree.StringLiteral)
        }
      },
      ExportAllDeclaration(node) {
        check(context, node.source)
      },
    }
  },
})

export default rule
