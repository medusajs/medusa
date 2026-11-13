/**
 * @schema AdminTransactionsResponse
 * type: object
 * description: The paginated list of transactions.
 * x-schemaName: AdminTransactionsResponse
 * required:
 *   - limit
 *   - offset
 *   - count
 *   - transactions
 * properties:
 *   limit:
 *     type: number
 *     title: limit
 *     description: The maximum number of transactions to return.
 *   offset:
 *     type: number
 *     title: offset
 *     description: The number of transactions to skip before retrieving the results.
 *   count:
 *     type: number
 *     title: count
 *     description: The total number of transactions available.
 *   transactions:
 *     type: array
 *     description: The list of transactions.
 *     items:
 *       $ref: "#/components/schemas/AdminTransaction"
 *   estimate_count:
 *     type: number
 *     title: estimate_count
 *     description: The store credit account's estimate count.
 *     x-featureFlag: index_engine
 *     deprecated: true
 * 
*/

