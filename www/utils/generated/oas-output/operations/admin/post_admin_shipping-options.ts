/**
 * @oas [post] /admin/shipping-options
 * operationId: PostShippingOptions
 * summary: Create Shipping Option
 * description: Create a shipping option.
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
 *           - name
 *           - service_zone_id
 *           - shipping_profile_id
 *           - price_type
 *           - provider_id
 *           - type
 *           - prices
 *         properties:
 *           name:
 *             type: string
 *             title: name
 *             description: The shipping option's name.
 *           service_zone_id:
 *             type: string
 *             title: service_zone_id
 *             description: The shipping option's service zone id.
 *           shipping_profile_id:
 *             type: string
 *             title: shipping_profile_id
 *             description: The shipping option's shipping profile id.
 *           data:
 *             type: object
 *             description: The shipping option's data.
 *           price_type:
 *             type: string
 *             enum:
 *               - calculated
 *               - flat
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
 *                     - currency_code
 *                     - amount
 *                   properties:
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
 *                     - region_id
 *                     - amount
 *                   properties:
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
 *               type: object
 *               description: The rule's rules.
 *               required:
 *                 - operator
 *                 - attribute
 *                 - value
 *               properties:
 *                 operator:
 *                   type: string
 *                   enum:
 *                     - in
 *                     - eq
 *                     - ne
 *                     - gt
 *                     - gte
 *                     - lt
 *                     - lte
 *                     - nin
 *                 attribute:
 *                   type: string
 *                   title: attribute
 *                   description: The rule's attribute.
 *                 value:
 *                   oneOf:
 *                     - type: string
 *                       title: value
 *                       description: The rule's value.
 *                     - type: array
 *                       description: The rule's value.
 *                       items:
 *                         type: string
 *                         title: value
 *                         description: The value's details.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/shipping-options' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "name": "Julie",
 *         "service_zone_id": "{value}",
 *         "shipping_profile_id": "{value}",
 *         "price_type": "{value}",
 *         "provider_id": "{value}",
 *         "type": {
 *           "label": "{value}",
 *           "description": "{value}",
 *           "code": "{value}"
 *         },
 *         "prices": []
 *       }'
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
 * 
*/

