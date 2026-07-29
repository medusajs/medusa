/**
 * The single character used as the RBAC wildcard across both resource and
 * operation slots.
 */
export const WILDCARD = "*"

/**
 * RBAC operations type-only registry.
 *
 * Medusa's own operations are declared here. Modules and plugins that need
 * their own operations augment this interface, which widens
 * {@link PolicyOperationValue} and therefore what a route's `policies` accepts:
 *
 * ```ts
 * // src/types/policy-operations.d.ts
 * declare module "@medusajs/framework/utils" {
 *   interface PolicyOperationRegistry {
 *     approve: "approve"
 *   }
 * }
 *
 * export {}
 * ```
 *
 * ```ts
 * // anywhere policies are declared, now autocompleted alongside the core operations
 * policies: [{ resource: "brand", operation: "approve" }]
 * ```
 */
export interface PolicyOperationRegistry {
  read: "read"
  create: "create"
  update: "update"
  delete: "delete"
}

/**
 * Every operation a route may be guarded by: the ones in
 * {@link PolicyOperationRegistry}, plus the wildcard.
 */
export type PolicyOperationValue =
  | PolicyOperationRegistry[keyof PolicyOperationRegistry]
  | typeof WILDCARD

/**
 * Medusa's own operations, as values.
 */
export const PolicyOperation = {
  read: "read",
  create: "create",
  update: "update",
  delete: "delete",
  [WILDCARD]: WILDCARD,
  ALL: WILDCARD,
} as const
