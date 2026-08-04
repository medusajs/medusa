/**
 * @oas [get] /admin/product-options/{id}/values
 * operationId: GetProductOptionsIdValues
 * summary: List Product Option Values
 * description: Retrieve a list of values in a product option. The values can be filtered by fields like `id`. The values can also be paginated.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The product option's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: q
 *     in: query
 *     description: Query to apply on the product option value's searchable fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: q
 *       description: Query to apply on the product option value's searchable fields.
 *   - name: id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: id
 *           description: Filter by a product option value ID.
 *         - type: array
 *           description: Filter by product option value IDs.
 *           items:
 *             type: string
 *             title: id
 *             description: The product option value's ID.
 *   - name: value
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: value
 *           description: Filter by a product option value.
 *         - type: array
 *           description: Filter by product option values.
 *           items:
 *             type: string
 *             title: value
 *             description: The value.
 *   - name: option_id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: option_id
 *           description: Filter by the value's product option ID.
 *         - type: array
 *           description: Filter by the value's product option IDs.
 *           items:
 *             type: string
 *             title: option_id
 *             description: The value's product option ID.
 *   - name: created_at
 *     in: query
 *     description: Filter by the product option value's creation date.
 *     required: false
 *     schema:
 *       type: object
 *       properties:
 *         $and:
 *           type: array
 *           description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *           items:
 *             type: object
 *         $or:
 *           type: array
 *           description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *           items:
 *             type: object
 *         $eq:
 *           oneOf:
 *             - type: string
 *               title: $eq
 *               description: Filter by exact value.
 *             - type: array
 *               title: $eq
 *               description: Filter by exact value.
 *               items:
 *                 type: string
 *         $ne:
 *           type: string
 *           title: $ne
 *           description: Filter by not equal to the given value.
 *         $in:
 *           type: array
 *           title: $in
 *           description: Filter by values included in the given array.
 *           items:
 *             type: string
 *         $nin:
 *           type: array
 *           title: $nin
 *           description: Filter by values not included in the given array.
 *           items:
 *             type: string
 *         $not:
 *           oneOf:
 *             - type: string
 *               title: $not
 *               description: Filter by not equal to the given value.
 *             - type: object
 *               title: $not
 *               description: Filter by values not matching the conditions in this parameter.
 *             - type: array
 *               title: $not
 *               description: Filter by values not matching the conditions in this parameter.
 *               items:
 *                 type: string
 *         $gt:
 *           type: string
 *           title: $gt
 *           description: Filter by values greater than the given value.
 *         $gte:
 *           type: string
 *           title: $gte
 *           description: Filter by values greater than or equal to the given value.
 *         $lt:
 *           type: string
 *           title: $lt
 *           description: Filter by values less than the given value.
 *         $lte:
 *           type: string
 *           title: $lte
 *           description: Filter by values less than or equal to the given value.
 *         $like:
 *           type: string
 *           title: $like
 *           description: Apply a `like` filter. Useful for strings only.
 *         $re:
 *           type: string
 *           title: $re
 *           description: Apply a regex filter. Useful for strings only.
 *         $ilike:
 *           type: string
 *           title: $ilike
 *           description: Apply a case-insensitive `like` filter. Useful for strings only.
 *         $fulltext:
 *           type: string
 *           title: $fulltext
 *           description: Filter to apply on full-text properties.
 *         $overlap:
 *           type: array
 *           title: $overlap
 *           description: Filter to apply on array properties to find overlapping values.
 *           items:
 *             type: string
 *         $contains:
 *           type: array
 *           title: $contains
 *           description: Filter to apply on array properties to find contained values.
 *           items:
 *             type: string
 *         $contained:
 *           type: array
 *           title: $contained
 *           description: Filter to apply on array properties to find contained values.
 *           items:
 *             type: string
 *         $exists:
 *           type: boolean
 *           title: $exists
 *           description: Filter by whether a value exists or not.
 *       title: created_at
 *       description: Filter by the product option value's creation date.
 *   - name: updated_at
 *     in: query
 *     description: Filter by the product option value's update date.
 *     required: false
 *     schema:
 *       type: object
 *       properties:
 *         $and:
 *           type: array
 *           description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *           items:
 *             type: object
 *         $or:
 *           type: array
 *           description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *           items:
 *             type: object
 *         $eq:
 *           oneOf:
 *             - type: string
 *               title: $eq
 *               description: Filter by exact value.
 *             - type: array
 *               title: $eq
 *               description: Filter by exact value.
 *               items:
 *                 type: string
 *         $ne:
 *           type: string
 *           title: $ne
 *           description: Filter by not equal to the given value.
 *         $in:
 *           type: array
 *           title: $in
 *           description: Filter by values included in the given array.
 *           items:
 *             type: string
 *         $nin:
 *           type: array
 *           title: $nin
 *           description: Filter by values not included in the given array.
 *           items:
 *             type: string
 *         $not:
 *           oneOf:
 *             - type: string
 *               title: $not
 *               description: Filter by not equal to the given value.
 *             - type: object
 *               title: $not
 *               description: Filter by values not matching the conditions in this parameter.
 *             - type: array
 *               title: $not
 *               description: Filter by values not matching the conditions in this parameter.
 *               items:
 *                 type: string
 *         $gt:
 *           type: string
 *           title: $gt
 *           description: Filter by values greater than the given value.
 *         $gte:
 *           type: string
 *           title: $gte
 *           description: Filter by values greater than or equal to the given value.
 *         $lt:
 *           type: string
 *           title: $lt
 *           description: Filter by values less than the given value.
 *         $lte:
 *           type: string
 *           title: $lte
 *           description: Filter by values less than or equal to the given value.
 *         $like:
 *           type: string
 *           title: $like
 *           description: Apply a `like` filter. Useful for strings only.
 *         $re:
 *           type: string
 *           title: $re
 *           description: Apply a regex filter. Useful for strings only.
 *         $ilike:
 *           type: string
 *           title: $ilike
 *           description: Apply a case-insensitive `like` filter. Useful for strings only.
 *         $fulltext:
 *           type: string
 *           title: $fulltext
 *           description: Filter to apply on full-text properties.
 *         $overlap:
 *           type: array
 *           title: $overlap
 *           description: Filter to apply on array properties to find overlapping values.
 *           items:
 *             type: string
 *         $contains:
 *           type: array
 *           title: $contains
 *           description: Filter to apply on array properties to find contained values.
 *           items:
 *             type: string
 *         $contained:
 *           type: array
 *           title: $contained
 *           description: Filter to apply on array properties to find contained values.
 *           items:
 *             type: string
 *         $exists:
 *           type: boolean
 *           title: $exists
 *           description: Filter by whether a value exists or not.
 *       title: updated_at
 *       description: Filter by the product option value's update date.
 *   - name: deleted_at
 *     in: query
 *     description: Filter by the product option value's deletion date.
 *     required: false
 *     schema:
 *       type: object
 *       properties:
 *         $and:
 *           type: array
 *           description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *           items:
 *             type: object
 *         $or:
 *           type: array
 *           description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *           items:
 *             type: object
 *         $eq:
 *           oneOf:
 *             - type: string
 *               title: $eq
 *               description: Filter by exact value.
 *             - type: array
 *               title: $eq
 *               description: Filter by exact value.
 *               items:
 *                 type: string
 *         $ne:
 *           type: string
 *           title: $ne
 *           description: Filter by not equal to the given value.
 *         $in:
 *           type: array
 *           title: $in
 *           description: Filter by values included in the given array.
 *           items:
 *             type: string
 *         $nin:
 *           type: array
 *           title: $nin
 *           description: Filter by values not included in the given array.
 *           items:
 *             type: string
 *         $not:
 *           oneOf:
 *             - type: string
 *               title: $not
 *               description: Filter by not equal to the given value.
 *             - type: object
 *               title: $not
 *               description: Filter by values not matching the conditions in this parameter.
 *             - type: array
 *               title: $not
 *               description: Filter by values not matching the conditions in this parameter.
 *               items:
 *                 type: string
 *         $gt:
 *           type: string
 *           title: $gt
 *           description: Filter by values greater than the given value.
 *         $gte:
 *           type: string
 *           title: $gte
 *           description: Filter by values greater than or equal to the given value.
 *         $lt:
 *           type: string
 *           title: $lt
 *           description: Filter by values less than the given value.
 *         $lte:
 *           type: string
 *           title: $lte
 *           description: Filter by values less than or equal to the given value.
 *         $like:
 *           type: string
 *           title: $like
 *           description: Apply a `like` filter. Useful for strings only.
 *         $re:
 *           type: string
 *           title: $re
 *           description: Apply a regex filter. Useful for strings only.
 *         $ilike:
 *           type: string
 *           title: $ilike
 *           description: Apply a case-insensitive `like` filter. Useful for strings only.
 *         $fulltext:
 *           type: string
 *           title: $fulltext
 *           description: Filter to apply on full-text properties.
 *         $overlap:
 *           type: array
 *           title: $overlap
 *           description: Filter to apply on array properties to find overlapping values.
 *           items:
 *             type: string
 *         $contains:
 *           type: array
 *           title: $contains
 *           description: Filter to apply on array properties to find contained values.
 *           items:
 *             type: string
 *         $contained:
 *           type: array
 *           title: $contained
 *           description: Filter to apply on array properties to find contained values.
 *           items:
 *             type: string
 *         $exists:
 *           type: boolean
 *           title: $exists
 *           description: Filter by whether a value exists or not.
 *       title: deleted_at
 *       description: Filter by the product option value's deletion date.
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
 *   - name: order
 *     in: query
 *     description: The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
 *     required: false
 *     schema:
 *       type: string
 *       title: order
 *       description: The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
 *       externalDocs:
 *         url: "#pagination"
 *   - name: with_deleted
 *     in: query
 *     description: The product option's with deleted.
 *     required: false
 *     schema:
 *       type: boolean
 *       title: with_deleted
 *       description: The product option's with deleted.
 *   - name: fields
 *     in: query
 *     description: Comma-separated fields that should be included in the returned data. If a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *       fields. Without prefix it will replace the entire default fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned data. If a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *         fields. Without prefix it will replace the entire default fields.
 *       externalDocs:
 *         url: "#select-fields-and-relations"
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
 *   - lang: JavaScript
 *     label: JS SDK
 *     source: |-
 *       import Medusa from "@medusajs/js-sdk"
 * 
 *       export const sdk = new Medusa({
 *         baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
 *         debug: import.meta.env.DEV,
 *         auth: {
 *           type: "session",
 *         },
 *       })
 * 
 *       sdk.admin.productOption.listValues("opt_123", { q: "red" })
 *       .then(({ product_option_values, count, limit, offset }) => {
 *         console.log(product_option_values)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/product-options/{id}/values' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Product Options
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           allOf:
 *             - type: object
 *               description: The pagination details of the product option values list.
 *               required:
 *                 - limit
 *                 - offset
 *                 - count
 *               properties:
 *                 limit:
 *                   type: number
 *                   title: limit
 *                   description: The maximum number of items returned in the list.
 *                 offset:
 *                   type: number
 *                   title: offset
 *                   description: The number of items skipped before retrieving the list.
 *                 count:
 *                   type: number
 *                   title: count
 *                   description: The total number of items in the list.
 *                 estimate_count:
 *                   type: number
 *                   title: estimate_count
 *                   description: The estimated count retrieved from the PostgreSQL query planner, which may be inaccurate.
 *                   x-featureFlag: index_engine
 *             - type: object
 *               description: The product option values list.
 *               required:
 *                 - product_option_values
 *               properties:
 *                 product_option_values:
 *                   type: array
 *                   description: The list of product option values.
 *                   items:
 *                     $ref: "#/components/schemas/AdminProductOptionValue"
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
 * x-since: 2.16.0
 * 
*/

