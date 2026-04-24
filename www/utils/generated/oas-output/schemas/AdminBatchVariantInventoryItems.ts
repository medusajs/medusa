/**
 * @schema AdminBatchVariantInventoryItems
 * type: object
 * description: The product variant inventories to manage.
 * properties:
 *   create:
 *     type: array
 *     description: The associations to create between product variants and inventory items.
 *     items:
 *       $ref: "#/components/schemas/AdminBatchCreateVariantInventoryItem"
 *   update:
 *     type: array
 *     description: The product variants to update their association with inventory items.
 *     items:
 *       $ref: "#/components/schemas/AdminBatchUpdateVariantInventoryItem"
 *   delete:
 *     type: array
 *     description: The product variants to delete their association with inventory items.
 *     items:
 *       $ref: "#/components/schemas/AdminBatchDeleteVariantInventoryItem"
 * x-schemaName: AdminBatchVariantInventoryItems
 * 
*/

