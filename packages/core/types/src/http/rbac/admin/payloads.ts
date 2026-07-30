export interface AdminCreateRbacRole {
  /**
   * The role's name.
   */
  name: string
  /**
   * The ID of the parent role, if any.
   */
  parent_id?: string | null
  /**
   * The role's description.
   */
  description?: string | null
  /**
   * Custom key-value pairs that can be added to the role.
   */
  metadata?: Record<string, unknown> | null
  /**
   * The IDs of the policies to attach to the role on creation. The actor
   * must hold every policy in the list; omit or
   * leave empty to create a role without any policies.
   */
  policy_ids?: string[]
}

export interface AdminUpdateRbacRole {
  /**
   * The role's name.
   */
  name?: string
  /**
   * The ID of the parent role, if any.
   */
  parent_id?: string | null
  /**
   * The role's description.
   */
  description?: string | null
  /**
   * Custom key-value pairs that can be added to the role.
   */
  metadata?: Record<string, unknown> | null
}

export interface AdminAddRolePolicies {
  /**
   * The IDs of the policies to add to the role.
   */
  policies: string[]
}

export interface AdminAssignRoleUsers {
  /**
   * The IDs of the users to add to the role.
   */
  users: string[]
}

export interface AdminRemoveRoleUsers {
  /**
   * The IDs of the users to remove from the role.
   */
  users: string[]
}

export interface AdminCreateRoleAssignments {
  /**
   * The type of entity the role is assigned to (e.g. `user`, `invite`).
   */
  reference: string
  /**
   * The IDs of the entities to assign the role to.
   */
  reference_ids: string[]
  /**
   * The type of scope entity the assignments are constrained to (e.g.
   * `sales_channel`). Must be provided together with `scope_id`.
   */
  scope?: string
  /**
   * The ID of the scope entity the assignments are constrained to. Must be
   * provided together with `scope`.
   */
  scope_id?: string
}

export interface AdminRemoveRoleAssignments {
  /**
   * The type of entity the role is assigned to (e.g. `user`, `invite`).
   */
  reference: string
  /**
   * The IDs of the entities to remove the role from.
   */
  reference_ids: string[]
  /**
   * When provided together with `scope_id`, only assignments constrained to
   * that exact scope are removed.
   */
  scope?: string
  /**
   * When provided together with `scope`, only assignments constrained to
   * that exact scope are removed.
   */
  scope_id?: string
}

export interface AdminCreateRbacPolicy {
  /**
   * The policy's unique key.
   */
  key: string
  /**
   * The resource the policy applies to.
   */
  resource: string
  /**
   * The operation the policy allows.
   */
  operation: string
  /**
   * The policy's name.
   */
  name?: string | null
  /**
   * The policy's description.
   */
  description?: string | null
  /**
   * Custom key-value pairs that can be added to the policy.
   */
  metadata?: Record<string, unknown> | null
}

export interface AdminUpdateRbacPolicy {
  /**
   * The policy's unique key.
   */
  key?: string
  /**
   * The resource the policy applies to.
   */
  resource?: string
  /**
   * The operation the policy allows.
   */
  operation?: string
  /**
   * The policy's name.
   */
  name?: string | null
  /**
   * The policy's description.
   */
  description?: string | null
  /**
   * Custom key-value pairs that can be added to the policy.
   */
  metadata?: Record<string, unknown> | null
}
