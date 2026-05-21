/**
 * @oas [post] /auth/mfa/recovery-codes
 * operationId: PostMfaRecoveryCodes
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
 *         properties:
 *           count:
 *             type: number
 *             title: count
 *             description: The mfa's count.
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

