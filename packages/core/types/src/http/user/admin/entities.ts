export interface AdminUser {
  /**
   * The user's ID.
   */
  id: string
  /**
   * The user's email.
   */
  email: string
  /**
   * The user's first name.
   */
  first_name: string | null
  /**
   * The user's last name.
   */
  last_name: string | null
  /**
   * The URL of the user's avatar image.
   */
  avatar_url: string | null
  /**
   * Custom key-value pairs that can be added to the user.
   */
  metadata: Record<string, unknown> | null
  /**
   * The RBAC roles assigned to the user.
   *
   * @ignore
   */
  roles?: string[] | null
  /**
   * The date the user was created.
   */
  created_at: string
  /**
   * The date the user was updated.
   */
  updated_at: string
  /**
   * The date the user was deleted.
   */
  deleted_at: string | null
}
