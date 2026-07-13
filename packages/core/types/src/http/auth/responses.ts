/**
 * The public information of a registered auth provider instance. This is safe
 * to expose to unauthenticated clients and never contains provider options or
 * secrets.
 */
export interface AuthProvider {
  /**
   * The registered instance ID of the provider, used in authentication routes
   * (for example, `okta` in `POST /auth/user/okta`).
   */
  id: string
  /**
   * The provider's static identifier (for example, `oidc` or `emailpass`).
   */
  identifier: string
  /**
   * The name to display for the provider in a frontend application.
   */
  display_name: string
}

/**
 * The response of listing the auth providers available for an actor type.
 */
export interface AuthProvidersListResponse {
  /**
   * The list of auth providers.
   */
  providers: AuthProvider[]
}
