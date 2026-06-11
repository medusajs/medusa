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
 * True when `fn`'s return type annotation is a `Promise<...>` reference.
 *
 * Shallow check — looks only at the outermost type reference's name. Doesn't
 * unwrap unions/intersections (`Promise<X> | null` returns false) or aliases
 * (a `type MyPromise = Promise<X>` returns false). Good enough for rules that
 * want to give `async`-equivalent return types a pass without paying for full
 * type-aware analysis.
 */
export const returnTypeIsPromise = (
  fn:
    | TSESTree.FunctionExpression
    | TSESTree.FunctionDeclaration
    | TSESTree.ArrowFunctionExpression
    | TSESTree.TSEmptyBodyFunctionExpression
): boolean => {
  const annotation = fn.returnType?.typeAnnotation
  if (!annotation) return false
  if (annotation.type !== AST_NODE_TYPES.TSTypeReference) return false
  const name = annotation.typeName
  if (name.type !== AST_NODE_TYPES.Identifier) return false
  return name.name === "Promise"
}

/**
 * Returns the `constructor` `MethodDefinition` on a class body, or `null` if
 * the class has none.
 */
export const findConstructor = (
  node: TSESTree.ClassDeclaration | TSESTree.ClassExpression
): TSESTree.MethodDefinition | null => {
  for (const member of node.body.body) {
    if (member.type !== AST_NODE_TYPES.MethodDefinition) continue
    if (member.kind === "constructor") return member
  }
  return null
}
