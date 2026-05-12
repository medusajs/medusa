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
 *         - variant_id
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
 *         metadata:
 *           type: object
 *           description: Key-value pairs of custom data.
 *         variant_id:
 *           type: string
 *           title: variant_id
 *           description: The ID of the product variant to send to the customer.
 *         unit_price:
 *           type: number
 *           title: unit_price
 *           description: The item's unit price.
 * 
*/

