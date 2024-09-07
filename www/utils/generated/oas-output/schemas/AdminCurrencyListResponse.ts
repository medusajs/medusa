/**
 * @schema AdminCurrencyListResponse
 * type: object
 * description: The paginated list of currencies.
 * x-schemaName: AdminCurrencyListResponse
 * required:
 *   - limit
 *   - offset
 *   - count
 *   - currencies
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
 *   currencies:
 *     type: array
 *     description: The list of currencies.
 *     items:
 *       $ref: "#/components/schemas/AdminCurrency"
 * 
*/

