/**
 * @oas [get] /admin/inventory-items
 * operationId: GetInventoryItems
 * summary: List Inventory Items
 * description: Retrieve a list of inventory items. The inventory items can be
 *   filtered by fields such as `id`. The inventory items can also be sorted or
 *   paginated.
 * x-authenticated: true
 * parameters: []
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/inventory-items' \
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

