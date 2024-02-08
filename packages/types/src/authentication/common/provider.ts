/**
 * @interface
 *
 * The response details of an authentication request.
 */
export type AuthenticationResponse = {
  /**
   * Whether the authentication was successful.
   */
  success: boolean

  /**
   * The details of the authenticated user. The shape
   * of the user depends on the user provider.
   */
  authUser?: any

  /**
   * The error message, if an error occurred.
   */
  error?: string

  /**
   * {summary}
   */
  location?: string
}

/**
 * @interface
 *
 * The configurations of an authentication provider.
 */
export type AuthModuleProviderConfig = {
  /**
   * The provider's name.
   */
  name: string

  /**
   * The scopes of the provider.
   */
  scopes: Record<string, AuthProviderScope>
}

/**
 * @interface
 *
 * {summary}
 */
export type AuthProviderScope = Record<string, string>

/**
 * @interface
 *
 * {summary}
 */
export type AuthenticationInput = {
  /**
   * {summary}
   */
  connection: {
    /**
     * {summary}
     */
    encrypted: boolean
  }

  /**
   * {summary}
   */
  url: string

  /**
   * Construct a type with a set of properties K of type T
   */
  headers: Record<string, string>

  /**
   * Construct a type with a set of properties K of type T
   */
  query: Record<string, string>

  /**
   * Construct a type with a set of properties K of type T
   */
  body: Record<string, string>

  /**
   * {summary}
   */
  scope: string
}
