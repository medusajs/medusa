import { BaseFilterable } from "../dal"

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

export interface FilterableRbacRoleAssignmentProps
  extends BaseFilterable<FilterableRbacRoleAssignmentProps> {
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
 * The RBAC context of a request, held on `req.rbac_context`.
 *
 * The scope is set by the application, from a middleware registered ahead of
 * the `authorize` middleware guarding the route. The permissions are set by
 * `authorize` itself, once it has resolved the actor's roles.
 */
export type RbacContext = {
  /**
   * The most granular scope the request acts within. When it is not set, only
   * unscoped role assignments are considered when resolving the actor's roles.
   */
  scope?: RbacScope
  /**
   * The policies guarding the request, recorded by the `authorize` middlewares
   * it went through. Read by the query config middlewares to filter the
   * requested fields.
   */
  policies?: PolicyAction[]
  /**
   * The `resource:operation` permissions granted by the roles resolved for the
   * request. Wildcards are listed as they are stored (e.g. `product:*`).
   */
  permissions?: string[]
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

export type AuthzContextConfig = {
  /**
   * Entities that can hold role assignments reachable from the actor in the graph. Used
   * to build the AuthzContext necessary to resolve the actor's roles.
   */
  grantees: {
    /**
     * The entity that can hold role assignments reachable from the actor.
     */
    entity: string
    /**
     * The path from the actor to the entity's id.
     */
    path: string
  }[]
}
