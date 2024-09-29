/**
 * @schema AdminProductVariantInventoryLink
 * type: object
 * description: The details of an association between a product variant and an inventory item.
 * x-schemaName: AdminProductVariantInventoryLink
 * required:
 *   - Product
 *   - Inventory
 * properties:
 *   Product:
 *     type: object
 *     description: The id's product.
 *     required:
 *       - variant_id
 *     properties:
 *       variant_id:
 *         type: string
 *         title: variant_id
 *         description: The product's variant id.
 *   Inventory:
 *     type: object
 *     description: The id's inventory.
 *     required:
 *       - inventory_item_id
 *     properties:
 *       inventory_item_id:
 *         type: string
 *         title: inventory_item_id
 *         description: The inventory's inventory item id.
 * 
*/

