/**
 * @schema AdminTaxRateListParams
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminTaxRateListParams
 * properties:
 *   q:
 *     type: string
 *     title: q
 *     description: The tax rate's q.
 *   tax_region_id:
 *     oneOf:
 *       - type: string
 *         title: tax_region_id
 *         description: The tax rate's tax region id.
 *       - type: array
 *         description: The tax rate's tax region id.
 *         items:
 *           type: string
 *           title: tax_region_id
 *           description: The tax region id's details.
 *       - type: object
 *         description: The tax rate's tax region id.
 *         properties:
 *           $and:
 *             type: array
 *             description: The tax region id's $and.
 *             items:
 *               type: object
 *             title: $and
 *           $or:
 *             type: array
 *             description: The tax region id's $or.
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
 *   is_default:
 *     type: string
 *     title: is_default
 *     description: The tax rate's is default.
 *   service_zone_id:
 *     type: string
 *     title: service_zone_id
 *     description: The tax rate's service zone id.
 *   shipping_profile_id:
 *     type: string
 *     title: shipping_profile_id
 *     description: The tax rate's shipping profile id.
 *   provider_id:
 *     type: string
 *     title: provider_id
 *     description: The tax rate's provider id.
 *   shipping_option_type_id:
 *     type: string
 *     title: shipping_option_type_id
 *     description: The tax rate's shipping option type id.
 *   created_at:
 *     type: object
 *     description: The tax rate's created at.
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
 *     description: The tax rate's updated at.
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
 *     description: The tax rate's deleted at.
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
 *   limit:
 *     type: number
 *     title: limit
 *     description: The tax rate's limit.
 *   offset:
 *     type: number
 *     title: offset
 *     description: The tax rate's offset.
 *   order:
 *     type: string
 *     title: order
 *     description: The tax rate's order.
 *   fields:
 *     type: string
 *     title: fields
 *     description: The tax rate's fields.
 *   $and:
 *     type: array
 *     description: The tax rate's $and.
 *     items:
 *       type: object
 *     title: $and
 *   $or:
 *     type: array
 *     description: The tax rate's $or.
 *     items:
 *       type: object
 *     title: $or
 * 
*/

