/**
 * @oas [post] /admin/pricing/rule-types
 * operationId: PostPricingRuleTypes
 * summary: Create Pricing
 * description: Create a pricing.
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
 *         type: object
 *         description: SUMMARY
 *         required:
 *           - name
 *           - rule_attribute
 *           - default_priority
 *         properties:
 *           name:
 *             type: string
 *             title: name
 *             description: The pricing's name.
 *           rule_attribute:
 *             type: string
 *             title: rule_attribute
 *             description: The pricing's rule attribute.
 *           default_priority:
 *             type: number
 *             title: default_priority
 *             description: The pricing's default priority.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/pricing/rule-types' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "name": "Thurman",
 *         "rule_attribute": "{value}",
 *         "default_priority": 4640267816665088
 *       }'
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

