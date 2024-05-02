/**
 * @oas [get] /admin/sales-channels/{id}
 * operationId: GetSalesChannelsId
 * summary: Get a Sales Channel
 * description: Retrieve a sales channel by its ID. You can expand the sales
 *   channel's relations or select the fields that should be returned.
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
 *       curl '{backend_url}/admin/sales-channels/{id}' \
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
 *           - fields
 *         properties:
 *           fields:
 *             type: string
 *             title: fields
 *             description: The sales channel's fields.
 * 
*/

