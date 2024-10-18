/**
 * @schema Return
 * type: object
 * description: The return's details.
 * x-schemaName: Return
 * required:
 *   - id
 *   - status
 *   - order_id
 *   - items
 *   - display_id
 *   - metadata
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The return's ID.
 *   status:
 *     type: string
 *     description: The return's status.
 *     enum:
 *       - canceled
 *       - requested
 *       - received
 *       - partially_received
 *   refund_amount:
 *     oneOf:
 *       - type: string
 *         title: refund_amount
 *         description: The return order's refund amount.
 *       - type: number
 *         title: refund_amount
 *         description: The return order's refund amount.
 *       - type: string
 *         title: refund_amount
 *         description: The return order's refund amount.
 *       - type: number
 *         title: refund_amount
 *         description: The return order's refund amount.
 *     description: The amount refunded by this return.
 *   order_id:
 *     type: string
 *     title: order_id
 *     description: The ID of the associated order.
 *   items:
 *     type: array
 *     description: The return's items.
 *     items:
 *       $ref: "#/components/schemas/OrderReturnItem"
 *   shipping_methods:
 *     type: array
 *     description: The return's shipping methods.
 *     items:
 *       $ref: "#/components/schemas/OrderShippingMethod"
 *   transactions:
 *     type: array
 *     description: The return's transactions.
 *     items:
 *       $ref: "#/components/schemas/OrderTransaction"
 *   metadata:
 *     type: object
 *     description: The return's metadata, can hold custom key-value pairs.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the return was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the return was updated.
 *   canceled_at:
 *     type: string
 *     title: canceled_at
 *     description: The date the return was canceled.
 *     format: date-time
 *   raw_refund_amount:
 *     oneOf:
 *       - type: string
 *         title: raw_refund_amount
 *         description: The return order's raw refund amount.
 *       - type: number
 *         title: raw_refund_amount
 *         description: The return order's raw refund amount.
 *       - type: string
 *         title: raw_refund_amount
 *         description: The return order's raw refund amount.
 *       - type: number
 *         title: raw_refund_amount
 *         description: The return order's raw refund amount.
 *   order:
 *     $ref: "#/components/schemas/Order"
 *   exchange_id:
 *     type: string
 *     title: exchange_id
 *     description: The return order's exchange id.
 *   exchange:
 *     $ref: "#/components/schemas/OrderExchange"
 *   claim_id:
 *     type: string
 *     title: claim_id
 *     description: The return order's claim id.
 *   claim:
 *     $ref: "#/components/schemas/OrderClaim"
 *   display_id:
 *     type: number
 *     title: display_id
 *     description: The return order's display id.
 *   location_id:
 *     type: string
 *     title: location_id
 *     description: The return order's location id.
 *   no_notification:
 *     type: boolean
 *     title: no_notification
 *     description: The return order's no notification.
 *   created_by:
 *     type: string
 *     title: created_by
 *     description: The return order's created by.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The return order's deleted at.
 *   requested_at:
 *     type: string
 *     title: requested_at
 *     description: The return order's requested at.
 *     format: date-time
 *   received_at:
 *     type: string
 *     title: received_at
 *     description: The return order's received at.
 *     format: date-time
 * 
*/

