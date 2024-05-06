/**
 * @oas [post] /admin/stock-locations/{id}
 * operationId: PostStockLocationsId
 * summary: Update a Stock Location
 * description: Update a stock location's details.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The stock location's ID.
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
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: SUMMARY
 *         required:
 *           - name
 *           - address
 *           - address_id
 *           - metadata
 *         properties:
 *           name:
 *             type: string
 *             title: name
 *             description: The stock location's name.
 *           address:
 *             type: object
 *             description: The stock location's address.
 *             required:
 *               - address_1
 *               - address_2
 *               - company
 *               - city
 *               - country_code
 *               - phone
 *               - postal_code
 *               - province
 *             properties:
 *               address_1:
 *                 type: string
 *                 title: address_1
 *                 description: The address's address 1.
 *               address_2:
 *                 type: string
 *                 title: address_2
 *                 description: The address's address 2.
 *               company:
 *                 type: string
 *                 title: company
 *                 description: The address's company.
 *               city:
 *                 type: string
 *                 title: city
 *                 description: The address's city.
 *               country_code:
 *                 type: string
 *                 title: country_code
 *                 description: The address's country code.
 *               phone:
 *                 type: string
 *                 title: phone
 *                 description: The address's phone.
 *               postal_code:
 *                 type: string
 *                 title: postal_code
 *                 description: The address's postal code.
 *               province:
 *                 type: string
 *                 title: province
 *                 description: The address's province.
 *           address_id:
 *             type: string
 *             title: address_id
 *             description: The stock location's address id.
 *           metadata:
 *             type: object
 *             description: The stock location's metadata.
 *             properties: {}
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/stock-locations/{id}' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "name": "Gustave",
 *         "address": {
 *           "address_1": "{value}",
 *           "address_2": "{value}",
 *           "company": "{value}",
 *           "city": "{value}",
 *           "country_code": "{value}",
 *           "phone": "{value}",
 *           "postal_code": "{value}",
 *           "province": "{value}"
 *         },
 *         "address_id": "{value}",
 *         "metadata": {}
 *       }'
 * tags:
 *   - Stock Locations
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

