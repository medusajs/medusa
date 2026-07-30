export type RbacRoleDTO = {
  id: string
  name: string
  description?: string | null
  metadata?: Record<string, unknown> | null
  policies?: RbacPolicyDTO[]
  deleted_at?: Date | string | null
}

export type FilterableRbacRoleProps = {
  id?: string | string[]
  name?: string
  q?: string
}

export type RbacPolicyDTO = {
  id: string
  key: string
  resource: string
  operation: string
  name?: string | null
  description?: string | null
  metadata?: Record<string, unknown> | null
  deleted_at?: Date | string | null
}

export type FilterableRbacPolicyProps = {
  id?: string | string[]
  key?: string | string[]
  resource?: string
  operation?: string
  q?: string
}

export type RbacRolePolicyDTO = {
  id: string
  role_id: string
  policy_id: string
  metadata?: Record<string, unknown> | null
  deleted_at?: Date | string | null
}

export type FilterableRbacRolePolicyProps = {
  id?: string | string[]
  role_id?: string | string[]
  policy_id?: string | string[]
}

export type RbacRoleParentDTO = {
  id: string
  role_id: string
  parent_id: string
  metadata?: Record<string, unknown> | null
}

export type FilterableRbacRoleParentProps = {
  id?: string | string[]
  role_id?: string | string[]
  parent_id?: string | string[]
}

export type RbacRoleAssignmentDTO = {
  id: string
  role_id: string
  reference: string
  reference_id: string
  scope?: string | null
  scope_id?: string | null
  metadata?: Record<string, unknown> | null
  deleted_at?: Date | string | null
}

export type FilterableRbacRoleAssignmentProps = {
  id?: string | string[]
  role_id?: string | string[]
  reference?: string | string[]
  reference_id?: string | string[]
  scope?: string | string[] | null
  scope_id?: string | string[] | null
}

/**
 * A scope a request acts within, identified by the scope
 * entity's type and id (e.g. `{ type: "organization", id: "org_123" }`).
 */
export type RbacScope = {
  type: string
  id: string
}

/**
 * A role resolved for an actor.
 *
 * @property role_id - The ID of the role.
 * @property source - The assigned source entity for the role from which it was resolved.
 * @property scope - The scope entity that was applied when resolving the role.
 *
 * @example
 * ```ts
 * {
 *   role_id: "role_123",
 *   source: { reference: "membership", reference_id: "mem_456" },
 *   scope: { type: "organization", id: "org_xyz" },
 * }
 * ```
 */
export interface ResolvedRole {
  role_id: string
  source: { reference: string; reference_id: string }
  scope?: RbacScope
}

/**
 * RBAC operations type-only registry.
 *
 * Medusa's own operations are declared here. Modules and plugins that need
 * their own operations augment this interface, which widens
 * {@link PolicyOperationValue} and therefore what a route's `policies` accepts:
 *
 * ```ts
 * // src/types/policy-operations.d.ts
 * declare module "@medusajs/framework/types" {
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
  | "*"

/**
 * A `(resource, operation)` pair a route may be guarded by.
 *
 * `operation` is constrained to {@link PolicyOperationValue}, so modules that
 * augment {@link PolicyOperationRegistry} can guard routes with their own
 * operations and typos stay compile errors.
 */
export type PolicyAction = {
  resource: string
  operation: PolicyOperationValue | PolicyOperationValue[]
}
