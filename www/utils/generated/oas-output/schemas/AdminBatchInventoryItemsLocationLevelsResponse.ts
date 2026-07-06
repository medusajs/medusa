/**
 * @schema AdminBatchInventoryItemsLocationLevelsResponse
 * type: object
 * description: The result of managing inventory levels.
 * x-schemaName: AdminBatchInventoryItemsLocationLevelsResponse
 * properties:
 *   created:
 *     type: array
 *     description: The created inventory levels.
 *     items:
 *       $ref: "#/components/schemas/AdminInventoryLevel"
 *   updated:
 *     type: array
 *     description: The updated inventory levels.
 *     items:
 *       $ref: "#/components/schemas/AdminInventoryLevel"
 *   deleted:
 *     type: array
 *     description: The IDs of deleted inventory levels.
 *     items:
 *       type: string
 *       title: deleted
 *       description: The ID of a deleted inventory level.
 * 
*/

