/**
 * @oas [post] /admin/orders/{id}/fulfillments/{fulfillment_id}/mark-as-delivered
 * operationId: PostOrdersIdFulfillmentsFulfillment_idMarkAsDelivered
 * summary: Mark a Fulfillment as Delivered.
 * x-sidebar-summary: Mark Delivered
 * description: Mark an order's fulfillment as delivered.
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
 *     description: The fulfillment's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: fields
 *     in: query
 *     description: |-
 *       Comma-separated fields that should be included in the returned data.
 *       If a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default fields.
 *       Without prefix it will replace the entire default fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned data. if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *         fields. without prefix it will replace the entire default fields.
 *   - name: version
 *     in: query
 *     description: The order's version.
 *     required: false
 *     schema:
 *       type: number
 *       title: version
 *       description: The order's version.
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
 *       sdk.admin.order.markAsDelivered(
 *         "order_123",
 *         "ful_123",
 *       )
 *       .then(({ order }) => {
 *         console.log(order)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/orders/{id}/fulfillments/{fulfillment_id}/mark-as-delivered' \
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
 * x-workflow: markOrderFulfillmentAsDeliveredWorkflow
 * x-events:
 *   - name: delivery.created
 *     payload: |-
 *       ```ts
 *       {
 *         id, // the ID of the fulfillment
 *       }
 *       ```
 *     description: Emitted when a fulfillment is marked as delivered.
 *     deprecated: false
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminMarkOrderFulfillmentAsDelivered"
 * 
*/

