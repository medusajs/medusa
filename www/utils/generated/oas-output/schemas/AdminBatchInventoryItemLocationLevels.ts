/**
 * @schema AdminBatchInventoryItemLocationLevels
 * type: object
 * description: The inventory levels to create, update, or delete.
 * properties:
 *   create:
 *     type: array
 *     description: The inventory levels to create.
 *     items:
 *       $ref: "#/components/schemas/AdminBatchCreateInventoryItemLocationLevels"
 *   update:
 *     type: array
 *     description: The inventory levels to update.
 *     items:
 *       $ref: "#/components/schemas/AdminBatchUpdateInventoryItemLocationLevels"
 *   delete:
 *     type: array
 *     description: The inventory levels to delete.
 *     items:
 *       type: string
 *       title: delete
 *       description: The ID of the inventory level to delete.
 *   force:
 *     type: boolean
 *     title: force
 *     description: Whether to delete specified inventory levels even if they have a non-zero stocked quantity.
 * x-schemaName: AdminBatchInventoryItemLocationLevels
 * 
*/

