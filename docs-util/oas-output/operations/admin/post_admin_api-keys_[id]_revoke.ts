/**
 * @oas [post] /admin/api-keys/{id}/revoke
 * operationId: PostApiKeysIdRevoke
 * summary: Add Revokes to Api Key
 * description: Add a list of revokes to a api key.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The api key's ID.
 *     required: true
 *     schema:
 *       type: string
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/api-keys/{id}/revoke' \
 *       -H 'x-medusa-access-token: {api_token}'
 * tags:
 *   - Api Keys
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
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         required:
 *           - revoke_in
 *         properties:
 *           revoke_in:
 *             type: number
 *             title: revoke_in
 *             description: The api key's revoke in.
 * 
*/

