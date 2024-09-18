/**
 * @schema AdminPriceListListResponse
 * type: object
 * description: The paginated list of price lists.
 * x-schemaName: AdminPriceListListResponse
 * required:
 *   - limit
 *   - offset
 *   - count
 *   - price_lists
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
 *   price_lists:
 *     type: array
 *     description: The list of price lists.
 *     items:
 *       $ref: "#/components/schemas/AdminPriceList"
 * 
*/

