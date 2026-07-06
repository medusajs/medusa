/**
 * @oas [post] /auth/mfa/factors
 * operationId: PostMfaFactors
 * summary: Start Multi-Factor Authentication (MFA) Factor Enrollment
 * x-sidebar-summary: Start MFA Factor Enrollment
 * description: |
 *   Start the enrollment of a new multi-factor authentication (MFA) factor for the authenticated
 *   user. The response contains the factor along with provider-specific setup data (such as a
 *   secret and an `otpauth_url` for TOTP) that can be used to display a QR code. The factor must
 *   then be verified via the verify endpoint before it can be used.
 * x-authenticated: false
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: The details of the MFA factor to enroll.
 *         required:
 *           - provider
 *         properties:
 *           provider:
 *             type: string
 *             title: provider
 *             description: The ID of the MFA provider to enroll the factor with (for example, `totp`).
 *           label:
 *             type: string
 *             title: label
 *             description: A human-readable label to identify the factor (for example, the name of the authenticator app or device).
 *           issuer:
 *             type: string
 *             title: issuer
 *             description: The issuer name shown in authenticator apps for this factor. Defaults to the application name when omitted.
 *           metadata:
 *             type: object
 *             description: Additional provider-specific data to associate with the factor.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS SDK
 *     source: |-
 *       import Medusa from "@medusajs/js-sdk"
 * 
 *       export const sdk = new Medusa({
 *         baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
 *         debug: import.meta.env.DEV,
 *         auth: {
 *           type: "session",
 *         },
 *       })
 * 
 *       const setup = await sdk.auth.mfa.start({
 *         provider: "totp",
 *         label: "Authenticator app"
 *       })
 * 
 *       // Render setup.otpauth_url as a QR code or show setup.secret manually.
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/auth/mfa/factors' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "provider": "{value}"
 *       }'
 * tags:
 *   - Mfa
 * responses:
 *   "200":
 *     description: OK
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 * 
*/

