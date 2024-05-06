/**
 * @oas [post] /store/carts/{id}/shipping-methods
 * operationId: PostCartsIdShippingMethods
 * summary: Add Shipping Methods to Cart
 * description: Add a list of shipping methods to a cart.
 * x-authenticated: false
 * parameters:
 *   - name: id
 *     in: path
 *     description: The cart's ID.
 *     required: true
 *     schema:
 *       type: string
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: SUMMARY
 *         required:
 *           - option_id
 *           - data
 *         properties:
 *           option_id:
 *             type: string
 *             title: option_id
 *             description: The cart's option id.
 *           data:
 *             type: object
 *             description: The cart's data.
 *             properties: {}
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/store/carts/{id}/shipping-methods' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "option_id": "{value}",
 *         "data": {}
 *       }'
 * tags:
 *   - Carts
 * responses:
 *   "200":
 *     description: OK
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
 * 
*/

