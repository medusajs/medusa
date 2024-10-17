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
 *         description: The propeties to update in the region.
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
 *               description: A country code.
 *           automatic_taxes:
 *             type: boolean
 *             title: automatic_taxes
 *             description: Whether taxes are calculated automatically for carts in the region.
 *           payment_providers:
 *             type: array
 *             description: The payment providers enabled in the region.
 *             items:
 *               type: string
 *               title: payment_providers
 *               description: A payment provider's ID.
 *           metadata:
 *             type: object
 *             description: The region's metadata. Can hold custom key-value pairs.
 *           is_tax_inclusive:
 *             type: boolean
 *             title: is_tax_inclusive
 *             description: Whether the prices in the region are tax inclusive.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/regions/{id}' \
 *       -H 'Authorization: Bearer {access_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "metadata": {}
 *       }'
 * tags:
 *   - Regions
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminRegionResponse"
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
 * x-workflow: updateRegionsWorkflow
 * 
*/

