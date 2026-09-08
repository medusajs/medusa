/**
 * @schema AuthProvider
 * type: object
 * description: |-
 *   The public information of a registered auth provider instance. This is safe
 *   to expose to unauthenticated clients and never contains provider options or
 *   secrets.
 * x-schemaName: AuthProvider
 * required:
 *   - id
 *   - identifier
 *   - display_name
 *   - flow
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: |-
 *       The registered instance ID of the provider, used in authentication routes
 *       (for example, `okta` in `POST /auth/user/okta`).
 *   identifier:
 *     type: string
 *     title: identifier
 *     description: The provider's static identifier (for example, `oidc` or `emailpass`).
 *   display_name:
 *     type: string
 *     title: display_name
 *     description: The name to display for the provider in a frontend application.
 *   flow:
 *     type: string
 *     description: |-
 *       The authentication flow the provider uses:
 * 
 *       - `credentials`: the client submits credentials (for example, email and
 *       password) directly to the authentication route.
 *       - `redirect`: the client is redirected to the provider (for example, an
 *       OIDC identity provider) and returns through a callback.
 * 
 *       A frontend can use this to decide whether to render a credentials form or a
 *       "Continue with ..." redirect button.
 *     enum:
 *       - credentials
 *       - redirect
 * 
*/

