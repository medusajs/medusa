/**
 * @oas [post] /admin/order-edits/{id}/shipping-method/{action_id}
 * operationId: PostOrderEditsIdShippingMethodAction_id
 * summary: Add Shipping Methods to Order Edit
 * description: Add a list of shipping methods to a order edit.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The order edit's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: action_id
 *     in: path
 *     description: The order edit's action id.
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
 *         $ref: "#/components/schemas/AdminPostOrderEditsShippingActionReqSchema"
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/order-edits/{id}/shipping-method/{action_id}' \
 *       -H 'x-medusa-access-token: {api_token}'
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
 * x-workflow: updateOrderEditShippingMethodWorkflow
 * 
*/

