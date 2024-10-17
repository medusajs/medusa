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
 *   - received_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The return's ID.
 *   order_id:
 *     type: string
 *     title: order_id
 *     description: The ID of the order this return is created for.
 *   status:
 *     type: string
 *     title: status
 *     description: The return's status.
 *   exchange_id:
 *     type: string
 *     title: exchange_id
 *     description: The ID of the associated exchange.
 *   location_id:
 *     type: string
 *     title: location_id
 *     description: The ID of the location the items are returned to.
 *   claim_id:
 *     type: string
 *     title: claim_id
 *     description: The ID of the associated claim.
 *   display_id:
 *     type: number
 *     title: display_id
 *     description: The return's display ID.
 *   refund_amount:
 *     type: number
 *     title: refund_amount
 *     description: The return's refunded amount.
 *   items:
 *     type: array
 *     description: The return's items.
 *     items:
 *       $ref: "#/components/schemas/StoreReturnItem"
 *   received_at:
 *     type: string
 *     title: received_at
 *     description: The date the return was received.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the return was created.
 *   canceled_at:
 *     type: string
 *     title: canceled_at
 *     description: The date the return was updated.
 * 
*/

