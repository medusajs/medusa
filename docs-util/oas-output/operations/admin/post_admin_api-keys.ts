/**
 * @oas [post] /admin/api-keys
 * operationId: PostApiKeys
 * summary: Create Api Key
 * description: Create a api key.
 * x-authenticated: true
 * parameters: []
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/api-keys' \
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
 *           - title
 *           - type
 *         properties:
 *           title:
 *             type: string
 *             title: title
 *             description: The api key's title.
 *           type: {}
 * 
*/

