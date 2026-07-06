/**
 * @oas [post] /auth/mfa/recovery-codes
 * operationId: PostMfaRecoveryCodes
 * summary: Generate Multi-Factor Authentication (MFA) Recovery Codes
 * x-sidebar-summary: Generate MFA Recovery Codes
 * description: |
 *   Generate a new set of single-use recovery codes for the authenticated user. Recovery codes can
 *   be used to verify MFA challenges when the user does not have access to their primary MFA
 *   factor. Generating new codes replaces any previously issued codes, so they should be stored in
 *   a safe place. At least one enabled MFA factor is required to generate recovery codes.
 * x-authenticated: false
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: The options to use when generating recovery codes.
 *         properties:
 *           count:
 *             type: number
 *             title: count
 *             description: The number of recovery codes to generate. Must be between 1 and 50. Defaults to the provider's configured value when omitted.
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
 *       const { recovery_codes } = await sdk.auth.mfa.generateRecoveryCodes()
 *   - lang: Shell
 *     label: cURL
 *     source: curl -X POST '{backend_url}/auth/mfa/recovery-codes'
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

