/**
 * @oas [get] /admin/promotions/{id}/{rule_type}
 * operationId: GetPromotionsIdRule_type
 * summary: List Rules of a Promotion
 * x-sidebar-summary: List Rules
 * description: |
 *   Retrieve a list of rules in a promotion. The type of rules retrieved depend on the value of the `rule_type` path parameter:
 *   - If `rule_type` is `rules`, the promotion's rules are retrivied. - If `rule_type` is `target-rules`, the target rules of the promotion's application method are retrieved.
 * 
 *   - If `rule_type` is `buy-rules`, the buy rules of the promotion's application method are retrieved.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The promotion's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: rule_type
 *     in: path
 *     description: The type of rules to retrieve.
 *     required: true
 *     schema:
 *       type: string
 *       enum:
 *         - rules
 *         - target-rules
 *         - buy-rules
 *   - name: fields
 *     in: query
 *     description: Comma-separated fields that should be included in the returned data. if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *       fields. without prefix it will replace the entire default fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned data. if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *         fields. without prefix it will replace the entire default fields.
 *       externalDocs:
 *         url: "#select-fields-and-relations"
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/promotions/{id}/{rule_type}' \
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
 *           description: The list of promotion rules.
 *           required:
 *             - rules
 *           properties:
 *             rules:
 *               type: array
 *               description: The list of promotion rules.
 *               items:
 *                 $ref: "#/components/schemas/AdminPromotionRule"
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

