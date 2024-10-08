import { AuthIdentityDTO } from "./auth-identity"

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
   * The authenticated user's details.
   */
  authIdentity?: AuthIdentityDTO

  /**
   * If an error occurs during the authentication process,
   * whether within the Auth Module or a third-party provider,
   * the error message is set in this field.
   */
  error?: string

  /**
   * The URL to redirect to for further authentication action
   * with a third-party provider. This takes precedence before
   * the `success` field.
   *
   * So, after checking that authentication is successful,
   * you should check whether this field is defined and, if so, redirect to the
   * specified location.
   */
  location?: string
}

/**
 * @interface
 *
 * The data passed to the auth provider when authenticating a user
 * or validating a callback.
 */
export type AuthenticationInput = {
  /**
   * URL of the incoming authentication request.
   */
  url?: string

  /**
   * Headers of incoming authentication request.
   */
  headers?: Record<string, string>

  /**
   *  Query params of the incoming authentication request.
   */
  query?: Record<string, string>

  /**
   * Body of the incoming authentication request.
   */
  body?: Record<string, string>

  /**
   * Protocol of the incoming authentication request (For example, `https`).
   */
  protocol?: string
}
