/**
 * @oas [post] /admin/api-keys/{id}/sales-channels
 * operationId: PostApiKeysIdSalesChannels
 * summary: Add Sales Channels to Api Key
 * description: Add a list of sales channels to a api key.
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
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: SUMMARY
 *         properties:
 *           add:
 *             type: array
 *             description: The api key's add.
 *             items:
 *               type: string
 *               title: add
 *               description: The add's details.
 *           remove:
 *             type: array
 *             description: The api key's remove.
 *             items:
 *               type: string
 *               title: remove
 *               description: The remove's details.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/api-keys/{id}/sales-channels' \
 *       -H 'x-medusa-access-token: {api_token}'
 * tags:
 *   - Api Keys
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

