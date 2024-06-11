/**
 * @oas [post] /admin/product-categories
 * operationId: PostProductCategories
 * summary: Create Product Category
 * description: Create a product category.
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
 *           - name
 *           - description
 *           - handle
 *           - is_internal
 *           - is_active
 *           - parent_category_id
 *           - metadata
 *           - rank
 *         properties:
 *           name:
 *             type: string
 *             title: name
 *             description: The product category's name.
 *           description:
 *             type: string
 *             title: description
 *             description: The product category's description.
 *           handle:
 *             type: string
 *             title: handle
 *             description: The product category's handle.
 *           is_internal:
 *             type: boolean
 *             title: is_internal
 *             description: The product category's is internal.
 *           is_active:
 *             type: boolean
 *             title: is_active
 *             description: The product category's is active.
 *           parent_category_id:
 *             type: string
 *             title: parent_category_id
 *             description: The product category's parent category id.
 *           metadata:
 *             type: object
 *             description: The product category's metadata.
 *             properties: {}
 *           rank:
 *             type: number
 *             title: rank
 *             description: The product category's rank.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/product-categories' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "name": "Rey",
 *         "description": "{value}",
 *         "handle": "{value}",
 *         "is_internal": true,
 *         "is_active": false,
 *         "parent_category_id": "{value}",
 *         "metadata": {},
 *         "rank": 4609966191149056
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

