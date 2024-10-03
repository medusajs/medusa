/**
 * @schema AdminReservation
 * type: object
 * description: The reservation's details.
 * x-schemaName: AdminReservation
 * required:
 *   - id
 *   - line_item_id
 *   - location_id
 *   - quantity
 *   - external_id
 *   - description
 *   - inventory_item_id
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The reservation's ID.
 *   line_item_id:
 *     type: string
 *     title: line_item_id
 *     description: The ID of the line item this reservation is for.
 *   location_id:
 *     type: string
 *     title: location_id
 *     description: The ID of the location the quantity is reserved from.
 *   quantity:
 *     type: number
 *     title: quantity
 *     description: The reservation's quantity.
 *   external_id:
 *     type: string
 *     title: external_id
 *     description: An ID in an external system
 *   description:
 *     type: string
 *     title: description
 *     description: The reservation's description.
 *   inventory_item_id:
 *     type: string
 *     title: inventory_item_id
 *     description: The ID of the inventory item this reservation is associated with.
 *   inventory_item:
 *     $ref: "#/components/schemas/AdminInventoryItem"
 *   metadata:
 *     type: object
 *     description: The reservation's metadata, can hold custom key-value pairs.
 *   created_by:
 *     type: string
 *     title: created_by
 *     description: The ID of the user that created this reservation.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The date this reservation was deleted.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date this reservation was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date this reservation was updated.
 * 
*/

