import type { TSESTree } from "@typescript-eslint/utils"
import { AST_NODE_TYPES } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import {
  createWorkflowSdkBindings,
  trackWorkflowSdkImports,
} from "../../util/workflow-scope"

type MessageIds = "asyncWorkflowConstructor"

export const rule = createRule<[], MessageIds>({
  name: "no-async-workflow-constructor",
  meta: {
    type: "problem",
    docs: {
      description:
        "The function passed to `createWorkflow` must not be `async`. Workflow constructors run at definition time, not execution time.",
    },
    fixable: "code",
    messages: {
      asyncWorkflowConstructor:
        "The function passed to `createWorkflow` must not be `async`. Workflow constructors are evaluated at definition time and cannot await; use steps for asynchronous work.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const bindings = createWorkflowSdkBindings()

    return {
      ImportDeclaration(node) {
        trackWorkflowSdkImports(node, bindings)
      },

      CallExpression(node) {
        if (
          node.callee.type !== AST_NODE_TYPES.Identifier ||
          !bindings.createWorkflow.has(node.callee.name)
        ) {
          return
        }

        const constructor = node.arguments[1]
        if (
          !constructor ||
          (constructor.type !== AST_NODE_TYPES.ArrowFunctionExpression &&
            constructor.type !== AST_NODE_TYPES.FunctionExpression) ||
          !constructor.async
        ) {
          return
        }

        const fn = constructor as
          | TSESTree.ArrowFunctionExpression
          | TSESTree.FunctionExpression

        context.report({
          node: fn,
          messageId: "asyncWorkflowConstructor",
          fix(fixer) {
            const sourceCode = context.sourceCode ?? context.getSourceCode()
            const asyncToken = sourceCode.getFirstToken(fn)
            if (!asyncToken || asyncToken.value !== "async") return null
            const nextToken = sourceCode.getTokenAfter(asyncToken)
            if (!nextToken) return null
            return fixer.removeRange([asyncToken.range[0], nextToken.range[0]])
          },
        })
      },
    }
  },
})

export default rule
