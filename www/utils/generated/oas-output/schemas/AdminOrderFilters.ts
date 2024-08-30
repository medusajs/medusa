/**
 * @schema AdminOrderFilters
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminOrderFilters
 * properties:
 *   id:
 *     oneOf:
 *       - type: string
 *         title: id
 *         description: The draft order's ID.
 *       - type: array
 *         description: The draft order's ID.
 *         items:
 *           type: string
 *           title: id
 *           description: The id's ID.
 *       - type: object
 *         description: The draft order's ID.
 *         properties:
 *           $and:
 *             type: array
 *             description: The id's $and.
 *             items:
 *               type: object
 *             title: $and
 *           $or:
 *             type: array
 *             description: The id's $or.
 *             items:
 *               type: object
 *             title: $or
 *           $eq:
 *             oneOf:
 *               - type: string
 *                 title: $eq
 *                 description: Filter by an exact match.
 *               - type: array
 *                 description: Filter by an exact match.
 *                 items:
 *                   type: string
 *                   title: $eq
 *                   description: Filter by an exact match.
 *               - type: array
 *                 description: Filter by an exact match.
 *                 items:
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
 *           $ne:
 *             oneOf:
 *               - type: string
 *                 title: $ne
 *                 description: Filter by values not equal to this parameter.
 *               - type: array
 *                 description: Filter by values not equal to this parameter.
 *                 items:
 *                   type: string
 *                   title: $ne
 *                   description: Filter by values not equal to this parameter.
 *           $in:
 *             type: array
 *             description: Filter by values in this array.
 *             items:
 *               oneOf:
 *                 - type: string
 *                   title: $in
 *                   description: Filter by values in this array.
 *                 - type: array
 *                   description: Filter by values in this array.
 *                   items:
 *                     type: string
 *                     title: $in
 *                     description: Filter by values in this array.
 *           $nin:
 *             type: array
 *             description: Filter by values not in this array.
 *             items:
 *               oneOf:
 *                 - type: string
 *                   title: $nin
 *                   description: Filter by values not in this array.
 *                 - type: array
 *                   description: Filter by values not in this array.
 *                   items:
 *                     type: string
 *                     title: $nin
 *                     description: Filter by values not in this array.
 *           $not:
 *             oneOf:
 *               - type: string
 *                 title: $not
 *                 description: Filter by values not matching the conditions in this parameter.
 *               - type: object
 *                 description: Filter by values not matching the conditions in this parameter.
 *                 properties:
 *                   $and:
 *                     type: array
 *                     description: The $not's $and.
 *                     items:
 *                       type: object
 *                     title: $and
 *                   $or:
 *                     type: array
 *                     description: The $not's $or.
 *                     items:
 *                       type: object
 *                     title: $or
 *                   $eq:
 *                     oneOf:
 *                       - type: string
 *                         title: $eq
 *                         description: Filter by an exact match.
 *                       - type: array
 *                         description: Filter by an exact match.
 *                         items:
 *                           type: string
 *                           title: $eq
 *                           description: Filter by an exact match.
 *                   $ne:
 *                     type: string
 *                     title: $ne
 *                     description: Filter by values not equal to this parameter.
 *                   $in:
 *                     type: array
 *                     description: Filter by values in this array.
 *                     items:
 *                       type: string
 *                       title: $in
 *                       description: Filter by values in this array.
 *                   $nin:
 *                     type: array
 *                     description: Filter by values not in this array.
 *                     items:
 *                       type: string
 *                       title: $nin
 *                       description: Filter by values not in this array.
 *                   $not:
 *                     oneOf:
 *                       - type: string
 *                         title: $not
 *                         description: Filter by values not matching the conditions in this parameter.
 *                       - type: object
 *                         description: Filter by values not matching the conditions in this parameter.
 *                       - type: array
 *                         description: Filter by values not matching the conditions in this parameter.
 *                         items:
 *                           type: string
 *                           title: $not
 *                           description: Filter by values not matching the conditions in this parameter.
 *                   $gt:
 *                     type: string
 *                     title: $gt
 *                     description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *                   $gte:
 *                     type: string
 *                     title: $gte
 *                     description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *                   $lt:
 *                     type: string
 *                     title: $lt
 *                     description: Filter by values less than this parameter. Useful for numbers and dates only.
 *                   $lte:
 *                     type: string
 *                     title: $lte
 *                     description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *                   $like:
 *                     type: string
 *                     title: $like
 *                     description: Apply a `like` filter. Useful for strings only.
 *                   $re:
 *                     type: string
 *                     title: $re
 *                     description: Apply a regex filter. Useful for strings only.
 *                   $ilike:
 *                     type: string
 *                     title: $ilike
 *                     description: Apply a case-insensitive `like` filter. Useful for strings only.
 *                   $fulltext:
 *                     type: string
 *                     title: $fulltext
 *                     description: Filter to apply on full-text properties.
 *                   $overlap:
 *                     type: array
 *                     description: Filter arrays that have overlapping values with this parameter.
 *                     items:
 *                       type: string
 *                       title: $overlap
 *                       description: Filter arrays that have overlapping values with this parameter.
 *                   $contains:
 *                     type: array
 *                     description: Filter arrays that contain some of the values of this parameter.
 *                     items:
 *                       type: string
 *                       title: $contains
 *                       description: Filter arrays that contain some of the values of this parameter.
 *                   $contained:
 *                     type: array
 *                     description: Filter arrays that contain all values of this parameter.
 *                     items:
 *                       type: string
 *                       title: $contained
 *                       description: Filter arrays that contain all values of this parameter.
 *                   $exists:
 *                     type: boolean
 *                     title: $exists
 *                     description: Filter by whether a value for this parameter exists (not `null`).
 *               - type: array
 *                 description: Filter by values not matching the conditions in this parameter.
 *                 items:
 *                   type: string
 *                   title: $not
 *                   description: Filter by values not matching the conditions in this parameter.
 *               - type: array
 *                 description: Filter by values not matching the conditions in this parameter.
 *                 items:
 *                   oneOf:
 *                     - type: string
 *                       title: $not
 *                       description: Filter by values not matching the conditions in this parameter.
 *                     - type: object
 *                       description: Filter by values not matching the conditions in this parameter.
 *                       properties:
 *                         $and:
 *                           type: array
 *                           description: The $not's $and.
 *                           items:
 *                             type: object
 *                           title: $and
 *                         $or:
 *                           type: array
 *                           description: The $not's $or.
 *                           items:
 *                             type: object
 *                           title: $or
 *                         $eq:
 *                           oneOf:
 *                             - type: string
 *                               title: $eq
 *                               description: Filter by an exact match.
 *                             - type: array
 *                               description: Filter by an exact match.
 *                               items:
 *                                 type: string
 *                                 title: $eq
 *                                 description: Filter by an exact match.
 *                         $ne:
 *                           type: string
 *                           title: $ne
 *                           description: Filter by values not equal to this parameter.
 *                         $in:
 *                           type: array
 *                           description: Filter by values in this array.
 *                           items:
 *                             type: string
 *                             title: $in
 *                             description: Filter by values in this array.
 *                         $nin:
 *                           type: array
 *                           description: Filter by values not in this array.
 *                           items:
 *                             type: string
 *                             title: $nin
 *                             description: Filter by values not in this array.
 *                         $not:
 *                           oneOf:
 *                             - type: string
 *                               title: $not
 *                               description: Filter by values not matching the conditions in this parameter.
 *                             - type: object
 *                               description: Filter by values not matching the conditions in this parameter.
 *                             - type: array
 *                               description: Filter by values not matching the conditions in this parameter.
 *                               items:
 *                                 type: string
 *                                 title: $not
 *                                 description: Filter by values not matching the conditions in this parameter.
 *                         $gt:
 *                           type: string
 *                           title: $gt
 *                           description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *                         $gte:
 *                           type: string
 *                           title: $gte
 *                           description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *                         $lt:
 *                           type: string
 *                           title: $lt
 *                           description: Filter by values less than this parameter. Useful for numbers and dates only.
 *                         $lte:
 *                           type: string
 *                           title: $lte
 *                           description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *                         $like:
 *                           type: string
 *                           title: $like
 *                           description: Apply a `like` filter. Useful for strings only.
 *                         $re:
 *                           type: string
 *                           title: $re
 *                           description: Apply a regex filter. Useful for strings only.
 *                         $ilike:
 *                           type: string
 *                           title: $ilike
 *                           description: Apply a case-insensitive `like` filter. Useful for strings only.
 *                         $fulltext:
 *                           type: string
 *                           title: $fulltext
 *                           description: Filter to apply on full-text properties.
 *                         $overlap:
 *                           type: array
 *                           description: Filter arrays that have overlapping values with this parameter.
 *                           items:
 *                             type: string
 *                             title: $overlap
 *                             description: Filter arrays that have overlapping values with this parameter.
 *                         $contains:
 *                           type: array
 *                           description: Filter arrays that contain some of the values of this parameter.
 *                           items:
 *                             type: string
 *                             title: $contains
 *                             description: Filter arrays that contain some of the values of this parameter.
 *                         $contained:
 *                           type: array
 *                           description: Filter arrays that contain all values of this parameter.
 *                           items:
 *                             type: string
 *                             title: $contained
 *                             description: Filter arrays that contain all values of this parameter.
 *                         $exists:
 *                           type: boolean
 *                           title: $exists
 *                           description: Filter by whether a value for this parameter exists (not `null`).
 *           $gt:
 *             oneOf:
 *               - type: string
 *                 title: $gt
 *                 description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *               - type: array
 *                 description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *                 items:
 *                   type: string
 *                   title: $gt
 *                   description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *           $gte:
 *             oneOf:
 *               - type: string
 *                 title: $gte
 *                 description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *               - type: array
 *                 description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *                 items:
 *                   type: string
 *                   title: $gte
 *                   description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *           $lt:
 *             oneOf:
 *               - type: string
 *                 title: $lt
 *                 description: Filter by values less than this parameter. Useful for numbers and dates only.
 *               - type: array
 *                 description: Filter by values less than this parameter. Useful for numbers and dates only.
 *                 items:
 *                   type: string
 *                   title: $lt
 *                   description: Filter by values less than this parameter. Useful for numbers and dates only.
 *           $lte:
 *             oneOf:
 *               - type: string
 *                 title: $lte
 *                 description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *               - type: array
 *                 description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *                 items:
 *                   type: string
 *                   title: $lte
 *                   description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *           $like:
 *             type: string
 *             title: $like
 *             description: Apply a `like` filter. Useful for strings only.
 *           $re:
 *             type: string
 *             title: $re
 *             description: Apply a regex filter. Useful for strings only.
 *           $ilike:
 *             type: string
 *             title: $ilike
 *             description: Apply a case-insensitive `like` filter. Useful for strings only.
 *           $fulltext:
 *             type: string
 *             title: $fulltext
 *             description: Filter to apply on full-text properties.
 *           $overlap:
 *             type: array
 *             description: Filter arrays that have overlapping values with this parameter.
 *             items:
 *               type: string
 *               title: $overlap
 *               description: Filter arrays that have overlapping values with this parameter.
 *           $contains:
 *             type: array
 *             description: Filter arrays that contain some of the values of this parameter.
 *             items:
 *               type: string
 *               title: $contains
 *               description: Filter arrays that contain some of the values of this parameter.
 *           $contained:
 *             type: array
 *             description: Filter arrays that contain all values of this parameter.
 *             items:
 *               type: string
 *               title: $contained
 *               description: Filter arrays that contain all values of this parameter.
 *           $exists:
 *             type: boolean
 *             title: $exists
 *             description: Filter by whether a value for this parameter exists (not `null`).
 *   status:
 *     oneOf:
 *       - type: string
 *         title: status
 *         description: The draft order's status.
 *       - type: array
 *         description: The draft order's status.
 *         items:
 *           type: string
 *           title: status
 *           description: The status's details.
 *       - type: object
 *         description: The draft order's status.
 *         properties:
 *           $and:
 *             type: array
 *             description: The status's $and.
 *             items:
 *               type: object
 *             title: $and
 *           $or:
 *             type: array
 *             description: The status's $or.
 *             items:
 *               type: object
 *             title: $or
 *           $eq:
 *             oneOf:
 *               - type: string
 *                 title: $eq
 *                 description: Filter by an exact match.
 *               - type: array
 *                 description: Filter by an exact match.
 *                 items:
 *                   type: string
 *                   title: $eq
 *                   description: Filter by an exact match.
 *               - type: array
 *                 description: Filter by an exact match.
 *                 items:
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
 *           $ne:
 *             oneOf:
 *               - type: string
 *                 title: $ne
 *                 description: Filter by values not equal to this parameter.
 *               - type: array
 *                 description: Filter by values not equal to this parameter.
 *                 items:
 *                   type: string
 *                   title: $ne
 *                   description: Filter by values not equal to this parameter.
 *           $in:
 *             type: array
 *             description: Filter by values in this array.
 *             items:
 *               oneOf:
 *                 - type: string
 *                   title: $in
 *                   description: Filter by values in this array.
 *                 - type: array
 *                   description: Filter by values in this array.
 *                   items:
 *                     type: string
 *                     title: $in
 *                     description: Filter by values in this array.
 *           $nin:
 *             type: array
 *             description: Filter by values not in this array.
 *             items:
 *               oneOf:
 *                 - type: string
 *                   title: $nin
 *                   description: Filter by values not in this array.
 *                 - type: array
 *                   description: Filter by values not in this array.
 *                   items:
 *                     type: string
 *                     title: $nin
 *                     description: Filter by values not in this array.
 *           $not:
 *             oneOf:
 *               - type: string
 *                 title: $not
 *                 description: Filter by values not matching the conditions in this parameter.
 *               - type: object
 *                 description: Filter by values not matching the conditions in this parameter.
 *                 properties:
 *                   $and:
 *                     type: array
 *                     description: The $not's $and.
 *                     items:
 *                       type: object
 *                     title: $and
 *                   $or:
 *                     type: array
 *                     description: The $not's $or.
 *                     items:
 *                       type: object
 *                     title: $or
 *                   $eq:
 *                     oneOf:
 *                       - type: string
 *                         title: $eq
 *                         description: Filter by an exact match.
 *                       - type: array
 *                         description: Filter by an exact match.
 *                         items:
 *                           type: string
 *                           title: $eq
 *                           description: Filter by an exact match.
 *                   $ne:
 *                     type: string
 *                     title: $ne
 *                     description: Filter by values not equal to this parameter.
 *                   $in:
 *                     type: array
 *                     description: Filter by values in this array.
 *                     items:
 *                       type: string
 *                       title: $in
 *                       description: Filter by values in this array.
 *                   $nin:
 *                     type: array
 *                     description: Filter by values not in this array.
 *                     items:
 *                       type: string
 *                       title: $nin
 *                       description: Filter by values not in this array.
 *                   $not:
 *                     oneOf:
 *                       - type: string
 *                         title: $not
 *                         description: Filter by values not matching the conditions in this parameter.
 *                       - type: object
 *                         description: Filter by values not matching the conditions in this parameter.
 *                       - type: array
 *                         description: Filter by values not matching the conditions in this parameter.
 *                         items:
 *                           type: string
 *                           title: $not
 *                           description: Filter by values not matching the conditions in this parameter.
 *                   $gt:
 *                     type: string
 *                     title: $gt
 *                     description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *                   $gte:
 *                     type: string
 *                     title: $gte
 *                     description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *                   $lt:
 *                     type: string
 *                     title: $lt
 *                     description: Filter by values less than this parameter. Useful for numbers and dates only.
 *                   $lte:
 *                     type: string
 *                     title: $lte
 *                     description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *                   $like:
 *                     type: string
 *                     title: $like
 *                     description: Apply a `like` filter. Useful for strings only.
 *                   $re:
 *                     type: string
 *                     title: $re
 *                     description: Apply a regex filter. Useful for strings only.
 *                   $ilike:
 *                     type: string
 *                     title: $ilike
 *                     description: Apply a case-insensitive `like` filter. Useful for strings only.
 *                   $fulltext:
 *                     type: string
 *                     title: $fulltext
 *                     description: Filter to apply on full-text properties.
 *                   $overlap:
 *                     type: array
 *                     description: Filter arrays that have overlapping values with this parameter.
 *                     items:
 *                       type: string
 *                       title: $overlap
 *                       description: Filter arrays that have overlapping values with this parameter.
 *                   $contains:
 *                     type: array
 *                     description: Filter arrays that contain some of the values of this parameter.
 *                     items:
 *                       type: string
 *                       title: $contains
 *                       description: Filter arrays that contain some of the values of this parameter.
 *                   $contained:
 *                     type: array
 *                     description: Filter arrays that contain all values of this parameter.
 *                     items:
 *                       type: string
 *                       title: $contained
 *                       description: Filter arrays that contain all values of this parameter.
 *                   $exists:
 *                     type: boolean
 *                     title: $exists
 *                     description: Filter by whether a value for this parameter exists (not `null`).
 *               - type: array
 *                 description: Filter by values not matching the conditions in this parameter.
 *                 items:
 *                   type: string
 *                   title: $not
 *                   description: Filter by values not matching the conditions in this parameter.
 *               - type: array
 *                 description: Filter by values not matching the conditions in this parameter.
 *                 items:
 *                   oneOf:
 *                     - type: string
 *                       title: $not
 *                       description: Filter by values not matching the conditions in this parameter.
 *                     - type: object
 *                       description: Filter by values not matching the conditions in this parameter.
 *                       properties:
 *                         $and:
 *                           type: array
 *                           description: The $not's $and.
 *                           items:
 *                             type: object
 *                           title: $and
 *                         $or:
 *                           type: array
 *                           description: The $not's $or.
 *                           items:
 *                             type: object
 *                           title: $or
 *                         $eq:
 *                           oneOf:
 *                             - type: string
 *                               title: $eq
 *                               description: Filter by an exact match.
 *                             - type: array
 *                               description: Filter by an exact match.
 *                               items:
 *                                 type: string
 *                                 title: $eq
 *                                 description: Filter by an exact match.
 *                         $ne:
 *                           type: string
 *                           title: $ne
 *                           description: Filter by values not equal to this parameter.
 *                         $in:
 *                           type: array
 *                           description: Filter by values in this array.
 *                           items:
 *                             type: string
 *                             title: $in
 *                             description: Filter by values in this array.
 *                         $nin:
 *                           type: array
 *                           description: Filter by values not in this array.
 *                           items:
 *                             type: string
 *                             title: $nin
 *                             description: Filter by values not in this array.
 *                         $not:
 *                           oneOf:
 *                             - type: string
 *                               title: $not
 *                               description: Filter by values not matching the conditions in this parameter.
 *                             - type: object
 *                               description: Filter by values not matching the conditions in this parameter.
 *                             - type: array
 *                               description: Filter by values not matching the conditions in this parameter.
 *                               items:
 *                                 type: string
 *                                 title: $not
 *                                 description: Filter by values not matching the conditions in this parameter.
 *                         $gt:
 *                           type: string
 *                           title: $gt
 *                           description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *                         $gte:
 *                           type: string
 *                           title: $gte
 *                           description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *                         $lt:
 *                           type: string
 *                           title: $lt
 *                           description: Filter by values less than this parameter. Useful for numbers and dates only.
 *                         $lte:
 *                           type: string
 *                           title: $lte
 *                           description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *                         $like:
 *                           type: string
 *                           title: $like
 *                           description: Apply a `like` filter. Useful for strings only.
 *                         $re:
 *                           type: string
 *                           title: $re
 *                           description: Apply a regex filter. Useful for strings only.
 *                         $ilike:
 *                           type: string
 *                           title: $ilike
 *                           description: Apply a case-insensitive `like` filter. Useful for strings only.
 *                         $fulltext:
 *                           type: string
 *                           title: $fulltext
 *                           description: Filter to apply on full-text properties.
 *                         $overlap:
 *                           type: array
 *                           description: Filter arrays that have overlapping values with this parameter.
 *                           items:
 *                             type: string
 *                             title: $overlap
 *                             description: Filter arrays that have overlapping values with this parameter.
 *                         $contains:
 *                           type: array
 *                           description: Filter arrays that contain some of the values of this parameter.
 *                           items:
 *                             type: string
 *                             title: $contains
 *                             description: Filter arrays that contain some of the values of this parameter.
 *                         $contained:
 *                           type: array
 *                           description: Filter arrays that contain all values of this parameter.
 *                           items:
 *                             type: string
 *                             title: $contained
 *                             description: Filter arrays that contain all values of this parameter.
 *                         $exists:
 *                           type: boolean
 *                           title: $exists
 *                           description: Filter by whether a value for this parameter exists (not `null`).
 *           $gt:
 *             oneOf:
 *               - type: string
 *                 title: $gt
 *                 description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *               - type: array
 *                 description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *                 items:
 *                   type: string
 *                   title: $gt
 *                   description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *           $gte:
 *             oneOf:
 *               - type: string
 *                 title: $gte
 *                 description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *               - type: array
 *                 description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *                 items:
 *                   type: string
 *                   title: $gte
 *                   description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *           $lt:
 *             oneOf:
 *               - type: string
 *                 title: $lt
 *                 description: Filter by values less than this parameter. Useful for numbers and dates only.
 *               - type: array
 *                 description: Filter by values less than this parameter. Useful for numbers and dates only.
 *                 items:
 *                   type: string
 *                   title: $lt
 *                   description: Filter by values less than this parameter. Useful for numbers and dates only.
 *           $lte:
 *             oneOf:
 *               - type: string
 *                 title: $lte
 *                 description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *               - type: array
 *                 description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *                 items:
 *                   type: string
 *                   title: $lte
 *                   description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
 *           $like:
 *             type: string
 *             title: $like
 *             description: Apply a `like` filter. Useful for strings only.
 *           $re:
 *             type: string
 *             title: $re
 *             description: Apply a regex filter. Useful for strings only.
 *           $ilike:
 *             type: string
 *             title: $ilike
 *             description: Apply a case-insensitive `like` filter. Useful for strings only.
 *           $fulltext:
 *             type: string
 *             title: $fulltext
 *             description: Filter to apply on full-text properties.
 *           $overlap:
 *             type: array
 *             description: Filter arrays that have overlapping values with this parameter.
 *             items:
 *               type: string
 *               title: $overlap
 *               description: Filter arrays that have overlapping values with this parameter.
 *           $contains:
 *             type: array
 *             description: Filter arrays that contain some of the values of this parameter.
 *             items:
 *               type: string
 *               title: $contains
 *               description: Filter arrays that contain some of the values of this parameter.
 *           $contained:
 *             type: array
 *             description: Filter arrays that contain all values of this parameter.
 *             items:
 *               type: string
 *               title: $contained
 *               description: Filter arrays that contain all values of this parameter.
 *           $exists:
 *             type: boolean
 *             title: $exists
 *             description: Filter by whether a value for this parameter exists (not `null`).
 *   $and:
 *     type: array
 *     description: The draft order's $and.
 *     items:
 *       type: object
 *     title: $and
 *   $or:
 *     type: array
 *     description: The draft order's $or.
 *     items:
 *       type: object
 *     title: $or
 * 
*/

