/**
 * @schema StoreReturn
 * type: object
 * description: The return's details.
 * x-schemaName: StoreReturn
 * required:
 *   - id
 *   - order_id
 *   - order_version
 *   - display_id
 *   - items
 *   - received_at
 *   - created_at
 *   - canceled_at
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
 *   order_version:
 *     type: number
 *     title: order_version
 *     description: The version of the order when the return is applied.
 *   display_id:
 *     type: number
 *     title: display_id
 *     description: The return's display ID.
 *   no_notification:
 *     type: boolean
 *     title: no_notification
 *     description: Whether the customer should receive updates about changes in the return.
 *   refund_amount:
 *     type: number
 *     title: refund_amount
 *     description: The return's refunded amount.
 *   items:
 *     type: array
 *     description: The return's items.
 *     items:
 *       $ref: "#/components/schemas/BaseReturnItem"
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

