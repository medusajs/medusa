/**
 * @oas [get] /admin/product-categories/{id}
 * operationId: GetProductCategoriesId
 * summary: Get a Product Category
 * description: Retrieve a product category by its ID. You can expand the product category's relations or select the fields that should be returned.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The product category's ID.
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
 *   - name: include_ancestors_tree
 *     in: query
 *     description: Whether to retrieve the category's parent. When enabled, the parent category is set in the `parent_category` property.
 *     required: false
 *     schema:
 *       type: boolean
 *       title: include_ancestors_tree
 *       description: Whether to retrieve the category's parent. When enabled, the parent category is set in the `parent_category` property.
 *   - name: include_descendants_tree
 *     in: query
 *     description: Whether to retrieve a list of child categories. When enabled, the parent categories are added to the `category_children` property.
 *     required: false
 *     schema:
 *       type: boolean
 *       title: include_descendants_tree
 *       description: Whether to retrieve a list of child categories. When enabled, the parent categories are added to the `category_children` property.
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/product-categories/{id}' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Product Categories
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminProductCategoryResponse"
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

