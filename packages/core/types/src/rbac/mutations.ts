/**
 * The data to create a role.
 */
export type CreateRbacRoleDTO = {
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
}

/**
 * The data to update a role.
 */
export type UpdateRbacRoleDTO = Partial<CreateRbacRoleDTO> & {
  /**
   * The ID of the role to update.
   */
  id: string
}

/**
 * The data to create a policy.
 */
export type CreateRbacPolicyDTO = {
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
}

/**
 * The data to update a policy.
 */
export type UpdateRbacPolicyDTO = Partial<CreateRbacPolicyDTO> & {
  /**
   * The ID of the policy to update.
   */
  id: string
}

/**
 * The data to create a role-policy assignment, which grants a policy to a role.
 */
export type CreateRbacRolePolicyDTO = {
  /**
   * The ID of the role to assign the policy to.
   */
  role_id: string
  /**
   * The ID of the policy to assign to the role.
   */
  policy_id: string
  /**
   * Key-value pairs of custom data associated with the role-policy assignment.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * The data to update a role-policy assignment.
 */
export type UpdateRbacRolePolicyDTO = Partial<CreateRbacRolePolicyDTO> & {
  /**
   * The ID of the role-policy assignment to update.
   */
  id: string
}

/**
 * The data to create a role-parent assignment, which links a role to a parent
 * role it inherits policies from.
 */
export type CreateRbacRoleParentDTO = {
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
 * The data to update a role-parent assignment.
 */
export type UpdateRbacRoleParentDTO = Partial<CreateRbacRoleParentDTO> & {
  /**
   * The ID of the role-parent assignment to update.
   */
  id: string
}
