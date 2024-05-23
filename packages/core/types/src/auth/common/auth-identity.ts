import { BaseFilterable } from "../../dal"

/**
 * @interface
 *
 * The auth identity details.
 */
export type AuthIdentityDTO = {
  /**
   * The ID of the auth identity.
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
   * Holds custom data related to the provider in key-value pairs.
   */
  provider_metadata?: Record<string, unknown>

  /**
   * Holds custom data related to the user in key-value pairs.
   */
  user_metadata: Record<string, unknown>
}

/**
 * @interface
 *
 * The auth identity to be created.
 */
export type CreateAuthIdentityDTO = {
  /**
   * The ID of the auth identity.
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
   * Holds custom data related to the provider in key-value pairs.
   */
  provider_metadata?: Record<string, unknown>

  /**
   * Holds custom data related to the user in key-value pairs.
   */
  user_metadata?: Record<string, unknown>
}

/**
 * @interface
 *
 * The attributes to update in the auth identity.
 */
export type UpdateAuthIdentityDTO = {
  /**
   * The ID of the auth identity.
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
}

/**
 * The filters to apply on the retrieved auth identity.
 */
export interface FilterableAuthIdentityProps
  extends BaseFilterable<FilterableAuthIdentityProps> {
  /**
   * The IDs to filter the auth identity by.
   */
  id?: string[]

  /**
   * Filter the auth identitys by the ID of their auth provider.
   */
  provider?: string[] | string
}
