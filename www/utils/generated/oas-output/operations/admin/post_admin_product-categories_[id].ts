/**
 * @oas [post] /admin/product-categories/{id}
 * operationId: PostProductCategoriesId
 * summary: Update a Product Category
 * description: Update a product category's details.
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
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: The properties to update in the product category.
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
 *             description: The product category's handle. Must be a unique value.
 *           is_internal:
 *             type: boolean
 *             title: is_internal
 *             description: Whether the product category is only used for internal purposes and shouldn't be shown the customer.
 *           is_active:
 *             type: boolean
 *             title: is_active
 *             description: Whether the product category is active.
 *           parent_category_id:
 *             type: string
 *             title: parent_category_id
 *             description: The ID of a parent category.
 *           metadata:
 *             type: object
 *             description: The product category's metadata. Can hold custom key-value pairs.
 *           rank:
 *             type: number
 *             title: rank
 *             description: The product category's rank among other categories.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/product-categories/{id}' \
 *       -H 'Authorization: Bearer {access_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "parent_category_id": "{value}",
 *         "metadata": {}
 *       }'
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
 * x-workflow: updateProductCategoriesWorkflow
 * 
*/

