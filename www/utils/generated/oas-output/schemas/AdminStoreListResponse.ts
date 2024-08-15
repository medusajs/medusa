/**
 * @schema AdminStoreListResponse
 * type: object
 * description: SUMMARY
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
 *     description: The store's limit.
 *   offset:
 *     type: number
 *     title: offset
 *     description: The store's offset.
 *   count:
 *     type: number
 *     title: count
 *     description: The store's count.
 *   stores:
 *     type: array
 *     description: The store's stores.
 *     items:
 *       $ref: "#/components/schemas/AdminStore"
 * 
*/

