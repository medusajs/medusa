/**
 * @oas [post] /store/payment-collections/{id}/payment-sessions
 * operationId: PostPaymentCollectionsIdPaymentSessions
 * summary: Add Payment Sessions to Payment Collection
 * description: Add a list of payment sessions to a payment collection.
 * x-authenticated: false
 * parameters:
 *   - name: id
 *     in: path
 *     description: The payment collection's ID.
 *     required: true
 *     schema:
 *       type: string
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/StorePostPaymentCollectionsPaymentSessionReq"
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: >-
 *       curl -X POST
 *       '{backend_url}/store/payment-collections/{id}/payment-sessions' \
 * 
 *       -H 'Content-Type: application/json' \
 * 
 *       --data-raw '{
 *         "provider_id": "{value}"
 *       }'
 * tags:
 *   - Payment Collections
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

