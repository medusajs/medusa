/**
 * @schema AdminPostReturnsRequestItemsReqSchema
 * type: object
 * description: The items' details.
 * x-schemaName: AdminPostReturnsRequestItemsReqSchema
 * properties:
 *   items:
 *     type: array
 *     description: The items' details.
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
 *           description: The item's ID.
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
 *           description: The ID of the associated return reason.
 *         metadata:
 *           type: object
 *           description: The item's metadata, can hold custom key-value pairs.
 * 
*/

