/**
 * @schema AdminCollectionListResponse
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminCollectionListResponse
 * required:
 *   - limit
 *   - offset
 *   - count
 *   - collections
 * properties:
 *   limit:
 *     type: number
 *     title: limit
 *     description: The collection's limit.
 *   offset:
 *     type: number
 *     title: offset
 *     description: The collection's offset.
 *   count:
 *     type: number
 *     title: count
 *     description: The collection's count.
 *   collections:
 *     type: array
 *     description: The collection's collections.
 *     items:
 *       $ref: "#/components/schemas/AdminCollection"
 * 
*/

