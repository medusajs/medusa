/**
 * @schema OrderItem
 * type: object
 * description: The order item's detail.
 * x-schemaName: OrderItem
 * required:
 *   - id
 *   - item_id
 *   - item
 *   - quantity
 *   - fulfilled_quantity
 *   - delivered_quantity
 *   - shipped_quantity
 *   - return_requested_quantity
 *   - return_received_quantity
 *   - return_dismissed_quantity
 *   - written_off_quantity
 *   - metadata
 *   - created_at
 *   - updated_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The item's ID.
 *   item_id:
 *     type: string
 *     title: item_id
 *     description: The ID of the associated line item.
 *   item:
 *     $ref: "#/components/schemas/OrderLineItem"
 *   quantity:
 *     type: number
 *     title: quantity
 *     description: The item's quantity.
 *   fulfilled_quantity:
 *     type: number
 *     title: fulfilled_quantity
 *     description: The item's fulfilled quantity.
 *   delivered_quantity:
 *     type: number
 *     title: delivered_quantity
 *     description: The item's delivered quantity.
 *   shipped_quantity:
 *     type: number
 *     title: shipped_quantity
 *     description: The item's shipped quantity.
 *   return_requested_quantity:
 *     type: number
 *     title: return_requested_quantity
 *     description: The item's quantity that's requested to be returned.
 *   return_received_quantity:
 *     type: number
 *     title: return_received_quantity
 *     description: The item's quantity that's received through a return.
 *   return_dismissed_quantity:
 *     type: number
 *     title: return_dismissed_quantity
 *     description: The item's quantity that's returned but dismissed because it's damaged.
 *   written_off_quantity:
 *     type: number
 *     title: written_off_quantity
 *     description: The item's quantity that's removed due to an order change.
 *   metadata:
 *     type: object
 *     description: The item's metadata, can hold custom key-value pairs.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the item was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the item was updated.
 * 
*/

