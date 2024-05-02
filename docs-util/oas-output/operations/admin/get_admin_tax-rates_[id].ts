/**
 * @oas [get] /admin/tax-rates/{id}
 * operationId: GetTaxRatesId
 * summary: Get a Tax Rate
 * description: Retrieve a tax rate by its ID. You can expand the tax rate's
 *   relations or select the fields that should be returned.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The tax rate's ID.
 *     required: true
 *     schema:
 *       type: string
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/tax-rates/{id}' \
 *       -H 'x-medusa-access-token: {api_token}'
 * tags:
 *   - Tax Rates
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
 *           - fields
 *         properties:
 *           fields:
 *             type: string
 *             title: fields
 *             description: The tax rate's fields.
 * 
*/

