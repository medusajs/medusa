/**
 * @oas [get] /admin/promotions/rule-value-options/{rule_type}/{rule_attribute_id}
 * operationId: GetPromotionsRuleValueOptionsRule_typeRule_attribute_id
 * summary: "List "
 * description: Retrieve a list of  in a promotion. The  can be filtered by fields
 *   like FILTER FIELDS. The  can also be paginated.
 * x-authenticated: true
 * parameters:
 *   - name: rule_type
 *     in: path
 *     description: The promotion's rule type.
 *     required: true
 *     schema:
 *       type: string
 *   - name: rule_attribute_id
 *     in: path
 *     description: The promotion's rule attribute id.
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
 *     source: >-
 *       curl
 *       '{backend_url}/admin/promotions/rule-value-options/{rule_type}/{rule_attribute_id}'
 *       \
 * 
 *       -H 'x-medusa-access-token: {api_token}'
 * tags:
 *   - Promotions
 * responses:
 *   "200":
 *     description: OK
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

