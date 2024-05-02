/**
 * @oas [post] /admin/tax-regions
 * operationId: PostTaxRegions
 * summary: Create Tax Region
 * description: Create a tax region.
 * x-authenticated: true
 * parameters: []
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
 *           - country_code
 *           - province_code
 *           - parent_id
 *           - default_tax_rate
 *           - metadata
 *         properties:
 *           country_code:
 *             type: string
 *             title: country_code
 *             description: The tax region's country code.
 *           province_code:
 *             type: string
 *             title: province_code
 *             description: The tax region's province code.
 *           parent_id:
 *             type: string
 *             title: parent_id
 *             description: The tax region's parent id.
 *           default_tax_rate:
 *             type: object
 *             description: The tax region's default tax rate.
 *             required:
 *               - rate
 *               - code
 *               - name
 *               - is_combinable
 *               - metadata
 *             properties:
 *               rate:
 *                 type: number
 *                 title: rate
 *                 description: The default tax rate's rate.
 *               code:
 *                 type: string
 *                 title: code
 *                 description: The default tax rate's code.
 *               name:
 *                 type: string
 *                 title: name
 *                 description: The default tax rate's name.
 *               metadata:
 *                 type: object
 *                 description: The default tax rate's metadata.
 *                 properties: {}
 *               is_combinable:
 *                 type: string
 *                 enum:
 *                   - "true"
 *                   - "false"
 *           metadata:
 *             type: object
 *             description: The tax region's metadata.
 *             properties: {}
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/tax-regions' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "country_code": "{value}"
 *       }'
 * tags:
 *   - Tax Regions
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

