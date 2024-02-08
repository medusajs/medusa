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
   * {summary}
   */
  location?: string
}

/**
 * @interface
 *
 * {summary}
 */
export type AuthModuleProviderConfig = {
  /**
   * {summary}
   */
  name: string

  /**
   * Construct a type with a set of properties K of type T
   */
  scopes: Record<string, AuthProviderScope>
}

/**
 * @interface
 *
 * {summary}
 */
export type AuthProviderScope = Record<string, unknown>

/**
 * @interface
 *
 * {summary}
 */
export type AuthenticationInput = {
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
  authScope: string

  /**
   * {summary}
   */
  protocol: string
}
