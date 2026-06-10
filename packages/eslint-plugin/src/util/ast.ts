import type { TSESTree } from "@typescript-eslint/utils"
import { AST_NODE_TYPES } from "@typescript-eslint/utils"

/**
 * True when `node` is something other than a pure literal — i.e. it references
 * a binding or computes a value at runtime. `Literal` (string/number/boolean/
 * regex/etc.) and bare `TemplateLiteral` (no interpolations are non-literal in
 * themselves) return false; everything else (Identifier, MemberExpression,
 * CallExpression, …) returns true.
 *
 * Useful for skipping noise like `1 + 1` or `` `hello ${"x"}` `` when a rule
 * cares whether an expression touches a real binding.
 */
export const isNonLiteralRef = (node: TSESTree.Node): boolean => {
  if (
    node.type === AST_NODE_TYPES.Literal ||
    node.type === AST_NODE_TYPES.TemplateLiteral
  ) {
    return false
  }
  return true
}

/**
 * True when `node` represents an explicit `undefined` value — either the
 * `undefined` identifier or `void <expr>` (which always evaluates to
 * `undefined`).
 */
export const isUndefinedExpression = (node: TSESTree.Node): boolean => {
  if (node.type === AST_NODE_TYPES.Identifier && node.name === "undefined") {
    return true
  }
  if (
    node.type === AST_NODE_TYPES.UnaryExpression &&
    node.operator === "void"
  ) {
    return true
  }
  return false
}
