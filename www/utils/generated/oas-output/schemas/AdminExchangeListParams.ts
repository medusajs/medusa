/**
 * @schema AdminExchangeListParams
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminExchangeListParams
 * properties:
 *   deleted_at:
 *     type: object
 *     description: The exchange's deleted at.
 *     properties:
 *       $and:
 *         type: array
 *         description: The deleted at's $and.
 *         items:
 *           type: object
 *         title: $and
 *       $or:
 *         type: array
 *         description: The deleted at's $or.
 *         items:
 *           type: object
 *         title: $or
 *       $eq:
 *         oneOf:
 *           - type: string
 *             title: $eq
 *             description: Filter by an exact match.
 *           - type: array
 *             description: Filter by an exact match.
 *             items:
 *               type: string
 *               title: $eq
 *               description: Filter by an exact match.
 *       $ne:
 *         type: string
 *         title: $ne
 *         description: Filter by values not equal to this parameter.
 *       $in:
 *         type: array
 *         description: Filter by values in this array.
 *         items:
 *           type: string
 *           title: $in
 *           description: Filter by values in this array.
 *       $nin:
 *         type: array
 *         description: Filter by values not in this array.
 *         items:
 *           type: string
 *           title: $nin
 *           description: Filter by values not in this array.
 *       $not:
 *         oneOf:
 *           - type: string
 *             title: $not
 *             description: Filter by values not matching the conditions in this parameter.
 *           - type: object
 *             description: Filter by values not matching the conditions in this parameter.
 *             properties:
 *               $and:
 *                 type: array
 *                 description: The $not's $and.
 *                 items:
 *                   type: object
 *                 title: $and
 *               $or:
 *                 type: array
 *                 description: The $not's $or.
 *                 items:
 *                   type: object
 *                 title: $or
 *               $eq:
 *                 oneOf:
 *                   - type: string
 *                     title: $eq
 *                     description: Filter by an exact match.
 *                   - type: array
 *                     description: Filter by an exact match.
 *                     items:
 *                       type: string
 *                       title: $eq
 *                       description: Filter by an exact match.
 *               $ne:
 *                 type: string
 *                 title: $ne
 *                 description: Filter by values not equal to this parameter.
 *               $in:
 *                 type: array
 *                 description: Filter by values in this array.
 *                 items:
 *                   type: string
 *                   title: $in
 *                   description: Filter by values in this array.
 *               $nin:
 *                 type: array
 *                 description: Filter by values not in this array.
 *                 items:
 *                   type: string
 *                   title: $nin
 *                   description: Filter by values not in this array.
 *               $not:
 *                 oneOf:
 *                   - type: string
 *                     title: $not
 *                     description: Filter by values not matching the conditions in this parameter.
 *                   - type: object
 *                     description: Filter by values not matching the conditions in this parameter.
 *                   - type: array
 *                     description: Filter by values not matching the conditions in this parameter.
 *                     items:
 *                       type: string
 *                       title: $not
 *                       description: Filter by values not matching the conditions in this parameter.
 *               $gt:
 *                 type: string
 *                 title: $gt
 *                 description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *               $gte:
 *                 type: string
 *                 title: $gte
 *                 description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *               $lt:
 *                 type: string
 *                 title: $lt
 *                 description: Filter by values less than this parameter. Useful for numbers and dates only.
 *               $lte:
 *                 type: string
 *                 title: $lte
 *                 description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *               $like:
 *                 type: string
 *                 title: $like
 *                 description: Apply a `like` filter. Useful for strings only.
 *               $re:
 *                 type: string
 *                 title: $re
 *                 description: Apply a regex filter. Useful for strings only.
 *               $ilike:
 *                 type: string
 *                 title: $ilike
 *                 description: Apply a case-insensitive `like` filter. Useful for strings only.
 *               $fulltext:
 *                 type: string
 *                 title: $fulltext
 *                 description: Filter to apply on full-text properties.
 *               $overlap:
 *                 type: array
 *                 description: Filter arrays that have overlapping values with this parameter.
 *                 items:
 *                   type: string
 *                   title: $overlap
 *                   description: Filter arrays that have overlapping values with this parameter.
 *               $contains:
 *                 type: array
 *                 description: Filter arrays that contain some of the values of this parameter.
 *                 items:
 *                   type: string
 *                   title: $contains
 *                   description: Filter arrays that contain some of the values of this parameter.
 *               $contained:
 *                 type: array
 *                 description: Filter arrays that contain all values of this parameter.
 *                 items:
 *                   type: string
 *                   title: $contained
 *                   description: Filter arrays that contain all values of this parameter.
 *               $exists:
 *                 type: boolean
 *                 title: $exists
 *                 description: Filter by whether a value for this parameter exists (not `null`).
 *           - type: array
 *             description: Filter by values not matching the conditions in this parameter.
 *             items:
 *               type: string
 *               title: $not
 *               description: Filter by values not matching the conditions in this parameter.
 *       $gt:
 *         type: string
 *         title: $gt
 *         description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *       $gte:
 *         type: string
 *         title: $gte
 *         description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *       $lt:
 *         type: string
 *         title: $lt
 *         description: Filter by values less than this parameter. Useful for numbers and dates only.
 *       $lte:
 *         type: string
 *         title: $lte
 *         description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *       $like:
 *         type: string
 *         title: $like
 *         description: Apply a `like` filter. Useful for strings only.
 *       $re:
 *         type: string
 *         title: $re
 *         description: Apply a regex filter. Useful for strings only.
 *       $ilike:
 *         type: string
 *         title: $ilike
 *         description: Apply a case-insensitive `like` filter. Useful for strings only.
 *       $fulltext:
 *         type: string
 *         title: $fulltext
 *         description: Filter to apply on full-text properties.
 *       $overlap:
 *         type: array
 *         description: Filter arrays that have overlapping values with this parameter.
 *         items:
 *           type: string
 *           title: $overlap
 *           description: Filter arrays that have overlapping values with this parameter.
 *       $contains:
 *         type: array
 *         description: Filter arrays that contain some of the values of this parameter.
 *         items:
 *           type: string
 *           title: $contains
 *           description: Filter arrays that contain some of the values of this parameter.
 *       $contained:
 *         type: array
 *         description: Filter arrays that contain all values of this parameter.
 *         items:
 *           type: string
 *           title: $contained
 *           description: Filter arrays that contain all values of this parameter.
 *       $exists:
 *         type: boolean
 *         title: $exists
 *         description: Filter by whether a value for this parameter exists (not `null`).
 *   q:
 *     type: string
 *     title: q
 *     description: The exchange's q.
 *   id:
 *     oneOf:
 *       - type: string
 *         title: id
 *         description: The exchange's ID.
 *       - type: array
 *         description: The exchange's ID.
 *         items:
 *           type: string
 *           title: id
 *           description: The id's ID.
 *   order_id:
 *     oneOf:
 *       - type: string
 *         title: order_id
 *         description: The exchange's order id.
 *       - type: array
 *         description: The exchange's order id.
 *         items:
 *           type: string
 *           title: order_id
 *           description: The order id's details.
 *   status:
 *     oneOf:
 *       - type: string
 *         title: status
 *         description: The exchange's status.
 *       - type: array
 *         description: The exchange's status.
 *         items:
 *           type: string
 *           title: status
 *           description: The status's details.
 *   created_at:
 *     type: object
 *     description: The exchange's created at.
 *     properties:
 *       $and:
 *         type: array
 *         description: The created at's $and.
 *         items:
 *           type: object
 *         title: $and
 *       $or:
 *         type: array
 *         description: The created at's $or.
 *         items:
 *           type: object
 *         title: $or
 *       $eq:
 *         oneOf:
 *           - type: string
 *             title: $eq
 *             description: Filter by an exact match.
 *           - type: array
 *             description: Filter by an exact match.
 *             items:
 *               type: string
 *               title: $eq
 *               description: Filter by an exact match.
 *       $ne:
 *         type: string
 *         title: $ne
 *         description: Filter by values not equal to this parameter.
 *       $in:
 *         type: array
 *         description: Filter by values in this array.
 *         items:
 *           type: string
 *           title: $in
 *           description: Filter by values in this array.
 *       $nin:
 *         type: array
 *         description: Filter by values not in this array.
 *         items:
 *           type: string
 *           title: $nin
 *           description: Filter by values not in this array.
 *       $not:
 *         oneOf:
 *           - type: string
 *             title: $not
 *             description: Filter by values not matching the conditions in this parameter.
 *           - type: object
 *             description: Filter by values not matching the conditions in this parameter.
 *             properties:
 *               $and:
 *                 type: array
 *                 description: The $not's $and.
 *                 items:
 *                   type: object
 *                 title: $and
 *               $or:
 *                 type: array
 *                 description: The $not's $or.
 *                 items:
 *                   type: object
 *                 title: $or
 *               $eq:
 *                 oneOf:
 *                   - type: string
 *                     title: $eq
 *                     description: Filter by an exact match.
 *                   - type: array
 *                     description: Filter by an exact match.
 *                     items:
 *                       type: string
 *                       title: $eq
 *                       description: Filter by an exact match.
 *               $ne:
 *                 type: string
 *                 title: $ne
 *                 description: Filter by values not equal to this parameter.
 *               $in:
 *                 type: array
 *                 description: Filter by values in this array.
 *                 items:
 *                   type: string
 *                   title: $in
 *                   description: Filter by values in this array.
 *               $nin:
 *                 type: array
 *                 description: Filter by values not in this array.
 *                 items:
 *                   type: string
 *                   title: $nin
 *                   description: Filter by values not in this array.
 *               $not:
 *                 oneOf:
 *                   - type: string
 *                     title: $not
 *                     description: Filter by values not matching the conditions in this parameter.
 *                   - type: object
 *                     description: Filter by values not matching the conditions in this parameter.
 *                   - type: array
 *                     description: Filter by values not matching the conditions in this parameter.
 *                     items:
 *                       type: string
 *                       title: $not
 *                       description: Filter by values not matching the conditions in this parameter.
 *               $gt:
 *                 type: string
 *                 title: $gt
 *                 description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *               $gte:
 *                 type: string
 *                 title: $gte
 *                 description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *               $lt:
 *                 type: string
 *                 title: $lt
 *                 description: Filter by values less than this parameter. Useful for numbers and dates only.
 *               $lte:
 *                 type: string
 *                 title: $lte
 *                 description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *               $like:
 *                 type: string
 *                 title: $like
 *                 description: Apply a `like` filter. Useful for strings only.
 *               $re:
 *                 type: string
 *                 title: $re
 *                 description: Apply a regex filter. Useful for strings only.
 *               $ilike:
 *                 type: string
 *                 title: $ilike
 *                 description: Apply a case-insensitive `like` filter. Useful for strings only.
 *               $fulltext:
 *                 type: string
 *                 title: $fulltext
 *                 description: Filter to apply on full-text properties.
 *               $overlap:
 *                 type: array
 *                 description: Filter arrays that have overlapping values with this parameter.
 *                 items:
 *                   type: string
 *                   title: $overlap
 *                   description: Filter arrays that have overlapping values with this parameter.
 *               $contains:
 *                 type: array
 *                 description: Filter arrays that contain some of the values of this parameter.
 *                 items:
 *                   type: string
 *                   title: $contains
 *                   description: Filter arrays that contain some of the values of this parameter.
 *               $contained:
 *                 type: array
 *                 description: Filter arrays that contain all values of this parameter.
 *                 items:
 *                   type: string
 *                   title: $contained
 *                   description: Filter arrays that contain all values of this parameter.
 *               $exists:
 *                 type: boolean
 *                 title: $exists
 *                 description: Filter by whether a value for this parameter exists (not `null`).
 *           - type: array
 *             description: Filter by values not matching the conditions in this parameter.
 *             items:
 *               type: string
 *               title: $not
 *               description: Filter by values not matching the conditions in this parameter.
 *       $gt:
 *         type: string
 *         title: $gt
 *         description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *       $gte:
 *         type: string
 *         title: $gte
 *         description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *       $lt:
 *         type: string
 *         title: $lt
 *         description: Filter by values less than this parameter. Useful for numbers and dates only.
 *       $lte:
 *         type: string
 *         title: $lte
 *         description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *       $like:
 *         type: string
 *         title: $like
 *         description: Apply a `like` filter. Useful for strings only.
 *       $re:
 *         type: string
 *         title: $re
 *         description: Apply a regex filter. Useful for strings only.
 *       $ilike:
 *         type: string
 *         title: $ilike
 *         description: Apply a case-insensitive `like` filter. Useful for strings only.
 *       $fulltext:
 *         type: string
 *         title: $fulltext
 *         description: Filter to apply on full-text properties.
 *       $overlap:
 *         type: array
 *         description: Filter arrays that have overlapping values with this parameter.
 *         items:
 *           type: string
 *           title: $overlap
 *           description: Filter arrays that have overlapping values with this parameter.
 *       $contains:
 *         type: array
 *         description: Filter arrays that contain some of the values of this parameter.
 *         items:
 *           type: string
 *           title: $contains
 *           description: Filter arrays that contain some of the values of this parameter.
 *       $contained:
 *         type: array
 *         description: Filter arrays that contain all values of this parameter.
 *         items:
 *           type: string
 *           title: $contained
 *           description: Filter arrays that contain all values of this parameter.
 *       $exists:
 *         type: boolean
 *         title: $exists
 *         description: Filter by whether a value for this parameter exists (not `null`).
 *   updated_at:
 *     type: object
 *     description: The exchange's updated at.
 *     properties:
 *       $and:
 *         type: array
 *         description: The updated at's $and.
 *         items:
 *           type: object
 *         title: $and
 *       $or:
 *         type: array
 *         description: The updated at's $or.
 *         items:
 *           type: object
 *         title: $or
 *       $eq:
 *         oneOf:
 *           - type: string
 *             title: $eq
 *             description: Filter by an exact match.
 *           - type: array
 *             description: Filter by an exact match.
 *             items:
 *               type: string
 *               title: $eq
 *               description: Filter by an exact match.
 *       $ne:
 *         type: string
 *         title: $ne
 *         description: Filter by values not equal to this parameter.
 *       $in:
 *         type: array
 *         description: Filter by values in this array.
 *         items:
 *           type: string
 *           title: $in
 *           description: Filter by values in this array.
 *       $nin:
 *         type: array
 *         description: Filter by values not in this array.
 *         items:
 *           type: string
 *           title: $nin
 *           description: Filter by values not in this array.
 *       $not:
 *         oneOf:
 *           - type: string
 *             title: $not
 *             description: Filter by values not matching the conditions in this parameter.
 *           - type: object
 *             description: Filter by values not matching the conditions in this parameter.
 *             properties:
 *               $and:
 *                 type: array
 *                 description: The $not's $and.
 *                 items:
 *                   type: object
 *                 title: $and
 *               $or:
 *                 type: array
 *                 description: The $not's $or.
 *                 items:
 *                   type: object
 *                 title: $or
 *               $eq:
 *                 oneOf:
 *                   - type: string
 *                     title: $eq
 *                     description: Filter by an exact match.
 *                   - type: array
 *                     description: Filter by an exact match.
 *                     items:
 *                       type: string
 *                       title: $eq
 *                       description: Filter by an exact match.
 *               $ne:
 *                 type: string
 *                 title: $ne
 *                 description: Filter by values not equal to this parameter.
 *               $in:
 *                 type: array
 *                 description: Filter by values in this array.
 *                 items:
 *                   type: string
 *                   title: $in
 *                   description: Filter by values in this array.
 *               $nin:
 *                 type: array
 *                 description: Filter by values not in this array.
 *                 items:
 *                   type: string
 *                   title: $nin
 *                   description: Filter by values not in this array.
 *               $not:
 *                 oneOf:
 *                   - type: string
 *                     title: $not
 *                     description: Filter by values not matching the conditions in this parameter.
 *                   - type: object
 *                     description: Filter by values not matching the conditions in this parameter.
 *                   - type: array
 *                     description: Filter by values not matching the conditions in this parameter.
 *                     items:
 *                       type: string
 *                       title: $not
 *                       description: Filter by values not matching the conditions in this parameter.
 *               $gt:
 *                 type: string
 *                 title: $gt
 *                 description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *               $gte:
 *                 type: string
 *                 title: $gte
 *                 description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *               $lt:
 *                 type: string
 *                 title: $lt
 *                 description: Filter by values less than this parameter. Useful for numbers and dates only.
 *               $lte:
 *                 type: string
 *                 title: $lte
 *                 description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *               $like:
 *                 type: string
 *                 title: $like
 *                 description: Apply a `like` filter. Useful for strings only.
 *               $re:
 *                 type: string
 *                 title: $re
 *                 description: Apply a regex filter. Useful for strings only.
 *               $ilike:
 *                 type: string
 *                 title: $ilike
 *                 description: Apply a case-insensitive `like` filter. Useful for strings only.
 *               $fulltext:
 *                 type: string
 *                 title: $fulltext
 *                 description: Filter to apply on full-text properties.
 *               $overlap:
 *                 type: array
 *                 description: Filter arrays that have overlapping values with this parameter.
 *                 items:
 *                   type: string
 *                   title: $overlap
 *                   description: Filter arrays that have overlapping values with this parameter.
 *               $contains:
 *                 type: array
 *                 description: Filter arrays that contain some of the values of this parameter.
 *                 items:
 *                   type: string
 *                   title: $contains
 *                   description: Filter arrays that contain some of the values of this parameter.
 *               $contained:
 *                 type: array
 *                 description: Filter arrays that contain all values of this parameter.
 *                 items:
 *                   type: string
 *                   title: $contained
 *                   description: Filter arrays that contain all values of this parameter.
 *               $exists:
 *                 type: boolean
 *                 title: $exists
 *                 description: Filter by whether a value for this parameter exists (not `null`).
 *           - type: array
 *             description: Filter by values not matching the conditions in this parameter.
 *             items:
 *               type: string
 *               title: $not
 *               description: Filter by values not matching the conditions in this parameter.
 *       $gt:
 *         type: string
 *         title: $gt
 *         description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *       $gte:
 *         type: string
 *         title: $gte
 *         description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *       $lt:
 *         type: string
 *         title: $lt
 *         description: Filter by values less than this parameter. Useful for numbers and dates only.
 *       $lte:
 *         type: string
 *         title: $lte
 *         description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *       $like:
 *         type: string
 *         title: $like
 *         description: Apply a `like` filter. Useful for strings only.
 *       $re:
 *         type: string
 *         title: $re
 *         description: Apply a regex filter. Useful for strings only.
 *       $ilike:
 *         type: string
 *         title: $ilike
 *         description: Apply a case-insensitive `like` filter. Useful for strings only.
 *       $fulltext:
 *         type: string
 *         title: $fulltext
 *         description: Filter to apply on full-text properties.
 *       $overlap:
 *         type: array
 *         description: Filter arrays that have overlapping values with this parameter.
 *         items:
 *           type: string
 *           title: $overlap
 *           description: Filter arrays that have overlapping values with this parameter.
 *       $contains:
 *         type: array
 *         description: Filter arrays that contain some of the values of this parameter.
 *         items:
 *           type: string
 *           title: $contains
 *           description: Filter arrays that contain some of the values of this parameter.
 *       $contained:
 *         type: array
 *         description: Filter arrays that contain all values of this parameter.
 *         items:
 *           type: string
 *           title: $contained
 *           description: Filter arrays that contain all values of this parameter.
 *       $exists:
 *         type: boolean
 *         title: $exists
 *         description: Filter by whether a value for this parameter exists (not `null`).
 *   limit:
 *     type: number
 *     title: limit
 *     description: The exchange's limit.
 *   offset:
 *     type: number
 *     title: offset
 *     description: The exchange's offset.
 *   order:
 *     type: string
 *     title: order
 *     description: The exchange's order.
 *   fields:
 *     type: string
 *     title: fields
 *     description: The exchange's fields.
 *   $and:
 *     type: array
 *     description: The exchange's $and.
 *     items:
 *       type: object
 *     title: $and
 *   $or:
 *     type: array
 *     description: The exchange's $or.
 *     items:
 *       type: object
 *     title: $or
 * 
*/

