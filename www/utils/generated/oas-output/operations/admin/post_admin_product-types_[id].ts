/**
 * @oas [post] /admin/product-types/{id}
 * operationId: PostProductTypesId
 * summary: Update a Product Type
 * description: Update a product type's details.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The product type's ID.
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
 *           - value
 *           - metadata
 *         properties:
 *           value:
 *             type: string
 *             title: value
 *             description: The product type's value.
 *           metadata:
 *             type: object
 *             description: The product type's metadata.
 *             properties: {}
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/product-types/{id}' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "value": "{value}",
 *         "metadata": {}
 *       }'
 * tags:
 *   - Product Types
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

