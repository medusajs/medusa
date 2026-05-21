/**
 * @oas [delete] /auth/mfa/factors/{id}
 * operationId: DeleteMfaFactorsId
 * summary: Remove Factor from Mfa
 * description: Remove a Factor from a mfa.
 * x-authenticated: false
 * parameters:
 *   - name: id
 *     in: path
 *     description: The mfa's ID.
 *     required: true
 *     schema:
 *       type: string
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: SUMMARY
 *         properties:
 *           method:
 *             type: string
 *             title: method
 *             description: The mfa's method.
 *           code:
 *             type: string
 *             title: code
 *             description: The mfa's code.
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

