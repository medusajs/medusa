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
   * The list of provider identities linked to the auth identity.
   **/
  provider_identities?: ProviderIdentityDTO[]

  /**
   * Holds information related to the actor IDs tied to the auth identity.
   */
  app_metadata?: Record<string, unknown>
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
   * The list of provider identities linked to the auth identity.
   **/
  provider_identities?: CreateProviderIdentityDTO[]

  /**
   * Holds information related to the actor IDs tied to the auth identity.
   */
  app_metadata?: Record<string, unknown>
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
   * Holds information related to the actor IDs tied to the auth identity.
   */
  app_metadata?: Record<string, unknown>
}

/**
 * @interface
 *
 * The provider identity details.
 */
export type ProviderIdentityDTO = {
  /**
   * The ID of the provider identity.
   */
  id: string

  /*
   * The ID of the provider used to authenticate the user.
   */
  provider: string

  /**
   * The user's identifier. For example, when using the `emailpass`
   * provider, the `entity_id` would be the user's email.
   */
  entity_id: string

  /**
   * The auth identity linked to the provider identity.
   */
  auth_identity?: AuthIdentityDTO

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
 * The provider identity to be created.
 */
export type CreateProviderIdentityDTO = {
  /**
   * The ID of the provider identity.
   */
  id?: string

  /*
   * The ID of the provider used to authenticate the user.
   */
  provider: string

  /**
   * The user's identifier. For example, when using the `emailpass`
   * provider, the `entity_id` would be the user's email.
   */
  entity_id: string

  /**
   * The auth identity linked to the provider identity. Needs to be specified if creating a new provider identity directly.
   */
  auth_identity_id?: string

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
 * The provider identity to be created.
 */
export type UpdateProviderIdentityDTO = {
  /**
   * The ID of the provider identity.
   */
  id: string

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
 * The filters to apply on the retrieved auth identity.
 */
export interface FilterableAuthIdentityProps
  extends BaseFilterable<FilterableAuthIdentityProps> {
  /**
   * The IDs to filter the auth identity by.
   */
  id?: string[]

  /**
   * The provider identities to filter the auth identity by.
   */
  provider_identities?: {
    /**
     * Filter the provider identities by the ID of the provider identity ID they are linked to.
     */
    entity_id?: string

    /**
     * Filter the provider identities by the provider handle.
     */
    provider?: string
  }
}
