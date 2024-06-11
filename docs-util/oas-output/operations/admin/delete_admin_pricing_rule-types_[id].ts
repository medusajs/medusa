/**
 * @oas [delete] /admin/pricing/rule-types/{id}
 * operationId: DeletePricingRuleTypesId
 * summary: Remove Rule Types from Pricing
 * description: Remove a list of rule types from a pricing. This doesn't delete the
 *   Rule Type, only the association between the Rule Type and the pricing.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The pricing's ID.
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
 *         description: SUMMARY
 *         properties: {}
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X DELETE '{backend_url}/admin/pricing/rule-types/{id}' \
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

