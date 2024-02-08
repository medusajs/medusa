/**
 * The user to be created.
 */
export interface CreateUserDTO {
  /**
   * The ID of the user.
   */
  id?: string
}

/**
 * The attributes to update in the user.
 */
export interface UpdateUserDTO {
  /**
   * The ID of the user.
   */
  id: string
}
