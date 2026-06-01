import { AuthIdentityDTO } from "./auth-identity"
import { AuthVerification } from "./verification"
import { AuthMfaChallengeDTO } from "./mfa"

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
   * The multi-factor authentication (MFA) challenge to complete before issuing a token.
   */
  mfa_challenge?: AuthMfaChallengeDTO

  /**
   * The verification state to show to the caller.
   */
  verification?: AuthVerification

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
   * Actor type used to issue the token after authentication.
   */
  actor_type?: string

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
   *
   * One of the arguments that is suggested to be treated in a standard manner is a `callback_url` field.
   * The field specifies where the user is redirected to after a successful authentication in the case of Oauth auhentication.
   * If not passed, the provider will fallback to the callback_url provided in the provider options.
   */
  body?: Record<string, string>

  /**
   * Protocol of the incoming authentication request (For example, `https`).
   */
  protocol?: string
}
