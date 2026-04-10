/**
 * @schema StoreReturn
 * type: object
 * description: The return's details.
 * x-schemaName: StoreReturn
 * required:
 *   - items
 *   - id
 *   - display_id
 *   - created_at
 *   - order_id
 *   - canceled_at
 *   - created_by
 *   - received_at
 * properties:
 *   items:
 *     type: array
 *     description: The return's items.
 *     items:
 *       $ref: "#/components/schemas/StoreReturnItem"
 *   status:
 *     type: string
 *     description: The return's status.
 *     enum:
 *       - received
 *       - canceled
 *       - requested
 *       - open
 *       - partially_received
 *   id:
 *     type: string
 *     title: id
 *     description: The return's ID.
 *   display_id:
 *     type: number
 *     title: display_id
 *     description: The return's display ID.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the return was created.
 *   order_id:
 *     type: string
 *     title: order_id
 *     description: The ID of the order this return belongs to.
 *   location_id:
 *     type: string
 *     title: location_id
 *     description: The ID of the location the return items are being returned to.
 *   canceled_at:
 *     type: string
 *     title: canceled_at
 *     description: The date the return was canceled.
 *   exchange_id:
 *     type: string
 *     title: exchange_id
 *     description: The ID of the associated exchange.
 *   claim_id:
 *     type: string
 *     title: claim_id
 *     description: The ID of the associated claim.
 *   refund_amount:
 *     type: number
 *     title: refund_amount
 *     description: The amount to be refunded.
 *   received_at:
 *     type: string
 *     title: received_at
 *     description: The date the return items were received.
 *   created_by:
 *     type: string
 *     title: created_by
 *     description: The ID of the user that created the return.
 * 
*/

