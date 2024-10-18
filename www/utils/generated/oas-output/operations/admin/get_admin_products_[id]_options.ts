/**
 * @oas [get] /admin/products/{id}/options
 * operationId: GetProductsIdOptions
 * summary: List a Product's Options
 * x-sidebar-summary: List Options
 * description: Retrieve a list of options of a product. The options can be filtered by fields like `id`. The options can also be paginated.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The product's ID.
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
 *   - name: offset
 *     in: query
 *     description: The number of items to skip when retrieving a list.
 *     required: false
 *     schema:
 *       type: number
 *       title: offset
 *       description: The number of items to skip when retrieving a list.
 *       externalDocs:
 *         url: "#pagination"
 *   - name: limit
 *     in: query
 *     description: Limit the number of items returned in the list.
 *     required: false
 *     schema:
 *       type: number
 *       title: limit
 *       description: Limit the number of items returned in the list.
 *       externalDocs:
 *         url: "#pagination"
 *   - name: order
 *     in: query
 *     description: The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
 *     required: false
 *     schema:
 *       type: string
 *       title: order
 *       description: The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
 *   - name: q
 *     in: query
 *     description: Search term to filter the product option's searchable fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: q
 *       description: Search term to filter the product option's searchable fields.
 *   - name: id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: id
 *           description: Filter by the product option's ID.
 *         - type: array
 *           description: Filter by product option IDs.
 *           items:
 *             type: string
 *             title: id
 *             description: A product option's ID.
 *   - name: title
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: title
 *           description: Filter by a title.
 *         - type: array
 *           description: Filter by titles.
 *           items:
 *             type: string
 *             title: title
 *             description: An option's title.
 *   - name: $and
 *     in: query
 *     description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *     required: false
 *     schema:
 *       type: array
 *       description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *       items:
 *         type: object
 *       title: $and
 *   - name: $or
 *     in: query
 *     description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *     required: false
 *     schema:
 *       type: array
 *       description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *       items:
 *         type: object
 *       title: $or
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/products/{id}/options' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Products
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           allOf:
 *             - type: object
 *               description: The paginated list of product options.
 *               required:
 *                 - limit
 *                 - offset
 *                 - count
 *               properties:
 *                 limit:
 *                   type: number
 *                   title: limit
 *                   description: The maximum number of items returned.
 *                 offset:
 *                   type: number
 *                   title: offset
 *                   description: The number of items skipped before the returned items.
 *                 count:
 *                   type: number
 *                   title: count
 *                   description: The total number of items.
 *             - type: object
 *               description: The paginated list of product options.
 *               required:
 *                 - product_options
 *               properties:
 *                 product_options:
 *                   type: array
 *                   description: The list of product options.
 *                   items:
 *                     $ref: "#/components/schemas/AdminProductOption"
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

