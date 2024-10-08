/**
 * @schema AdminPostClaimItemsReqSchema
 * type: object
 * description: The details of the order items to add to the claim.
 * x-schemaName: AdminPostClaimItemsReqSchema
 * properties:
 *   items:
 *     type: array
 *     description: The item's details.
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
 *           description: The quantity of the order's item to add to the claim.
 *         reason:
 *           type: string
 *           description: The reason the item is claimed.
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
 *           description: A note that's only viewed by admin users.
 * 
*/

