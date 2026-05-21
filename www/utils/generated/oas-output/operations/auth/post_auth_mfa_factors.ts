/**
 * @oas [post] /auth/mfa/factors
 * operationId: PostMfaFactors
 * summary: Create Mfa
 * description: Create a mfa.
 * x-authenticated: false
 * parameters: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: SUMMARY
 *         required:
 *           - provider
 *         properties:
 *           provider:
 *             type: string
 *             title: provider
 *             description: The mfa's provider.
 *           label:
 *             type: string
 *             title: label
 *             description: The mfa's label.
 *           issuer:
 *             type: string
 *             title: issuer
 *             description: The mfa's issuer.
 *           metadata:
 *             type: object
 *             description: The mfa's metadata.
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

