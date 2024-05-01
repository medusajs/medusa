/**
 * @oas [post] /admin/promotions/{id}
 * operationId: PostPromotionsId
 * summary: Update a Promotion
 * description: Update a promotion's details.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The promotion's ID.
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
 *         properties:
 *           code:
 *             type: string
 *             title: code
 *             description: The promotion's code.
 *           is_automatic:
 *             type: boolean
 *             title: is_automatic
 *             description: The promotion's is automatic.
 *           type:
 *             enum:
 *               - standard
 *               - buyget
 *           campaign_id:
 *             type: string
 *             title: campaign_id
 *             description: The promotion's campaign id.
 *           campaign:
 *             type: object
 *             description: The promotion's campaign.
 *             required:
 *               - name
 *               - campaign_identifier
 *               - description
 *               - currency
 *               - budget
 *               - starts_at
 *               - ends_at
 *               - promotions
 *             properties:
 *               name:
 *                 type: string
 *                 title: name
 *                 description: The campaign's name.
 *               campaign_identifier:
 *                 type: string
 *                 title: campaign_identifier
 *                 description: The campaign's campaign identifier.
 *               description:
 *                 type: string
 *                 title: description
 *                 description: The campaign's description.
 *               currency:
 *                 type: string
 *                 title: currency
 *                 description: The campaign's currency.
 *               budget:
 *                 type: object
 *                 description: The campaign's budget.
 *                 properties:
 *                   type:
 *                     enum:
 *                       - spend
 *                       - usage
 *                   limit:
 *                     type: number
 *                     title: limit
 *                     description: The budget's limit.
 *                 required:
 *                   - type
 *                   - limit
 *               starts_at:
 *                 type: string
 *                 title: starts_at
 *                 description: The campaign's starts at.
 *               ends_at:
 *                 type: string
 *                 title: ends_at
 *                 description: The campaign's ends at.
 *               promotions:
 *                 type: array
 *                 description: The campaign's promotions.
 *                 items:
 *                   type: object
 *                   description: The promotion's promotions.
 *                   required:
 *                     - id
 *                   properties:
 *                     id:
 *                       type: string
 *                       title: id
 *                       description: The promotion's ID.
 *           application_method:
 *             type: object
 *             description: The promotion's application method.
 *             properties:
 *               description:
 *                 type: string
 *                 title: description
 *                 description: The application method's description.
 *               value:
 *                 type: string
 *                 title: value
 *                 description: The application method's value.
 *               max_quantity:
 *                 type: number
 *                 title: max_quantity
 *                 description: The application method's max quantity.
 *               type:
 *                 enum:
 *                   - fixed
 *                   - percentage
 *               target_type:
 *                 enum:
 *                   - order
 *                   - shipping_methods
 *                   - items
 *               allocation:
 *                 enum:
 *                   - each
 *                   - across
 *               target_rules:
 *                 type: array
 *                 description: The application method's target rules.
 *                 items:
 *                   type: object
 *                   description: The target rule's target rules.
 *                   required:
 *                     - operator
 *                     - description
 *                     - attribute
 *                     - values
 *                   properties:
 *                     operator:
 *                       enum:
 *                         - gte
 *                         - lte
 *                         - gt
 *                         - lt
 *                         - eq
 *                         - ne
 *                         - in
 *                     description:
 *                       type: string
 *                       title: description
 *                       description: The target rule's description.
 *                     attribute:
 *                       type: string
 *                       title: attribute
 *                       description: The target rule's attribute.
 *                     values:
 *                       type: array
 *                       description: The target rule's values.
 *                       items:
 *                         type: string
 *                         title: values
 *                         description: The value's values.
 *               buy_rules:
 *                 type: array
 *                 description: The application method's buy rules.
 *                 items:
 *                   type: object
 *                   description: The buy rule's buy rules.
 *                   required:
 *                     - operator
 *                     - description
 *                     - attribute
 *                     - values
 *                   properties:
 *                     operator:
 *                       enum:
 *                         - gte
 *                         - lte
 *                         - gt
 *                         - lt
 *                         - eq
 *                         - ne
 *                         - in
 *                     description:
 *                       type: string
 *                       title: description
 *                       description: The buy rule's description.
 *                     attribute:
 *                       type: string
 *                       title: attribute
 *                       description: The buy rule's attribute.
 *                     values:
 *                       type: array
 *                       description: The buy rule's values.
 *                       items:
 *                         type: string
 *                         title: values
 *                         description: The value's values.
 *               apply_to_quantity:
 *                 type: number
 *                 title: apply_to_quantity
 *                 description: The application method's apply to quantity.
 *               buy_rules_min_quantity:
 *                 type: number
 *                 title: buy_rules_min_quantity
 *                 description: The application method's buy rules min quantity.
 *             required:
 *               - description
 *               - value
 *               - max_quantity
 *               - type
 *               - target_type
 *               - allocation
 *               - target_rules
 *               - buy_rules
 *               - apply_to_quantity
 *               - buy_rules_min_quantity
 *           rules:
 *             type: array
 *             description: The promotion's rules.
 *             items:
 *               type: object
 *               description: The rule's rules.
 *               required:
 *                 - operator
 *                 - description
 *                 - attribute
 *                 - values
 *               properties:
 *                 operator:
 *                   enum:
 *                     - gte
 *                     - lte
 *                     - gt
 *                     - lt
 *                     - eq
 *                     - ne
 *                     - in
 *                 description:
 *                   type: string
 *                   title: description
 *                   description: The rule's description.
 *                 attribute:
 *                   type: string
 *                   title: attribute
 *                   description: The rule's attribute.
 *                 values:
 *                   type: array
 *                   description: The rule's values.
 *                   items:
 *                     type: string
 *                     title: values
 *                     description: The value's values.
 *         required:
 *           - code
 *           - is_automatic
 *           - type
 *           - campaign_id
 *           - campaign
 *           - application_method
 *           - rules
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/promotions/{id}' \
 *       -H 'x-medusa-access-token: {api_token}'
 * tags:
 *   - Promotions
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

