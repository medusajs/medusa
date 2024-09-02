/**
 * @schema AdminCustomerFilters
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminCustomerFilters
 * required:
 *   - groups
 * properties:
 *   groups:
 *     oneOf:
 *       - type: string
 *         title: groups
 *         description: The customer's groups.
 *       - $ref: "#/components/schemas/CustomerGroupInCustomerFilters"
 *       - type: array
 *         description: The customer's groups.
 *         items:
 *           type: string
 *           title: groups
 *           description: The group's groups.
 *   q:
 *     type: string
 *     title: q
 *     description: The customer's q.
 *   id:
 *     oneOf:
 *       - type: string
 *         title: id
 *         description: The customer's ID.
 *       - type: array
 *         description: The customer's ID.
 *         items:
 *           type: string
 *           title: id
 *           description: The id's ID.
 *       - type: object
 *         description: The customer's ID.
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
 *   email:
 *     oneOf:
 *       - type: string
 *         title: email
 *         description: The customer's email.
 *         format: email
 *       - type: array
 *         description: The customer's email.
 *         items:
 *           type: string
 *           title: email
 *           description: The email's details.
 *           format: email
 *       - type: object
 *         description: The customer's email.
 *         properties:
 *           $and:
 *             type: array
 *             description: The email's $and.
 *             items:
 *               type: object
 *             title: $and
 *           $or:
 *             type: array
 *             description: The email's $or.
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
 *           $ne:
 *             type: string
 *             title: $ne
 *             description: Filter by values not equal to this parameter.
 *           $in:
 *             type: array
 *             description: Filter by values in this array.
 *             items:
 *               type: string
 *               title: $in
 *               description: Filter by values in this array.
 *           $nin:
 *             type: array
 *             description: Filter by values not in this array.
 *             items:
 *               type: string
 *               title: $nin
 *               description: Filter by values not in this array.
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
 *           $gt:
 *             type: string
 *             title: $gt
 *             description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *           $gte:
 *             type: string
 *             title: $gte
 *             description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *           $lt:
 *             type: string
 *             title: $lt
 *             description: Filter by values less than this parameter. Useful for numbers and dates only.
 *           $lte:
 *             type: string
 *             title: $lte
 *             description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
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
 *   company_name:
 *     oneOf:
 *       - type: string
 *         title: company_name
 *         description: The customer's company name.
 *       - type: array
 *         description: The customer's company name.
 *         items:
 *           type: string
 *           title: company_name
 *           description: The company name's details.
 *       - type: object
 *         description: The customer's company name.
 *         properties:
 *           $and:
 *             type: array
 *             description: The company name's $and.
 *             items:
 *               type: object
 *             title: $and
 *           $or:
 *             type: array
 *             description: The company name's $or.
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
 *           $ne:
 *             type: string
 *             title: $ne
 *             description: Filter by values not equal to this parameter.
 *           $in:
 *             type: array
 *             description: Filter by values in this array.
 *             items:
 *               type: string
 *               title: $in
 *               description: Filter by values in this array.
 *           $nin:
 *             type: array
 *             description: Filter by values not in this array.
 *             items:
 *               type: string
 *               title: $nin
 *               description: Filter by values not in this array.
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
 *           $gt:
 *             type: string
 *             title: $gt
 *             description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *           $gte:
 *             type: string
 *             title: $gte
 *             description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *           $lt:
 *             type: string
 *             title: $lt
 *             description: Filter by values less than this parameter. Useful for numbers and dates only.
 *           $lte:
 *             type: string
 *             title: $lte
 *             description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
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
 *   first_name:
 *     oneOf:
 *       - type: string
 *         title: first_name
 *         description: The customer's first name.
 *       - type: array
 *         description: The customer's first name.
 *         items:
 *           type: string
 *           title: first_name
 *           description: The first name's details.
 *       - type: object
 *         description: The customer's first name.
 *         properties:
 *           $and:
 *             type: array
 *             description: The first name's $and.
 *             items:
 *               type: object
 *             title: $and
 *           $or:
 *             type: array
 *             description: The first name's $or.
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
 *           $ne:
 *             type: string
 *             title: $ne
 *             description: Filter by values not equal to this parameter.
 *           $in:
 *             type: array
 *             description: Filter by values in this array.
 *             items:
 *               type: string
 *               title: $in
 *               description: Filter by values in this array.
 *           $nin:
 *             type: array
 *             description: Filter by values not in this array.
 *             items:
 *               type: string
 *               title: $nin
 *               description: Filter by values not in this array.
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
 *           $gt:
 *             type: string
 *             title: $gt
 *             description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *           $gte:
 *             type: string
 *             title: $gte
 *             description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *           $lt:
 *             type: string
 *             title: $lt
 *             description: Filter by values less than this parameter. Useful for numbers and dates only.
 *           $lte:
 *             type: string
 *             title: $lte
 *             description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
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
 *   last_name:
 *     oneOf:
 *       - type: string
 *         title: last_name
 *         description: The customer's last name.
 *       - type: array
 *         description: The customer's last name.
 *         items:
 *           type: string
 *           title: last_name
 *           description: The last name's details.
 *       - type: object
 *         description: The customer's last name.
 *         properties:
 *           $and:
 *             type: array
 *             description: The last name's $and.
 *             items:
 *               type: object
 *             title: $and
 *           $or:
 *             type: array
 *             description: The last name's $or.
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
 *           $ne:
 *             type: string
 *             title: $ne
 *             description: Filter by values not equal to this parameter.
 *           $in:
 *             type: array
 *             description: Filter by values in this array.
 *             items:
 *               type: string
 *               title: $in
 *               description: Filter by values in this array.
 *           $nin:
 *             type: array
 *             description: Filter by values not in this array.
 *             items:
 *               type: string
 *               title: $nin
 *               description: Filter by values not in this array.
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
 *           $gt:
 *             type: string
 *             title: $gt
 *             description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *           $gte:
 *             type: string
 *             title: $gte
 *             description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *           $lt:
 *             type: string
 *             title: $lt
 *             description: Filter by values less than this parameter. Useful for numbers and dates only.
 *           $lte:
 *             type: string
 *             title: $lte
 *             description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
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
 *   created_by:
 *     oneOf:
 *       - type: string
 *         title: created_by
 *         description: The customer's created by.
 *       - type: array
 *         description: The customer's created by.
 *         items:
 *           type: string
 *           title: created_by
 *           description: The created by's details.
 *       - type: object
 *         description: The customer's created by.
 *         properties:
 *           $and:
 *             type: array
 *             description: The created by's $and.
 *             items:
 *               type: object
 *             title: $and
 *           $or:
 *             type: array
 *             description: The created by's $or.
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
 *           $ne:
 *             type: string
 *             title: $ne
 *             description: Filter by values not equal to this parameter.
 *           $in:
 *             type: array
 *             description: Filter by values in this array.
 *             items:
 *               type: string
 *               title: $in
 *               description: Filter by values in this array.
 *           $nin:
 *             type: array
 *             description: Filter by values not in this array.
 *             items:
 *               type: string
 *               title: $nin
 *               description: Filter by values not in this array.
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
 *           $gt:
 *             type: string
 *             title: $gt
 *             description: Filter by values greater than this parameter. Useful for numbers and dates only.
 *           $gte:
 *             type: string
 *             title: $gte
 *             description: Filter by values greater than or equal to this parameter. Useful for numbers and dates only.
 *           $lt:
 *             type: string
 *             title: $lt
 *             description: Filter by values less than this parameter. Useful for numbers and dates only.
 *           $lte:
 *             type: string
 *             title: $lte
 *             description: Filter by values less than or equal to this parameter. Useful for numbers and dates only.
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
 *   created_at:
 *     type: object
 *     description: The customer's created at.
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
 *     description: The customer's updated at.
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
 *   deleted_at:
 *     type: object
 *     description: The customer's deleted at.
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
 *   $and:
 *     type: array
 *     description: The customer's $and.
 *     items:
 *       type: object
 *     title: $and
 *   $or:
 *     type: array
 *     description: The customer's $or.
 *     items:
 *       type: object
 *     title: $or
 * 
*/

