/**
 * @schema AdminReturnItem
 * type: object
 * description: The return item's details.
 * x-schemaName: AdminReturnItem
 * required:
 *   - id
 *   - quantity
 *   - received_quantity
 *   - damaged_quantity
 *   - item_id
 *   - return_id
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The return item's ID.
 *   quantity:
 *     type: number
 *     title: quantity
 *     description: The return item's quantity.
 *   received_quantity:
 *     type: number
 *     title: received_quantity
 *     description: The received quantity of the item. This quantity is added to the stocked inventory quantity of the item.
 *   damaged_quantity:
 *     type: number
 *     title: damaged_quantity
 *     description: The received damaged quantity of the item, which isn't added to the stocked inventory quantity of the item.
 *   reason_id:
 *     type: string
 *     title: reason_id
 *     description: The ID of the return reason associated with the item.
 *   note:
 *     type: string
 *     title: note
 *     description: A note about why the item was returned.
 *   item_id:
 *     type: string
 *     title: item_id
 *     description: The ID of the associated order item.
 *   return_id:
 *     type: string
 *     title: return_id
 *     description: The ID of the return this return item belongs to.
 *   metadata:
 *     type: object
 *     description: The return item's metadata, can hold custom key-value pairs.
 * 
*/

