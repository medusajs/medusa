import type { TSESTree } from "@typescript-eslint/utils"
import { AST_NODE_TYPES } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import { isUndefinedExpression } from "../../util/ast"
import {
  createWorkflowSdkBindings,
  getEnclosingFunction,
  isWorkflowConstructorFunction,
  trackWorkflowSdkImports,
  WORKFLOW_RESPONSE,
  WORKFLOWS_SDK_SOURCE,
} from "../../util/workflow-scope"

type MessageIds = "missingWorkflowResponse"

export const rule = createRule<[], MessageIds>({
  name: "workflow-must-return-workflow-response",
  meta: {
    type: "problem",
    docs: {
      description:
        "A `createWorkflow` constructor that returns a value must return `new WorkflowResponse(...)`.",
    },
    fixable: "code",
    messages: {
      missingWorkflowResponse:
        "Workflow constructors must wrap their return value in `new WorkflowResponse(...)`.",
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
        if (bindings.createWorkflow.size === 0) {
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
        if (!isWorkflowConstructorFunction(fn, bindings)) {
          return
        }

        const arg = node.argument
        if (
          arg.type === AST_NODE_TYPES.NewExpression &&
          arg.callee.type === AST_NODE_TYPES.Identifier &&
          bindings.workflowResponse.has(arg.callee.name)
        ) {
          return
        }

        context.report({
          node: arg,
          messageId: "missingWorkflowResponse",
          fix(fixer) {
            const argText = context.sourceCode.getText(arg)

            if (bindings.workflowResponse.size > 0) {
              const name = bindings.workflowResponse.values().next()
                .value as string
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
            bindings.workflowResponse.add(WORKFLOW_RESPONSE)
            return [
              fixer.insertTextAfter(lastSpecifier, `, ${WORKFLOW_RESPONSE}`),
              fixer.replaceText(arg, `new ${WORKFLOW_RESPONSE}(${argText})`),
            ]
          },
        })
      },
    }
  },
})

export default rule
