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
   * The invite token.
   */
  token: string
  /**
   * The date the invite expires.
   */
  expires_at?: Date
  /**
   * Key-value pairs of custom data.
   */
  metadata?: Record<string, unknown>
  /**
   * The date that the invite was created.
   */
  created_at?: Date
  /**
   * The date that the invite was updated.
   */
  updated_at?: Date
}
