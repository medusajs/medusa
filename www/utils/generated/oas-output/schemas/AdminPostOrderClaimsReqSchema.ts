/**
 * @schema AdminPostOrderClaimsReqSchema
 * type: object
 * description: The claim's details.
 * x-schemaName: AdminPostOrderClaimsReqSchema
 * required:
 *   - type
 *   - order_id
 * properties:
 *   type:
 *     type: string
 *     description: The claim's type.
 *     enum:
 *       - refund
 *       - replace
 *   order_id:
 *     type: string
 *     title: order_id
 *     description: The ID of the order the claim is created for.
 *   description:
 *     type: string
 *     title: description
 *     description: The claim's description.
 *   internal_note:
 *     type: string
 *     title: internal_note
 *     description: A note viewed only by admin users.
 *   reason_id:
 *     type: string
 *     title: reason_id
 *     description: The ID of the associated return reason.
 *   metadata:
 *     type: object
 *     description: The claim's metadata, can hold custom key-value pairs.
 * 
*/

