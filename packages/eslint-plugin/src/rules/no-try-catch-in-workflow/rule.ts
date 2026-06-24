import { createRule } from "../../create-rule"
import {
  createWorkflowSdkBindings,
  isInWorkflowDefinitionScope,
  trackWorkflowSdkImports,
} from "../../util/workflow-scope"

type MessageIds = "tryCatchInWorkflow"

export const rule = createRule<[], MessageIds>({
  name: "no-try-catch-in-workflow",
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow `try/catch` statements directly inside a `createWorkflow` constructor or a `when().then()` callback. Use steps with compensation functions, `throwOnError: false`, or `skipOnPermanentFailure` / `continueOnPermanentFailure` instead.",
    },
    messages: {
      tryCatchInWorkflow:
        "Do not use `try/catch` inside a workflow constructor or a `when().then()` callback — both run at definition time, not execution time. Use steps with compensation functions, `throwOnError: false`, or `skipOnPermanentFailure` / `continueOnPermanentFailure` on the failing step.",
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

      TryStatement(node) {
        if (bindings.createWorkflow.size === 0) return
        if (!isInWorkflowDefinitionScope(node, bindings)) return
        context.report({
          node,
          messageId: "tryCatchInWorkflow",
        })
      },
    }
  },
})

export default rule
