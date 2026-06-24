import type { TSESTree } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import {
  createWorkflowSdkBindings,
  isInWorkflowDefinitionScope,
  trackWorkflowSdkImports,
  WorkflowSdkBindings,
} from "../../util/workflow-scope"

type MessageIds = "newDateInWorkflow" | "dateMethodInWorkflow"

const isDateIdentifier = (node: TSESTree.Node): boolean =>
  node.type === "Identifier" && node.name === "Date"

export const rule = createRule<[], MessageIds>({
  name: "no-new-date-in-workflow",
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow `new Date(...)` and any `Date.*(...)` static-method call directly inside a `createWorkflow` constructor or a `when().then()` callback. They evaluate at workflow-definition time, not execution time — wrap them in `transform` or compute inside a `createStep`.",
    },
    messages: {
      newDateInWorkflow:
        "Do not call `new Date(...)` inside a workflow constructor or a `when().then()` callback — it evaluates at definition time, not execution time. Wrap it in `transform({}, () => new Date())` or compute it inside a `createStep`.",
      dateMethodInWorkflow:
        "Do not call `Date.{{method}}(...)` inside a workflow constructor or a `when().then()` callback — it evaluates at definition time, not execution time. Wrap it in `transform({}, () => Date.{{method}}(...))` or compute it inside a `createStep`.",
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
      NewExpression(node) {
        if (bindings.createWorkflow.size === 0) return
        if (!isDateIdentifier(node.callee)) return
        if (!isInWorkflowDefinitionScope(node, bindings)) return
        context.report({ node, messageId: "newDateInWorkflow" })
      },
      CallExpression(node) {
        if (bindings.createWorkflow.size === 0) return
        const callee = node.callee
        if (
          callee.type !== "MemberExpression" ||
          callee.computed ||
          !isDateIdentifier(callee.object) ||
          callee.property.type !== "Identifier"
        ) {
          return
        }
        if (!isInWorkflowDefinitionScope(node, bindings)) return
        context.report({
          node,
          messageId: "dateMethodInWorkflow",
          data: { method: callee.property.name },
        })
      },
    }
  },
})

export default rule
