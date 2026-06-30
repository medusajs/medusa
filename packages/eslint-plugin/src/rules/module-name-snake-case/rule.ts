import type { TSESTree } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import { resolveStaticStringValue } from "../../util/ast"
import { FRAMEWORK_UTILS_SOURCE } from "../../constants"

type MessageIds = "invalidModuleName"

const MODULE_NAME = "Module"
const VALID_NAME_RE = /^[a-zA-Z0-9_]+$/

export const rule = createRule<[], MessageIds>({
  name: "module-name-snake-case",
  meta: {
    type: "problem",
    docs: {
      description:
        "The name passed to `Module(name, ...)` must contain only alphanumeric characters and underscores.",
    },
    messages: {
      invalidModuleName:
        "Module name {{name}} must contain only alphanumeric characters and underscores.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const moduleLocalNames = new Set<string>()

    return {
      ImportDeclaration(node) {
        if (node.source.value !== FRAMEWORK_UTILS_SOURCE) {
          return
        }
        for (const specifier of node.specifiers) {
          if (
            specifier.type === "ImportSpecifier" &&
            specifier.imported.type === "Identifier" &&
            specifier.imported.name === MODULE_NAME
          ) {
            moduleLocalNames.add(specifier.local.name)
          }
        }
      },

      CallExpression(node) {
        if (moduleLocalNames.size === 0) {
          return
        }
        const callee = node.callee
        if (
          callee.type !== "Identifier" ||
          !moduleLocalNames.has(callee.name)
        ) {
          return
        }
        const firstArg = node.arguments[0] as
          | TSESTree.CallExpressionArgument
          | undefined
        if (!firstArg) {
          return
        }
        const resolved = resolveStaticStringValue(
          firstArg,
          context.sourceCode.getScope(firstArg)
        )
        if (resolved === null) {
          return
        }
        if (VALID_NAME_RE.test(resolved.value)) {
          return
        }
        context.report({
          node: resolved.reportNode,
          messageId: "invalidModuleName",
          data: { name: JSON.stringify(resolved.value) },
        })
      },
    }
  },
})

export default rule
