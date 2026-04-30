/**
 * @schema AdminBatchCreateVariantInventoryItem
 * type: object
 * description: The associations to create between a product variant and an inventory item.
 * required:
 *   - inventory_item_id
 *   - required_quantity
 *   - variant_id
 * properties:
 *   required_quantity:
 *     type: number
 *     title: required_quantity
 *     description: The number of units a single quantity is equivalent to. For example, if a customer orders one quantity of the variant, Medusa checks the availability of the quantity multiplied by the
 *       value set for `required_quantity`. When the customer orders the quantity, Medusa reserves the ordered quantity multiplied by the value set for `required_quantity`.
 *   inventory_item_id:
 *     type: string
 *     title: inventory_item_id
 *     description: The ID of the inventory item to associate the variant with.
 *   variant_id:
 *     type: string
 *     title: variant_id
 *     description: The ID of the variant.
 * x-schemaName: AdminBatchCreateVariantInventoryItem
 * 
*/

