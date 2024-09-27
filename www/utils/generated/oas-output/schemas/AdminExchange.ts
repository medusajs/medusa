/**
 * @schema AdminExchange
 * type: object
 * description: The exchange's details.
 * x-schemaName: AdminExchange
 * required:
 *   - id
 *   - order_id
 *   - created_at
 *   - updated_at
 *   - canceled_at
 *   - deleted_at
 *   - additional_items
 *   - return_items
 * properties:
 *   order_id:
 *     type: string
 *     title: order_id
 *     description: The ID of the order the exchange is created for.
 *   return_items:
 *     type: array
 *     description: The items returned (inbound) by the exchange.
 *     items:
 *       $ref: "#/components/schemas/AdminReturnItem"
 *   additional_items:
 *     type: array
 *     description: The new items (outbound) sent by the exchange.
 *     items:
 *       $ref: "#/components/schemas/BaseExchangeItem"
 *   no_notification:
 *     type: boolean
 *     title: no_notification
 *     description: Whether to send the customer notifications when the exchange is updated.
 *   difference_due:
 *     type: number
 *     title: difference_due
 *     description: The amount to be exchanged or refunded. If the amount is negative, it must be refunded. If positive, additional payment is required from the customer.
 *   return:
 *     $ref: "#/components/schemas/AdminReturn"
 *   return_id:
 *     type: string
 *     title: return_id
 *     description: The ID of the associated exchange.
 *   id:
 *     type: string
 *     title: id
 *     description: The exchange's ID.
 *   display_id:
 *     type: string
 *     title: display_id
 *     description: The exchange's display ID.
 *   shipping_methods:
 *     type: array
 *     description: The shipping methods used to send the new (outbound) items.
 *     items:
 *       $ref: "#/components/schemas/BaseOrderShippingMethod"
 *   transactions:
 *     type: array
 *     description: The exchange's transactions.
 *     externalDocs:
 *       url: https://docs.medusajs.com/v2/resources/commerce-modules/order/transactions
 *     items:
 *       $ref: "#/components/schemas/BaseOrderTransaction"
 *   metadata:
 *     type: object
 *     description: The exchange's metadata, can hold custom key-value pairs.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date that the exchange was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date that the exchange was updated.
 *   order_version:
 *     type: string
 *     title: order_version
 *     description: The exchange's order version.
 *   created_by:
 *     type: string
 *     title: created_by
 *     description: The exchange's created by.
 *   canceled_at:
 *     type: string
 *     title: canceled_at
 *     description: The exchange's canceled at.
 *     format: date-time
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The exchange's deleted at.
 *   order:
 *     type: string
 *     title: order
 *     description: The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
 *   allow_backorder:
 *     type: boolean
 *     title: allow_backorder
 *     description: The exchange's allow backorder.
 * 
*/

