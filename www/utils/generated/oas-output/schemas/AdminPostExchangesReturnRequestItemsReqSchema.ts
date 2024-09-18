/**
 * @schema AdminPostExchangesReturnRequestItemsReqSchema
 * type: object
 * description: The details of the inbound (return) items.
 * x-schemaName: AdminPostExchangesReturnRequestItemsReqSchema
 * properties:
 *   items:
 *     type: array
 *     description: The details of the inbound (return) items.
 *     items:
 *       type: object
 *       description: An item's details.
 *       required:
 *         - id
 *         - quantity
 *       properties:
 *         id:
 *           type: string
 *           title: id
 *           description: The ID of the order's item.
 *         quantity:
 *           type: number
 *           title: quantity
 *           description: The item's quantity.
 *         description:
 *           type: string
 *           title: description
 *           description: The item's description.
 *         internal_note:
 *           type: string
 *           title: internal_note
 *           description: A note viewed only by admin users.
 *         reason_id:
 *           type: string
 *           title: reason_id
 *           description: The ID of the return reason to associate with the item.
 *         metadata:
 *           type: object
 *           description: The item's metadata, can hold custom key-value pairs.
 * 
*/

