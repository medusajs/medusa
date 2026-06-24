import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"

type MessageIds = "nodeOnlyImportInAdmin"

/**
 * Framework entry points that pull Node-only code into the bundle. The admin
 * dashboard is a browser bundle, so importing any of these breaks the admin
 * build (or ships server-only code to the client).
 */
const FORBIDDEN_ADMIN_IMPORTS = new Set([
  "@medusajs/framework/utils",
  "@medusajs/framework/http",
  "@medusajs/framework/workflows-sdk",
])

function check(
  context: Parameters<Parameters<typeof createRule>[0]["create"]>[0],
  source: TSESTree.StringLiteral | null | undefined
) {
  if (!source) {
    return
  }
  const value = source.value
  if (typeof value !== "string") {
    return
  }

  if (FORBIDDEN_ADMIN_IMPORTS.has(value)) {
    context.report({
      node: source,
      messageId: "nodeOnlyImportInAdmin",
      data: { source: value },
    })
  }
}

export const rule = createRule<[], MessageIds>({
  name: "admin-no-medusa-utils-import",
  meta: {
    type: "problem",
    docs: {
      description:
        "Don't import Node-only framework modules (`@medusajs/framework/utils`, `@medusajs/framework/http`, `@medusajs/framework/workflows-sdk`) in admin code — they break the browser bundle.",
    },
    messages: {
      nodeOnlyImportInAdmin:
        "`{{ source }}` is a Node-only module and must not be imported in admin code — it breaks the browser bundle. Move this logic to the server (a workflow, API route, or module service) and call it from the admin via the JS SDK.",
    },
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
