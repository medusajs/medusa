/**
 * @oas [post] /admin/shipping-options/{id}
 * operationId: PostShippingOptionsId
 * summary: Update a Shipping Option
 * description: Update a shipping option's details.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The shipping option's ID.
 *     required: true
 *     schema:
 *       type: string
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
 *         type: object
 *         description: The properties to update in the shipping option.
 *         properties:
 *           name:
 *             type: string
 *             title: name
 *             description: The shipping option's name.
 *           data:
 *             type: object
 *             description: The shipping option's data that is useful for third-party providers.
 *             externalDocs:
 *               url: https://docs.medusajs.com/v2/resources/commerce-modules/fulfillment/shipping-option#data-property
 *           price_type:
 *             type: string
 *             description: >
 *               The type of the shipping option's price. If `calculated`, its price is retrieved by the  associated fulfillment provider during checkout. If `flat`, its price is set in the `prices`
 *               property.
 *             enum:
 *               - calculated
 *               - flat
 *           provider_id:
 *             type: string
 *             title: provider_id
 *             description: The ID of the associated fulfillment provider that is used to process the option.
 *           shipping_profile_id:
 *             type: string
 *             title: shipping_profile_id
 *             description: The ID of the shipping profile this shipping option belongs to.
 *           type:
 *             type: object
 *             description: The shipping option's type.
 *             required:
 *               - code
 *               - description
 *               - label
 *             properties:
 *               label:
 *                 type: string
 *                 title: label
 *                 description: The type's label.
 *               description:
 *                 type: string
 *                 title: description
 *                 description: The type's description.
 *               code:
 *                 type: string
 *                 title: code
 *                 description: The type's code.
 *           prices:
 *             type: array
 *             description: The shipping option's prices. If the `price_type` is `calculated`, pass an empty array.
 *             items:
 *               oneOf:
 *                 - type: object
 *                   description: The shipping option's price for a currency code.
 *                   properties:
 *                     id:
 *                       type: string
 *                       title: id
 *                       description: The ID of an existing price.
 *                     currency_code:
 *                       type: string
 *                       title: currency_code
 *                       description: The price's currency code.
 *                     amount:
 *                       type: number
 *                       title: amount
 *                       description: The price's amount.
 *                 - type: object
 *                   description: The shipping option's price for a region.
 *                   properties:
 *                     id:
 *                       type: string
 *                       title: id
 *                       description: The ID of an existing price.
 *                     region_id:
 *                       type: string
 *                       title: region_id
 *                       description: The ID of the associated region.
 *                     amount:
 *                       type: number
 *                       title: amount
 *                       description: The price's amount.
 *           rules:
 *             type: array
 *             description: The shipping option's rules.
 *             items:
 *               oneOf:
 *                 - type: object
 *                   description: The details of a new shipping option rule.
 *                   required:
 *                     - operator
 *                     - attribute
 *                     - value
 *                   properties:
 *                     operator:
 *                       type: string
 *                       description: The operator used to check whether a rule applies.
 *                       enum:
 *                         - in
 *                         - eq
 *                         - ne
 *                         - gt
 *                         - gte
 *                         - lt
 *                         - lte
 *                         - nin
 *                     attribute:
 *                       type: string
 *                       title: attribute
 *                       description: The name of a property or table that the rule applies to.
 *                       example: customer_group
 *                     value:
 *                       oneOf:
 *                         - type: string
 *                           title: value
 *                           description: A value of the attribute that enables this rule.
 *                           example: cusgroup_123
 *                         - type: array
 *                           description: Values of the attribute that enable this rule.
 *                           items:
 *                             type: string
 *                             title: value
 *                             description: A value of the attribute that enables this rule.
 *                             example: cusgroup_123
 *                 - type: object
 *                   description: Update the properties of an existing rule.
 *                   required:
 *                     - id
 *                     - operator
 *                     - attribute
 *                     - value
 *                   properties:
 *                     id:
 *                       type: string
 *                       title: id
 *                       description: The rule's ID.
 *                     operator:
 *                       type: string
 *                       description: The operator used to check whether a rule applies.
 *                       enum:
 *                         - in
 *                         - eq
 *                         - ne
 *                         - gt
 *                         - gte
 *                         - lt
 *                         - lte
 *                         - nin
 *                     attribute:
 *                       type: string
 *                       title: attribute
 *                       description: The name of a property or table that the rule applies to.
 *                       example: customer_group
 *                     value:
 *                       oneOf:
 *                         - type: string
 *                           title: value
 *                           description: A value of the attribute that enables this rule.
 *                           example: cusgroup_123
 *                         - type: array
 *                           description: Values of the attribute that enable this rule.
 *                           items:
 *                             type: string
 *                             title: value
 *                             description: A value of the attribute that enables this rule.
 *                             example: cusgroup_123
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/shipping-options/{id}' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Shipping Options
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminShippingOptionResponse"
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
 * x-workflow: updateShippingOptionsWorkflow
 * 
*/

