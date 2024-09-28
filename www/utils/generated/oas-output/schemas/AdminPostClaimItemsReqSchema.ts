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
 *           oneOf:
 *             - type: string
 *               description: The item's reason.
 *               enum:
 *                 - MISSING_ITEM
 *             - type: string
 *               description: The item's reason.
 *               enum:
 *                 - WRONG_ITEM
 *             - type: string
 *               description: The item's reason.
 *               enum:
 *                 - PRODUCTION_FAILURE
 *             - type: string
 *               description: The item's reason.
 *               enum:
 *                 - OTHER
 *           description: The reason the item is claimed.
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

