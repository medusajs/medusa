/**
 * @schema AdminPriceListPriceListResponse
 * type: object
 * description: The list of prices associated with a price list.
 * x-schemaName: AdminPriceListPriceListResponse
 * required:
 *   - limit
 *   - offset
 *   - count
 *   - prices
 * properties:
 *   limit:
 *     type: number
 *     title: limit
 *     description: The maximum number of prices to return.
 *   offset:
 *     type: number
 *     title: offset
 *     description: The number of items skipped before retrieving the prices.
 *   count:
 *     type: number
 *     title: count
 *     description: The maximum number of prices available.
 *   estimate_count:
 *     type: number
 *     title: estimate_count
 *     description: The estimated count retrieved from the PostgreSQL query planner, which may be inaccurate.
 *     x-featureFlag: index_engine
 *   prices:
 *     type: array
 *     description: The list of prices associated with the price list.
 *     items:
 *       $ref: "#/components/schemas/AdminPrice"
 * 
*/

