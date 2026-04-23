/**
 * @schema AdminAddClaimOutboundItems
 * type: object
 * description: The details of the outbound items to add to the claim.
 * x-schemaName: AdminAddClaimOutboundItems
 * properties:
 *   items:
 *     type: array
 *     description: The outbound item's details.
 *     items:
 *       type: object
 *       description: An item's details.
 *       required:
 *         - id
 *         - quantity
 *       properties:
 *         quantity:
 *           type: number
 *           title: quantity
 *           description: The quantity to send to the customer.
 *         internal_note:
 *           type: string
 *           title: internal_note
 *           description: A note viewed only by admin users.
 *         id:
 *           type: string
 *           title: id
 *           description: The item's ID.
 *         reason:
 *           type: string
 *           description: The item's reason.
 *           enum:
 *             - missing_item
 *             - wrong_item
 *             - production_failure
 *             - other
 *         description:
 *           type: string
 *           title: description
 *           description: The item's description.
 *         metadata:
 *           type: object
 *           description: Key-value pairs of custom data.
 * 
*/

