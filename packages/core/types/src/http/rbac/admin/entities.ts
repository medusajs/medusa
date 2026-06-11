export interface AdminRbacRole {
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
  description: string | null
  /**
   * The ID of the parent role, if any.
   */
  parent_id: string | null
  /**
   * Custom key-value pairs that can be added to the role.
   */
  metadata: Record<string, unknown> | null
  /**
   * The policies associated with the role.
   */
  policies?: AdminRbacPolicy[]
  /**
   * The date the role was created.
   */
  created_at: string
  /**
   * The date the role was updated.
   */
  updated_at: string
  /**
   * The date the role was deleted.
   */
  deleted_at: string | null
}

export interface AdminRbacPolicy {
  /**
   * The policy's ID.
   */
  id: string
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
  name: string | null
  /**
   * The policy's description.
   */
  description: string | null
  /**
   * Custom key-value pairs that can be added to the policy.
   */
  metadata: Record<string, unknown> | null
  /**
   * The role ID the policy is inherited from, if any.
   */
  inherited_from_role_id?: string | null
  /**
   * The date the policy was created.
   */
  created_at: string
  /**
   * The date the policy was updated.
   */
  updated_at: string
  /**
   * The date the policy was deleted.
   */
  deleted_at: string | null
}
