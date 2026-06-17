import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils"
import { ADMIN_SDK_SOURCE } from "../../constants"
import { createRule } from "../../create-rule"
import { isDynamicUiRoutePath } from "../../util/admin-scope"

type MessageIds = "configOnDynamicRoute"

const DEFINE_ROUTE_CONFIG = "defineRouteConfig"

export const rule = createRule<[], MessageIds>({
  name: "no-config-on-dynamic-ui-route",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Dynamic UI routes (e.g. `[id]/page.tsx`) must not use `defineRouteConfig` — they aren't added to the sidebar.",
    },
    messages: {
      configOnDynamicRoute:
        "Dynamic UI routes aren't added to the sidebar, so `defineRouteConfig` has no effect here and the framework warns at runtime. Remove it from this dynamic route.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    // Only dynamic routes are affected — a non-dynamic route's `defineRouteConfig`
    // is fine (and enforced by `ui-route-config-via-define-route-config`).
    if (!isDynamicUiRoutePath(context.filename)) {
      return {}
    }

    const defineRouteConfigLocalNames = new Set<string>()
    // Every `defineRouteConfig(...)` call we find, reported at `Program:exit`
    // so import tracking (which may appear after a call in source order) is
    // complete before we decide.
    const callNodes: TSESTree.CallExpression[] = []

    return {
      ImportDeclaration(node: TSESTree.ImportDeclaration) {
        if (node.source.value !== ADMIN_SDK_SOURCE) {
          return
        }
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
      CallExpression(node: TSESTree.CallExpression) {
        if (node.callee.type === AST_NODE_TYPES.Identifier) {
          callNodes.push(node)
        }
      },
      "Program:exit"() {
        for (const node of callNodes) {
          const callee = node.callee as TSESTree.Identifier
          if (defineRouteConfigLocalNames.has(callee.name)) {
            context.report({ node, messageId: "configOnDynamicRoute" })
          }
        }
      },
    }
  },
})

export default rule
