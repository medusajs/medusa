import * as path from "path"
import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import { toPosix } from "../../util/filename"

type MessageIds = "wrongFileName"

const ADMIN_ROUTES_RE = /(?:^|\/)src\/admin\/routes\//
const ADMIN_ROUTES_RE_NO_SRC = /(?:^|\/)admin\/routes\//
const PAGE_BASENAMES = new Set(["page.tsx", "page.jsx"])
const ADMIN_SDK_SOURCE = "@medusajs/admin-sdk"
const DEFINE_ROUTE_CONFIG = "defineRouteConfig"

function isUnderAdminRoutesDir(filename: string): boolean {
  const posix = toPosix(filename)
  return ADMIN_ROUTES_RE.test(posix) || ADMIN_ROUTES_RE_NO_SRC.test(posix)
}

export const rule = createRule<[], MessageIds>({
  name: "ui-route-file-name-page-tsx",
  meta: {
    type: "problem",
    docs: {
      description:
        "UI route files under `src/admin/routes/` must be named `page.tsx`.",
    },
    messages: {
      wrongFileName:
        "UI route files under `src/admin/routes/` must be named `page.tsx`. Rename this file to `page.tsx`.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const filename = context.filename
    if (!filename || filename.startsWith("<")) return {}
    if (!isUnderAdminRoutesDir(filename)) return {}

    const basename = path.basename(filename)
    if (PAGE_BASENAMES.has(basename)) return {}

    const defineRouteConfigNames = new Set<string>()
    const callSites: TSESTree.CallExpression[] = []

    return {
      ImportDeclaration(node) {
        if (node.source.value !== ADMIN_SDK_SOURCE) return
        for (const spec of node.specifiers) {
          if (
            spec.type === AST_NODE_TYPES.ImportSpecifier &&
            spec.imported.type === AST_NODE_TYPES.Identifier &&
            spec.imported.name === DEFINE_ROUTE_CONFIG
          ) {
            defineRouteConfigNames.add(spec.local.name)
          }
        }
      },
      CallExpression(node) {
        if (node.callee.type === AST_NODE_TYPES.Identifier) {
          callSites.push(node)
        }
      },
      "Program:exit"(node) {
        for (const call of callSites) {
          if (
            call.callee.type === AST_NODE_TYPES.Identifier &&
            defineRouteConfigNames.has(call.callee.name)
          ) {
            context.report({ node, messageId: "wrongFileName" })
            return
          }
        }
      },
    }
  },
})

export default rule
