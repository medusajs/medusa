/**
 * @oas [get] /admin/pricing/rule-types
 * operationId: GetPricingRuleTypes
 * summary: List Pricing
 * description: Retrieve a list of pricing. The pricing can be filtered by fields
 *   such as `id`. The pricing can also be sorted or paginated.
 * x-authenticated: true
 * parameters: []
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminGetPricingRuleTypesParams"
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/pricing/rule-types' \
 *       -H 'x-medusa-access-token: {api_token}'
 * tags:
 *   - Pricing
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

