/**
 * @oas [post] /admin/orders/{id}/fulfillments/{fulfillment_id}/cancel
 * operationId: PostOrdersIdFulfillmentsFulfillment_idCancel
 * summary: Cancel Fulfillment
 * description: Cancel an order's fulfillment. The fulfillment can't be canceled if it's shipped.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The order's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: fulfillment_id
 *     in: path
 *     description: The order's fulfillment id.
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
 *         allOf:
 *           - type: object
 *             description: The cancelation details.
 *             properties:
 *               no_notification:
 *                 type: boolean
 *                 title: no_notification
 *                 description: Whether the customer should receive a notification about this change.
 *           - type: object
 *             description: The cancelation details.
 *             properties:
 *               additional_data:
 *                 type: object
 *                 description: Pass additional custom data to the API route. This data is passed to the underlying workflow under the `additional_data` parameter.
 *         description: The cancelation details.
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
 *       sdk.admin.order.cancelFulfillment(
 *         "order_123",
 *         "ful_123",
 *         {
 *           no_notification: false
 *         }
 *       )
 *       .then(({ order }) => {
 *         console.log(order)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/orders/{id}/fulfillments/{fulfillment_id}/cancel' \
 *       -H 'Authorization: Bearer {jwt_token}'
 * tags:
 *   - Orders
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
 * x-workflow: cancelOrderFulfillmentWorkflow
 * x-events:
 *   - name: order.fulfillment_canceled
 *     payload: |-
 *       ```ts
 *       {
 *         order_id, // The ID of the order
 *         fulfillment_id, // The ID of the fulfillment
 *         no_notification, // (boolean) Whether to notify the customer
 *       }
 *       ```
 *     description: Emitted when an order's fulfillment is canceled.
 *     deprecated: false
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
 *   - name: reservation-item.updated
 *     payload: |-
 *       ```ts
 *       {
 *         id, // The ID of the reservation
 *         order_id, // (optional) The ID of the order, if the reservation was updated by an order flow
 *       }
 *       ```
 *     description: Emitted when reservations are updated.
 *     deprecated: false
 *     since: 2.18.0
 * 
*/

