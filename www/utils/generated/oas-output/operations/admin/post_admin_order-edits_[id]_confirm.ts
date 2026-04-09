/**
 * @oas [post] /admin/order-edits/{id}/confirm
 * operationId: PostOrderEditsIdConfirm
 * summary: Confirm Order Edit
 * description: Confirm an order edit request and apply the changes on the order.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The ID of the order that is being edited.
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
 *       sdk.admin.orderEdit.confirm("order_123")
 *       .then(({ order_preview }) => {
 *         console.log(order_preview)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/order-edits/{id}/confirm' \
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
 * x-workflow: confirmOrderEditRequestWorkflow
 * x-events:
 *   - name: order-edit.confirmed
 *     payload: |-
 *       ```ts
 *       {
 *         order_id, // The ID of the order
 *         actions, // (array) The [actions](https://docs.medusajs.com/resources/references/fulfillment/interfaces/fulfillment.OrderChangeActionDTO) to edit the order
 *       }
 *       ```
 *     description: Emitted when an order edit request is confirmed.
 *     deprecated: false
 *     since: 2.8.0
 * 
*/

