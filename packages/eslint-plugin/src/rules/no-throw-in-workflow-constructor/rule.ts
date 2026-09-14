import { createRule } from "../../create-rule"
import {
  createWorkflowSdkBindings,
  isInWorkflowDefinitionScope,
  trackWorkflowSdkImports,
} from "../../util/workflow-scope"

type MessageIds = "throwInWorkflowConstructor"

export const rule = createRule<[], MessageIds>({
  name: "no-throw-in-workflow-constructor",
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow `throw` statements directly inside a `createWorkflow` constructor or a `when().then()` callback. Both run at definition time, not execution time — a bare throw there skips the compensation mechanism, leaving previously executed steps uncompensated.",
    },
    messages: {
      throwInWorkflowConstructor:
        "Do not throw inside a workflow constructor or a `when().then()` callback — both run at definition time, not execution time, so a throw here bypasses compensation for any steps that already ran. Extract the check into a validation step (as `MedusaError`) so a failure triggers compensation.",
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

      ThrowStatement(node) {
        if (bindings.createWorkflow.size === 0) {
          return
        }
        if (!isInWorkflowDefinitionScope(node, bindings)) {
          return
        }
        context.report({
          node,
          messageId: "throwInWorkflowConstructor",
        })
      },
    }
  },
})

export default rule
