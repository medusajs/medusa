/**
 * @oas [post] /admin/stores/{id}
 * operationId: PostStoresId
 * summary: Update a Store
 * description: Update a store's details.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The store's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: expand
 *     in: query
 *     description: Comma-separated relations that should be expanded in the returned data.
 *     required: false
 *     schema:
 *       type: string
 *       title: expand
 *       description: Comma-separated relations that should be expanded in the returned data.
 *   - name: fields
 *     in: query
 *     description: Comma-separated fields that should be included in the returned data.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned data.
 *   - name: offset
 *     in: query
 *     description: The number of items to skip when retrieving a list.
 *     required: false
 *     schema:
 *       type: number
 *       title: offset
 *       description: The number of items to skip when retrieving a list.
 *   - name: limit
 *     in: query
 *     description: Limit the number of items returned in the list.
 *     required: false
 *     schema:
 *       type: number
 *       title: limit
 *       description: Limit the number of items returned in the list.
 *   - name: order
 *     in: query
 *     description: Field to sort items in the list by.
 *     required: false
 *     schema:
 *       type: string
 *       title: order
 *       description: Field to sort items in the list by.
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/stores/{id}' \
 *       -H 'x-medusa-access-token: {api_token}'
 * tags:
 *   - Stores
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
 *           - supported_currency_codes
 *           - default_currency_code
 *           - default_sales_channel_id
 *           - default_region_id
 *           - default_location_id
 *           - metadata
 *         properties:
 *           name:
 *             type: string
 *             title: name
 *             description: The store's name.
 *           supported_currency_codes:
 *             type: array
 *             description: The store's supported currency codes.
 *             items:
 *               type: string
 *               title: supported_currency_codes
 *               description: The supported currency code's supported currency codes.
 *           default_currency_code:
 *             type: string
 *             title: default_currency_code
 *             description: The store's default currency code.
 *           default_sales_channel_id:
 *             type: string
 *             title: default_sales_channel_id
 *             description: The store's default sales channel id.
 *           default_region_id:
 *             type: string
 *             title: default_region_id
 *             description: The store's default region id.
 *           default_location_id:
 *             type: string
 *             title: default_location_id
 *             description: The store's default location id.
 *           metadata:
 *             type: object
 *             description: The store's metadata.
 *             properties: {}
 * 
*/

