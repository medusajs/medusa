/**
 * @schema InventoryLevel
 * type: object
 * description: The inventory level's details
 * x-schemaName: InventoryLevel
 * required:
 *   - id
 *   - inventory_item_id
 *   - location_id
 *   - stocked_quantity
 *   - reserved_quantity
 *   - available_quantity
 *   - incoming_quantity
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The inventory level's ID.
 *   inventory_item_id:
 *     type: string
 *     title: inventory_item_id
 *     description: The ID of the associated inventory item.
 *   location_id:
 *     type: string
 *     title: location_id
 *     description: The ID of the associated location.
 *   stocked_quantity:
 *     type: number
 *     title: stocked_quantity
 *     description: The inventory level's stocked quantity.
 *   reserved_quantity:
 *     type: number
 *     title: reserved_quantity
 *     description: The inventory level's reserved quantity.
 *   available_quantity:
 *     type: number
 *     title: available_quantity
 *     description: The inventory level's available quantity.
 *   incoming_quantity:
 *     type: number
 *     title: incoming_quantity
 *     description: The inventory level's incoming quantity.
 *   metadata:
 *     type: object
 *     description: The inventory level's metadata, can hold custom key-value pairs.
 * 
*/

