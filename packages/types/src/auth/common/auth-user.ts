import { BaseFilterable } from "../../dal"

/**
 * @interface
 *
 * The auth user details.
 */
export type AuthUserDTO = {
  /**
   * The ID of the auth user.
   */
  id: string

  /**
   * The provider of the auth user.
   */
  provider: string

  /**
   * The associated entity's ID.
   */
  entity_id: string

  /**
   * The scope of the auth user.
   */
  scope: string

  /**
   * The provider metadata of the auth user.
   */
  provider_metadata?: Record<string, unknown>

  /**
   * The user metadata of the auth user.
   */
  user_metadata: Record<string, unknown>

  /**
   * The app metadata of the auth user.
   */
  app_metadata: Record<string, unknown>
}

/**
 * @interface
 *
 * The auth user to be created.
 */
export type CreateAuthUserDTO = {
  /**
   * The ID of the auth user.
   */
  id?: string

  /**
   * The provider of the auth user.
   */
  provider: string

  /**
   * The associated entity's ID.
   */
  entity_id: string

  /**
   * The scope of the auth user.
   */
  scope: string

  /**
   * The provider metadata of the auth user.
   */
  provider_metadata?: Record<string, unknown>

  /**
   * The user metadata of the auth user.
   */
  user_metadata?: Record<string, unknown>

  /**
   * The app metadata of the auth user.
   */
  app_metadata?: Record<string, unknown>
}

/**
 * @interface
 *
 * The attributes to update in the auth user.
 */
export type UpdateAuthUserDTO = {
  /**
   * The ID of the auth user.
   */
  id: string

  /**
   * The provider metadata of the auth user.
   */
  provider_metadata?: Record<string, unknown>

  /**
   * The user metadata of the auth user.
   */
  user_metadata?: Record<string, unknown>

  /**
   * The app metadata of the auth user.
   */
  app_metadata?: Record<string, unknown>
}

/**
 * The filters to apply on the retrieved auth user.
 */
export interface FilterableAuthUserProps
  extends BaseFilterable<FilterableAuthUserProps> {
  /**
   * The IDs to filter the auth user by.
   */
  id?: string[]

  /**
   * Filter the auth auth user by the associated provider(s).
   */
  provider?: string[] | string
}
