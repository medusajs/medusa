import { AdminRbacRole } from "../../rbac/admin/entities"

export interface AdminInvite {
  /**
   * The invite's ID.
   */
  id: string
  /**
   * The email of the invited user.
   */
  email: string
  /**
   * Whether the invite was accepted.
   */
  accepted: boolean
  /**
   * The invite token. Omitted when the authenticated actor can't assign the
   * invite's roles.
   */
  token?: string
  /**
   * The date the invite expires.
   */
  expires_at: string
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown>
  /**
   * The RBAC roles assigned to the invite.
   */
  rbac_roles?: AdminRbacRole[]
  /**
   * The date that the invite was created.
   */
  created_at: string
  /**
   * The date that the invite was updated.
   */
  updated_at: string
}
