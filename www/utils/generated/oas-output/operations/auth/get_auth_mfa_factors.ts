/**
 * @oas [get] /auth/mfa/factors
 * operationId: GetMfaFactors
 * summary: List Multifactor Authentication (MFA) Factors
 * x-sidebar-summary: List MFA Factors
 * description: |
 *   Retrieve the list of multi-factor authentication (MFA) factors registered for the authenticated user,
 *   including both pending (not yet verified) and enabled factors.
 * x-authenticated: false
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
 *       const { mfa_factors } = await sdk.auth.mfa.list()
 *   - lang: Shell
 *     label: cURL
 *     source: curl '{backend_url}/auth/mfa/factors'
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

