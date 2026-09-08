/**
 * @oas [post] /admin/returns/{id}/receive/confirm
 * operationId: PostReturnsIdReceiveConfirm
 * summary: Confirm Return Receival
 * description: |
 *   Confirm that a return has been received. This updates the quantity of the items received, if not damaged, and  reflects the changes on the order.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The return's ID.
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
 *         $ref: "#/components/schemas/AdminConfirmReceiveReturn"
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
 *       sdk.admin.return.confirmReceive("return_123", {
 *         no_notification: true,
 *       })
 *       .then(({ return }) => {
 *         console.log(return)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/returns/{id}/receive/confirm' \
 *       -H 'Authorization: Bearer {jwt_token}'
 * tags:
 *   - Returns
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminReturnPreviewResponse"
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
 * x-workflow: confirmReturnReceiveWorkflow
 * x-events:
 *   - name: order.return_received
 *     payload: |-
 *       ```ts
 *       {
 *         order_id, // The ID of the order
 *         return_id, // The ID of the return
 *       }
 *       ```
 *     description: Emitted when a return is marked as received.
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
 * 
*/

