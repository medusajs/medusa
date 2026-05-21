/**
 * @oas [post] /auth/mfa/challenges/{id}/verify
 * operationId: PostMfaChallengesIdVerify
 * summary: Add Verify to Mfa
 * description: Add a Verify to a mfa
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
 *         required:
 *           - method
 *           - code
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
 *       const result = await sdk.auth.login("user", "emailpass", {
 *         email: "user@example.com",
 *         password: "secret"
 *       })
 * 
 *       if (typeof result === "object" && "mfa_challenge" in result) {
 *         await sdk.auth.mfa.verifyChallenge(result.mfa_challenge.id, {
 *           method: "totp",
 *           code: "123456"
 *         })
 *       }
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/auth/mfa/challenges/{id}/verify' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "method": "{value}",
 *         "code": "{value}"
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

