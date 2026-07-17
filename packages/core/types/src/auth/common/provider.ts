import { AuthMfaChallengeDTO } from "../.."
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
   * The multi-factor authentication (MFA) challenge to complete before issuing a token.
   */
  mfaChallenge?: AuthMfaChallengeDTO

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
 * Public information about a registered auth provider instance. This is safe to
 * expose to unauthenticated clients (for example, a login UI that renders a
 * button per provider). It never includes the provider's options or secrets.
 */
export type AuthProviderInfoDTO = {
  /**
   * The registered instance ID of the provider. This is the value used in
   * authentication routes (for example, `okta` in `POST /auth/user/okta`).
   */
  id: string

  /**
   * The provider's static identifier (for example, `oidc` or `emailpass`).
   * Multiple instances can share the same identifier.
   */
  identifier: string

  /**
   * The name to display for the provider in a frontend application.
   */
  display_name: string

  /**
   * The authentication flow the provider uses:
   *
   * - `credentials`: the client submits credentials (for example, email and
   * password) directly to the authentication route.
   * - `redirect`: the client is redirected to the provider (for example, an
   * OIDC identity provider) and returns through a callback. A provider is
   * considered `redirect` when it implements `validateCallback`.
   *
   * This value is derived and can be used by a frontend to decide whether to
   * render a credentials form or a "Continue with ..." redirect button.
   */
  flow: "credentials" | "redirect"
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
