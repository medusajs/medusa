/**
 * @oas [post] /admin/orders/{id}/transfer
 * operationId: PostOrdersIdTransfer
 * x-sidebar-summary: Request Transfer
 * summary: Request Order Transfer
 * description: Request an order to be transfered to another customer. The transfer is confirmed by sending a request to the [Accept Order
 *   Transfer](https://docs.medusajs.com/api/store#orders_postordersidtransferaccept) Store API route.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The order's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: fields
 *     in: query
 *     description: |-
 *       Comma-separated fields that should be included in the returned data.
 *       if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default fields.
 *       without prefix it will replace the entire default fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned data. If a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *         fields. Without prefix it will replace the entire default fields.
 *       externalDocs:
 *         url: "#select-fields-and-relations"
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
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminRequestOrderTransfer"
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
 *       sdk.admin.order.requestTransfer("order_123", {
 *         customer_id: "cus_123",
 *         internal_note: "Internal note",
 *       })
 *       .then(({ order }) => {
 *         console.log(order)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/orders/{id}/transfer' \
 *       -H 'Authorization: Bearer {jwt_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "customer_id": "cus_123"
 *       }'
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
 * x-workflow: requestOrderTransferWorkflow
 * x-events:
 *   - name: order.transfer_requested
 *     payload: |-
 *       ```ts
 *       {
 *         id, // The ID of the order
 *         order_change_id, // The ID of the order change created for the transfer
 *       }
 *       ```
 *     description: |-
 *       Emitted when an order is requested to be transferred to
 *       another customer.
 *     deprecated: false
 * 
*/

