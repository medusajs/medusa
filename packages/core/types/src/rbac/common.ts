/**
 * The details of a role.
 */
export type RbacRoleDTO = {
  /**
   * The role's ID.
   */
  id: string
  /**
   * The role's name.
   */
  name: string
  /**
   * The role's description.
   */
  description?: string | null
  /**
   * Key-value pairs of custom data associated with the role.
   */
  metadata?: Record<string, unknown> | null
  /**
   * The policies granted by the role.
   */
  policies?: RbacPolicyDTO[]
  /**
   * The date the role was deleted, if it was soft-deleted.
   */
  deleted_at?: Date | string | null
}

/**
 * The filters to apply on retrieved roles.
 */
export type FilterableRbacRoleProps = {
  /**
   * Filter by role ID(s).
   */
  id?: string | string[]
  /**
   * Filter by role name.
   */
  name?: string
  /**
   * A search query to filter the roles by their searchable fields.
   */
  q?: string
}

/**
 * The details of a policy.
 */
export type RbacPolicyDTO = {
  /**
   * The policy's ID.
   */
  id: string
  /**
   * The policy's key in the format `resource:operation`, such as `product:read`.
   */
  key: string
  /**
   * The resource the policy applies to, such as `product`.
   */
  resource: string
  /**
   * The operation the policy allows on the resource, such as `read`.
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
   * Key-value pairs of custom data associated with the policy.
   */
  metadata?: Record<string, unknown> | null
  /**
   * The date the policy was deleted, if it was soft-deleted.
   */
  deleted_at?: Date | string | null
}

/**
 * The filters to apply on retrieved policies.
 */
export type FilterableRbacPolicyProps = {
  /**
   * Filter by policy ID(s).
   */
  id?: string | string[]
  /**
   * Filter by policy key(s).
   */
  key?: string | string[]
  /**
   * Filter by the resource the policy applies to.
   */
  resource?: string
  /**
   * Filter by the operation the policy allows.
   */
  operation?: string
  /**
   * A search query to filter the policies by their searchable fields.
   */
  q?: string
}

/**
 * The details of a role-policy assignment, which grants a policy to a role.
 */
export type RbacRolePolicyDTO = {
  /**
   * The role-policy assignment's ID.
   */
  id: string
  /**
   * The ID of the role the policy is assigned to.
   */
  role_id: string
  /**
   * The ID of the policy assigned to the role.
   */
  policy_id: string
  /**
   * Key-value pairs of custom data associated with the role-policy assignment.
   */
  metadata?: Record<string, unknown> | null
  /**
   * The date the role-policy assignment was deleted, if it was soft-deleted.
   */
  deleted_at?: Date | string | null
}

/**
 * The filters to apply on retrieved role-policy assignments.
 */
export type FilterableRbacRolePolicyProps = {
  /**
   * Filter by role-policy assignment ID(s).
   */
  id?: string | string[]
  /**
   * Filter by the ID(s) of the assigned role(s).
   */
  role_id?: string | string[]
  /**
   * Filter by the ID(s) of the assigned policy(ies).
   */
  policy_id?: string | string[]
}

/**
 * The details of a role-parent assignment, which links a role to a parent role
 * it inherits policies from.
 */
export type RbacRoleParentDTO = {
  /**
   * The role-parent assignment's ID.
   */
  id: string
  /**
   * The ID of the child role that inherits the parent's policies.
   */
  role_id: string
  /**
   * The ID of the parent role.
   */
  parent_id: string
  /**
   * Key-value pairs of custom data associated with the role-parent assignment.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * The filters to apply on retrieved role-parent assignments.
 */
export type FilterableRbacRoleParentProps = {
  /**
   * Filter by role-parent assignment ID(s).
   */
  id?: string | string[]
  /**
   * Filter by the ID(s) of the child role(s).
   */
  role_id?: string | string[]
  /**
   * Filter by the ID(s) of the parent role(s).
   */
  parent_id?: string | string[]
}
