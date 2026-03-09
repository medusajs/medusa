/**
 * @oas [post] /admin/order-edits/{id}/items/item/{item_id}
 * operationId: PostOrderEditsIdItemsItemItem_id
 * summary: Update Order Item Quantity of Order Edit
 * x-sidebar-summary: Update Item Quantity
 * description: |
 *   Update an existing order item's quantity of an order edit.
 *   You can also use this API route to remove an item from an order by setting its quantity to `0`.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The ID of the order that is being edited.
 *     required: true
 *     schema:
 *       type: string
 *   - name: item_id
 *     in: path
 *     description: The order edit's item id.
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
 *         $ref: "#/components/schemas/AdminPostOrderEditsUpdateItemQuantityReqSchema"
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
 *       sdk.admin.orderEdit.updateOriginalItem(
 *         "order_123",
 *         "orli_123",
 *         {
 *           quantity: 1
 *         }
 *       )
 *       .then(({ order_preview }) => {
 *         console.log(order_preview)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/order-edits/{id}/items/item/{item_id}' \
 *       -H 'Authorization: Bearer {jwt_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "quantity": 7564330046324736
 *       }'
 * tags:
 *   - Order Edits
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminOrderEditPreviewResponse"
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
 * x-workflow: orderEditUpdateItemQuantityWorkflow
 * x-events: []
 * 
*/

