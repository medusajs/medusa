import { ApiKeyType } from "../common"

/**
 * The API key to be created.
 */
export interface CreateApiKeyDTO {
  /**
   * The title of the API key.
   */
  title: string

  /**
   * The type of the API key.
   */
  type: ApiKeyType

  /**
   * Who created the API key.
   */
  created_by: string
  // We could add revoked_at as a parameter (or expires_at that gets mapped to revoked_at internally) in order to support expiring tokens
}

/**
 * The attributes in the API key to be created or updated.
 */
export interface UpsertApiKeyDTO {
  /**
   * The ID of the API key.
   */
  id?: string

  /**
   * The title of the API key.
   */
  title?: string

  /**
   * The type of the API key. Required only when creating an API key.
   */
  type?: ApiKeyType

  /**
   * Who created the API key. It's only
   * usable and required when creating an API key.
   */
  created_by?: string
}

/**
 * The attributes to update in the API key.
 */
export interface UpdateApiKeyDTO {
  /**
   * The title of the API key.
   */
  title?: string
}

/**
 * The details of revoking an API key.
 */
export interface RevokeApiKeyDTO {
  /**
   * Who revoked the API key.
   */
  revoked_by: string

  /**
   * When to revoke the API key (time in seconds).
   */
  revoke_in?: number
}
