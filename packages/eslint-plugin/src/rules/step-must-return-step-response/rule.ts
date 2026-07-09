import type { TSESTree } from "@typescript-eslint/utils"
import { AST_NODE_TYPES } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import { isUndefinedExpression, unwrapTsExpression } from "../../util/ast"
import {
  createWorkflowSdkBindings,
  getEnclosingFunction,
  isStepCallbackFunction,
  STEP_RESPONSE,
  trackWorkflowSdkImports,
  WORKFLOWS_SDK_SOURCE,
} from "../../util/workflow-scope"

type MessageIds = "missingStepResponse"

/**
 * Static `StepResponse` factories that return a valid step response:
 * - `skip()` short-circuits a step.
 * - `permanentFailure()` marks the step as permanently failed.
 */
const STATIC_FACTORY_METHODS = new Set(["skip", "permanentFailure"])

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
        if (bindings.createStep.size === 0) {
          return
        }
        if (!node.argument) {
          return
        }
        if (isUndefinedExpression(node.argument)) {
          return
        }

        const fn = getEnclosingFunction(node)
        if (!fn) {
          return
        }
        if (!isStepCallbackFunction(fn, bindings)) {
          return
        }

        const arg = node.argument
        // Inspect the underlying expression, ignoring TS-only wrappers like
        // `as any` — `return StepResponse.skip() as any` is still valid.
        const value = unwrapTsExpression(arg)
        if (
          value.type === AST_NODE_TYPES.NewExpression &&
          value.callee.type === AST_NODE_TYPES.Identifier &&
          bindings.stepResponse.has(value.callee.name)
        ) {
          return
        }

        // `StepResponse.skip()` / `StepResponse.permanentFailure()` are static
        // factories that produce a valid StepResponse — a valid step return.
        if (
          value.type === AST_NODE_TYPES.CallExpression &&
          value.callee.type === AST_NODE_TYPES.MemberExpression &&
          !value.callee.computed &&
          value.callee.object.type === AST_NODE_TYPES.Identifier &&
          bindings.stepResponse.has(value.callee.object.name) &&
          value.callee.property.type === AST_NODE_TYPES.Identifier &&
          STATIC_FACTORY_METHODS.has(value.callee.property.name)
        ) {
          return
        }

        context.report({
          node: arg,
          messageId: "missingStepResponse",
          fix(fixer) {
            const argText = context.sourceCode.getText(arg)

            if (bindings.stepResponse.size > 0) {
              const name = bindings.stepResponse.values().next().value as string
              return fixer.replaceText(arg, `new ${name}(${argText})`)
            }

            if (!workflowsSdkImportNode) {
              return null
            }
            const importNode = workflowsSdkImportNode
            const specifiers = importNode.specifiers.filter(
              (s): s is TSESTree.ImportSpecifier =>
                s.type === AST_NODE_TYPES.ImportSpecifier
            )
            if (specifiers.length === 0) {
              return null
            }

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
