/**
 * @oas [post] /admin/promotions
 * operationId: PostPromotions
 * summary: Create Promotion
 * description: Create a promotion.
 * x-authenticated: true
 * parameters:
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
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         allOf:
 *           - type: object
 *             description: The promotion's details.
 *             required:
 *               - code
 *               - type
 *               - campaign_id
 *               - application_method
 *             properties:
 *               code:
 *                 type: string
 *                 title: code
 *                 description: The promotion's code.
 *               is_automatic:
 *                 type: boolean
 *                 title: is_automatic
 *                 description: Whether the promotion is applied automatically.
 *               type:
 *                 type: string
 *                 description: The promotion's type.
 *                 externalDocs:
 *                   url: https://docs.medusajs.com/v2/resources/commerce-modules/promotion/concepts#what-is-a-promotion
 *                 enum:
 *                   - standard
 *                   - buyget
 *               campaign_id:
 *                 type: string
 *                 title: campaign_id
 *                 description: The ID of the campaign that the promotion belongs to.
 *               campaign:
 *                 type: object
 *                 description: The details of a campaign to create and add the promotion to it.
 *                 required:
 *                   - name
 *                   - campaign_identifier
 *                   - description
 *                   - budget
 *                   - starts_at
 *                   - ends_at
 *                 properties:
 *                   name:
 *                     type: string
 *                     title: name
 *                     description: The campaign's name.
 *                   campaign_identifier:
 *                     type: string
 *                     title: campaign_identifier
 *                     description: The campaign's identifier.
 *                   description:
 *                     type: string
 *                     title: description
 *                     description: The campaign's description.
 *                   budget:
 *                     type: object
 *                     description: The campaign's budget which, when crossed, ends the campaign.
 *                     required:
 *                       - type
 *                       - limit
 *                       - currency_code
 *                     properties:
 *                       type:
 *                         type: string
 *                         description: >
 *                           The budget's type. This can't be edited later. Use `spend` to set a limit on the total amount discounted by the campaign's promotions. Use `usage` to set a limit on the total
 *                           number of times the campaign's promotions can be used.
 *                         enum:
 *                           - spend
 *                           - usage
 *                       limit:
 *                         type: number
 *                         title: limit
 *                         description: The budget's limit.
 *                       currency_code:
 *                         type: string
 *                         title: currency_code
 *                         description: The campaign budget's currency code. This can't be edited later.
 *                   starts_at:
 *                     type: string
 *                     title: starts_at
 *                     description: The campaign's start date.
 *                     format: date-time
 *                   ends_at:
 *                     type: string
 *                     title: ends_at
 *                     description: The campaign's end date.
 *                     format: date-time
 *               application_method:
 *                 type: object
 *                 description: The promotion's application method.
 *                 required:
 *                   - description
 *                   - value
 *                   - currency_code
 *                   - max_quantity
 *                   - type
 *                   - target_type
 *                   - apply_to_quantity
 *                   - buy_rules_min_quantity
 *                 properties:
 *                   description:
 *                     type: string
 *                     title: description
 *                     description: The application method's description.
 *                   value:
 *                     type: number
 *                     title: value
 *                     description: The discounted amount applied by the associated promotion based on the `type`.
 *                   currency_code:
 *                     type: string
 *                     title: currency_code
 *                     description: The application method's currency code.
 *                   max_quantity:
 *                     type: number
 *                     title: max_quantity
 *                     description: The max quantity allowed in the cart for the associated promotion to be applied.
 *                   type:
 *                     type: string
 *                     description: The type of the application method indicating how the associated promotion is applied.
 *                     enum:
 *                       - fixed
 *                       - percentage
 *                   target_type:
 *                     type: string
 *                     description: The target type of the application method indicating whether the associated promotion is applied to the cart's items, shipping methods, or the whole order.
 *                     enum:
 *                       - order
 *                       - shipping_methods
 *                       - items
 *                   allocation:
 *                     type: string
 *                     description: The allocation value that indicates whether the associated promotion is applied on each item in a cart or split between the items in the cart.
 *                     enum:
 *                       - each
 *                       - across
 *                   target_rules:
 *                     type: array
 *                     description: The application method's target rules.
 *                     items:
 *                       type: object
 *                       description: A target rule's details.
 *                       required:
 *                         - operator
 *                         - description
 *                         - attribute
 *                         - values
 *                       properties:
 *                         operator:
 *                           type: string
 *                           description: The operator used to check whether the target rule applies on a cart. For example, `eq` means that the cart's value for the specified attribute must match the specified value.
 *                           enum:
 *                             - gte
 *                             - lte
 *                             - gt
 *                             - lt
 *                             - eq
 *                             - ne
 *                             - in
 *                         description:
 *                           type: string
 *                           title: description
 *                           description: The target rule's description.
 *                         attribute:
 *                           type: string
 *                           title: attribute
 *                           description: The attribute to compare against when checking whether a promotion can be applied on a cart.
 *                           example: items.product.id
 *                         values:
 *                           oneOf:
 *                             - type: string
 *                               title: values
 *                               description: The attribute's value.
 *                               example: prod_123
 *                             - type: array
 *                               description: The allowed attribute values.
 *                               items:
 *                                 type: string
 *                                 title: values
 *                                 description: An attribute value.
 *                                 example: prod_123
 *                   buy_rules:
 *                     type: array
 *                     description: The application method's buy rules.
 *                     items:
 *                       type: object
 *                       description: A buy rule's details.
 *                       required:
 *                         - operator
 *                         - description
 *                         - attribute
 *                         - values
 *                       properties:
 *                         operator:
 *                           type: string
 *                           description: The operator used to check whether the buy rule applies on a cart. For example, `eq` means that the cart's value for the specified attribute must match the specified value.
 *                           enum:
 *                             - gte
 *                             - lte
 *                             - gt
 *                             - lt
 *                             - eq
 *                             - ne
 *                             - in
 *                         description:
 *                           type: string
 *                           title: description
 *                           description: The buy rule's description.
 *                         attribute:
 *                           type: string
 *                           title: attribute
 *                           description: The attribute to compare against when checking whether a promotion can be applied on a cart.
 *                           example: items.product.id
 *                         values:
 *                           oneOf:
 *                             - type: string
 *                               title: values
 *                               description: The attribute's value.
 *                               example: prod_123
 *                             - type: array
 *                               description: The allowed attribute values.
 *                               items:
 *                                 type: string
 *                                 title: values
 *                                 description: An attribute value.
 *                                 example: prod_123
 *                   apply_to_quantity:
 *                     type: number
 *                     title: apply_to_quantity
 *                     description: The quantity that results from matching the `buyget` promotion's condition. For example, if the promotion is a "Buy 2 shirts get 1 free", the value f this attribute is `1`.
 *                   buy_rules_min_quantity:
 *                     type: number
 *                     title: buy_rules_min_quantity
 *                     description: The minimum quantity required for a `buyget` promotion to be applied. For example, if the promotion is a "Buy 2 shirts get 1 free", the value of this attribute is `2`.
 *               rules:
 *                 type: array
 *                 description: The promotion's rules.
 *                 items:
 *                   type: object
 *                   description: A rule's details.
 *                   required:
 *                     - operator
 *                     - description
 *                     - attribute
 *                     - values
 *                   properties:
 *                     operator:
 *                       type: string
 *                       description: The operator used to check whether the buy rule applies on a cart. For example, `eq` means that the cart's value for the specified attribute must match the specified value.
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
 *                       description: The rule's description.
 *                     attribute:
 *                       type: string
 *                       title: attribute
 *                       description: The attribute to compare against when checking whether a promotion can be applied on a cart.
 *                       example: items.product.id
 *                     values:
 *                       oneOf:
 *                         - type: string
 *                           title: values
 *                           description: The attribute's value.
 *                           example: prod_123
 *                         - type: array
 *                           description: The allowed attribute values.
 *                           items:
 *                             type: string
 *                             title: values
 *                             description: An attribute value.
 *                             example: prod_123
 *           - type: object
 *             description: The promotion's details.
 *             properties:
 *               additional_data:
 *                 type: object
 *                 description: Pass additional custom data to the API route. This data is passed to the underlying workflow under the `additional_data` parameter.
 *         description: The promotion's details.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/promotions' \
 *       -H 'Authorization: Bearer {access_token}' \
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
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminPromotionResponse"
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
 * x-workflow: createPromotionsWorkflow
 * 
*/

