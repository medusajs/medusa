/**
 * @oas [get] /admin/product-types/{id}
 * operationId: GetProductTypesId
 * summary: Get a Product Type
 * description: Retrieve a product type by its ID. You can expand the product
 *   type's relations or select the fields that should be returned.
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
 *           - fields
 *         properties:
 *           fields:
 *             type: string
 *             title: fields
 *             description: The product type's fields.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/product-types/{id}' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "fields": "{value}"
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

