import * as path from "path"
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import { isUnderApiDir } from "../../util/api-route"

type MessageIds = "wrongFileName" | "noHttpExports"

const HTTP_METHODS = new Set([
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS",
])

const ROUTE_FILE_BASENAMES = new Set(["route.ts", "route.js"])

function collectExportedHttpMethodNodes(
  node: TSESTree.ExportNamedDeclaration
): TSESTree.Node[] {
  const hits: TSESTree.Node[] = []

  if (node.declaration) {
    const decl = node.declaration
    if (decl.type === AST_NODE_TYPES.FunctionDeclaration && decl.id) {
      if (HTTP_METHODS.has(decl.id.name)) hits.push(decl.id)
    } else if (decl.type === AST_NODE_TYPES.VariableDeclaration) {
      for (const d of decl.declarations) {
        if (
          d.id.type === AST_NODE_TYPES.Identifier &&
          HTTP_METHODS.has(d.id.name)
        ) {
          hits.push(d.id)
        }
      }
    }
  }

  for (const spec of node.specifiers) {
    if (spec.type !== AST_NODE_TYPES.ExportSpecifier) continue
    const exported = spec.exported
    const exportedName =
      exported.type === AST_NODE_TYPES.Identifier
        ? exported.name
        : typeof exported.value === "string"
          ? exported.value
          : null
    if (exportedName && HTTP_METHODS.has(exportedName)) {
      hits.push(exported)
    }
  }

  return hits
}

export const rule = createRule<[], MessageIds>({
  name: "route-file-naming",
  meta: {
    type: "problem",
    docs: {
      description:
        "API route handler files must be named `route.ts` / `route.js` and live under `src/api/`.",
    },
    messages: {
      wrongFileName:
        "API route handlers must be exported from `route.ts` or `route.js`. Move this `{{name}}` handler into a `route.{ts,js}` file.",
      noHttpExports:
        "`route.{ts,js}` files must export at least one HTTP method handler (GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS).",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const filename = context.filename
    if (!filename || filename.startsWith("<")) return {}
    if (!isUnderApiDir(filename)) return {}

    const basename = path.basename(filename)
    const isRouteFile = ROUTE_FILE_BASENAMES.has(basename)

    const httpExports: TSESTree.Node[] = []

    return {
      ExportNamedDeclaration(node) {
        for (const hit of collectExportedHttpMethodNodes(node)) {
          httpExports.push(hit)
        }
      },

      "Program:exit"(node) {
        if (!isRouteFile) {
          for (const hit of httpExports) {
            const name =
              hit.type === AST_NODE_TYPES.Identifier
                ? hit.name
                : hit.type === AST_NODE_TYPES.Literal &&
                    typeof hit.value === "string"
                  ? hit.value
                  : "handler"
            context.report({
              node: hit,
              messageId: "wrongFileName",
              data: { name },
            })
          }
          return
        }

        if (httpExports.length === 0) {
          context.report({ node, messageId: "noHttpExports" })
        }
      },
    }
  },
})

export default rule
