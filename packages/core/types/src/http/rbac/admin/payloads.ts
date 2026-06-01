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
