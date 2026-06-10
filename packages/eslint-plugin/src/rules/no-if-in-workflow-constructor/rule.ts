import { createRule } from "../../create-rule"
import {
  createWorkflowSdkBindings,
  isInWorkflowDefinitionScope,
  trackWorkflowSdkImports,
} from "../../util/workflow-scope"

type MessageIds = "ifInWorkflowConstructor"

export const rule = createRule<[], MessageIds>({
  name: "no-if-in-workflow-constructor",
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow `if`/`else` statements directly inside a `createWorkflow` constructor or a `when().then()` callback. Both run at definition time — use `when(...).then(...)` to conditionally execute steps.",
    },
    messages: {
      ifInWorkflowConstructor:
        "Do not use `if` statements inside a workflow constructor or a `when().then()` callback — both run at definition time, not execution time. Use `when(...).then(...)` from `@medusajs/framework/workflows-sdk` to conditionally execute steps.",
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

      IfStatement(node) {
        if (bindings.createWorkflow.size === 0) return
        if (!isInWorkflowDefinitionScope(node, bindings)) return
        context.report({
          node,
          messageId: "ifInWorkflowConstructor",
        })
      },
    }
  },
})

export default rule
