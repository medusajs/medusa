export interface AdminCreateUser {
  email: string
  first_name?: string | null
  last_name?: string | null
  avatar_url?: string | null
}

export interface AdminUpdateUser {
  /**
   * The first name of the user.
   */
  first_name?: string | null
  /**
   * The last name of the user.
   */
  last_name?: string | null
  /**
   * The URL of the user's avatar image.
   */
  avatar_url?: string | null
  /**
   * Custom key-value pairs that can be added to the user.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * @featureFlag rbac
 */
export interface AdminAssignUserRoles {
  roles: string[]
}

/**
 * @featureFlag rbac
 */
export interface AdminRemoveUserRoles {
  roles: string[]
}
