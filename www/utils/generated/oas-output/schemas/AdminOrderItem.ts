/**
 * @schema AdminOrderItem
 * type: object
 * description: The order item's order items.
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
 *     description: The order item's order id.
 *   item_id:
 *     type: string
 *     title: item_id
 *     description: The order item's item id.
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
 *         description: The history's version.
 *         required:
 *           - from
 *           - to
 *         properties:
 *           from:
 *             type: number
 *             title: from
 *             description: The version's from.
 *           to:
 *             type: number
 *             title: to
 *             description: The version's to.
 *   item:
 *     $ref: "#/components/schemas/AdminOrderLineItem"
 * 
*/

