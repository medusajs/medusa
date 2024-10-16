/**
 * @schema OrderClaim
 * type: object
 * description: The order change's claim.
 * x-schemaName: OrderClaim
 * required:
 *   - id
 *   - type
 *   - order_id
 *   - order_version
 *   - display_id
 *   - claim_items
 *   - additional_items
 *   - metadata
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The claim's ID.
 *   order_id:
 *     type: string
 *     title: order_id
 *     description: The ID of the order associated with the claim.
 *   claim_items:
 *     type: array
 *     description: The order items targetted by the claim.
 *     items:
 *       $ref: "#/components/schemas/BaseClaimItem"
 *   additional_items:
 *     type: array
 *     description: The outbound or new items of the claim.
 *     items:
 *       $ref: "#/components/schemas/BaseClaimItem"
 *   return:
 *     $ref: "#/components/schemas/Return"
 *   return_id:
 *     type: string
 *     title: return_id
 *     description: The ID of the associated return.
 *   no_notification:
 *     type: boolean
 *     title: no_notification
 *     description: Whether the customer should be notified about changes in the claim.
 *   refund_amount:
 *     oneOf:
 *       - type: string
 *         title: refund_amount
 *         description: The claim's refund amount.
 *       - type: number
 *         title: refund_amount
 *         description: The claim's refund amount.
 *       - type: string
 *         title: refund_amount
 *         description: The claim's refund amount.
 *       - type: number
 *         title: refund_amount
 *         description: The claim's refund amount.
 *     description: The amount to be refunded.
 *   display_id:
 *     type: number
 *     title: display_id
 *     description: The claim's display ID.
 *   shipping_methods:
 *     type: array
 *     description: The claim's shipping methods.
 *     items:
 *       $ref: "#/components/schemas/OrderShippingMethod"
 *   transactions:
 *     type: array
 *     description: The claim's transactions.
 *     externalDocs:
 *       url: https://docs.medusajs.com/v2/resources/commerce-modules/order/transactions
 *       description: Learn more about transactions of orders and associated models.
 *     items:
 *       $ref: "#/components/schemas/OrderTransaction"
 *   metadata:
 *     type: object
 *     description: The claim's metadata, used to store custom key-value pairs.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The claim's creation date.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The claim's update date.
 *   type:
 *     type: string
 *     description: The claim's type.
 *     enum:
 *       - replace
 *       - refund
 *   order:
 *     $ref: "#/components/schemas/Order"
 *   order_version:
 *     type: number
 *     title: order_version
 *     description: The claim's order version.
 *   raw_refund_amount:
 *     oneOf:
 *       - type: string
 *         title: raw_refund_amount
 *         description: The claim's raw refund amount.
 *       - type: number
 *         title: raw_refund_amount
 *         description: The claim's raw refund amount.
 *       - type: string
 *         title: raw_refund_amount
 *         description: The claim's raw refund amount.
 *       - type: number
 *         title: raw_refund_amount
 *         description: The claim's raw refund amount.
 *   created_by:
 *     type: string
 *     title: created_by
 *     description: The ID of the user that created the claim.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The date the claim was deleted.
 *   canceled_at:
 *     type: string
 *     title: canceled_at
 *     description: The date the claim was canceled.
 *     format: date-time
 * 
*/

