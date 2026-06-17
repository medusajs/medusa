import type { TSESTree } from "@typescript-eslint/utils"
import { AST_NODE_TYPES } from "@typescript-eslint/utils"
import { FRAMEWORK_UTILS_SOURCE } from "../constants"

export const MEDUSA_SERVICE = "MedusaService"
export const CONTEXT_TYPE = "Context"

export type MedusaServiceBindings = {
  medusaService: Set<string>
}

export function createMedusaServiceBindings(): MedusaServiceBindings {
  return {
    medusaService: new Set(),
  }
}

/**
 * Records local names bound to `MedusaService` from
 * `@medusajs/framework/utils` (honors `import { MedusaService as MS }`).
 *
 * Call from an `ImportDeclaration` visitor.
 */
export function trackMedusaServiceImports(
  node: TSESTree.ImportDeclaration,
  bindings: MedusaServiceBindings
): void {
  if (node.source.value !== FRAMEWORK_UTILS_SOURCE) {
    return
  }
  for (const specifier of node.specifiers) {
    if (specifier.type !== AST_NODE_TYPES.ImportSpecifier) {
      continue
    }
    if (specifier.imported.type !== AST_NODE_TYPES.Identifier) {
      continue
    }
    if (specifier.imported.name !== MEDUSA_SERVICE) {
      continue
    }
    bindings.medusaService.add(specifier.local.name)
  }
}

/**
 * True when `superClass` is a `CallExpression` whose callee resolves to a
 * tracked `MedusaService` binding (e.g. `class X extends MedusaService({...})`).
 */
export function isMedusaServiceSuper(
  superClass: TSESTree.LeftHandSideExpression | null,
  bindings: MedusaServiceBindings
): boolean {
  if (!superClass) {
    return false
  }
  if (superClass.type !== AST_NODE_TYPES.CallExpression) {
    return false
  }
  const callee = superClass.callee
  if (callee.type !== AST_NODE_TYPES.Identifier) {
    return false
  }
  return bindings.medusaService.has(callee.name)
}

/**
 * Generic import tracker for named specifiers from
 * `@medusajs/framework/utils`. Given a map of canonical imported names to
 * `Set<string>` buckets, populates each bucket with the *local* name a
 * consumer bound that import to (honors `import { Foo as F }`).
 *
 * Call from an `ImportDeclaration` visitor. Imports from other sources are
 * ignored.
 */
export function trackFrameworkUtilsImports(
  node: TSESTree.ImportDeclaration,
  buckets: Record<string, Set<string>>
): void {
  if (node.source.value !== FRAMEWORK_UTILS_SOURCE) {
    return
  }
  for (const specifier of node.specifiers) {
    if (specifier.type !== AST_NODE_TYPES.ImportSpecifier) {
      continue
    }
    if (specifier.imported.type !== AST_NODE_TYPES.Identifier) {
      continue
    }
    const bucket = buckets[specifier.imported.name]
    if (!bucket) {
      continue
    }
    bucket.add(specifier.local.name)
  }
}

/**
 * Unwraps a parameter pattern to its binding `Identifier`. Handles both
 * `foo: T` (bare `Identifier`) and `foo: T = x` (`AssignmentPattern` with an
 * `Identifier` on the left). Returns `null` for destructuring patterns,
 * rest elements, and TS parameter properties.
 */
export function getParamIdentifier(
  param: TSESTree.Parameter
): TSESTree.Identifier | null {
  if (param.type === AST_NODE_TYPES.Identifier) {
    return param
  }
  if (
    param.type === AST_NODE_TYPES.AssignmentPattern &&
    param.left.type === AST_NODE_TYPES.Identifier
  ) {
    return param.left
  }
  return null
}

/**
 * True when `id`'s type annotation is a bare reference to `Context`.
 *
 * AST-level check only — does not resolve the import; a custom local
 * `type Context = ...` would also match. Acceptable: the rules that use
 * this gate are scoped to Medusa service classes where `Context` is the
 * convention.
 */
export function isContextTypedIdentifier(id: TSESTree.Identifier): boolean {
  const annotation = id.typeAnnotation?.typeAnnotation
  if (!annotation) {
    return false
  }
  if (annotation.type !== AST_NODE_TYPES.TSTypeReference) {
    return false
  }
  if (annotation.typeName.type !== AST_NODE_TYPES.Identifier) {
    return false
  }
  return annotation.typeName.name === CONTEXT_TYPE
}

/** True when any of `fn`'s parameters is typed `Context`. */
export function hasContextParam(
  fn: TSESTree.FunctionExpression | TSESTree.TSEmptyBodyFunctionExpression
): boolean {
  for (const param of fn.params) {
    const id = getParamIdentifier(param)
    if (id && isContextTypedIdentifier(id)) {
      return true
    }
  }
  return false
}

/**
 * Returns parameter decorators attached to `param`. TSESTree puts
 * decorators on the outermost pattern (the `AssignmentPattern` when there's
 * a default), but we fall back to the inner `Identifier`'s decorators
 * defensively.
 */
export function getParamDecorators(
  param: TSESTree.Parameter
): TSESTree.Decorator[] {
  const outer = (param as { decorators?: TSESTree.Decorator[] }).decorators
  if (outer && outer.length) {
    return outer
  }
  if (param.type === AST_NODE_TYPES.AssignmentPattern) {
    const inner = (param.left as { decorators?: TSESTree.Decorator[] })
      .decorators
    if (inner && inner.length) {
      return inner
    }
  }
  return []
}

/**
 * True when any decorator in `decorators` is `@<name>()` / `@<name>` where
 * `<name>` is in `localNames`. Used to gate rules whose autofix or
 * detection relies on decorator presence.
 */
export function hasDecoratorWithLocalName(
  decorators: TSESTree.Decorator[] | undefined,
  localNames: Set<string>
): boolean {
  if (!decorators?.length) {
    return false
  }
  for (const decorator of decorators) {
    const expr = decorator.expression
    let calleeName: string | null = null
    if (expr.type === AST_NODE_TYPES.CallExpression) {
      if (expr.callee.type === AST_NODE_TYPES.Identifier) {
        calleeName = expr.callee.name
      }
    } else if (expr.type === AST_NODE_TYPES.Identifier) {
      calleeName = expr.name
    }
    if (calleeName && localNames.has(calleeName)) {
      return true
    }
  }
  return false
}
