import { AdminUser } from "../.."

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
   * The users associated with the role.
   */
  users?: AdminUser[]
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

export interface AdminRbacRoleAssignment {
  /**
   * The assignment's ID.
   */
  id: string
  /**
   * The ID of the role the assignment is for.
   */
  role_id: string
  /**
   * The type of entity the role is assigned to (e.g. `user`, `invite`).
   */
  reference: string
  /**
   * The ID of the entity the role is assigned to.
   */
  reference_id: string
  /**
   * The type of scope entity the assignment is constrained to (e.g.
   * `sales_channel`), if any.
   */
  scope: string | null
  /**
   * The ID of the scope entity the assignment is constrained to, if any.
   */
  scope_id: string | null
  /**
   * Custom key-value pairs that can be added to the assignment.
   */
  metadata: Record<string, unknown> | null
  /**
   * The date the assignment was created.
   */
  created_at: string
  /**
   * The date the assignment was updated.
   */
  updated_at: string
  /**
   * The date the assignment was deleted.
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
