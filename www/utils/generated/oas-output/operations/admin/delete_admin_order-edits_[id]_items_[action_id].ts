/**
 * @oas [delete] /admin/order-edits/{id}/items/{action_id}
 * operationId: DeleteOrderEditsIdItemsAction_id
 * summary: Remove Item from Order Edit
 * x-sidebar-summary: Remove Item
 * description: |
 *   Remove an added item in the order edit by the ID of the item's `ITEM_ADD` action.
 * 
 *   Every item has an `actions` property, whose value is an array of actions. You can check the action's name using its `action` property, and use the value of the `id` property.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The ID of the order that is being edited.
 *     required: true
 *     schema:
 *       type: string
 *   - name: action_id
 *     in: path
 *     description: The ID of the new item's `ITEM_ADD` action.
 *     required: true
 *     schema:
 *       type: string
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
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
 *       sdk.admin.orderEdit.removeAddedItem(
 *         "order_123",
 *         "orli_123",
 *       )
 *       .then(({ order_preview }) => {
 *         console.log(order_preview)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X DELETE '{backend_url}/admin/order-edits/{id}/items/{action_id}' \
 *       -H 'Authorization: Bearer {jwt_token}'
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
 * x-workflow: removeItemOrderEditActionWorkflow
 * x-events: []
 * 
*/

