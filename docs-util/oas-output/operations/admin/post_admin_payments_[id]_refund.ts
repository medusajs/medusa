/**
 * @oas [post] /admin/payments/{id}/refund
 * operationId: PostPaymentsIdRefund
 * summary: Add Refunds to Payment
 * description: Add a list of refunds to a payment.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The payment's ID.
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
 *         type: object
 *         description: SUMMARY
 *         properties:
 *           amount:
 *             type: number
 *             title: amount
 *             description: The payment's amount.
 *         required:
 *           - amount
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/payments/{id}/refund' \
 *       -H 'x-medusa-access-token: {api_token}'
 * tags:
 *   - Payments
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
 * 
*/

