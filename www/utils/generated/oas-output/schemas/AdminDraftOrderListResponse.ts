/**
 * @schema AdminDraftOrderListResponse
 * type: object
 * description: The list of draft orders with pagination fields.
 * x-schemaName: AdminDraftOrderListResponse
 * required:
 *   - limit
 *   - offset
 *   - count
 *   - draft_orders
 * properties:
 *   limit:
 *     type: number
 *     title: limit
 *     description: The maximum number of items retrieved.
 *   offset:
 *     type: number
 *     title: offset
 *     description: The number of items skipped before retrieving the returned items.
 *   count:
 *     type: number
 *     title: count
 *     description: The total count of items available.
 *   draft_orders:
 *     type: array
 *     description: The list of draft orders.
 *     items:
 *       $ref: "#/components/schemas/AdminDraftOrder"
 *   estimate_count:
 *     type: number
 *     title: estimate_count
 *     description: The estimated count retrieved from the PostgreSQL query planner, which may be inaccurate.
 *     x-featureFlag: index_engine
 *     deprecated: true
 * 
*/

