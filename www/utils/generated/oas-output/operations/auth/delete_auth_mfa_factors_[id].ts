/**
 * @oas [delete] /auth/mfa/factors/{id}
 * operationId: DeleteMfaFactorsId
 * summary: Disable a Multi-Factor Authentication (MFA) Factor
 * x-sidebar-summary: Disable MFA Factor
 * description: |
 *   Disable a multi-factor authentication (MFA) factor for the authenticated user. Once disabled,
 *   the factor can no longer be used to verify MFA challenges. When disabling a recovery-code
 *   factor, a valid recovery code must be provided in the request body.
 * x-authenticated: false
 * parameters:
 *   - name: id
 *     in: path
 *     description: The MFA factor's ID.
 *     required: true
 *     schema:
 *       type: string
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: The details required to disable the MFA factor.
 *         properties:
 *           method:
 *             type: string
 *             title: method
 *             description: The MFA method used to authorize disabling the factor (for example, `recovery-code`).
 *           code:
 *             type: string
 *             title: code
 *             description: The verification code associated with the provided `method`, used to confirm the disable action.
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
 *       const { mfa_factor } = await sdk.auth.mfa.disable("authmfa_123")
 *   - lang: Shell
 *     label: cURL
 *     source: curl -X DELETE '{backend_url}/auth/mfa/factors/{id}'
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

