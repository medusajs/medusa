/**
 * @oas [post] /admin/inventory-items/{id}/location-levels/{location_id}
 * operationId: PostInventoryItemsIdLocationLevelsLocation_id
 * summary: Update an Inventory Level of an Inventory Item
 * x-sidebar-summary: Update Inventory Level
 * description: Updates the details of an inventory item's inventory level using its associated location ID.
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
 *     description: The ID of the location associated with the inventory level.
 *     required: true
 *     schema:
 *       type: string
 *   - name: fields
 *     in: query
 *     description: Comma-separated fields that should be included in the returned data. if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *       fields. without prefix it will replace the entire default fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned data. if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *         fields. without prefix it will replace the entire default fields.
 *       externalDocs:
 *         url: "#select-fields-and-relations"
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminUpdateInventoryLevel"
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS SDK
 *     source: |-
 *       import Medusa from "@medusajs/js-sdk"
 * 
 *       export const sdk = new Medusa({
 *         baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
 *         debug: import.meta.env.DEV,
 *         auth: {
 *           type: "session",
 *         },
 *       })
 * 
 *       sdk.admin.inventoryItem.updateLevel(
 *         "iitem_123",
 *         "sloc_123",
 *         {
 *           stocked_quantity: 10
 *         }
 *       )
 *       .then(({ inventory_item }) => {
 *         console.log(inventory_item)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/inventory-items/{id}/location-levels/{location_id}' \
 *       -H 'Authorization: Bearer {jwt_token}'
 * tags:
 *   - Inventory Items
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminInventoryItemResponse"
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
 * x-workflow: updateInventoryLevelsWorkflow
 * x-events:
 *   - name: inventory-level.updated
 *     payload: |-
 *       ```ts
 *       {
 *         id, // The ID of the inventory level
 *         order_id, // (optional) The ID of the order, if the update was triggered by an order flow
 *       }
 *       ```
 *     description: |-
 *       Emitted when inventory levels are updated. This includes adjustments to
 *       the stocked or reserved quantity, such as during order fulfillment.
 *     deprecated: false
 *     since: 2.18.0
 * 
*/

