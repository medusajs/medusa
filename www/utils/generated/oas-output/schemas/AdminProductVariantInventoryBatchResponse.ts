/**
 * @schema AdminProductVariantInventoryBatchResponse
 * type: object
 * description: The created, updated, and deleted associations between variants and inventory items.
 * x-schemaName: AdminProductVariantInventoryBatchResponse
 * required:
 *   - created
 *   - updated
 *   - deleted
 * properties:
 *   created:
 *     oneOf:
 *       - $ref: "#/components/schemas/AdminProductVariantInventoryLink"
 *       - type: array
 *         description: The created associations between product variants and inventory items.
 *         items:
 *           type: object
 *           description: A created association between a product variant and an inventory item.
 *           x-schemaName: AdminProductVariantInventoryLink
 *           required:
 *             - productService
 *             - inventoryService
 *           properties:
 *             productService:
 *               type: object
 *               description: The product variant's details.
 *               required:
 *                 - variant_id
 *               properties:
 *                 variant_id:
 *                   type: string
 *                   title: variant_id
 *                   description: The ID of the product variant.
 *             inventoryService:
 *               type: object
 *               description: The inventory item's details.
 *               required:
 *                 - inventory_item_id
 *               properties:
 *                 inventory_item_id:
 *                   type: string
 *                   title: inventory_item_id
 *                   description: The ID of the inventory item.
 *   updated:
 *     oneOf:
 *       - $ref: "#/components/schemas/AdminProductVariantInventoryLink"
 *       - type: array
 *         description: The updated associations between product variants and inventory items.
 *         items:
 *           type: object
 *           description: An updated association between a product variant and an inventory item.
 *           x-schemaName: AdminProductVariantInventoryLink
 *           required:
 *             - productService
 *             - inventoryService
 *           properties:
 *             productService:
 *               type: object
 *               description: The product variant's details.
 *               required:
 *                 - variant_id
 *               properties:
 *                 variant_id:
 *                   type: string
 *                   title: variant_id
 *                   description: The ID of the product variant.
 *             inventoryService:
 *               type: object
 *               description: The inventory item's details.
 *               required:
 *                 - inventory_item_id
 *               properties:
 *                 inventory_item_id:
 *                   type: string
 *                   title: inventory_item_id
 *                   description: The ID of the inventory item.
 *   deleted:
 *     oneOf:
 *       - $ref: "#/components/schemas/AdminProductVariantInventoryLink"
 *       - type: array
 *         description: The deleted associations between product variants and inventory items.
 *         items:
 *           type: object
 *           description: An deleted association between a product variant and an inventory item.
 *           x-schemaName: AdminProductVariantInventoryLink
 *           required:
 *             - productService
 *             - inventoryService
 *           properties:
 *             productService:
 *               type: object
 *               description: The product variant's details.
 *               required:
 *                 - variant_id
 *               properties:
 *                 variant_id:
 *                   type: string
 *                   title: variant_id
 *                   description: The ID of the product variant.
 *             inventoryService:
 *               type: object
 *               description: The inventory item's details.
 *               required:
 *                 - inventory_item_id
 *               properties:
 *                 inventory_item_id:
 *                   type: string
 *                   title: inventory_item_id
 *                   description: The ID of the inventory item.
 * 
*/

