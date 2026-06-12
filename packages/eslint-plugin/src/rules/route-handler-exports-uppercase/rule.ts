import * as path from "path"
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import { isUnderApiDir } from "../../util/api-route"

type MessageIds = "lowercaseHandler"

const LOWERCASE_HTTP_METHODS = new Set([
  "get",
  "post",
  "put",
  "patch",
  "delete",
  "head",
  "options",
])

const ROUTE_FILE_BASENAMES = new Set(["route.ts", "route.js"])

export const rule = createRule<[], MessageIds>({
  name: "route-handler-exports-uppercase",
  meta: {
    type: "problem",
    docs: {
      description:
        "API route handler exports must be uppercase HTTP method names (GET, POST, ...). Lowercase exports are ignored by the framework.",
    },
    fixable: "code",
    messages: {
      lowercaseHandler:
        "Route handler exports must be uppercase. Rename `{{name}}` to `{{upper}}` — lowercase exports are ignored by the framework.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const filename = context.filename
    if (!filename || filename.startsWith("<")) return {}
    if (!isUnderApiDir(filename)) return {}
    if (!ROUTE_FILE_BASENAMES.has(path.basename(filename))) return {}

    function reportIdentifier(id: TSESTree.Identifier) {
      const name = id.name
      if (!LOWERCASE_HTTP_METHODS.has(name)) return
      const upper = name.toUpperCase()
      context.report({
        node: id,
        messageId: "lowercaseHandler",
        data: { name, upper },
        fix(fixer) {
          return fixer.replaceText(id, upper)
        },
      })
    }

    function reportStringLiteral(
      node: TSESTree.StringLiteral,
      name: string
    ) {
      const upper = name.toUpperCase()
      context.report({
        node,
        messageId: "lowercaseHandler",
        data: { name, upper },
        fix(fixer) {
          return fixer.replaceText(node, JSON.stringify(upper))
        },
      })
    }

    return {
      ExportNamedDeclaration(node) {
        if (node.declaration) {
          const decl = node.declaration
          if (decl.type === AST_NODE_TYPES.FunctionDeclaration && decl.id) {
            reportIdentifier(decl.id)
          } else if (decl.type === AST_NODE_TYPES.VariableDeclaration) {
            for (const d of decl.declarations) {
              if (d.id.type === AST_NODE_TYPES.Identifier) {
                reportIdentifier(d.id)
              }
            }
          }
        }

        for (const spec of node.specifiers) {
          if (spec.type !== AST_NODE_TYPES.ExportSpecifier) continue
          const exported = spec.exported
          if (exported.type === AST_NODE_TYPES.Identifier) {
            reportIdentifier(exported)
          } else if (
            exported.type === AST_NODE_TYPES.Literal &&
            typeof exported.value === "string" &&
            LOWERCASE_HTTP_METHODS.has(exported.value)
          ) {
            reportStringLiteral(
              exported as TSESTree.StringLiteral,
              exported.value
            )
          }
        }
      },
    }
  },
})

export default rule
