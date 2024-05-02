/**
 * @oas [post] /store/carts/{id}/line-items/{line_id}
 * operationId: PostCartsIdLineItemsLine_id
 * summary: Add Line Items to Cart
 * description: Add a list of line items to a cart.
 * x-authenticated: false
 * parameters:
 *   - name: id
 *     in: path
 *     description: The cart's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: line_id
 *     in: path
 *     description: The cart's line id.
 *     required: true
 *     schema:
 *       type: string
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: curl -X POST '{backend_url}/store/carts/{id}/line-items/{line_id}'
 * tags:
 *   - Carts
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
 *       schema:
 *         type: object
 *         required:
 *           - quantity
 *           - metadata
 *         properties:
 *           quantity:
 *             type: number
 *             title: quantity
 *             description: The cart's quantity.
 *           metadata:
 *             type: object
 *             description: The cart's metadata.
 *             properties: {}
 * 
*/

