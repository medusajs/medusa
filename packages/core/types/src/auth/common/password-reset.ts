/**
 * The data required to create a single-use password reset token.
 *
 * @since 2.15.6
 */
export type CreatePasswordResetTokenDTO = {
  /**
   * The ID of the authentication provider, e.g. `emailpass`.
   */
  provider: string
  /**
   * The identifier of the entity requesting the reset, typically the email.
   */
  entity_id: string
  /**
   * Optional token lifetime in seconds. Defaults to the module's password
   * reset TTL when omitted.
   */
  ttl_seconds?: number
}

/**
 * The data returned when issuing a password reset token.
 *
 * @since 2.15.6
 */
export type CreatePasswordResetTokenResponse = {
  /**
   * The opaque token identifier. The caller is responsible for embedding it
   * as the `jti` claim of the reset JWT.
   */
  jti: string
  /**
   * The absolute expiration time of the stored token row.
   */
  expires_at: Date
}

/**
 * The data required to consume a previously-issued password reset token.
 *
 * @since 2.15.6
 */
export type ConsumePasswordResetTokenDTO = {
  /**
   * The token identifier extracted from the reset JWT's `jti` claim.
   */
  jti: string
  /**
   * The ID of the authentication provider the token was issued for.
   */
  provider: string
  /**
   * The identifier of the entity the token was issued for.
   */
  entity_id: string
}

/**
 * The data returned when a password reset token is successfully consumed.
 *
 * @since 2.15.6
 */
export type ConsumePasswordResetTokenResponse = {
  /** The ID of the auth identity associated with the consumed token. */
  auth_identity_id: string
  /** The ID of the provider identity associated with the consumed token. */
  provider_identity_id: string
  /** The entity identifier associated with the consumed token. */
  entity_id: string
}
