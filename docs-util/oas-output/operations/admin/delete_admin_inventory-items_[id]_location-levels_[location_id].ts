/**
 * @oas [delete] /admin/inventory-items/{id}/location-levels/{location_id}
 * operationId: DeleteInventoryItemsIdLocationLevelsLocation_id
 * summary: Remove Location Levels from Inventory Item
 * description: Remove a list of location levels from a inventory item. This
 *   doesn't delete the Location Level, only the association between the Location
 *   Level and the inventory item.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The inventory item's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: location_id
 *     in: path
 *     description: The inventory item's location id.
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
 *     source: >-
 *       curl -X DELETE
 *       '{backend_url}/admin/inventory-items/{id}/location-levels/{location_id}' \
 * 
 *       -H 'x-medusa-access-token: {api_token}'
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
 * requestBody:
 *   content:
 *     application/json:
 *       schema: {}
 * 
*/

