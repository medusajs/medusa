/**
 * @oas [post] /admin/draft-orders/{id}/convert-to-order
 * operationId: PostDraftOrdersIdConvertToOrder
 * summary: Convert a Draft Order to an Order
 * x-sidebar-summary: Convert to Order
 * description: Convert a draft order to an order. This will finalize the draft order and create a new order with the same details.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The draft order's ID.
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
 *       sdk.admin.draftOrder.convertToOrder("order_123")
 *       .then(({ order }) => {
 *         console.log(order)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/draft-orders/{id}/convert-to-order' \
 *       -H 'Authorization: Bearer {jwt_token}'
 * tags:
 *   - Draft Orders
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminOrderResponse"
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
 * x-workflow: convertDraftOrderWorkflow
 * x-events:
 *   - name: order.placed
 *     payload: |-
 *       ```ts
 *       {
 *         id, // The ID of the order
 *       }
 *       ```
 *     description: |-
 *       Emitted when an order is placed, or when a draft order is converted to an
 *       order.
 *     deprecated: false
 *   - name: reservation-item.created
 *     payload: |-
 *       ```ts
 *       {
 *         id, // The ID of the reservation
 *         order_id, // (optional) The ID of the order, if the reservation was created by an order flow
 *       }
 *       ```
 *     description: Emitted when reservations are created.
 *     deprecated: false
 *     since: 2.18.0
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminDraftOrderParams"
 * 
*/

