/**
 * @oas [post] /admin/inventory-items/{id}/location-levels
 * operationId: PostInventoryItemsIdLocationLevels
 * summary: Add Location Levels to Inventory Item
 * description: Add a list of location levels to a inventory item.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The inventory item's ID.
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
 *         required:
 *           - location_id
 *           - stocked_quantity
 *           - incoming_quantity
 *         properties:
 *           location_id:
 *             type: string
 *             title: location_id
 *             description: The inventory item's location id.
 *           stocked_quantity:
 *             type: number
 *             title: stocked_quantity
 *             description: The inventory item's stocked quantity.
 *           incoming_quantity:
 *             type: number
 *             title: incoming_quantity
 *             description: The inventory item's incoming quantity.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/inventory-items/{id}/location-levels' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "location_id": "{value}",
 *         "stocked_quantity": 1506469662949376
 *       }'
 * tags:
 *   - Inventory Items
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

