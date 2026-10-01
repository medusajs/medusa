import type { TSESTree } from "@typescript-eslint/utils"
import { AST_NODE_TYPES } from "@typescript-eslint/utils"
import { createRule } from "../../create-rule"
import {
  createWorkflowSdkBindings,
  isWorkflowSdkHelperCall,
  trackWorkflowSdkImports,
  WorkflowSdkBindings,
} from "../../util/workflow-scope"

type MessageIds = "whenBlockMissingName"

type FunctionLike =
  | TSESTree.ArrowFunctionExpression
  | TSESTree.FunctionExpression

/**
 * Returns the `.then(fn)` callback chained directly off a `when(...)` call,
 * or `null` if `node` isn't immediately followed by `.then(...)`.
 */
const getThenCallback = (
  node: TSESTree.CallExpression
): FunctionLike | null => {
  const parent = node.parent
  if (!parent || parent.type !== AST_NODE_TYPES.MemberExpression) {
    return null
  }
  if (parent.object !== node || parent.computed) {
    return null
  }
  if (
    parent.property.type !== AST_NODE_TYPES.Identifier ||
    parent.property.name !== "then"
  ) {
    return null
  }
  const grandparent = parent.parent
  if (!grandparent || grandparent.type !== AST_NODE_TYPES.CallExpression) {
    return null
  }
  if (grandparent.callee !== parent) {
    return null
  }
  const callback = grandparent.arguments[0]
  if (
    !callback ||
    (callback.type !== AST_NODE_TYPES.ArrowFunctionExpression &&
      callback.type !== AST_NODE_TYPES.FunctionExpression)
  ) {
    return null
  }
  return callback
}

/**
 * Unwraps a trailing `.config(...)` call — steps are commonly renamed with
 * `someStep(...).config({ name: ... })`, which doesn't change what the
 * expression fundamentally returns.
 */
const unwrapConfigCall = (expr: TSESTree.Expression): TSESTree.Expression => {
  if (expr.type !== AST_NODE_TYPES.CallExpression) {
    return expr
  }
  const callee = expr.callee
  if (
    callee.type === AST_NODE_TYPES.MemberExpression &&
    !callee.computed &&
    callee.property.type === AST_NODE_TYPES.Identifier &&
    callee.property.name === "config" &&
    callee.object.type === AST_NODE_TYPES.CallExpression
  ) {
    return callee.object
  }
  return expr
}

/**
 * True when `expr` (after unwrapping `.config(...)`) is a direct step or
 * `.runAsStep(...)` invocation. `when().then()` returns those values as-is,
 * without wrapping them in a synthetic step — so no name is required for
 * this shape at runtime, matching the behavior in
 * `packages/core/workflows-sdk/src/utils/composer/when.ts`.
 */
const isStepLikeReturn = (
  expr: TSESTree.Expression,
  bindings: WorkflowSdkBindings
): boolean => {
  const unwrapped = unwrapConfigCall(expr)
  if (unwrapped.type !== AST_NODE_TYPES.CallExpression) {
    return false
  }
  const callee = unwrapped.callee
  if (callee.type === AST_NODE_TYPES.Identifier) {
    return !isWorkflowSdkHelperCall(callee.name, bindings)
  }
  if (
    callee.type === AST_NODE_TYPES.MemberExpression &&
    !callee.computed &&
    callee.property.type === AST_NODE_TYPES.Identifier
  ) {
    return callee.property.name === "runAsStep"
  }
  return false
}

/**
 * Collects the top-level `return` argument expressions of a `.then(fn)`
 * callback. `if`/`try`/loops are already banned in this scope by other
 * rules, so callbacks are effectively flat — only the block's direct
 * statements (not nested functions) are inspected.
 */
const getReturnArguments = (fn: FunctionLike): TSESTree.Expression[] => {
  if (fn.body.type !== AST_NODE_TYPES.BlockStatement) {
    return [fn.body]
  }
  const args: TSESTree.Expression[] = []
  for (const statement of fn.body.body) {
    if (
      statement.type === AST_NODE_TYPES.ReturnStatement &&
      statement.argument
    ) {
      args.push(statement.argument)
    }
  }
  return args
}

export const rule = createRule<[], MessageIds>({
  name: "when-block-must-have-name",
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Require a `name` on `when(...)` calls whose `.then()` callback returns a value that isn't a step invocation. Medusa core assigns a random name at runtime in this case and logs a warning — pass `when(name, values, condition)` instead.",
    },
    messages: {
      whenBlockMissingName:
        "This `when` block's `.then()` returns a value that will be wrapped in a synthetic step. Without an explicit name, Medusa assigns a random one and logs a warning in production. Pass a name as the first argument: `when('<unique-name>', values, condition)`.",
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
        // Named form: `when(name, values, condition)`. Any 3-arg call is
        // treated as named, including a non-literal `name`, since a variable
        // could still resolve to a non-empty string at runtime — we can't
        // tell statically, so we don't flag it.
        if (node.arguments.length !== 2) {
          return
        }

        const thenCallback = getThenCallback(node)
        if (!thenCallback) {
          return
        }

        const hasNonStepReturn = getReturnArguments(thenCallback).some(
          (returnArg) => !isStepLikeReturn(returnArg, bindings)
        )
        if (!hasNonStepReturn) {
          return
        }

        context.report({
          node,
          messageId: "whenBlockMissingName",
        })
      },
    }
  },
})

export default rule
