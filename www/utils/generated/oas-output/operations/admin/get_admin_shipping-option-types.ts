/**
 * @oas [get] /admin/shipping-option-types
 * operationId: GetShippingOptionTypes
 * summary: List Shipping Option Types
 * description: Retrieve a list of shipping option types. The shipping option types can be filtered by fields such as `id`. The shipping option types can also be sorted or paginated.
 * x-authenticated: true
 * parameters:
 *   - name: fields
 *     in: query
 *     description: |-
 *       Comma-separated fields that should be included in the returned data.
 *       if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default fields.
 *       without prefix it will replace the entire default fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned data. If a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *         fields. Without prefix it will replace the entire default fields.
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
 *       externalDocs:
 *         url: "#pagination"
 *   - name: with_deleted
 *     in: query
 *     description: Whether to include deleted records in the result.
 *     required: false
 *     schema:
 *       type: boolean
 *       title: with_deleted
 *       description: Whether to include deleted records in the result.
 *   - name: q
 *     in: query
 *     description: Search query to apply on the shipping option type's searchable properties.
 *     required: false
 *     schema:
 *       type: string
 *       title: q
 *       description: Search query to apply on the shipping option type's searchable properties.
 *   - name: id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: id
 *           description: Filter by a shipping option type's ID.
 *         - type: array
 *           description: Filter by shipping option type IDs.
 *           items:
 *             type: string
 *             title: id
 *             description: A shipping option type's ID.
 *   - name: label
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: label
 *           description: Filter by a shipping option type's label.
 *         - type: array
 *           description: Filter by shipping option type labels.
 *           items:
 *             type: string
 *             title: label
 *             description: A label.
 *   - name: code
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: code
 *           description: Filter by a shipping option type's code.
 *         - type: array
 *           description: Filter by shipping option type codes.
 *           items:
 *             type: string
 *             title: code
 *             description: A code.
 *   - name: created_at
 *     in: query
 *     description: Filter by a shipping option type's creation date.
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
 *       description: The shipping option type's created at.
 *   - name: updated_at
 *     in: query
 *     description: Filter by a shipping option type's update date.
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
 *       description: The shipping option type's updated at.
 *   - name: deleted_at
 *     in: query
 *     description: Filter by a shipping option type's deletion date.
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
 *       description: The shipping option type's deleted at.
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
 *   - name: description
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: description
 *           description: Filter by a shipping option type's description.
 *         - type: array
 *           description: Filter by shipping option type descriptions.
 *           items:
 *             type: string
 *             title: description
 *             description: A description.
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
 *       sdk.admin.shippingOptionType.list()
 *       .then(({ shipping_option_types, count, limit, offset }) => {
 *         console.log(shipping_option_types)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/shipping-option-types' \
 *       -H 'Authorization: Bearer {jwt_token}'
 * tags:
 *   - Shipping Option Types
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminShippingOptionTypeListResponse"
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
 * x-since: 2.10.0
 * 
*/

