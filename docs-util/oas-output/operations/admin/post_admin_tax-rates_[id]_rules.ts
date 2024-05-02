/**
 * @oas [post] /admin/tax-rates/{id}/rules
 * operationId: PostTaxRatesIdRules
 * summary: Add Rules to Tax Rate
 * description: Add a list of rules to a tax rate.
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
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: SUMMARY
 *         required:
 *           - reference
 *           - reference_id
 *         properties:
 *           reference:
 *             type: string
 *             title: reference
 *             description: The tax rate's reference.
 *           reference_id:
 *             type: string
 *             title: reference_id
 *             description: The tax rate's reference id.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/tax-rates/{id}/rules' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "reference": "{value}",
 *         "reference_id": "{value}"
 *       }'
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
 * 
*/

