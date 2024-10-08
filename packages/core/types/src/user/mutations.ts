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

/**
 * The invite to be created.
 */
export interface CreateInviteDTO {
  /**
   * The email of the invite.
   */
  email: string

  /**
   * Whether the invite is accepted.
   */
  accepted?: boolean

  /**
   * Holds custom data in key-value pairs.
   */
  metadata?: Record<string, unknown> | null
}

/**
 * The attributes to update in the invite.
 */
export interface UpdateInviteDTO
  extends Partial<Omit<CreateInviteDTO, "email">> {
  /**
   * The ID of the invite.
   */
  id: string
}
