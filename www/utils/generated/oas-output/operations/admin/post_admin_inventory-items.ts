/**
 * @oas [post] /admin/inventory-items
 * operationId: PostInventoryItems
 * summary: Create Inventory Item
 * description: Create an inventory item.
 * x-authenticated: true
 * parameters:
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
 *         $ref: "#/components/schemas/AdminCreateInventoryItem"
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
 *       sdk.admin.inventoryItem.create({
 *         sku: "SHIRT"
 *       })
 *       .then(({ inventory_item }) => {
 *         console.log(inventory_item)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/inventory-items' \
 *       -H 'Authorization: Bearer {jwt_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "sku": "{value}",
 *         "hs_code": "{value}",
 *         "weight": 2857134683324416,
 *         "length": 2322256963305472,
 *         "height": 8391220613087232,
 *         "width": 1297863250280448,
 *         "origin_country": "{value}",
 *         "mid_code": "{value}",
 *         "material": "{value}",
 *         "title": "{value}",
 *         "description": "{value}",
 *         "thumbnail": "{value}",
 *         "metadata": {}
 *       }'
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
 * x-workflow: createInventoryItemsWorkflow
 * x-events:
 *   - name: inventory-item.created
 *     payload: |-
 *       ```ts
 *       {
 *         id, // The ID of the inventory item
 *       }
 *       ```
 *     description: Emitted when inventory items are created.
 *     deprecated: false
 *     since: 2.18.0
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
 * 
*/

