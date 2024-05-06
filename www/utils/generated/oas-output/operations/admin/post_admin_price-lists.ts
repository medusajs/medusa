/**
 * @oas [post] /admin/price-lists
 * operationId: PostPriceLists
 * summary: Create Price List
 * description: Create a price list.
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
 *     description: Comma-separated fields that should be included in the returned data.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned data.
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
 *     description: Field to sort items in the list by.
 *     required: false
 *     schema:
 *       type: string
 *       title: order
 *       description: Field to sort items in the list by.
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
 *           - title
 *           - description
 *           - starts_at
 *           - ends_at
 *           - status
 *           - type
 *           - rules
 *           - prices
 *         properties:
 *           title:
 *             type: string
 *             title: title
 *             description: The price list's title.
 *           description:
 *             type: string
 *             title: description
 *             description: The price list's description.
 *           starts_at:
 *             type: string
 *             title: starts_at
 *             description: The price list's starts at.
 *           ends_at:
 *             type: string
 *             title: ends_at
 *             description: The price list's ends at.
 *           status:
 *             enum:
 *               - active
 *               - draft
 *             type: string
 *           type:
 *             enum:
 *               - sale
 *               - override
 *             type: string
 *           prices:
 *             type: array
 *             description: The price list's prices.
 *             items:
 *               type: object
 *               description: The price's prices.
 *               required:
 *                 - currency_code
 *                 - amount
 *                 - variant_id
 *                 - min_quantity
 *                 - max_quantity
 *                 - rules
 *               properties:
 *                 currency_code:
 *                   type: string
 *                   title: currency_code
 *                   description: The price's currency code.
 *                 amount:
 *                   type: number
 *                   title: amount
 *                   description: The price's amount.
 *                 variant_id:
 *                   type: string
 *                   title: variant_id
 *                   description: The price's variant id.
 *                 min_quantity:
 *                   type: number
 *                   title: min_quantity
 *                   description: The price's min quantity.
 *                 max_quantity:
 *                   type: number
 *                   title: max_quantity
 *                   description: The price's max quantity.
 *                 rules:
 *                   type: object
 *                   description: The price's rules.
 *                   properties: {}
 *           rules:
 *             type: object
 *             description: The price list's rules.
 *             properties: {}
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/price-lists' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "title": "{value}",
 *         "description": "{value}",
 *         "prices": [
 *           {
 *             "currency_code": "{value}",
 *             "amount": 1270314195484672,
 *             "variant_id": "{value}"
 *           }
 *         ]
 *       }'
 * tags:
 *   - Price Lists
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

