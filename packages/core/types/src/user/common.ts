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

/**
 * The invite details.
 */
export interface InviteDTO {
  /**
   * The ID of the invite.
   */
  id: string

  /**
   * The email of the invite.
   */
  email: string

  /**
   * Whether the invite is accepted.
   */
  accepted: boolean

  /**
   * The token of the invite.
   */
  token: string

  /**
   * The invite's expiry date.
   */
  expires_at: Date

  /**
   * Holds custom data in key-value pairs.
   */
  metadata: Record<string, unknown> | null

  /**
   * The invite's creation date.
   */
  created_at: Date

  /**
   * The invite's update date.
   */
  updated_at: Date

  /**
   * The invite's deletion date.
   */
  deleted_at: Date | null
}

/**
 * The filters to apply on the retrieved invites.
 */
export interface FilterableInviteProps
  extends BaseFilterable<FilterableInviteProps> {
  /**
   * The IDs to filter the invites by.
   */
  id?: string | string[]

  /**
   * Filter the invites by their email.
   */
  email?: string | string[]

  /**
   * Filter the invites by their expiry date.
   */
  expires_at?: DateComparisonOperator
}
