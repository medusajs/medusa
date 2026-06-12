import { AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils"
import { ADMIN_SDK_SOURCE } from "../../constants"
import { createRule } from "../../create-rule"

type MessageIds = "mustBeStringLiteral" | "templateLiteralMustBeString"

const DEFINE_WIDGET_CONFIG = "defineWidgetConfig"

function isStringLiteral(node: TSESTree.Node): boolean {
  return (
    node.type === AST_NODE_TYPES.Literal && typeof node.value === "string"
  )
}

export const rule = createRule<[], MessageIds>({
  name: "widget-zone-must-be-string-literal",
  meta: {
    type: "problem",
    docs: {
      description:
        "Widget `zone` in `defineWidgetConfig` must be a string literal (or array of string literals).",
    },
    messages: {
      mustBeStringLiteral:
        "Widget `zone` must be a string literal or array of string literals, not {{kind}}.",
      templateLiteralMustBeString:
        "Widget `zone` must be a string literal. Template literals are not allowed; use a plain string instead.",
    },
    fixable: "code",
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const localNames = new Set<string>()

    function checkZoneValue(value: TSESTree.Node) {
      if (isStringLiteral(value)) return

      if (value.type === AST_NODE_TYPES.TemplateLiteral) {
        if (value.expressions.length === 0 && value.quasis.length === 1) {
          context.report({
            node: value,
            messageId: "templateLiteralMustBeString",
            fix(fixer) {
              const cooked = value.quasis[0].value.cooked ?? ""
              const raw = cooked.replace(/(["\\])/g, "\\$1")
              return fixer.replaceText(value, `"${raw}"`)
            },
          })
          return
        }
        context.report({
          node: value,
          messageId: "templateLiteralMustBeString",
        })
        return
      }

      if (value.type === AST_NODE_TYPES.ArrayExpression) {
        for (const element of value.elements) {
          if (!element) continue
          if (element.type === AST_NODE_TYPES.SpreadElement) {
            context.report({
              node: element,
              messageId: "mustBeStringLiteral",
              data: { kind: "a spread element" },
            })
            continue
          }
          if (isStringLiteral(element)) continue
          if (element.type === AST_NODE_TYPES.TemplateLiteral) {
            checkZoneValue(element)
            continue
          }
          context.report({
            node: element,
            messageId: "mustBeStringLiteral",
            data: { kind: describeKind(element) },
          })
        }
        return
      }

      context.report({
        node: value,
        messageId: "mustBeStringLiteral",
        data: { kind: describeKind(value) },
      })
    }

    return {
      ImportDeclaration(node) {
        if (node.source.value !== ADMIN_SDK_SOURCE) return
        for (const spec of node.specifiers) {
          if (
            spec.type === AST_NODE_TYPES.ImportSpecifier &&
            spec.imported.type === AST_NODE_TYPES.Identifier &&
            spec.imported.name === DEFINE_WIDGET_CONFIG
          ) {
            localNames.add(spec.local.name)
          }
        }
      },
      CallExpression(node) {
        if (
          node.callee.type !== AST_NODE_TYPES.Identifier ||
          !localNames.has(node.callee.name)
        ) {
          return
        }
        const first = node.arguments[0]
        if (!first || first.type !== AST_NODE_TYPES.ObjectExpression) return
        for (const prop of first.properties) {
          if (prop.type !== AST_NODE_TYPES.Property) continue
          if (prop.computed) continue
          const key = prop.key
          const keyName =
            key.type === AST_NODE_TYPES.Identifier
              ? key.name
              : key.type === AST_NODE_TYPES.Literal && typeof key.value === "string"
                ? key.value
                : null
          if (keyName !== "zone") continue
          checkZoneValue(prop.value as TSESTree.Node)
        }
      },
    }
  },
})

function describeKind(node: TSESTree.Node): string {
  switch (node.type) {
    case AST_NODE_TYPES.Identifier:
      return "a variable reference"
    case AST_NODE_TYPES.MemberExpression:
      return "a member expression"
    case AST_NODE_TYPES.CallExpression:
      return "a function call"
    case AST_NODE_TYPES.ConditionalExpression:
      return "a conditional expression"
    case AST_NODE_TYPES.Literal:
      return "a non-string literal"
    default:
      return "a dynamic expression"
  }
}

export default rule
