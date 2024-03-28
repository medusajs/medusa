/**
 * @oas [get] /store/currencies
 * operationId: GetCurrencies
 * summary: List Currencies
 * description: Retrieve a list of currencies. The currencies can be filtered by
 *   fields such as `id`. The currencies can also be sorted or paginated.
 * x-authenticated: false
 * parameters: []
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: curl '{backend_url}/store/currencies'
 * tags:
 *   - Currencies
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

