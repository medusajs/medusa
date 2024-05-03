import { DateComparisonOperator } from "../common"
import { BaseFilterable } from "../dal"

/**
 * @interface
 *
 * The user details.
 */
export interface UserDTO {
  /**
   * The ID of the user.
   */
  id: string
  /**
   * The email of the user.
   */
  email: string
  /**
   * The first name of the user.
   */
  first_name: string | null
  /**
   * The last name of the user.
   */
  last_name: string | null
  /**
   * The avatar URL of the user.
   */
  avatar_url: string | null
  /**
   * Holds custom data in key-value pairs.
   */
  metadata: Record<string, unknown> | null
  /**
   * The creation date of the user.
   */
  created_at: Date
  /**
   * The updated date of the user.
   */
  updated_at: Date
  /**
   * The deletion date of the user.
   */
  deleted_at: Date | null
}

/**
 * @interface
 *
 * The filters to apply on the retrieved user.
 */
export interface FilterableUserProps
  extends BaseFilterable<FilterableUserProps> {
  /**
   * Find users by name or email through this search term
   */
  q?: string
  /**
   * The IDs to filter users by.
   */
  id?: string | string[]
  /**
   * Filter users by their email.
   */
  email?: string | string[]
  /**
   * Filter users by their first name.
   */
  first_name?: string | string[]
  /**
   * Filter users by their last name.
   */
  last_name?: string | string[]
}

export interface InviteDTO {
  id: string
  email: string
  accepted: boolean
  token: string
  expires_at: Date
  metadata: Record<string, unknown> | null
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

export interface FilterableInviteProps
  extends BaseFilterable<FilterableInviteProps> {
  id?: string | string[]
  email?: string | string[]
  expires_at?: DateComparisonOperator
}
