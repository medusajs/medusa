/**
 * @oas [delete] /store/auth
 * operationId: "DeleteAuth"
 * summary: "Customer Log out"
 * description: "Delete the current session for the logged in customer."
 * x-authenticated: true
 * x-codegen:
 *   method: deleteSession
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.auth.deleteSession()
 *       .then(() => {
 *         // customer logged out successfully
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl -X DELETE '{backend_url}/store/auth' \
 *       -H 'Authorization: Bearer {access_token}'
 * security:
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Auth
 * responses:
 *  "200":
 *    description: OK
 *  "400":
 *    $ref: "#/components/responses/400_error"
 *  "401":
 *    $ref: "#/components/responses/unauthorized"
 *  "404":
 *    $ref: "#/components/responses/not_found_error"
 *  "409":
 *    $ref: "#/components/responses/invalid_state_error"
 *  "422":
 *    $ref: "#/components/responses/invalid_request_error"
 *  "500":
 *    $ref: "#/components/responses/500_error"
 */
export default async (req, res) => {
  if (req.session.user_id) {
    // if we are also logged in as a user, persist that session
    delete req.session.customer_id
  } else {
    // otherwise, destroy the session
    req.session.destroy()
  }

  res.sendStatus(200)
}
