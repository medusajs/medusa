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
 *           $ref: "#/components/schemas/AdminProductVariantInventoryLink"
 *   updated:
 *     oneOf:
 *       - $ref: "#/components/schemas/AdminProductVariantInventoryLink"
 *       - type: array
 *         description: The updated associations between product variants and inventory items.
 *         items:
 *           $ref: "#/components/schemas/AdminProductVariantInventoryLink"
 *   deleted:
 *     oneOf:
 *       - $ref: "#/components/schemas/AdminProductVariantInventoryLink"
 *       - type: array
 *         description: The deleted associations between product variants and inventory items.
 *         items:
 *           $ref: "#/components/schemas/AdminProductVariantInventoryLink"
 * 
*/

