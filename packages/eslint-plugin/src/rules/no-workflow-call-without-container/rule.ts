import { AST_NODE_TYPES, ESLintUtils, TSESTree } from "@typescript-eslint/utils"
import * as ts from "typescript"
import { createRule } from "../../create-rule"

type MessageIds = "missingContainer"

const WORKFLOW_ALIAS_NAME = "ReturnWorkflow"
const MAX_DEPTH = 4

/**
 * Returns true when `type` (or any of its union/intersection constituents)
 * looks like a Medusa workflow — either the canonical `ReturnWorkflow<...>`
 * alias, or any type with the structural shape (a callable that also has
 * `run`, `runAsStep`, and `getName`).
 */
function isWorkflowType(type: ts.Type, depth = 0): boolean {
  if (depth > MAX_DEPTH) return false

  if (type.aliasSymbol?.name === WORKFLOW_ALIAS_NAME) return true
  if (type.getSymbol()?.name === WORKFLOW_ALIAS_NAME) return true

  if (type.isUnion() || type.isIntersection()) {
    return type.types.some((t) => isWorkflowType(t, depth + 1))
  }

  const hasRun = type.getProperty("run")
  const hasRunAsStep = type.getProperty("runAsStep")
  const hasGetName = type.getProperty("getName")
  const hasCallSignatures = type.getCallSignatures().length > 0

  return !!hasRun && !!hasRunAsStep && !!hasGetName && !!hasCallSignatures
}

function getNameFromExpression(node: TSESTree.Node): string {
  if (node.type === AST_NODE_TYPES.Identifier) return node.name
  if (
    node.type === AST_NODE_TYPES.MemberExpression &&
    node.property.type === AST_NODE_TYPES.Identifier
  ) {
    return node.property.name
  }
  return "workflow"
}

export const rule = createRule<[], MessageIds>({
  name: "no-workflow-call-without-container",
  meta: {
    type: "problem",
    docs: {
      description:
        "Workflow invocations must pass the Medusa container — `workflow(container).run({ input })`. Calling the workflow with no arguments or accessing `.run` directly bypasses container resolution.",
      requiresTypeChecking: true,
    },
    messages: {
      missingContainer:
        "Workflow `{{name}}` must be invoked with a container — use `{{name}}(container).run({ input })` instead.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const services = ESLintUtils.getParserServices(context)
    const checker = services.program.getTypeChecker()

    function getType(node: TSESTree.Node): ts.Type {
      const tsNode = services.esTreeNodeToTSNodeMap.get(node)
      return checker.getTypeAtLocation(tsNode)
    }

    return {
      // Flag `workflow()` — invoking a workflow value with no container argument.
      CallExpression(node) {
        if (node.arguments.length > 0) return
        if (
          node.callee.type !== AST_NODE_TYPES.Identifier &&
          node.callee.type !== AST_NODE_TYPES.MemberExpression
        ) {
          return
        }
        if (!isWorkflowType(getType(node.callee as TSESTree.Node))) return

        context.report({
          node,
          messageId: "missingContainer",
          data: { name: getNameFromExpression(node.callee as TSESTree.Node) },
        })
      },

      // Flag `workflow.run` — reaching for `.run` directly on the workflow
      // value without first invoking it with a container.
      MemberExpression(node) {
        if (node.computed) return
        if (node.property.type !== AST_NODE_TYPES.Identifier) return
        if (node.property.name !== "run") return
        if (!isWorkflowType(getType(node.object as TSESTree.Node))) return

        context.report({
          node,
          messageId: "missingContainer",
          data: { name: getNameFromExpression(node.object as TSESTree.Node) },
        })
      },
    }
  },
})

export default rule
