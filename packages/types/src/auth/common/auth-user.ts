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
   * The ID of the provider used to authenticate the user.
   */
  provider: string

  /**
   * The user's identifier. For example, when using the `emailpass`
   * provider, the `entity_id` would be the user's email.
   */
  entity_id: string

  /**
   * The scope of the auth user. For example,
   * `admin` or `store`.
   */
  scope: string

  /**
   * Holds custom data related to the provider in key-value pairs.
   */
  provider_metadata?: Record<string, unknown>

  /**
   * Holds custom data related to the user in key-value pairs.
   */
  user_metadata: Record<string, unknown>

  /**
   * Holds custom data related to the third-party app in key-value pairs.
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
   * The ID of the provider used to authenticate
   * the user.
   */
  provider: string

  /**
   * The user's identifier. For example, when using the `emailpass`
   * provider, the `entity_id` would be the user's email.
   */
  entity_id: string

  /**
   * The scope of the auth user. For example,
   * `admin` or `store`.
   */
  scope: string

  /**
   * Holds custom data related to the provider in key-value pairs.
   */
  provider_metadata?: Record<string, unknown>

  /**
   * Holds custom data related to the user in key-value pairs.
   */
  user_metadata?: Record<string, unknown>

  /**
   * Holds custom data related to the third-party app in key-value pairs.
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
   * Holds custom data related to the provider in key-value pairs.
   */
  provider_metadata?: Record<string, unknown>

  /**
   * Holds custom data related to the user in key-value pairs.
   */
  user_metadata?: Record<string, unknown>

  /**
   * Holds custom data related to the third-party app in key-value pairs.
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
   * Filter the auth users by the ID of their auth provider.
   */
  provider?: string[] | string
}
