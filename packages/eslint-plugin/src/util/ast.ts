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

const FUNCTION_NODE_TYPES = new Set<string>([
  AST_NODE_TYPES.ArrowFunctionExpression,
  AST_NODE_TYPES.FunctionExpression,
  AST_NODE_TYPES.FunctionDeclaration,
])

/**
 * Recursively walks the AST rooted at `node`, calling `visit` for every
 * descendant (including `node` itself). When `visit` returns `false` the walk
 * does not descend into that subtree's children — useful for "skip nested
 * function bodies" patterns.
 *
 * Skips the `parent` back-reference. Generic over the standard TSESTree shape;
 * does not know about parser-specific extension keys.
 */
export const walkAst = (
  node: TSESTree.Node | null | undefined,
  visit: (node: TSESTree.Node) => boolean | void
): void => {
  if (!node) return
  if (visit(node) === false) return

  for (const key of Object.keys(node)) {
    if (key === "parent") continue
    const value = (node as unknown as Record<string, unknown>)[key]
    if (!value) continue
    if (Array.isArray(value)) {
      for (const child of value) {
        if (child && typeof child === "object" && "type" in child) {
          walkAst(child as TSESTree.Node, visit)
        }
      }
    } else if (typeof value === "object" && "type" in (value as object)) {
      walkAst(value as TSESTree.Node, visit)
    }
  }
}

/**
 * True for `ArrowFunctionExpression`, `FunctionExpression`, and
 * `FunctionDeclaration`.
 */
export const isFunctionNode = (node: TSESTree.Node): boolean =>
  FUNCTION_NODE_TYPES.has(node.type)

/**
 * Returns the name of the `VariableDeclarator` that directly initializes
 * `call`, e.g. `export const myWorkflow = createWorkflow(...)` → `"myWorkflow"`.
 *
 * Only matches when the call is the direct initializer of an identifier-bound
 * declarator — not when nested inside an object/array/etc. on the right-hand
 * side. Returns `null` otherwise.
 */
export const getInitializedVariableName = (
  call: TSESTree.CallExpression
): string | null => {
  const parent = call.parent
  if (
    parent &&
    parent.type === AST_NODE_TYPES.VariableDeclarator &&
    parent.init === call &&
    parent.id.type === AST_NODE_TYPES.Identifier
  ) {
    return parent.id.name
  }
  return null
}
