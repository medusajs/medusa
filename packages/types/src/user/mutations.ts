/**
 * The user to be created.
 */
export interface CreateUserDTO {
  /**
   * The email of the user.
   */
  email: string
  /**
   * The first name of the user.
   */
  first_name?: string | null
  /**
   * The last name of the user.
   */
  last_name?: string | null
  /**
   * The avatar URL of the user.
   */
  avatar_url?: string | null
  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * The attributes to update in the user.
 */
export interface UpdateUserDTO extends Partial<Omit<CreateUserDTO, "email">> {
  /**
   * The ID of the user.
   */
  id: string
}

export interface CreateInviteDTO {
  email: string
  accepted?: boolean
  metadata?: Record<string, unknown> | null
}

export interface UpdateInviteDTO
  extends Partial<Omit<CreateInviteDTO, "email">> {
  id: string
}
