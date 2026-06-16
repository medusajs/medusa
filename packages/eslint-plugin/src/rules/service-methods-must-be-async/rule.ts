import type { TSESTree } from "@typescript-eslint/utils"
import { AST_NODE_TYPES } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import { returnTypeIsPromise } from "../../util/ast"
import {
  createMedusaServiceBindings,
  isServiceClass,
  trackMedusaServiceImports,
} from "../../util/service-scope"

type MessageIds = "methodMustBeAsync"

export const rule = createRule<[], MessageIds>({
  name: "service-methods-must-be-async",
  meta: {
    type: "problem",
    docs: {
      description:
        "All public methods on a service class (extends `MedusaService(...)` or class name ends with `Service`) must be `async` (or return a `Promise`). Medusa always awaits service method calls.",
    },
    fixable: "code",
    messages: {
      methodMustBeAsync:
        "Public methods on a service class must be `async` (or return a `Promise`). Add `async` or annotate the method with a `Promise<...>` return type.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const bindings = createMedusaServiceBindings()

    function checkClass(node: TSESTree.ClassDeclaration | TSESTree.ClassExpression) {
      if (!isServiceClass(node, bindings)) return

      for (const member of node.body.body) {
        if (member.type !== AST_NODE_TYPES.MethodDefinition) continue
        if (member.kind === "constructor") continue
        if (
          member.accessibility === "private" ||
          member.accessibility === "protected"
        ) {
          continue
        }
        if (member.computed) continue

        const value = member.value
        if (
          value.type !== AST_NODE_TYPES.FunctionExpression &&
          value.type !== AST_NODE_TYPES.TSEmptyBodyFunctionExpression
        ) {
          continue
        }

        if ((value as TSESTree.FunctionExpression).async) continue
        if (returnTypeIsPromise(value)) continue

        const canAutofix = member.kind === "method"

        context.report({
          node: member.key,
          messageId: "methodMustBeAsync",
          fix: canAutofix
            ? (fixer) => fixer.insertTextBefore(member.key, "async ")
            : undefined,
        })
      }
    }

    return {
      ImportDeclaration(node) {
        trackMedusaServiceImports(node, bindings)
      },

      ClassDeclaration: checkClass,
      ClassExpression: checkClass,
    }
  },
})

export default rule
