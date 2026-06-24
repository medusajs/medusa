import { createRule } from "../../create-rule"
import {
  createWorkflowSdkBindings,
  isInWorkflowDefinitionScope,
  trackWorkflowSdkImports,
} from "../../util/workflow-scope"

type MessageIds = "spreadInWorkflow" | "restInWorkflow"

export const rule = createRule<[], MessageIds>({
  name: "no-spread-in-workflow",
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow spread (`...`) and rest (`...`) elements directly inside a `createWorkflow` constructor or a `when().then()` callback. Wrap object/array manipulation in `transform(...)` so it runs at execution time.",
    },
    messages: {
      spreadInWorkflow:
        "Do not use the spread operator (`...`) inside a workflow constructor or `when().then()` callback — it evaluates at workflow-definition time, not execution time. Move the operation into a `transform(...)` callback or a `createStep` instead.",
      restInWorkflow:
        "Do not use rest destructuring (`...`) inside a workflow constructor or `when().then()` callback — it evaluates at workflow-definition time, not execution time. Move the operation into a `transform(...)` callback or a `createStep` instead.",
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

      SpreadElement(node) {
        if (bindings.createWorkflow.size === 0) return
        if (!isInWorkflowDefinitionScope(node, bindings)) return
        context.report({
          node,
          messageId: "spreadInWorkflow",
        })
      },

      RestElement(node) {
        if (bindings.createWorkflow.size === 0) return
        if (!isInWorkflowDefinitionScope(node, bindings)) return
        context.report({
          node,
          messageId: "restInWorkflow",
        })
      },
    }
  },
})

export default rule
