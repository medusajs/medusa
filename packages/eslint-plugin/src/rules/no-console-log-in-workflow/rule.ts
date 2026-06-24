import { AST_NODE_TYPES } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import {
  createWorkflowSdkBindings,
  isInWorkflowDefinitionScope,
  trackWorkflowSdkImports,
} from "../../util/workflow-scope"

type MessageIds = "consoleInWorkflow"

const CONSOLE_METHODS = new Set([
  "log",
  "info",
  "warn",
  "error",
  "debug",
  "trace",
  "dir",
])

export const rule = createRule<[], MessageIds>({
  name: "no-console-log-in-workflow",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Disallow `console.log` (and other `console.*` calls) directly inside a `createWorkflow` constructor or a `when().then()` callback. Both run at workflow-definition time, not execution time — move logs into a `createStep` callback so they run when the workflow actually executes.",
    },
    messages: {
      consoleInWorkflow:
        "`console.{{method}}` inside a workflow constructor or a `when().then()` callback runs at workflow-definition time, not execution time, so it only logs when the workflow is registered. Move logging into a `createStep(...)` callback if you want it to run on each workflow execution.",
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
        if (bindings.createWorkflow.size === 0) return
        const callee = node.callee
        if (callee.type !== AST_NODE_TYPES.MemberExpression) return
        if (callee.computed) return
        if (
          callee.object.type !== AST_NODE_TYPES.Identifier ||
          callee.object.name !== "console"
        ) {
          return
        }
        if (callee.property.type !== AST_NODE_TYPES.Identifier) return
        const method = callee.property.name
        if (!CONSOLE_METHODS.has(method)) return
        if (!isInWorkflowDefinitionScope(node, bindings)) return
        context.report({
          node,
          messageId: "consoleInWorkflow",
          data: { method },
        })
      },
    }
  },
})

export default rule
