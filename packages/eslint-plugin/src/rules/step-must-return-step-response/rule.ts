import type { TSESTree } from "@typescript-eslint/utils"
import { AST_NODE_TYPES } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import { isUndefinedExpression } from "../../util/ast"
import {
  createWorkflowSdkBindings,
  getEnclosingFunction,
  isStepCallbackFunction,
  STEP_RESPONSE,
  trackWorkflowSdkImports,
  WORKFLOWS_SDK_SOURCE,
} from "../../util/workflow-scope"

type MessageIds = "missingStepResponse"

export const rule = createRule<[], MessageIds>({
  name: "step-must-return-step-response",
  meta: {
    type: "problem",
    docs: {
      description:
        "A `createStep` main (or compensation) callback that returns a value must return `new StepResponse(...)`.",
    },
    fixable: "code",
    messages: {
      missingStepResponse:
        "Step callbacks must wrap their return value in `new StepResponse(...)`.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const bindings = createWorkflowSdkBindings()
    let workflowsSdkImportNode: TSESTree.ImportDeclaration | null = null

    return {
      ImportDeclaration(node) {
        trackWorkflowSdkImports(node, bindings)
        if (node.source.value === WORKFLOWS_SDK_SOURCE) {
          workflowsSdkImportNode = node
        }
      },

      ReturnStatement(node) {
        if (bindings.createStep.size === 0) return
        if (!node.argument) return
        if (isUndefinedExpression(node.argument)) return

        const fn = getEnclosingFunction(node)
        if (!fn) return
        if (!isStepCallbackFunction(fn, bindings)) return

        const arg = node.argument
        if (
          arg.type === AST_NODE_TYPES.NewExpression &&
          arg.callee.type === AST_NODE_TYPES.Identifier &&
          bindings.stepResponse.has(arg.callee.name)
        ) {
          return
        }

        context.report({
          node: arg,
          messageId: "missingStepResponse",
          fix(fixer) {
            const argText = context.sourceCode.getText(arg)

            if (bindings.stepResponse.size > 0) {
              const name = bindings.stepResponse.values().next()
                .value as string
              return fixer.replaceText(arg, `new ${name}(${argText})`)
            }

            if (!workflowsSdkImportNode) return null
            const importNode = workflowsSdkImportNode
            const specifiers = importNode.specifiers.filter(
              (s): s is TSESTree.ImportSpecifier =>
                s.type === AST_NODE_TYPES.ImportSpecifier
            )
            if (specifiers.length === 0) return null

            const lastSpecifier = specifiers[specifiers.length - 1]
            bindings.stepResponse.add(STEP_RESPONSE)
            return [
              fixer.insertTextAfter(lastSpecifier, `, ${STEP_RESPONSE}`),
              fixer.replaceText(arg, `new ${STEP_RESPONSE}(${argText})`),
            ]
          },
        })
      },
    }
  },
})

export default rule
