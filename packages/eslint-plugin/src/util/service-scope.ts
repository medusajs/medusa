import type { TSESTree } from "@typescript-eslint/utils"
import { AST_NODE_TYPES } from "@typescript-eslint/utils"
import { FRAMEWORK_UTILS_SOURCE } from "../constants"

export const MEDUSA_SERVICE = "MedusaService"

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
  if (node.source.value !== FRAMEWORK_UTILS_SOURCE) return
  for (const specifier of node.specifiers) {
    if (specifier.type !== AST_NODE_TYPES.ImportSpecifier) continue
    if (specifier.imported.type !== AST_NODE_TYPES.Identifier) continue
    if (specifier.imported.name !== MEDUSA_SERVICE) continue
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
  if (!superClass) return false
  if (superClass.type !== AST_NODE_TYPES.CallExpression) return false
  const callee = superClass.callee
  if (callee.type !== AST_NODE_TYPES.Identifier) return false
  return bindings.medusaService.has(callee.name)
}

/**
 * True when `node` looks like a Medusa "service class": **either** its
 * superclass is `MedusaService(...)` (from `@medusajs/framework/utils`), **or**
 * its class name ends with the `Service` suffix.
 *
 * The suffix convention catches custom domain services that don't extend
 * `MedusaService` but still expose awaitable methods to callers (Medusa
 * convention is to name them `XxxService`).
 *
 * Anonymous class expressions assigned to `Service`-suffixed variables are
 * not covered here — the predicate only inspects the class node's own `id`.
 * Add a `VariableDeclarator`-aware variant if a rule needs that.
 */
export function isServiceClass(
  node: TSESTree.ClassDeclaration | TSESTree.ClassExpression,
  bindings: MedusaServiceBindings
): boolean {
  if (isMedusaServiceSuper(node.superClass, bindings)) return true
  return node.id?.name.endsWith("Service") ?? false
}
