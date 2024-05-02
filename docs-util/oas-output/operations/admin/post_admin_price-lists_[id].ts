/**
 * @oas [post] /admin/price-lists/{id}
 * operationId: PostPriceListsId
 * summary: Update a Price List
 * description: Update a price list's details.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The price list's ID.
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
 *           - title
 *           - description
 *           - starts_at
 *           - ends_at
 *           - status
 *           - type
 *           - rules
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
 *           type:
 *             enum:
 *               - sale
 *               - override
 *           rules:
 *             type: object
 *             description: The price list's rules.
 *             properties: {}
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/price-lists/{id}' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "prices": [
 *           {
 *             "currency_code": "{value}",
 *             "amount": 1670236243755008,
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

