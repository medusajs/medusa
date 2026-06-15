import type { TSESTree } from "@typescript-eslint/utils"
import { AST_NODE_TYPES } from "@typescript-eslint/utils"

/**
 * Whether a call's callee is a container `resolve(...)` — either the bare
 * destructured form `resolve(...)` or a member form `<x>.resolve(...)`
 * (e.g. `req.scope.resolve(...)`, `container.resolve(...)`).
 *
 * Shared by the rules that inspect container resolutions
 * (`prefer-container-registration-keys`, `prefer-modules-enum`,
 * `prefer-link-over-remote-link`).
 */
export function isResolveCallee(callee: TSESTree.Node): boolean {
  if (callee.type === AST_NODE_TYPES.Identifier && callee.name === "resolve") {
    return true
  }
  if (
    callee.type === AST_NODE_TYPES.MemberExpression &&
    !callee.computed &&
    callee.property.type === AST_NODE_TYPES.Identifier &&
    callee.property.name === "resolve"
  ) {
    return true
  }
  return false
}
