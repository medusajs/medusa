/**
 * @oas [post] /hooks/payment/{provider}
 * operationId: PostPaymentProvider
 * summary: Update a Payment
 * description: Update a payment's details.
 * x-authenticated: false
 * parameters:
 *   - name: provider
 *     in: path
 *     description: The payment's provider.
 *     required: true
 *     schema:
 *       type: string
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: curl -X POST '{backend_url}/hooks/payment/{provider}'
 * tags:
 *   - Payment
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

