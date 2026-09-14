/**
 * The mapping between an auth identity's fields and the claims returned
 * in the OIDC ID token. The key is the target field, and the value is the
 * name of the claim to read it from.
 *
 * @since 2.19.0
 */
export interface OidcClaimMappings {
  /**
   * The claim used to derive the auth identity's `entity_id`.
   *
   * @defaultValue "sub"
   */
  entity_id?: string

  /**
   * The claim used to read the user's email address.
   *
   * @defaultValue "email"
   */
  email?: string

  /**
   * The claim used to read the user's display name.
   *
   * @defaultValue "name"
   */
  name?: string

  /**
   * Additional custom claim mappings. The key is the target field stored
   * in the auth identity's `user_metadata`, and the value is the claim's name.
   */
  [key: string]: string | undefined
}

/**
 * The options of the generic OIDC (OpenID Connect) auth provider.
 *
 * The provider works with any spec-compliant identity provider (Okta, Entra ID,
 * Auth0, Keycloak, Google Workspace, ...) by resolving the provider's configuration
 * from its discovery document, unless the relevant endpoints are configured explicitly.
 *
 * @since 2.19.0
 */
export interface OidcAuthProviderOptions {
  /**
   * The identity provider's issuer URL. It's used both to resolve the discovery
   * document at `{issuer}/.well-known/openid-configuration` and to validate the
   * `iss` claim of returned ID tokens. Must be an `https` URL, except for
   * `localhost` outside of production.
   */
  issuer: string

  /**
   * The OAuth 2 client ID registered with the identity provider.
   */
  client_id: string

  /**
   * The OAuth 2 client secret registered with the identity provider.
   *
   * Optional: a public client authenticating with PKCE only is valid.
   */
  client_secret?: string

  /**
   * The default `redirect_uri` the identity provider redirects to after a
   * successful authentication.
   */
  callback_url: string

  /**
   * An exact-match allowlist of callback URLs that a request may use to override
   * `callback_url` (through the request's `callback_url` body field). Any override
   * that isn't in this list is rejected.
   *
   * This check is opt-in and complements the identity provider's own redirect URI
   * validation. If the option isn't set, any callback URL is accepted and the
   * validation is left entirely to the identity provider.
   */
  allowed_callback_urls?: string[]

  /**
   * The OAuth 2 / OIDC scopes to request. The `openid` scope is required for the
   * identity provider to return an ID token, and it's included in the default;
   * always keep it when overriding this option.
   *
   * @defaultValue `["openid", "email", "profile"]`
   */
  scopes?: string[]

  /**
   * An explicit authorization endpoint. If set, it overrides the value from the
   * discovery document.
   */
  authorization_endpoint?: string

  /**
   * An explicit token endpoint. If set, it overrides the value from the
   * discovery document.
   */
  token_endpoint?: string

  /**
   * An explicit JWKS URI used to verify ID-token signatures. If set, it overrides
   * the value from the discovery document.
   */
  jwks_uri?: string

  // TODO: sso remove this option?
  /**
   * An explicit end-session endpoint. It's stored for future RP-initiated logout
   * support and, if set, overrides the value from the discovery document.
   */
  end_session_endpoint?: string

  /**
   * The mapping between the auth identity's fields and the ID token's claims.
   *
   * @defaultValue `{ entity_id: "sub", email: "email", name: "name" }`
   */
  claim_mappings?: OidcClaimMappings

  /**
   * Whether the user's email must be verified (`email_verified` claim) by the
   * identity provider before authentication succeeds.
   *
   * This requires the identity provider to return the `email_verified` claim,
   * which is typically included through the `email` scope. With scope sets that
   * omit the claim, authentication will always fail unless this option is set
   * to `false`.
   *
   * @defaultValue true
   */
  require_verified_email?: boolean

  /**
   * An optional allowlist of email domains permitted to authenticate through this
   * provider. If set, only users whose email domain is in this list can log in.
   */
  allowed_email_domains?: string[]

  /**
   * The allowed clock skew, in seconds, when validating time-based ID-token claims
   * (`exp`, `iat`, `nbf`).
   *
   * @defaultValue 5
   */
  clock_tolerance_seconds?: number

  /**
   * The time-to-live, in seconds, of the single-use `state` value stored during
   * the authentication flow.
   *
   * @defaultValue 600
   */
  state_ttl_seconds?: number

  /**
   * The display name of the provider. Useful when using multiple registrations for specific implementations:
   * Google, Okta, etc.
   *
   * @defaultValue "OpenID Connect"
   */
  display_name?: string
}
