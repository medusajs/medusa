/**
 * @schema AdminPostOrderEditsAddItemsReqSchema
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminPostOrderEditsAddItemsReqSchema
 * properties:
 *   items:
 *     type: array
 *     description: The order edit's items.
 *     items:
 *       type: object
 *       description: The item's items.
 *       required:
 *         - variant_id
 *         - quantity
 *       properties:
 *         variant_id:
 *           type: string
 *           title: variant_id
 *           description: The item's variant id.
 *         quantity:
 *           type: number
 *           title: quantity
 *           description: The item's quantity.
 *         unit_price:
 *           type: number
 *           title: unit_price
 *           description: The item's unit price.
 *         internal_note:
 *           type: string
 *           title: internal_note
 *           description: The item's internal note.
 *         allow_backorder:
 *           type: boolean
 *           title: allow_backorder
 *           description: The item's allow backorder.
 *         metadata:
 *           type: object
 *           description: The item's metadata.
 * 
*/

