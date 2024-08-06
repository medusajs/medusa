/**
 * @schema AdminPostClaimItemsReqSchema
 * type: object
 * description: SUMMARY
 * x-schemaName: AdminPostClaimItemsReqSchema
 * properties:
 *   items:
 *     type: array
 *     description: The claim's items.
 *     items:
 *       type: object
 *       description: The item's items.
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
 *         reason:
 *           type: string
 *           enum:
 *             - missing_item
 *             - wrong_item
 *             - production_failure
 *             - other
 *         description:
 *           type: string
 *           title: description
 *           description: The item's description.
 *         internal_note:
 *           type: string
 *           title: internal_note
 *           description: The item's internal note.
 * 
*/

