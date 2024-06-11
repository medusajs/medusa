/**
 * @oas [get] /store/product-categories/{id}
 * operationId: GetProductCategoriesId
 * summary: Get a Product Category
 * description: Retrieve a product category by its ID. You can expand the product
 *   category's relations or select the fields that should be returned.
 * x-authenticated: false
 * parameters:
 *   - name: id
 *     in: path
 *     description: The product category's ID.
 *     required: true
 *     schema:
 *       type: string
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: SUMMARY
 *         required:
 *           - fields
 *           - include_ancestors_tree
 *           - include_descendants_tree
 *         properties:
 *           fields:
 *             type: string
 *             title: fields
 *             description: The product category's fields.
 *           include_ancestors_tree:
 *             type: boolean
 *             title: include_ancestors_tree
 *             description: The product category's include ancestors tree.
 *           include_descendants_tree:
 *             type: boolean
 *             title: include_descendants_tree
 *             description: The product category's include descendants tree.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/store/product-categories/{id}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "fields": "{value}",
 *         "include_ancestors_tree": false,
 *         "include_descendants_tree": true
 *       }'
 * tags:
 *   - Product Categories
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

