/**
 * @interface
 *
 * The details of the authentication response.
 */
export type AuthenticationResponse = {
  /**
   * Whether the authentication was successful.
   */
  success: boolean

  /**
   * The authenticated user's details. The details shape
   * depends on the used provider ID.
   */
  authUser?: any

  /**
   * The error message, if an error occurs.
   */
  error?: string

  /**
   * Redirect location. Location takes precedence over success.
   */
  location?: string
}

/**
 * @interface
 *
 * Provider configuration for the Medusa auth module.
 */
export type AuthModuleProviderConfig = {
  /**
   * Provider name
   */
  name: string

  /**
   * Scope configurations for the provider
   */
  scopes: Record<string, AuthProviderScope>
}

/**
 * @interface
 *
 * Configuration of a single provider scope
 */
export type AuthProviderScope = Record<string, unknown>

/**
 * @interface
 *
 * Input for authentication and callback validation methods.
 */
export type AuthenticationInput = {
  /**
   * url of incoming authentication request.
   */
  url: string

  /**
   * Headers of incoming authentication request.
   */
  headers: Record<string, string>

  /**
   *  Query params of incoming authentication request.
   */
  query: Record<string, string>

  /**
   * Body of incoming authentication request.
   */
  body: Record<string, string>

  /**
   * Scope for authentication request.
   */
  authScope: string

  /**
   * Protocol of incoming authentication request (For example, `https`).
   */
  protocol: string
}
