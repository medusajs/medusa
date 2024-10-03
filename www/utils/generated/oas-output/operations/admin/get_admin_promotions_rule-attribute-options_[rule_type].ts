/**
 * @oas [get] /admin/promotions/rule-attribute-options/{rule_type}
 * operationId: GetPromotionsRuleAttributeOptionsRule_type
 * summary: List Rule Attribute Options of a Rule Type
 * x-sidebar-summary: List Potential Rule Attributes
 * description: |
 *   Retrieve a list of potential rule attributes for the promotion and application method types specified in the query parameters.
 *   Only the attributes of the rule type specified in the path parameter are retrieved:
 *   - If `rule_type` is `rules`, the attributes of the promotion's type are retrieved.
 * 
 *   - If `rule_type` is `target-rules`, the target rules' attributes of the application method's type are retrieved.
 * 
 *   - If `rule_type` is `buy-rules`, the buy rules' attributes of the application method's type are retrieved.
 * x-authenticated: true
 * parameters:
 *   - name: rule_type
 *     in: path
 *     description: The rule type.
 *     required: true
 *     schema:
 *       type: string
 *       enum:
 *         - rules
 *         - target-rules
 *         - buy-rules
 *   - name: promotion_type
 *     in: query
 *     description: The promotion type to retrieve rules for.
 *     required: false
 *     schema:
 *       type: string
 *       title: promotion_type
 *       description: The promotion type to retrieve rules for.
 *       enum:
 *         - standard
 *         - buyget
 *   - name: application_method_type
 *     in: query
 *     description: The application method type to retrieve rules for.
 *     required: false
 *     schema:
 *       type: string
 *       title: application_method_type
 *       description: The application method type to retrieve rules for.
 *       enum:
 *         - fixed
 *         - percentage
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/promotions/rule-attribute-options/{rule_type}' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Promotions
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           description: The list of attributes.
 *           required:
 *             - attributes
 *           properties:
 *             attributes:
 *               type: array
 *               description: The list of attributes.
 *               items:
 *                 $ref: "#/components/schemas/AdminRuleAttributeOption"
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

