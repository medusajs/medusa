/**
 * @oas [post] /admin/promotions
 * operationId: PostPromotions
 * summary: Create Promotion
 * description: Create a promotion.
 * x-authenticated: true
 * parameters:
 *   - name: expand
 *     in: query
 *     description: Comma-separated relations that should be expanded in the returned data.
 *     required: false
 *     schema:
 *       type: string
 *       title: expand
 *       description: Comma-separated relations that should be expanded in the returned data.
 *   - name: fields
 *     in: query
 *     description: >-
 *       Comma-separated fields that should be included in the returned data.
 *        * if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default fields.
 *        * without prefix it will replace the entire default fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: >-
 *         Comma-separated fields that should be included in the returned data.
 *          * if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default fields.
 *          * without prefix it will replace the entire default fields.
 *   - name: offset
 *     in: query
 *     description: The number of items to skip when retrieving a list.
 *     required: false
 *     schema:
 *       type: number
 *       title: offset
 *       description: The number of items to skip when retrieving a list.
 *   - name: limit
 *     in: query
 *     description: Limit the number of items returned in the list.
 *     required: false
 *     schema:
 *       type: number
 *       title: limit
 *       description: Limit the number of items returned in the list.
 *   - name: order
 *     in: query
 *     description: The field to sort the data by. By default, the sort order is
 *       ascending. To change the order to descending, prefix the field name with
 *       `-`.
 *     required: false
 *     schema:
 *       type: string
 *       title: order
 *       description: The field to sort the data by. By default, the sort order is
 *         ascending. To change the order to descending, prefix the field name with
 *         `-`.
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
 *           - code
 *           - type
 *           - campaign_id
 *           - application_method
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
 *             type: string
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
 *               - starts_at
 *               - ends_at
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
 *               budget:
 *                 type: object
 *                 description: The campaign's budget.
 *                 required:
 *                   - type
 *                   - currency_code
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum:
 *                       - spend
 *                       - usage
 *                   limit:
 *                     type: number
 *                     title: limit
 *                     description: The budget's limit.
 *                   currency_code:
 *                     type: string
 *                     title: currency_code
 *                     description: The budget's currency code.
 *               starts_at:
 *                 type: string
 *                 title: starts_at
 *                 description: The campaign's starts at.
 *                 format: date-time
 *               ends_at:
 *                 type: string
 *                 title: ends_at
 *                 description: The campaign's ends at.
 *                 format: date-time
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
 *             required:
 *               - description
 *               - value
 *               - currency_code
 *               - max_quantity
 *               - type
 *               - target_type
 *               - apply_to_quantity
 *               - buy_rules_min_quantity
 *             properties:
 *               description:
 *                 type: string
 *                 title: description
 *                 description: The application method's description.
 *               value:
 *                 type: number
 *                 title: value
 *                 description: The application method's value.
 *               currency_code:
 *                 type: string
 *                 title: currency_code
 *                 description: The application method's currency code.
 *               max_quantity:
 *                 type: number
 *                 title: max_quantity
 *                 description: The application method's max quantity.
 *               type:
 *                 type: string
 *                 enum:
 *                   - fixed
 *                   - percentage
 *               target_type:
 *                 type: string
 *                 enum:
 *                   - order
 *                   - shipping_methods
 *                   - items
 *               allocation:
 *                 type: string
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
 *                       type: string
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
 *                       oneOf:
 *                         - type: string
 *                           title: values
 *                           description: The target rule's values.
 *                         - type: array
 *                           description: The target rule's values.
 *                           items:
 *                             type: string
 *                             title: values
 *                             description: The value's values.
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
 *                       type: string
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
 *                       oneOf:
 *                         - type: string
 *                           title: values
 *                           description: The buy rule's values.
 *                         - type: array
 *                           description: The buy rule's values.
 *                           items:
 *                             type: string
 *                             title: values
 *                             description: The value's values.
 *               apply_to_quantity:
 *                 type: number
 *                 title: apply_to_quantity
 *                 description: The application method's apply to quantity.
 *               buy_rules_min_quantity:
 *                 type: number
 *                 title: buy_rules_min_quantity
 *                 description: The application method's buy rules min quantity.
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
 *                   type: string
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
 *                   oneOf:
 *                     - type: string
 *                       title: values
 *                       description: The rule's values.
 *                     - type: array
 *                       description: The rule's values.
 *                       items:
 *                         type: string
 *                         title: values
 *                         description: The value's values.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/promotions' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "code": "{value}",
 *         "type": "{value}",
 *         "campaign_id": "{value}",
 *         "application_method": {
 *           "description": "{value}",
 *           "value": 1841223411171328,
 *           "currency_code": "{value}",
 *           "max_quantity": 2960098049654784,
 *           "type": "{value}",
 *           "target_type": "{value}",
 *           "allocation": "{value}",
 *           "target_rules": [],
 *           "buy_rules": [],
 *           "apply_to_quantity": 708643867590656,
 *           "buy_rules_min_quantity": 3167972149428224
 *         }
 *       }'
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

