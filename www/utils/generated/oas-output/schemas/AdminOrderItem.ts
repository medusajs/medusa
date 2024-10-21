/**
 * @schema AdminOrderItem
 * type: object
 * description: The order item's details.
 * x-schemaName: AdminOrderItem
 * required:
 *   - order_id
 *   - item_id
 *   - version
 *   - history
 *   - item
 * properties:
 *   order_id:
 *     type: string
 *     title: order_id
 *     description: The ID of the order this item belongs to.
 *   item_id:
 *     type: string
 *     title: item_id
 *     description: The ID of the associated line item.
 *   version:
 *     type: number
 *     title: version
 *     description: The order item's version.
 *   history:
 *     type: object
 *     description: The order item's history.
 *     required:
 *       - version
 *     properties:
 *       version:
 *         type: object
 *         description: The version changes of the item.
 *         required:
 *           - from
 *           - to
 *         properties:
 *           from:
 *             type: number
 *             title: from
 *             description: The original version.
 *           to:
 *             type: number
 *             title: to
 *             description: The new version.
 *   item:
 *     $ref: "#/components/schemas/AdminOrderLineItem"
 * 
*/

