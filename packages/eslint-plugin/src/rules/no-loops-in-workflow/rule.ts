import type { TSESTree } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import {
  createWorkflowSdkBindings,
  isInWorkflowDefinitionScope,
  trackWorkflowSdkImports,
  WorkflowSdkBindings,
} from "../../util/workflow-scope"

type MessageIds = "loopInWorkflow"

type LoopNode =
  | TSESTree.ForStatement
  | TSESTree.ForInStatement
  | TSESTree.ForOfStatement
  | TSESTree.WhileStatement
  | TSESTree.DoWhileStatement

export const rule = createRule<[], MessageIds>({
  name: "no-loops-in-workflow",
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow `for`, `for-in`, `for-of`, `while`, and `do-while` loops directly inside a `createWorkflow` constructor or a `when().then()` callback. Use `transform` for input prep, or loop outside the workflow (around `.run()`).",
    },
    messages: {
      loopInWorkflow:
        "Do not use loops inside a workflow constructor or a `when().then()` callback — they run at definition time, not execution time. Use `transform` for input preparation, or loop outside the workflow around `.run()`.",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    const bindings: WorkflowSdkBindings = createWorkflowSdkBindings()

    const check = (node: LoopNode) => {
      if (bindings.createWorkflow.size === 0) return
      if (!isInWorkflowDefinitionScope(node, bindings)) return
      context.report({ node, messageId: "loopInWorkflow" })
    }

    return {
      ImportDeclaration(node) {
        trackWorkflowSdkImports(node, bindings)
      },
      ForStatement: check,
      ForInStatement: check,
      ForOfStatement: check,
      WhileStatement: check,
      DoWhileStatement: check,
    }
  },
})

export default rule
