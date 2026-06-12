import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils"
import { ADMIN_SDK_SOURCE } from "../../constants"
import { createRule } from "../../create-rule"

type MessageIds = "missingConfigExport" | "configNotDefineWidgetConfig"

const DEFINE_WIDGET_CONFIG = "defineWidgetConfig"

export const rule = createRule<[], MessageIds>({
  name: "widget-must-export-config",
  meta: {
    type: "problem",
    docs: {
      description:
        "Widget files must export a named `config` from `defineWidgetConfig(...)`.",
    },
    messages: {
      missingConfigExport:
        "Widget files must have a named export `config` initialized via `defineWidgetConfig(...)`.",
      configNotDefineWidgetConfig:
        "Widget `config` export must be initialized via `defineWidgetConfig(...)`.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const defineWidgetConfigLocalNames = new Set<string>()
    let hasConfigExport = false
    let badInitializerNode: TSESTree.Node | null = null

    function isDefineWidgetConfigCall(node: TSESTree.Node | null): boolean {
      if (!node || node.type !== AST_NODE_TYPES.CallExpression) return false
      const callee = node.callee
      return (
        callee.type === AST_NODE_TYPES.Identifier &&
        defineWidgetConfigLocalNames.has(callee.name)
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
            spec.imported.name === DEFINE_WIDGET_CONFIG
          ) {
            defineWidgetConfigLocalNames.add(spec.local.name)
          }
        }
      },
      ExportNamedDeclaration(node: TSESTree.ExportNamedDeclaration) {
        // export const config = defineWidgetConfig(...)
        if (
          node.declaration &&
          node.declaration.type === AST_NODE_TYPES.VariableDeclaration
        ) {
          for (const decl of node.declaration.declarations) {
            if (declaratorName(decl) === "config") {
              hasConfigExport = true
              if (!isDefineWidgetConfigCall(decl.init)) {
                badInitializerNode = decl.init ?? decl
              }
            }
          }
        }
        // export { foo as config }, export { config }, export { config } from "./x"
        for (const spec of node.specifiers) {
          if (
            spec.exported.type === AST_NODE_TYPES.Identifier &&
            spec.exported.name === "config"
          ) {
            hasConfigExport = true
          }
        }
      },
      "Program:exit"(node: TSESTree.Program) {
        if (!hasConfigExport) {
          context.report({ node, messageId: "missingConfigExport" })
          return
        }
        if (badInitializerNode) {
          context.report({
            node: badInitializerNode,
            messageId: "configNotDefineWidgetConfig",
          })
        }
      },
    }
  },
})

export default rule
