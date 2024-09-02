/**
 * @schema AdminPriceListListParams
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminPriceListListParams
 * properties:
 *   q:
 *     type: string
 *     title: q
 *     description: The price list's q.
 *   id:
 *     oneOf:
 *       - type: string
 *         title: id
 *         description: The price list's ID.
 *       - type: array
 *         description: The price list's ID.
 *         items:
 *           type: string
 *           title: id
 *           description: The id's ID.
 *   starts_at:
 *     type: object
 *     description: The price list's starts at.
 *     properties:
 *       $and:
 *         type: array
 *         description: The starts at's $and.
 *         items:
 *           type: object
 *         title: $and
 *       $or:
 *         type: array
 *         description: The starts at's $or.
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
 *   ends_at:
 *     type: object
 *     description: The price list's ends at.
 *     properties:
 *       $and:
 *         type: array
 *         description: The ends at's $and.
 *         items:
 *           type: object
 *         title: $and
 *       $or:
 *         type: array
 *         description: The ends at's $or.
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
 *   status:
 *     type: array
 *     description: The price list's status.
 *     items:
 *       type: string
 *       description: The status's details.
 *       enum:
 *         - active
 *         - draft
 *   rules_count:
 *     type: array
 *     description: The price list's rules count.
 *     items:
 *       type: number
 *       title: rules_count
 *       description: The rules count's details.
 *   limit:
 *     type: number
 *     title: limit
 *     description: The price list's limit.
 *   offset:
 *     type: number
 *     title: offset
 *     description: The price list's offset.
 *   order:
 *     type: string
 *     title: order
 *     description: The price list's order.
 *   fields:
 *     type: string
 *     title: fields
 *     description: The price list's fields.
 *   $and:
 *     type: array
 *     description: The price list's $and.
 *     items:
 *       type: object
 *     title: $and
 *   $or:
 *     type: array
 *     description: The price list's $or.
 *     items:
 *       type: object
 *     title: $or
 * 
*/

