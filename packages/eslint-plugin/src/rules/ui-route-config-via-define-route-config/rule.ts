import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils"
import { ADMIN_SDK_SOURCE } from "../../constants"
import { createRule } from "../../create-rule"
import { isDynamicUiRoutePath } from "../../util/admin-scope"

type MessageIds = "configNotDefineRouteConfig"

const DEFINE_ROUTE_CONFIG = "defineRouteConfig"

export const rule = createRule<[], MessageIds>({
  name: "ui-route-config-via-define-route-config",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "A UI route `config` export must be initialized via `defineRouteConfig(...)`.",
    },
    messages: {
      configNotDefineRouteConfig:
        "UI route `config` export must be initialized via `defineRouteConfig(...)` from `@medusajs/admin-sdk`.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    // Dynamic routes (e.g. `[id]/page.tsx`) aren't added to the sidebar, so
    // route `config` doesn't apply to them — skip the file entirely.
    if (isDynamicUiRoutePath(context.filename)) return {}

    const defineRouteConfigLocalNames = new Set<string>()
    // The `config` identifier(s) we report on, so the warning lands on the
    // config variable rather than its value.
    const badConfigNodes: TSESTree.Node[] = []

    function isDefineRouteConfigCall(node: TSESTree.Node | null): boolean {
      if (!node || node.type !== AST_NODE_TYPES.CallExpression) return false
      const callee = node.callee
      return (
        callee.type === AST_NODE_TYPES.Identifier &&
        defineRouteConfigLocalNames.has(callee.name)
      )
    }

    function declaratorName(decl: TSESTree.VariableDeclarator): string | null {
      if (decl.id.type === AST_NODE_TYPES.Identifier) return decl.id.name
      return null
    }

    return {
      ImportDeclaration(node: TSESTree.ImportDeclaration) {
        if (node.source.value !== ADMIN_SDK_SOURCE) return
        for (const spec of node.specifiers) {
          if (
            spec.type === AST_NODE_TYPES.ImportSpecifier &&
            spec.imported.type === AST_NODE_TYPES.Identifier &&
            spec.imported.name === DEFINE_ROUTE_CONFIG
          ) {
            defineRouteConfigLocalNames.add(spec.local.name)
          }
        }
      },
      ExportNamedDeclaration(node: TSESTree.ExportNamedDeclaration) {
        // export const config = defineRouteConfig(...)
        if (
          node.declaration &&
          node.declaration.type === AST_NODE_TYPES.VariableDeclaration
        ) {
          for (const decl of node.declaration.declarations) {
            if (declaratorName(decl) === "config" && decl.init) {
              if (!isDefineRouteConfigCall(decl.init)) {
                badConfigNodes.push(decl.id)
              }
            }
          }
        }
      },
      "Program:exit"() {
        for (const node of badConfigNodes) {
          context.report({ node, messageId: "configNotDefineRouteConfig" })
        }
      },
    }
  },
})

export default rule
