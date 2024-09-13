/**
 * @oas [delete] /auth/session
 * operationId: DeleteSession
 * summary: Delete Session
 * description: Delete Session
 * x-authenticated: false
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: curl -X DELETE '{backend_url}/auth/session'
 * tags:
 *   - Session
 * responses:
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

