import { AST_NODE_TYPES } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import {
  createWorkflowSdkBindings,
  isInWorkflowDefinitionScope,
  trackWorkflowSdkImports,
} from "../../util/workflow-scope"

type MessageIds =
  | "logicalExpression"
  | "conditionalExpression"
  | "negation"
  | "optionalChaining"
  | "equalityExpression"

const EQUALITY_OPERATORS = new Set(["===", "==", "!==", "!="])

export const rule = createRule<[], MessageIds>({
  name: "no-conditional-expressions-in-workflow",
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow conditional operators (`&&`, `||`, `??`, ternary, `!`, `!!`, optional chaining, `===`/`==`/`!==`/`!=`) directly inside a `createWorkflow` constructor or a `when().then()` callback. Wrap value manipulation in `transform`.",
    },
    messages: {
      logicalExpression:
        "Do not use `{{operator}}` inside a workflow constructor or a `when().then()` callback — both run at definition time, not execution time. Wrap value manipulation in `transform(...)` from `@medusajs/framework/workflows-sdk`.",
      conditionalExpression:
        "Do not use ternary expressions inside a workflow constructor or a `when().then()` callback — both run at definition time, not execution time. Wrap value manipulation in `transform(...)` from `@medusajs/framework/workflows-sdk`.",
      negation:
        "Do not use the `!` operator inside a workflow constructor or a `when().then()` callback — it runs at definition time, not execution time. Wrap value manipulation in `transform(...)` from `@medusajs/framework/workflows-sdk`.",
      equalityExpression:
        "Do not use `{{operator}}` inside a workflow constructor or a `when().then()` callback — it runs at definition time, not execution time. Wrap value comparison in `transform(...)` from `@medusajs/framework/workflows-sdk`.",
      optionalChaining:
        "Do not use optional chaining (`?.`) inside a workflow constructor or a `when().then()` callback — both run at definition time, not execution time. Wrap value manipulation in `transform(...)` from `@medusajs/framework/workflows-sdk`.",
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

      LogicalExpression(node) {
        if (bindings.createWorkflow.size === 0) return
        if (!isInWorkflowDefinitionScope(node, bindings)) return
        context.report({
          node,
          messageId: "logicalExpression",
          data: { operator: node.operator },
        })
      },

      ConditionalExpression(node) {
        if (bindings.createWorkflow.size === 0) return
        if (!isInWorkflowDefinitionScope(node, bindings)) return
        context.report({
          node,
          messageId: "conditionalExpression",
        })
      },

      UnaryExpression(node) {
        if (bindings.createWorkflow.size === 0) return
        if (node.operator !== "!") return
        // Avoid double-reporting on `!!x` / `!!!x` — only the outermost
        // `!` reports (the one whose parent is not also `!`).
        if (
          node.parent?.type === AST_NODE_TYPES.UnaryExpression &&
          node.parent.operator === "!"
        ) {
          return
        }
        if (!isInWorkflowDefinitionScope(node, bindings)) return
        context.report({
          node,
          messageId: "negation",
        })
      },

      BinaryExpression(node) {
        if (bindings.createWorkflow.size === 0) return
        if (!EQUALITY_OPERATORS.has(node.operator)) return
        if (!isInWorkflowDefinitionScope(node, bindings)) return
        context.report({
          node,
          messageId: "equalityExpression",
          data: { operator: node.operator },
        })
      },

      ChainExpression(node) {
        if (bindings.createWorkflow.size === 0) return
        if (!isInWorkflowDefinitionScope(node, bindings)) return
        context.report({
          node,
          messageId: "optionalChaining",
        })
      },
    }
  },
})

export default rule
