/**
 * @schema BaseClaim
 * type: object
 * description: The claim's details.
 * x-schemaName: BaseClaim
 * required:
 *   - id
 *   - type
 *   - order_id
 *   - display_id
 *   - order_version
 *   - created_at
 *   - updated_at
 *   - canceled_at
 *   - additional_items
 *   - claim_items
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The claim's ID.
 *   type:
 *     type: string
 *     description: The claim's type. If `refund`, the customer is refunded for the damaged item. If `replace`, new items are sent to the customer.
 *     enum:
 *       - refund
 *       - replace
 *   order_id:
 *     type: string
 *     title: order_id
 *     description: The ID of the order the claim is created for.
 *   return_id:
 *     type: string
 *     title: return_id
 *     description: The ID of the returned used to return the items from the customer.
 *   display_id:
 *     type: string
 *     title: display_id
 *     description: The claim's display ID.
 *   order_version:
 *     type: string
 *     title: order_version
 *     description: The version of the order when the claim is applied.
 *   refund_amount:
 *     type: number
 *     title: refund_amount
 *     description: The amount to be refunded.
 *   created_by:
 *     type: string
 *     title: created_by
 *     description: The ID of the user that created the claim.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the claim was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the claim was updated.
 *   canceled_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the claim was canceled.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The date the claim was deleted.
 *   additional_items:
 *     type: array
 *     description: The items sent to the customer if the claim's type is `replace`.
 *     items:
 *       $ref: "#/components/schemas/BaseClaimItem"
 *   claim_items:
 *     type: array
 *     description: The claim items from the original order.
 *     items:
 *       $ref: "#/components/schemas/BaseClaimItem"
 *   no_notification:
 *     type: boolean
 *     title: no_notification
 *     description: Whether to send the customer notifications on the claim's updates.
 *   order:
 *     $ref: "#/components/schemas/BaseOrder"
 *   return:
 *     $ref: "#/components/schemas/BaseReturn"
 *   shipping_methods:
 *     type: array
 *     description: The claim's shipping methods, used to send the new items.
 *     items:
 *       $ref: "#/components/schemas/BaseOrderShippingMethod"
 *   transactions:
 *     type: array
 *     description: The claim's transactions, such as the refunds made.
 *     items:
 *       $ref: "#/components/schemas/BaseOrderTransaction"
 *   metadata:
 *     type: object
 *     description: The claim's metadata, can hold custom key-value pairs.
 * 
*/

