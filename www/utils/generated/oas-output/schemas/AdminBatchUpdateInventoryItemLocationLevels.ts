/**
 * @schema AdminBatchUpdateInventoryItemLocationLevels
 * type: object
 * description: The inventory level's details.
 * properties:
 *   stocked_quantity:
 *     type: number
 *     title: stocked_quantity
 *     description: The inventory level's stocked quantity.
 *   incoming_quantity:
 *     type: number
 *     title: incoming_quantity
 *     description: The inventory level's incoming quantity.
 *   location_id:
 *     type: string
 *     title: location_id
 *     description: The associated stock location's ID.
 *   id:
 *     type: string
 *     title: id
 *     description: The ID of the location level.
 * required:
 *   - location_id
 * x-schemaName: AdminBatchUpdateInventoryItemLocationLevels
 * 
*/

