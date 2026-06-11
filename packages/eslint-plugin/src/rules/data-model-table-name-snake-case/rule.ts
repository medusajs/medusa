import type { TSESTree } from "@typescript-eslint/utils"
import { AST_NODE_TYPES } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import { resolveStaticStringValue } from "../../util/ast"
import { SNAKE_CASE_RE, toSnake } from "../../util/strings"
import { FRAMEWORK_UTILS_SOURCE } from "../../constants"

type MessageIds = "invalidTableName"

const MODEL_IMPORT = "model"
const DEFINE_METHOD = "define"

export const rule = createRule<[], MessageIds>({
  name: "data-model-table-name-snake-case",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "The name passed to `model.define(name, ...)` must be snake_case.",
    },
    messages: {
      invalidTableName:
        "Data model name {{name}} must be snake_case (lowercase letters, digits, and underscores; must start with a letter).",
    },
    fixable: "code",
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const modelLocalNames = new Set<string>()

    return {
      ImportDeclaration(node) {
        if (node.source.value !== FRAMEWORK_UTILS_SOURCE) return
        for (const specifier of node.specifiers) {
          if (
            specifier.type === AST_NODE_TYPES.ImportSpecifier &&
            specifier.imported.type === AST_NODE_TYPES.Identifier &&
            specifier.imported.name === MODEL_IMPORT
          ) {
            modelLocalNames.add(specifier.local.name)
          }
        }
      },

      CallExpression(node) {
        if (modelLocalNames.size === 0) return
        const callee = node.callee
        if (
          callee.type !== AST_NODE_TYPES.MemberExpression ||
          callee.computed ||
          callee.property.type !== AST_NODE_TYPES.Identifier ||
          callee.property.name !== DEFINE_METHOD ||
          callee.object.type !== AST_NODE_TYPES.Identifier ||
          !modelLocalNames.has(callee.object.name)
        ) {
          return
        }
        const firstArg = node.arguments[0] as
          | TSESTree.CallExpressionArgument
          | undefined
        if (!firstArg) return
        const resolved = resolveStaticStringValue(
          firstArg,
          context.sourceCode.getScope(firstArg)
        )
        if (resolved === null) return
        if (SNAKE_CASE_RE.test(resolved.value)) return

        const fixed = toSnake(resolved.value)
        const canFix =
          fixed.length > 0 &&
          SNAKE_CASE_RE.test(fixed) &&
          resolved.reportNode.type === AST_NODE_TYPES.Literal

        context.report({
          node: resolved.reportNode,
          messageId: "invalidTableName",
          data: { name: JSON.stringify(resolved.value) },
          fix: canFix
            ? (fixer) => {
                const raw = (resolved.reportNode as TSESTree.Literal).raw
                const quote = raw.startsWith("'") ? "'" : '"'
                return fixer.replaceText(
                  resolved.reportNode,
                  `${quote}${fixed}${quote}`
                )
              }
            : null,
        })
      },
    }
  },
})

export default rule
