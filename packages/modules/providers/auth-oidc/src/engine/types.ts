import {
  OidcAuthProviderOptions,
  OidcClaimMappings,
} from "@medusajs/framework/types"

export type { OidcClaimMappings }

/**
 * The options used to configure an {@link OidcEngine} instance..
 */
export interface OidcEngineOptions extends OidcAuthProviderOptions {
  /**
   * The TTL, in milliseconds, of the in-memory discovery-document cache and of
   * the cached OIDC client built from it.
   *
   * @defaultValue 3600000 (one hour)
   */
  discovery_cache_ttl_ms?: number

  /**
   * The timeout, in milliseconds, applied to discovery, JWKS, and token HTTP
   * requests.
   *
   * @defaultValue 10000
   */
  http_timeout_ms?: number
}

/**
 * The result of {@link OidcEngine.buildAuthorizationUrl}. The `nonce` and
 * `codeVerifier` must be persisted (in the auth state) so they can be replayed
 * when validating the callback.
 */
export interface OidcAuthorizationUrlResult {
  url: string
  nonce: string
  codeVerifier: string
}

/**
 * The input to {@link OidcEngine.buildAuthorizationUrl}.
 */
export interface OidcBuildAuthorizationUrlInput {
  /**
   * The `state` value (an opaque, single-use key) sent to the identity provider
   * and echoed back on the callback.
   */
  state: string
  /**
   * The `redirect_uri` to use. Falls back to the configured `callback_url`.
   */
  callbackUrl?: string
  /**
   * The scopes to request. Falls back to the configured scopes.
   */
  scopes?: string[]
}

/**
 * The input to {@link OidcEngine.exchangeCode}.
 */
export interface OidcExchangeCodeInput {
  /**
   * The full set of authorization-response parameters the identity provider
   * returned on the callback (`code`, `state`, `iss`, ...).
   */
  params: Record<string, string>
  /**
   * The stored nonce, matched against the ID token's `nonce` claim.
   */
  nonce: string
  /**
   * The stored PKCE code verifier.
   */
  codeVerifier: string
  /**
   * The `redirect_uri` used in the authorization request. Falls back to the
   * configured `callback_url`.
   */
  callbackUrl?: string
  /**
   * The `state` value echoed back by the identity provider, matched against the
   * `state` sent in the authorization request.
   */
  state?: string
}

/**
 * The tokens returned by the identity provider's token endpoint.
 */
export interface OidcTokens {
  id_token?: string
  access_token?: string
  refresh_token?: string
  expires_at?: number
  token_type?: string
  scope?: string
}

/**
 * The validated result of {@link OidcEngine.exchangeCode}.
 */
export interface OidcExchangeCodeResult {
  claims: Record<string, unknown>
  tokens: OidcTokens
}

/**
 * The result of {@link OidcEngine.mapClaims}: the value used to key the auth
 * identity and the profile data stored in its `user_metadata`.
 */
export interface OidcMappedClaims {
  entityId: string
  userMetadata: Record<string, unknown>
}
