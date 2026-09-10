import { AST_NODE_TYPES } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import {
  createWorkflowSdkBindings,
  getEnclosingFunction,
  isWhenThenCallbackFunction,
  trackWorkflowSdkImports,
} from "../../util/workflow-scope"

type MessageIds = "nestedWhenInWorkflow"

export const rule = createRule<[], MessageIds>({
  name: "no-nested-when-in-workflow",
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow calling `when(...)` inside a `when().then()` callback in a workflow composition function. `when` tracks its pending condition in a single shared slot rather than a stack, so the inner `.then()` clears that slot before the outer `.then()` reads it — the workflow throws a `TypeError` at server boot instead of failing at build time.",
    },
    messages: {
      nestedWhenInWorkflow:
        "Do not call `when(...)` inside another `when().then()` callback. `when` keeps its pending condition in one shared slot, so the inner `.then()` clears it before the outer `.then()` can read it — this throws `TypeError: Cannot read properties of undefined (reading 'steps')` at server boot, not at build time. Restructure into sibling `when(...).then(...)` calls instead of nesting them.",
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
        if (bindings.when.size === 0) {
          return
        }
        if (node.callee.type !== AST_NODE_TYPES.Identifier) {
          return
        }
        if (!bindings.when.has(node.callee.name)) {
          return
        }
        const fn = getEnclosingFunction(node)
        if (!fn) {
          return
        }
        if (!isWhenThenCallbackFunction(fn, bindings)) {
          return
        }
        context.report({
          node,
          messageId: "nestedWhenInWorkflow",
        })
      },
    }
  },
})

export default rule
