/**
 * @schema StoreProductTypeListResponse
 * type: object
 * description: The paginated list of product types.
 * x-schemaName: StoreProductTypeListResponse
 * required:
 *   - limit
 *   - offset
 *   - count
 *   - product_types
 * properties:
 *   limit:
 *     type: number
 *     title: limit
 *     description: The maximum number of items returned.
 *   offset:
 *     type: number
 *     title: offset
 *     description: The number of items to skip before retrieving the returned items.
 *   count:
 *     type: number
 *     title: count
 *     description: The total number of items available.
 *   product_types:
 *     type: array
 *     description: The list of product types.
 *     items:
 *       $ref: "#/components/schemas/StoreProductType"
 *   estimate_count:
 *     type: number
 *     title: estimate_count
 *     description: The estimated count retrieved from the PostgreSQL query planner, which may be inaccurate.
 *     x-featureFlag: index_engine
 *     deprecated: true
 * 
*/

