/**
 * @oas [post] /admin/inventory-items/location-levels/batch
 * operationId: PostInventoryItemsLocationLevelsBatch
 * summary: Manage Inventory Levels
 * description: Manage inventory levels to create, update, or delete them.
 * x-authenticated: true
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminBatchInventoryItemsLocationLevels"
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
 *       sdk.admin.inventoryItem.batchInventoryItemsLocationLevels({
 *         create: [{
 *           inventory_item_id: "iitem_123",
 *           location_id: "sloc_123",
 *           stocked_quantity: 10
 *         }],
 *         delete: ["ilvl_123"]
 *       })
 *       .then(({ created, updated, deleted }) => {
 *         console.log(created, updated, deleted)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/inventory-items/location-levels/batch' \
 *       -H 'Authorization: Bearer {jwt_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "create": [
 *           {
 *             "location_id": "sloc_123",
 *             "inventory_item_id": "iitem_123",
 *             "stocked_quantity": 100,
 *             "incoming_quantity": 50
 *           }
 *         ],
 *         "update": [
 *           {
 *             "location_id": "sloc_456",
 *             "inventory_item_id": "iitem_456",
 *             "stocked_quantity": 200,
 *             "incoming_quantity": 75
 *           }
 *         ],
 *         "delete": [
 *           "iilev_123"
 *         ]
 *       }'
 * tags:
 *   - Inventory Items
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminBatchInventoryItemsLocationLevelsResponse"
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
 * x-workflow: batchInventoryItemLevelsWorkflow
 * x-events:
 *   - name: inventory-level.created
 *     payload: |-
 *       ```ts
 *       {
 *         id, // The ID of the inventory level
 *       }
 *       ```
 *     description: Emitted when inventory levels are created.
 *     deprecated: false
 *     since: 2.18.0
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
 *   - name: inventory-level.deleted
 *     payload: |-
 *       ```ts
 *       {
 *         id, // The ID of the inventory level
 *       }
 *       ```
 *     description: Emitted when inventory levels are deleted.
 *     deprecated: false
 *     since: 2.18.0
 * 
*/

