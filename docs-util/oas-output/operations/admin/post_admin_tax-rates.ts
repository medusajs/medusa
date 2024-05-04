/**
 * @oas [post] /admin/tax-rates
 * operationId: PostTaxRates
 * summary: Create Tax Rate
 * description: Create a tax rate.
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
 *           - rate
 *           - code
 *           - rules
 *           - name
 *           - is_default
 *           - is_combinable
 *           - tax_region_id
 *           - metadata
 *         properties:
 *           rate:
 *             type: number
 *             title: rate
 *             description: The tax rate's rate.
 *           code:
 *             type: string
 *             title: code
 *             description: The tax rate's code.
 *           rules:
 *             type: array
 *             description: The tax rate's rules.
 *             items:
 *               type: object
 *               description: The rule's rules.
 *               required:
 *                 - reference
 *                 - reference_id
 *               properties:
 *                 reference:
 *                   type: string
 *                   title: reference
 *                   description: The rule's reference.
 *                 reference_id:
 *                   type: string
 *                   title: reference_id
 *                   description: The rule's reference id.
 *           name:
 *             type: string
 *             title: name
 *             description: The tax rate's name.
 *           is_default:
 *             type: boolean
 *             title: is_default
 *             description: The tax rate's is default.
 *           is_combinable:
 *             type: boolean
 *             title: is_combinable
 *             description: The tax rate's is combinable.
 *           tax_region_id:
 *             type: string
 *             title: tax_region_id
 *             description: The tax rate's tax region id.
 *           metadata:
 *             type: object
 *             description: The tax rate's metadata.
 *             properties: {}
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/tax-rates' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "name": "Myrl",
 *         "tax_region_id": "{value}"
 *       }'
 * tags:
 *   - Tax Rates
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

