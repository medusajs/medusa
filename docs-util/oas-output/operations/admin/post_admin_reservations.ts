/**
 * @oas [post] /admin/reservations
 * operationId: PostReservations
 * summary: Create Reservation
 * description: Create a reservation.
 * x-authenticated: true
 * parameters: []
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
 *         "quantity": 3446260591755264,
 *         "description": "{value}",
 *         "metadata": {}
 *       }'
 * tags:
 *   - Reservations
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

