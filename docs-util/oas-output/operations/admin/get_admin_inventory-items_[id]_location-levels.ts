/**
 * @oas [get] /admin/inventory-items/{id}/location-levels
 * operationId: GetInventoryItemsIdLocationLevels
 * summary: List Location Levels
 * description: Retrieve a list of location levels in a inventory item. The
 *   location levels can be filtered by fields like FILTER FIELDS. The location
 *   levels can also be paginated.
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
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/inventory-items/{id}/location-levels' \
 *       -H 'x-medusa-access-token: {api_token}'
 * tags:
 *   - Inventory Items
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

