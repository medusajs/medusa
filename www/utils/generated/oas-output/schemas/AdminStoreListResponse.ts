/**
 * @schema AdminStoreListResponse
 * type: object
 * description: The paginated list of stores.
 * x-schemaName: AdminStoreListResponse
 * required:
 *   - limit
 *   - offset
 *   - count
 *   - stores
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
 *   stores:
 *     type: array
 *     description: The list of stores.
 *     items:
 *       $ref: "#/components/schemas/AdminStore"
 * 
*/

