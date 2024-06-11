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
 *           - data
 *           - price_type
 *           - provider_id
 *           - type
 *           - prices
 *           - rules
 *         properties:
 *           name:
 *             type: string
 *             title: name
 *             description: The shipping option's name.
 *           data:
 *             type: object
 *             description: The shipping option's data.
 *             properties: {}
 *           price_type: {}
 *           provider_id:
 *             type: string
 *             title: provider_id
 *             description: The shipping option's provider id.
 *           type:
 *             type: object
 *             description: The shipping option's type.
 *             required:
 *               - label
 *               - description
 *               - code
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
 *             description: The shipping option's prices.
 *             items:
 *               oneOf:
 *                 - type: object
 *                   description: The price's prices.
 *                   required:
 *                     - id
 *                     - currency_code
 *                     - amount
 *                   properties:
 *                     id:
 *                       type: string
 *                       title: id
 *                       description: The price's ID.
 *                     currency_code:
 *                       type: string
 *                       title: currency_code
 *                       description: The price's currency code.
 *                     amount:
 *                       type: number
 *                       title: amount
 *                       description: The price's amount.
 *                 - type: object
 *                   description: The price's prices.
 *                   required:
 *                     - id
 *                     - region_id
 *                     - amount
 *                   properties:
 *                     id:
 *                       type: string
 *                       title: id
 *                       description: The price's ID.
 *                     region_id:
 *                       type: string
 *                       title: region_id
 *                       description: The price's region id.
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
 *                   description: The rule's rules.
 *                   required:
 *                     - operator
 *                     - attribute
 *                     - value
 *                   properties:
 *                     operator: {}
 *                     attribute:
 *                       type: string
 *                       title: attribute
 *                       description: The rule's attribute.
 *                     value:
 *                       oneOf:
 *                         - type: string
 *                           title: value
 *                           description: The rule's value.
 *                         - type: array
 *                           description: The rule's value.
 *                           items:
 *                             type: string
 *                             title: value
 *                             description: The value's details.
 *                 - type: object
 *                   description: The rule's rules.
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
 *                     operator: {}
 *                     attribute:
 *                       type: string
 *                       title: attribute
 *                       description: The rule's attribute.
 *                     value:
 *                       oneOf:
 *                         - type: string
 *                           title: value
 *                           description: The rule's value.
 *                         - type: array
 *                           description: The rule's value.
 *                           items:
 *                             type: string
 *                             title: value
 *                             description: The value's details.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/shipping-options/{id}' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "name": "Esta",
 *         "data": {},
 *         "provider_id": "{value}",
 *         "type": {
 *           "label": "{value}",
 *           "description": "{value}",
 *           "code": "{value}"
 *         },
 *         "prices": [],
 *         "rules": []
 *       }'
 * tags:
 *   - Shipping Options
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

