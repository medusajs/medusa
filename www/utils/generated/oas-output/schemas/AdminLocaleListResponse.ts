/**
 * @schema AdminLocaleListResponse
 * type: object
 * description: The list of locales with pagination details.
 * x-schemaName: AdminLocaleListResponse
 * required:
 *   - limit
 *   - offset
 *   - count
 *   - locales
 * properties:
 *   limit:
 *     type: number
 *     title: limit
 *     description: The maximum number of locales returned.
 *   offset:
 *     type: number
 *     title: offset
 *     description: The number of locales skipped before retrieving the returned locales.
 *   count:
 *     type: number
 *     title: count
 *     description: The total number of locales matching the query.
 *   estimate_count:
 *     type: number
 *     title: estimate_count
 *     description: The estimated count retrieved from the PostgreSQL query planner, which may be inaccurate.
 *     x-featureFlag: index_engine
 *   locales:
 *     type: array
 *     description: The list of locales.
 *     items:
 *       $ref: "#/components/schemas/AdminLocale"
 * 
*/

