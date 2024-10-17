/**
 * @oas [post] /admin/payments/{id}/refund
 * operationId: PostPaymentsIdRefund
 * summary: Refund Payment
 * description: Refund an amount of a payment. This uses the `refundPayment` method of the payment provider associated with the payment's collection.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The payment's ID.
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
 *         type: object
 *         description: The refund's details.
 *         properties:
 *           amount:
 *             type: number
 *             title: amount
 *             description: The amount to refund.
 *           refund_reason_id:
 *             type: string
 *             title: refund_reason_id
 *             description: The ID of a refund reason.
 *           note:
 *             type: string
 *             title: note
 *             description: A note to attach to the refund.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/payments/{id}/refund' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Payments
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminPaymentResponse"
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
 * x-workflow: refundPaymentWorkflow
 * 
*/

