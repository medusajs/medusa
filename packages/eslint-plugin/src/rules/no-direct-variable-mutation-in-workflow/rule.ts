import type { TSESTree } from "@typescript-eslint/utils"
import { AST_NODE_TYPES } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import { isNonLiteralRef } from "../../util/ast"
import {
  createWorkflowSdkBindings,
  getEnclosingFunction,
  isInWorkflowDefinitionScope,
  isWhenThenCallbackFunction,
  trackWorkflowSdkImports,
  WorkflowSdkBindings,
} from "../../util/workflow-scope"

type MessageIds = "mutateInWorkflow" | "recomputeInWorkflow"

const ARITHMETIC_OPERATORS = new Set(["+", "-", "*", "/", "%", "**"])

const isConditionalHookAssignment = (
  node: TSESTree.AssignmentExpression,
  bindings: WorkflowSdkBindings
): boolean => {
  if (node.operator !== "=") {
    return false
  }
  if (node.left.type !== AST_NODE_TYPES.Identifier) {
    return false
  }
  if (
    node.right.type !== AST_NODE_TYPES.CallExpression ||
    node.right.callee.type !== AST_NODE_TYPES.Identifier ||
    !bindings.createHook.has(node.right.callee.name)
  ) {
    return false
  }
  const fn = getEnclosingFunction(node)
  return !!fn && isWhenThenCallbackFunction(fn, bindings)
}

export const rule = createRule<[], MessageIds>({
  name: "no-direct-variable-mutation-in-workflow",
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow mutating or recomputing variables directly inside a `createWorkflow` constructor or a `when().then()` callback. The constructor runs at workflow-definition time, so locals (step outputs, input, etc.) are placeholders, not real values — derive new values inside `transform` instead.",
    },
    messages: {
      mutateInWorkflow:
        "Do not mutate variables inside a workflow constructor — values are placeholders at definition time, not real values. Use `transform` to derive a new value.",
      recomputeInWorkflow:
        "Do not recompute variables (arithmetic / template literals) inside a workflow constructor — values are placeholders at definition time. Move the computation into `transform`.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const bindings: WorkflowSdkBindings = createWorkflowSdkBindings()

    return {
      ImportDeclaration(node) {
        trackWorkflowSdkImports(node, bindings)
      },
      AssignmentExpression(node) {
        if (bindings.createWorkflow.size === 0) {
          return
        }
        if (!isInWorkflowDefinitionScope(node, bindings)) {
          return
        }
        if (isConditionalHookAssignment(node, bindings)) {
          return
        }
        context.report({ node, messageId: "mutateInWorkflow" })
      },
      UpdateExpression(node) {
        if (bindings.createWorkflow.size === 0) {
          return
        }
        if (!isInWorkflowDefinitionScope(node, bindings)) {
          return
        }
        context.report({ node, messageId: "mutateInWorkflow" })
      },
      BinaryExpression(node) {
        if (bindings.createWorkflow.size === 0) {
          return
        }
        if (!ARITHMETIC_OPERATORS.has(node.operator)) {
          return
        }
        if (!isNonLiteralRef(node.left) && !isNonLiteralRef(node.right)) {
          return
        }
        if (!isInWorkflowDefinitionScope(node, bindings)) {
          return
        }
        context.report({ node, messageId: "recomputeInWorkflow" })
      },
      TemplateLiteral(node) {
        if (bindings.createWorkflow.size === 0) {
          return
        }
        if (node.expressions.length === 0) {
          return
        }
        if (!node.expressions.some((expr) => isNonLiteralRef(expr))) {
          return
        }
        if (!isInWorkflowDefinitionScope(node, bindings)) {
          return
        }
        context.report({ node, messageId: "recomputeInWorkflow" })
      },
    }
  },
})

export default rule
