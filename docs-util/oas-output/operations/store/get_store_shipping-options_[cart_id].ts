/**
 * @oas [get] /store/shipping-options/{cart_id}
 * operationId: GetShippingOptionsCart_id
 * summary: Get a Shipping Option
 * description: Retrieve a shipping option by its ID. You can expand the shipping
 *   option's relations or select the fields that should be returned.
 * x-authenticated: false
 * parameters:
 *   - name: cart_id
 *     in: path
 *     description: The shipping option's cart id.
 *     required: true
 *     schema:
 *       type: string
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: curl '{backend_url}/store/shipping-options/{cart_id}'
 * tags:
 *   - Shipping Options
 * responses:
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
 * requestBody:
 *   content:
 *     application/json:
 *       schema: {}
 * 
*/

