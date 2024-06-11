/**
 * @oas [post] /admin/sales-channels/{id}
 * operationId: PostSalesChannelsId
 * summary: Update a Sales Channel
 * description: Update a sales channel's details.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The sales channel's ID.
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
 *       curl -X POST '{backend_url}/admin/sales-channels/{id}' \
 *       -H 'x-medusa-access-token: {api_token}'
 * tags:
 *   - Sales Channels
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
 *           - name
 *           - description
 *           - is_disabled
 *           - metadata
 *         properties:
 *           name:
 *             type: string
 *             title: name
 *             description: The sales channel's name.
 *           description:
 *             type: string
 *             title: description
 *             description: The sales channel's description.
 *           is_disabled:
 *             type: boolean
 *             title: is_disabled
 *             description: The sales channel's is disabled.
 *           metadata:
 *             type: object
 *             description: The sales channel's metadata.
 *             properties: {}
 * 
*/

