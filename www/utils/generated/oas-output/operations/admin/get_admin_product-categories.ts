/**
 * @oas [get] /admin/product-categories
 * operationId: GetProductCategories
 * summary: List Product Categories
 * description: Retrieve a list of product categories. The product categories can
 *   be filtered by fields such as `id`. The product categories can also be sorted
 *   or paginated.
 * x-authenticated: true
 * parameters:
 *   - name: expand
 *     in: query
 *     description: Comma-separated relations that should be expanded in the returned data.
 *     required: false
 *     schema:
 *       type: string
 *       title: expand
 *       description: Comma-separated relations that should be expanded in the returned data.
 *   - name: fields
 *     in: query
 *     description: Comma-separated fields that should be included in the returned
 *       data. if a field is prefixed with `+` it will be added to the default
 *       fields, using `-` will remove it from the default fields. without prefix
 *       it will replace the entire default fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned
 *         data. if a field is prefixed with `+` it will be added to the default
 *         fields, using `-` will remove it from the default fields. without prefix
 *         it will replace the entire default fields.
 *   - name: offset
 *     in: query
 *     description: The number of items to skip when retrieving a list.
 *     required: false
 *     schema:
 *       type: number
 *       title: offset
 *       description: The number of items to skip when retrieving a list.
 *   - name: limit
 *     in: query
 *     description: Limit the number of items returned in the list.
 *     required: false
 *     schema:
 *       type: number
 *       title: limit
 *       description: Limit the number of items returned in the list.
 *   - name: order
 *     in: query
 *     description: The field to sort the data by. By default, the sort order is
 *       ascending. To change the order to descending, prefix the field name with
 *       `-`.
 *     required: false
 *     schema:
 *       type: string
 *       title: order
 *       description: The field to sort the data by. By default, the sort order is
 *         ascending. To change the order to descending, prefix the field name with
 *         `-`.
 *   - name: q
 *     in: query
 *     description: The product category's q.
 *     required: false
 *     schema:
 *       type: string
 *       title: q
 *       description: The product category's q.
 *   - name: id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: id
 *           description: The product category's ID.
 *         - type: array
 *           description: The product category's ID.
 *           items:
 *             type: string
 *             title: id
 *             description: The id's ID.
 *   - name: description
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: description
 *           description: The product category's description.
 *         - type: array
 *           description: The product category's description.
 *           items:
 *             type: string
 *             title: description
 *             description: The description's details.
 *   - name: handle
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: handle
 *           description: The product category's handle.
 *         - type: array
 *           description: The product category's handle.
 *           items:
 *             type: string
 *             title: handle
 *             description: The handle's details.
 *   - name: parent_category_id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: parent_category_id
 *           description: The product category's parent category id.
 *         - type: array
 *           description: The product category's parent category id.
 *           items:
 *             type: string
 *             title: parent_category_id
 *             description: The parent category id's details.
 *   - name: include_ancestors_tree
 *     in: query
 *     description: The product category's include ancestors tree.
 *     required: true
 *     schema:
 *       type: boolean
 *       title: include_ancestors_tree
 *       description: The product category's include ancestors tree.
 *   - name: include_descendants_tree
 *     in: query
 *     description: The product category's include descendants tree.
 *     required: true
 *     schema:
 *       type: boolean
 *       title: include_descendants_tree
 *       description: The product category's include descendants tree.
 *   - name: is_internal
 *     in: query
 *     description: The product category's is internal.
 *     required: true
 *     schema:
 *       type: boolean
 *       title: is_internal
 *       description: The product category's is internal.
 *   - name: is_active
 *     in: query
 *     description: The product category's is active.
 *     required: true
 *     schema:
 *       type: boolean
 *       title: is_active
 *       description: The product category's is active.
 *   - name: created_at
 *     in: query
 *     description: The product category's created at.
 *     required: false
 *     schema:
 *       type: object
 *       description: The product category's created at.
 *       required:
 *         - $eq
 *         - $ne
 *         - $in
 *         - $nin
 *         - $like
 *         - $ilike
 *         - $re
 *         - $contains
 *         - $gt
 *         - $gte
 *         - $lt
 *         - $lte
 *       properties:
 *         $eq: {}
 *         $ne: {}
 *         $in: {}
 *         $nin: {}
 *         $like: {}
 *         $ilike: {}
 *         $re: {}
 *         $contains: {}
 *         $gt: {}
 *         $gte: {}
 *         $lt: {}
 *         $lte: {}
 *   - name: updated_at
 *     in: query
 *     description: The product category's updated at.
 *     required: false
 *     schema:
 *       type: object
 *       description: The product category's updated at.
 *       required:
 *         - $eq
 *         - $ne
 *         - $in
 *         - $nin
 *         - $like
 *         - $ilike
 *         - $re
 *         - $contains
 *         - $gt
 *         - $gte
 *         - $lt
 *         - $lte
 *       properties:
 *         $eq: {}
 *         $ne: {}
 *         $in: {}
 *         $nin: {}
 *         $like: {}
 *         $ilike: {}
 *         $re: {}
 *         $contains: {}
 *         $gt: {}
 *         $gte: {}
 *         $lt: {}
 *         $lte: {}
 *   - name: deleted_at
 *     in: query
 *     description: The product category's deleted at.
 *     required: false
 *     schema:
 *       type: object
 *       description: The product category's deleted at.
 *       required:
 *         - $eq
 *         - $ne
 *         - $in
 *         - $nin
 *         - $like
 *         - $ilike
 *         - $re
 *         - $contains
 *         - $gt
 *         - $gte
 *         - $lt
 *         - $lte
 *       properties:
 *         $eq: {}
 *         $ne: {}
 *         $in: {}
 *         $nin: {}
 *         $like: {}
 *         $ilike: {}
 *         $re: {}
 *         $contains: {}
 *         $gt: {}
 *         $gte: {}
 *         $lt: {}
 *         $lte: {}
 *   - name: $and
 *     in: query
 *     required: false
 *     schema: {}
 *   - name: $or
 *     in: query
 *     required: false
 *     schema: {}
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/product-categories' \
 *       -H 'x-medusa-access-token: {api_token}'
 * tags:
 *   - Product Categories
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminProductCategoryListResponse"
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

