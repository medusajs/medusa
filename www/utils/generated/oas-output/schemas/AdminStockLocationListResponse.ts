/**
 * @schema AdminStockLocationListResponse
 * type: object
 * description: The paginated list of stock locations.
 * x-schemaName: AdminStockLocationListResponse
 * required:
 *   - limit
 *   - offset
 *   - count
 *   - stock_locations
 * properties:
 *   limit:
 *     type: number
 *     title: limit
 *     description: The maximum number of items returned.
 *   offset:
 *     type: number
 *     title: offset
 *     description: The number of items skipped before retrieving the returned items.
 *   count:
 *     type: number
 *     title: count
 *     description: The total number of items.
 *   stock_locations:
 *     type: array
 *     description: The list of stock locations.
 *     items:
 *       $ref: "#/components/schemas/AdminStockLocation"
 * 
*/

