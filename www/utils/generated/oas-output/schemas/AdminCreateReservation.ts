/**
 * @schema AdminCreateReservation
 * type: object
 * description: The reservation's details.
 * x-schemaName: AdminCreateReservation
 * required:
 *   - location_id
 *   - inventory_item_id
 *   - quantity
 * properties:
 *   line_item_id:
 *     type: string
 *     title: line_item_id
 *     description: The ID of the line item this reservation is created for.
 *   location_id:
 *     type: string
 *     title: location_id
 *     description: The ID of the location the quantity is reserved from.
 *   inventory_item_id:
 *     type: string
 *     title: inventory_item_id
 *     description: The ID of the inventory item associated with the line item's variant.
 *   quantity:
 *     type: number
 *     title: quantity
 *     description: The reserved quantity.
 *   description:
 *     type: string
 *     title: description
 *     description: The reservation's description.
 *   metadata:
 *     type: object
 *     description: The reservation's metadata, used to store custom key-value pairs.
 * 
*/

