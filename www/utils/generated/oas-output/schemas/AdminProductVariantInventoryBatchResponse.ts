/**
 * @schema AdminProductVariantInventoryBatchResponse
 * type: object
 * description: SUMMARY
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
 *         description: The product's created.
 *         items:
 *           type: object
 *           description: The created's details.
 *           x-schemaName: AdminProductVariantInventoryLink
 *           required:
 *             - productService
 *             - inventoryService
 *           properties:
 *             productService:
 *               type: object
 *               description: The created's productservice.
 *               required:
 *                 - variant_id
 *               properties:
 *                 variant_id:
 *                   type: string
 *                   title: variant_id
 *                   description: The productservice's variant id.
 *             inventoryService:
 *               type: object
 *               description: The created's inventoryservice.
 *               required:
 *                 - inventory_item_id
 *               properties:
 *                 inventory_item_id:
 *                   type: string
 *                   title: inventory_item_id
 *                   description: The inventoryservice's inventory item id.
 *   updated:
 *     oneOf:
 *       - $ref: "#/components/schemas/AdminProductVariantInventoryLink"
 *       - type: array
 *         description: The product's updated.
 *         items:
 *           type: object
 *           description: The updated's details.
 *           x-schemaName: AdminProductVariantInventoryLink
 *           required:
 *             - productService
 *             - inventoryService
 *           properties:
 *             productService:
 *               type: object
 *               description: The updated's productservice.
 *               required:
 *                 - variant_id
 *               properties:
 *                 variant_id:
 *                   type: string
 *                   title: variant_id
 *                   description: The productservice's variant id.
 *             inventoryService:
 *               type: object
 *               description: The updated's inventoryservice.
 *               required:
 *                 - inventory_item_id
 *               properties:
 *                 inventory_item_id:
 *                   type: string
 *                   title: inventory_item_id
 *                   description: The inventoryservice's inventory item id.
 *   deleted:
 *     oneOf:
 *       - $ref: "#/components/schemas/AdminProductVariantInventoryLink"
 *       - type: array
 *         description: The product's deleted.
 *         items:
 *           type: object
 *           description: The deleted's details.
 *           x-schemaName: AdminProductVariantInventoryLink
 *           required:
 *             - productService
 *             - inventoryService
 *           properties:
 *             productService:
 *               type: object
 *               description: The deleted's productservice.
 *               required:
 *                 - variant_id
 *               properties:
 *                 variant_id:
 *                   type: string
 *                   title: variant_id
 *                   description: The productservice's variant id.
 *             inventoryService:
 *               type: object
 *               description: The deleted's inventoryservice.
 *               required:
 *                 - inventory_item_id
 *               properties:
 *                 inventory_item_id:
 *                   type: string
 *                   title: inventory_item_id
 *                   description: The inventoryservice's inventory item id.
 * 
*/

