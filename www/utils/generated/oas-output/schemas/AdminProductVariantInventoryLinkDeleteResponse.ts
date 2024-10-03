/**
 * @schema AdminProductVariantInventoryLinkDeleteResponse
 * type: object
 * description: The details of the deleted associated between a product variant and an inventory item.
 * x-schemaName: AdminProductVariantInventoryLinkDeleteResponse
 * required:
 *   - id
 *   - object
 *   - deleted
 *   - parent
 * properties:
 *   id:
 *     $ref: "#/components/schemas/AdminProductVariantInventoryLink"
 *   object:
 *     type: string
 *     title: object
 *     description: The name of the deleted object.
 *     default: variant-inventory-item-link
 *   deleted:
 *     type: boolean
 *     title: deleted
 *     description: Whether the association was deleted.
 *   parent:
 *     $ref: "#/components/schemas/AdminProductVariant"
 * 
*/

