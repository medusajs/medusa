/**
 * @oas [post] /admin/regions/{id}
 * operationId: PostRegionsId
 * summary: Update a Region
 * description: Update a region's details.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The region's ID.
 *     required: true
 *     schema:
 *       type: string
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/regions/{id}' \
 *       -H 'x-medusa-access-token: {api_token}'
 * tags:
 *   - Regions
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
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         required:
 *           - name
 *           - currency_code
 *           - countries
 *           - automatic_taxes
 *           - payment_providers
 *           - metadata
 *         properties:
 *           name:
 *             type: string
 *             title: name
 *             description: The region's name.
 *           currency_code:
 *             type: string
 *             title: currency_code
 *             description: The region's currency code.
 *           countries:
 *             type: array
 *             description: The region's countries.
 *             items:
 *               type: string
 *               title: countries
 *               description: The country's countries.
 *           automatic_taxes:
 *             type: boolean
 *             title: automatic_taxes
 *             description: The region's automatic taxes.
 *           payment_providers:
 *             type: array
 *             description: The region's payment providers.
 *             items:
 *               type: string
 *               title: payment_providers
 *               description: The payment provider's payment providers.
 *           metadata:
 *             type: object
 *             description: The region's metadata.
 *             properties: {}
 * 
*/

