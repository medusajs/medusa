/**
 * @oas [post] /admin/reservations
 * operationId: PostReservations
 * summary: Create Reservation
 * description: Create a reservation.
 * x-authenticated: true
 * parameters:
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
 *           - line_item_id
 *           - location_id
 *           - inventory_item_id
 *           - quantity
 *           - description
 *           - metadata
 *         properties:
 *           line_item_id:
 *             type: string
 *             title: line_item_id
 *             description: The reservation's line item id.
 *           location_id:
 *             type: string
 *             title: location_id
 *             description: The reservation's location id.
 *           inventory_item_id:
 *             type: string
 *             title: inventory_item_id
 *             description: The reservation's inventory item id.
 *           quantity:
 *             type: number
 *             title: quantity
 *             description: The reservation's quantity.
 *           description:
 *             type: string
 *             title: description
 *             description: The reservation's description.
 *           metadata:
 *             type: object
 *             description: The reservation's metadata.
 *             properties: {}
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/reservations' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "line_item_id": "{value}",
 *         "location_id": "{value}",
 *         "inventory_item_id": "{value}",
 *         "quantity": 3939752942239744,
 *         "description": "{value}",
 *         "metadata": {}
 *       }'
 * tags:
 *   - Reservations
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

