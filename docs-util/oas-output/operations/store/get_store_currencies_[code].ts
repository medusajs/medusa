/**
 * @oas [get] /store/currencies/{code}
 * operationId: GetCurrenciesCode
 * summary: Get a Currency
 * description: Retrieve a currency by its ID. You can expand the currency's
 *   relations or select the fields that should be returned.
 * x-authenticated: false
 * parameters:
 *   - name: code
 *     in: path
 *     description: The currency's code.
 *     required: true
 *     schema:
 *       type: string
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: curl '{backend_url}/store/currencies/{code}'
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

