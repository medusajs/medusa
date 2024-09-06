/**
 * @oas [get] /store/products
 * operationId: GetProducts
 * summary: List Products
 * description: Retrieve a list of products. The products can be filtered by fields such as `id`. The products can also be sorted or paginated.
 * x-authenticated: false
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
 *     description: Comma-separated fields that should be included in the returned data. if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *       fields. without prefix it will replace the entire default fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned data. if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *         fields. without prefix it will replace the entire default fields.
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
 *     description: The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
 *     required: false
 *     schema:
 *       type: string
 *       title: order
 *       description: The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
 *   - name: $and
 *     in: query
 *     required: false
 *     schema:
 *       type: array
 *       description: The product's $and.
 *       items:
 *         type: object
 *         description: The $and's details.
 *       title: $and
 *   - name: $or
 *     in: query
 *     required: false
 *     schema:
 *       type: array
 *       description: The product's $or.
 *       items:
 *         type: object
 *         description: The $or's details.
 *       title: $or
 *   - name: q
 *     in: query
 *     description: The product's q.
 *     required: false
 *     schema:
 *       type: string
 *       title: q
 *       description: The product's q.
 *   - name: id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: id
 *           description: The product's ID.
 *         - type: array
 *           description: The product's ID.
 *           items:
 *             type: string
 *             title: id
 *             description: The id's ID.
 *   - name: title
 *     in: query
 *     description: The product's title.
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: title
 *           description: The product's title.
 *         - type: array
 *           description: The product's title.
 *           items:
 *             type: string
 *             title: title
 *             description: The title's details.
 *   - name: handle
 *     in: query
 *     description: The product's handle.
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: handle
 *           description: The product's handle.
 *         - type: array
 *           description: The product's handle.
 *           items:
 *             type: string
 *             title: handle
 *             description: The handle's details.
 *   - name: is_giftcard
 *     in: query
 *     description: The product's is giftcard.
 *     required: false
 *     schema:
 *       type: boolean
 *       title: is_giftcard
 *       description: The product's is giftcard.
 *   - name: collection_id
 *     in: query
 *     description: The product's collection id.
 *     required: false
 *     schema:
 *       description: The product's collection id.
 *       items:
 *         type: string
 *         title: collection_id
 *         description: The collection id's details.
 *   - name: type_id
 *     in: query
 *     description: The product's type id.
 *     required: false
 *     schema:
 *       description: The product's type id.
 *       items:
 *         type: string
 *         title: type_id
 *         description: The type id's details.
 *   - name: created_at
 *     in: query
 *     description: The product's created at.
 *     required: false
 *     schema:
 *       type: object
 *       description: The product's created at.
 *       properties:
 *         $and:
 *           type: array
 *           description: The created at's $and.
 *           items:
 *             type: object
 *         $or:
 *           type: array
 *           description: The created at's $or.
 *           items:
 *             type: object
 *         $eq:
 *           oneOf:
 *             - type: string
 *               title: $eq
 *               description: Filter by an exact match.
 *             - type: array
 *               description: Filter by an exact match.
 *               items:
 *                 type: string
 *                 title: $eq
 *                 description: Filter by an exact match.
 *         $ne:
 *           type: string
 *           title: $ne
 *         $in:
 *           type: array
 *           description: The created at's $in.
 *           items:
 *             type: string
 *             title: $in
 *         $nin:
 *           type: array
 *           description: The created at's $nin.
 *           items:
 *             type: string
 *             title: $nin
 *         $not:
 *           oneOf:
 *             - type: string
 *               title: $not
 *               description: Filter by values not matching the conditions in this parameter.
 *             - type: object
 *               description: Filter by values not matching the conditions in this parameter.
 *               properties:
 *                 $and:
 *                   type: array
 *                   description: The $not's $and.
 *                   items:
 *                     type: object
 *                   title: $and
 *                 $or:
 *                   type: array
 *                   description: The $not's $or.
 *                   items:
 *                     type: object
 *                   title: $or
 *                 $eq:
 *                   oneOf:
 *                     - type: string
 *                       title: $eq
 *                       description: Filter by an exact match.
 *                     - type: array
 *                       description: Filter by an exact match.
 *                       items:
 *                         type: string
 *                         title: $eq
 *                         description: Filter by an exact match.
 *                 $ne:
 *                   type: string
 *                   title: $ne
 *                   description: Filter by values not equal to this parameter.
 *                 $in:
 *                   type: array
 *                   description: Filter by values in this array.
 *                   items:
 *                     type: string
 *                     title: $in
 *                     description: Filter by values in this array.
 *                 $nin:
 *                   type: array
 *                   description: Filter by values not in this array.
 *                   items:
 *                     type: string
 *                     title: $nin
 *                     description: Filter by values not in this array.
 *                 $not:
 *                   oneOf:
 *                     - type: string
 *                       title: $not
 *                       description: Filter by values not matching the conditions in this parameter.
 *                     - type: object
 *                       description: Filter by values not matching the conditions in this parameter.
 *                     - type: array
 *                       description: Filter by values not matching the conditions in this parameter.
 *                       items:
 *                         type: string
 *                         title: $not
 *                         description: Filter by values not matching the conditions in this parameter.
 *                 $gt:
 *                   type: string
 *                   title: $gt
 *                   description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *                 $gte:
 *                   type: string
 *                   title: $gte
 *                   description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *                 $lt:
 *                   type: string
 *                   title: $lt
 *                   description: Filter by values less than this parameter. Useful for numbers and dates only.
 *                 $lte:
 *                   type: string
 *                   title: $lte
 *                   description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *                 $like:
 *                   type: string
 *                   title: $like
 *                   description: Apply a `like` filter. Useful for strings only.
 *                 $re:
 *                   type: string
 *                   title: $re
 *                   description: Apply a regex filter. Useful for strings only.
 *                 $ilike:
 *                   type: string
 *                   title: $ilike
 *                   description: Apply a case-insensitive `like` filter. Useful for strings only.
 *                 $fulltext:
 *                   type: string
 *                   title: $fulltext
 *                   description: Filter to apply on full-text properties.
 *                 $overlap:
 *                   type: array
 *                   description: Filter arrays that have overlapping values with this parameter.
 *                   items:
 *                     type: string
 *                     title: $overlap
 *                     description: Filter arrays that have overlapping values with this parameter.
 *                 $contains:
 *                   type: array
 *                   description: Filter arrays that contain some of the values of this parameter.
 *                   items:
 *                     type: string
 *                     title: $contains
 *                     description: Filter arrays that contain some of the values of this parameter.
 *                 $contained:
 *                   type: array
 *                   description: Filter arrays that contain all values of this parameter.
 *                   items:
 *                     type: string
 *                     title: $contained
 *                     description: Filter arrays that contain all values of this parameter.
 *                 $exists:
 *                   type: boolean
 *                   title: $exists
 *                   description: Filter by whether a value for this parameter exists (not `null`).
 *             - type: array
 *               description: Filter by values not matching the conditions in this parameter.
 *               items:
 *                 type: string
 *                 title: $not
 *                 description: Filter by values not matching the conditions in this parameter.
 *         $gt:
 *           type: string
 *           title: $gt
 *         $gte:
 *           type: string
 *           title: $gte
 *         $lt:
 *           type: string
 *           title: $lt
 *         $lte:
 *           type: string
 *           title: $lte
 *         $like:
 *           type: string
 *           title: $like
 *           description: The created at's $like.
 *         $re:
 *           type: string
 *           title: $re
 *           description: The created at's $re.
 *         $ilike:
 *           type: string
 *           title: $ilike
 *           description: The created at's $ilike.
 *         $fulltext:
 *           type: string
 *           title: $fulltext
 *           description: The created at's $fulltext.
 *         $overlap:
 *           type: array
 *           description: The created at's $overlap.
 *           items:
 *             type: string
 *             title: $overlap
 *             description: The $overlap's details.
 *         $contains:
 *           type: array
 *           description: The created at's $contains.
 *           items:
 *             type: string
 *             title: $contains
 *             description: The $contain's $contains.
 *         $contained:
 *           type: array
 *           description: The created at's $contained.
 *           items:
 *             type: string
 *             title: $contained
 *             description: The $contained's details.
 *         $exists:
 *           type: boolean
 *           title: $exists
 *           description: The created at's $exists.
 *   - name: updated_at
 *     in: query
 *     description: The product's updated at.
 *     required: false
 *     schema:
 *       type: object
 *       description: The product's updated at.
 *       properties:
 *         $and:
 *           type: array
 *           description: The updated at's $and.
 *           items:
 *             type: object
 *         $or:
 *           type: array
 *           description: The updated at's $or.
 *           items:
 *             type: object
 *         $eq:
 *           oneOf:
 *             - type: string
 *               title: $eq
 *               description: Filter by an exact match.
 *             - type: array
 *               description: Filter by an exact match.
 *               items:
 *                 type: string
 *                 title: $eq
 *                 description: Filter by an exact match.
 *         $ne:
 *           type: string
 *           title: $ne
 *         $in:
 *           type: array
 *           description: The updated at's $in.
 *           items:
 *             type: string
 *             title: $in
 *         $nin:
 *           type: array
 *           description: The updated at's $nin.
 *           items:
 *             type: string
 *             title: $nin
 *         $not:
 *           oneOf:
 *             - type: string
 *               title: $not
 *               description: Filter by values not matching the conditions in this parameter.
 *             - type: object
 *               description: Filter by values not matching the conditions in this parameter.
 *               properties:
 *                 $and:
 *                   type: array
 *                   description: The $not's $and.
 *                   items:
 *                     type: object
 *                   title: $and
 *                 $or:
 *                   type: array
 *                   description: The $not's $or.
 *                   items:
 *                     type: object
 *                   title: $or
 *                 $eq:
 *                   oneOf:
 *                     - type: string
 *                       title: $eq
 *                       description: Filter by an exact match.
 *                     - type: array
 *                       description: Filter by an exact match.
 *                       items:
 *                         type: string
 *                         title: $eq
 *                         description: Filter by an exact match.
 *                 $ne:
 *                   type: string
 *                   title: $ne
 *                   description: Filter by values not equal to this parameter.
 *                 $in:
 *                   type: array
 *                   description: Filter by values in this array.
 *                   items:
 *                     type: string
 *                     title: $in
 *                     description: Filter by values in this array.
 *                 $nin:
 *                   type: array
 *                   description: Filter by values not in this array.
 *                   items:
 *                     type: string
 *                     title: $nin
 *                     description: Filter by values not in this array.
 *                 $not:
 *                   oneOf:
 *                     - type: string
 *                       title: $not
 *                       description: Filter by values not matching the conditions in this parameter.
 *                     - type: object
 *                       description: Filter by values not matching the conditions in this parameter.
 *                     - type: array
 *                       description: Filter by values not matching the conditions in this parameter.
 *                       items:
 *                         type: string
 *                         title: $not
 *                         description: Filter by values not matching the conditions in this parameter.
 *                 $gt:
 *                   type: string
 *                   title: $gt
 *                   description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *                 $gte:
 *                   type: string
 *                   title: $gte
 *                   description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *                 $lt:
 *                   type: string
 *                   title: $lt
 *                   description: Filter by values less than this parameter. Useful for numbers and dates only.
 *                 $lte:
 *                   type: string
 *                   title: $lte
 *                   description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *                 $like:
 *                   type: string
 *                   title: $like
 *                   description: Apply a `like` filter. Useful for strings only.
 *                 $re:
 *                   type: string
 *                   title: $re
 *                   description: Apply a regex filter. Useful for strings only.
 *                 $ilike:
 *                   type: string
 *                   title: $ilike
 *                   description: Apply a case-insensitive `like` filter. Useful for strings only.
 *                 $fulltext:
 *                   type: string
 *                   title: $fulltext
 *                   description: Filter to apply on full-text properties.
 *                 $overlap:
 *                   type: array
 *                   description: Filter arrays that have overlapping values with this parameter.
 *                   items:
 *                     type: string
 *                     title: $overlap
 *                     description: Filter arrays that have overlapping values with this parameter.
 *                 $contains:
 *                   type: array
 *                   description: Filter arrays that contain some of the values of this parameter.
 *                   items:
 *                     type: string
 *                     title: $contains
 *                     description: Filter arrays that contain some of the values of this parameter.
 *                 $contained:
 *                   type: array
 *                   description: Filter arrays that contain all values of this parameter.
 *                   items:
 *                     type: string
 *                     title: $contained
 *                     description: Filter arrays that contain all values of this parameter.
 *                 $exists:
 *                   type: boolean
 *                   title: $exists
 *                   description: Filter by whether a value for this parameter exists (not `null`).
 *             - type: array
 *               description: Filter by values not matching the conditions in this parameter.
 *               items:
 *                 type: string
 *                 title: $not
 *                 description: Filter by values not matching the conditions in this parameter.
 *         $gt:
 *           type: string
 *           title: $gt
 *         $gte:
 *           type: string
 *           title: $gte
 *         $lt:
 *           type: string
 *           title: $lt
 *         $lte:
 *           type: string
 *           title: $lte
 *         $like:
 *           type: string
 *           title: $like
 *           description: The updated at's $like.
 *         $re:
 *           type: string
 *           title: $re
 *           description: The updated at's $re.
 *         $ilike:
 *           type: string
 *           title: $ilike
 *           description: The updated at's $ilike.
 *         $fulltext:
 *           type: string
 *           title: $fulltext
 *           description: The updated at's $fulltext.
 *         $overlap:
 *           type: array
 *           description: The updated at's $overlap.
 *           items:
 *             type: string
 *             title: $overlap
 *             description: The $overlap's details.
 *         $contains:
 *           type: array
 *           description: The updated at's $contains.
 *           items:
 *             type: string
 *             title: $contains
 *             description: The $contain's $contains.
 *         $contained:
 *           type: array
 *           description: The updated at's $contained.
 *           items:
 *             type: string
 *             title: $contained
 *             description: The $contained's details.
 *         $exists:
 *           type: boolean
 *           title: $exists
 *           description: The updated at's $exists.
 *   - name: deleted_at
 *     in: query
 *     description: The product's deleted at.
 *     required: false
 *     schema:
 *       type: object
 *       description: The product's deleted at.
 *       properties:
 *         $and:
 *           type: array
 *           description: The deleted at's $and.
 *           items:
 *             type: object
 *         $or:
 *           type: array
 *           description: The deleted at's $or.
 *           items:
 *             type: object
 *         $eq:
 *           oneOf:
 *             - type: string
 *               title: $eq
 *               description: Filter by an exact match.
 *             - type: array
 *               description: Filter by an exact match.
 *               items:
 *                 type: string
 *                 title: $eq
 *                 description: Filter by an exact match.
 *         $ne:
 *           type: string
 *           title: $ne
 *         $in:
 *           type: array
 *           description: The deleted at's $in.
 *           items:
 *             type: string
 *             title: $in
 *         $nin:
 *           type: array
 *           description: The deleted at's $nin.
 *           items:
 *             type: string
 *             title: $nin
 *         $not:
 *           oneOf:
 *             - type: string
 *               title: $not
 *               description: Filter by values not matching the conditions in this parameter.
 *             - type: object
 *               description: Filter by values not matching the conditions in this parameter.
 *               properties:
 *                 $and:
 *                   type: array
 *                   description: The $not's $and.
 *                   items:
 *                     type: object
 *                   title: $and
 *                 $or:
 *                   type: array
 *                   description: The $not's $or.
 *                   items:
 *                     type: object
 *                   title: $or
 *                 $eq:
 *                   oneOf:
 *                     - type: string
 *                       title: $eq
 *                       description: Filter by an exact match.
 *                     - type: array
 *                       description: Filter by an exact match.
 *                       items:
 *                         type: string
 *                         title: $eq
 *                         description: Filter by an exact match.
 *                 $ne:
 *                   type: string
 *                   title: $ne
 *                   description: Filter by values not equal to this parameter.
 *                 $in:
 *                   type: array
 *                   description: Filter by values in this array.
 *                   items:
 *                     type: string
 *                     title: $in
 *                     description: Filter by values in this array.
 *                 $nin:
 *                   type: array
 *                   description: Filter by values not in this array.
 *                   items:
 *                     type: string
 *                     title: $nin
 *                     description: Filter by values not in this array.
 *                 $not:
 *                   oneOf:
 *                     - type: string
 *                       title: $not
 *                       description: Filter by values not matching the conditions in this parameter.
 *                     - type: object
 *                       description: Filter by values not matching the conditions in this parameter.
 *                     - type: array
 *                       description: Filter by values not matching the conditions in this parameter.
 *                       items:
 *                         type: string
 *                         title: $not
 *                         description: Filter by values not matching the conditions in this parameter.
 *                 $gt:
 *                   type: string
 *                   title: $gt
 *                   description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *                 $gte:
 *                   type: string
 *                   title: $gte
 *                   description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *                 $lt:
 *                   type: string
 *                   title: $lt
 *                   description: Filter by values less than this parameter. Useful for numbers and dates only.
 *                 $lte:
 *                   type: string
 *                   title: $lte
 *                   description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *                 $like:
 *                   type: string
 *                   title: $like
 *                   description: Apply a `like` filter. Useful for strings only.
 *                 $re:
 *                   type: string
 *                   title: $re
 *                   description: Apply a regex filter. Useful for strings only.
 *                 $ilike:
 *                   type: string
 *                   title: $ilike
 *                   description: Apply a case-insensitive `like` filter. Useful for strings only.
 *                 $fulltext:
 *                   type: string
 *                   title: $fulltext
 *                   description: Filter to apply on full-text properties.
 *                 $overlap:
 *                   type: array
 *                   description: Filter arrays that have overlapping values with this parameter.
 *                   items:
 *                     type: string
 *                     title: $overlap
 *                     description: Filter arrays that have overlapping values with this parameter.
 *                 $contains:
 *                   type: array
 *                   description: Filter arrays that contain some of the values of this parameter.
 *                   items:
 *                     type: string
 *                     title: $contains
 *                     description: Filter arrays that contain some of the values of this parameter.
 *                 $contained:
 *                   type: array
 *                   description: Filter arrays that contain all values of this parameter.
 *                   items:
 *                     type: string
 *                     title: $contained
 *                     description: Filter arrays that contain all values of this parameter.
 *                 $exists:
 *                   type: boolean
 *                   title: $exists
 *                   description: Filter by whether a value for this parameter exists (not `null`).
 *             - type: array
 *               description: Filter by values not matching the conditions in this parameter.
 *               items:
 *                 type: string
 *                 title: $not
 *                 description: Filter by values not matching the conditions in this parameter.
 *         $gt:
 *           type: string
 *           title: $gt
 *         $gte:
 *           type: string
 *           title: $gte
 *         $lt:
 *           type: string
 *           title: $lt
 *         $lte:
 *           type: string
 *           title: $lte
 *         $like:
 *           type: string
 *           title: $like
 *           description: The deleted at's $like.
 *         $re:
 *           type: string
 *           title: $re
 *           description: The deleted at's $re.
 *         $ilike:
 *           type: string
 *           title: $ilike
 *           description: The deleted at's $ilike.
 *         $fulltext:
 *           type: string
 *           title: $fulltext
 *           description: The deleted at's $fulltext.
 *         $overlap:
 *           type: array
 *           description: The deleted at's $overlap.
 *           items:
 *             type: string
 *             title: $overlap
 *             description: The $overlap's details.
 *         $contains:
 *           type: array
 *           description: The deleted at's $contains.
 *           items:
 *             type: string
 *             title: $contains
 *             description: The $contain's $contains.
 *         $contained:
 *           type: array
 *           description: The deleted at's $contained.
 *           items:
 *             type: string
 *             title: $contained
 *             description: The $contained's details.
 *         $exists:
 *           type: boolean
 *           title: $exists
 *           description: The deleted at's $exists.
 *   - name: region_id
 *     in: query
 *     description: The product's region id.
 *     required: false
 *     schema:
 *       type: string
 *       title: region_id
 *       description: The product's region id.
 *   - name: currency_code
 *     in: query
 *     description: The product's currency code.
 *     required: false
 *     schema:
 *       type: string
 *       title: currency_code
 *       description: The product's currency code.
 *   - name: province
 *     in: query
 *     description: The product's province.
 *     required: false
 *     schema:
 *       type: string
 *       title: province
 *       description: The product's province.
 *   - name: sales_channel_id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: sales_channel_id
 *           description: The product's sales channel id.
 *         - type: array
 *           description: The product's sales channel id.
 *           items:
 *             type: string
 *             title: sales_channel_id
 *             description: The sales channel id's details.
 *   - name: category_id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: category_id
 *           description: The product's category id.
 *         - type: array
 *           description: The product's category id.
 *           items:
 *             type: string
 *             title: category_id
 *             description: The category id's details.
 *   - name: tag_id
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: tag_id
 *           description: The product's tag id.
 *         - type: array
 *           description: The product's tag id.
 *           items:
 *             type: string
 *             title: tag_id
 *             description: The tag id's details.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: curl '{backend_url}/store/products'
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
 *               description: SUMMARY
 *               required:
 *                 - limit
 *                 - offset
 *                 - count
 *               properties:
 *                 limit:
 *                   type: number
 *                   title: limit
 *                   description: The product's limit.
 *                 offset:
 *                   type: number
 *                   title: offset
 *                   description: The product's offset.
 *                 count:
 *                   type: number
 *                   title: count
 *                   description: The product's count.
 *             - type: object
 *               description: SUMMARY
 *               required:
 *                 - products
 *               properties:
 *                 products:
 *                   type: array
 *                   description: The product's products.
 *                   items:
 *                     $ref: "#/components/schemas/StoreProduct"
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

