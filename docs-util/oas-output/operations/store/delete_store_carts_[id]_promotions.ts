/**
 * @oas [delete] /store/carts/{id}/promotions
 * operationId: DeleteCartsIdPromotions
 * summary: Remove Promotions from Cart
 * description: Remove a list of promotions from a cart. This doesn't delete the
 *   Promotion, only the association between the Promotion and the cart.
 * x-authenticated: false
 * parameters:
 *   - name: id
 *     in: path
 *     description: The cart's ID.
 *     required: true
 *     schema:
 *       type: string
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: curl -X DELETE '{backend_url}/store/carts/{id}/promotions'
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
 *           - promo_codes
 *         properties:
 *           promo_codes:
 *             type: array
 *             description: The cart's promo codes.
 *             items:
 *               type: string
 *               title: promo_codes
 *               description: The promo code's promo codes.
 * 
*/

