import { createRule } from "../../create-rule"
import {
  createWorkflowSdkBindings,
  isInTransformCallback,
  trackWorkflowSdkImports,
} from "../../util/workflow-scope"

type MessageIds = "throwInTransform"

export const rule = createRule<[], MessageIds>({
  name: "no-throw-in-transform",
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow `throw` statements inside a `transform()` callback. Use a validation step or `when-then` instead.",
    },
    messages: {
      throwInTransform:
        "Do not throw inside a `transform()` callback — transform runs at workflow-definition time and its errors don't surface as workflow failures. Create a validation step or use `when-then` to gate the work.",
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
        if (bindings.transform.size === 0) {
          return
        }
        if (!isInTransformCallback(node, bindings)) {
          return
        }
        context.report({
          node,
          messageId: "throwInTransform",
        })
      },
    }
  },
})

export default rule
