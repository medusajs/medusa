/**
 * @schema OrderExchange
 * type: object
 * description: The order change's exchange.
 * x-schemaName: OrderExchange
 * required:
 *   - order_id
 *   - return_items
 *   - additional_items
 *   - currency_code
 *   - id
 *   - region_id
 *   - customer_id
 *   - sales_channel_id
 *   - email
 *   - shipping_methods
 *   - payment_status
 *   - fulfillment_status
 *   - summary
 *   - metadata
 *   - created_at
 *   - updated_at
 *   - original_item_total
 *   - original_item_subtotal
 *   - original_item_tax_total
 *   - item_total
 *   - item_subtotal
 *   - item_tax_total
 *   - original_total
 *   - original_subtotal
 *   - original_tax_total
 *   - total
 *   - subtotal
 *   - tax_total
 *   - discount_total
 *   - discount_tax_total
 *   - gift_card_total
 *   - gift_card_tax_total
 *   - shipping_total
 *   - shipping_subtotal
 *   - shipping_tax_total
 *   - original_shipping_total
 *   - original_shipping_subtotal
 *   - original_shipping_tax_total
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
 *     description: the return associated with the exchange.
 *     $ref: "#/components/schemas/AdminReturn"
 *   return_id:
 *     type: string
 *     title: return_id
 *     description: The ID of the associated exchange.
 *   currency_code:
 *     type: string
 *     title: currency_code
 *     description: The exchange's currency code.
 *   id:
 *     type: string
 *     title: id
 *     description: The exchange's ID.
 *   region_id:
 *     type: string
 *     title: region_id
 *     description: The ID of the associated order's region.
 *   customer_id:
 *     type: string
 *     title: customer_id
 *     description: The ID of the customer that placed the order.
 *   sales_channel_id:
 *     type: string
 *     title: sales_channel_id
 *     description: The ID of the sales channel the associated order belongs to.
 *   email:
 *     type: string
 *     title: email
 *     description: The email used when placing the order.
 *     format: email
 *   display_id:
 *     type: number
 *     title: display_id
 *     description: The exchange's display ID.
 *   shipping_address:
 *     description: The shipping address to send new items to.
 *     $ref: "#/components/schemas/BaseOrderAddress"
 *   billing_address:
 *     description: The customer's billing address.
 *     $ref: "#/components/schemas/BaseOrderAddress"
 *   shipping_methods:
 *     type: array
 *     description: The shipping methods used to send the new (outbound) items.
 *     items:
 *       $ref: "#/components/schemas/BaseOrderShippingMethod"
 *   payment_collections:
 *     type: array
 *     description: The exchange's payment collections.
 *     items:
 *       $ref: "#/components/schemas/BasePaymentCollection"
 *   payment_status:
 *     type: string
 *     description: The exchange's payment status.
 *     enum:
 *       - canceled
 *       - not_paid
 *       - awaiting
 *       - authorized
 *       - partially_authorized
 *       - captured
 *       - partially_captured
 *       - partially_refunded
 *       - refunded
 *       - requires_action
 *   fulfillments:
 *     type: array
 *     description: The exchange's fulfillments of new (outbound) items.
 *     items:
 *       $ref: "#/components/schemas/BaseOrderFulfillment"
 *   fulfillment_status:
 *     type: string
 *     description: The exchange's fulfillment status.
 *     enum:
 *       - canceled
 *       - not_fulfilled
 *       - partially_fulfilled
 *       - fulfilled
 *       - partially_shipped
 *       - shipped
 *       - partially_delivered
 *       - delivered
 *   transactions:
 *     type: array
 *     description: The exchange's transactions.
 *     externalDocs:
 *       url: https://docs.medusajs.com/v2/resources/commerce-modules/order/transactions
 *     items:
 *       $ref: "#/components/schemas/BaseOrderTransaction"
 *   summary:
 *     description: The totals summary of the exchange.
 *     $ref: "#/components/schemas/BaseOrderSummary"
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
 *   original_item_total:
 *     type: number
 *     title: original_item_total
 *     description: The total of the original items in the order.
 *   original_item_subtotal:
 *     type: number
 *     title: original_item_subtotal
 *     description: The subtotal of the original items in the order.
 *   original_item_tax_total:
 *     type: number
 *     title: original_item_tax_total
 *     description: The total tax of the original items in the order.
 *   item_total:
 *     type: number
 *     title: item_total
 *     description: The total of the exchange's new items.
 *   item_subtotal:
 *     type: number
 *     title: item_subtotal
 *     description: The subtotal of the exchange's new items.
 *   item_tax_total:
 *     type: number
 *     title: item_tax_total
 *     description: The tax total of the exchange's new items.
 *   original_total:
 *     type: number
 *     title: original_total
 *     description: The total of the order.
 *   original_subtotal:
 *     type: number
 *     title: original_subtotal
 *     description: The subtotal of the order.
 *   original_tax_total:
 *     type: number
 *     title: original_tax_total
 *     description: The tax total of the order.
 *   total:
 *     type: number
 *     title: total
 *     description: The total of the exchange.
 *   subtotal:
 *     type: number
 *     title: subtotal
 *     description: The subtotal of the exchange.
 *   tax_total:
 *     type: number
 *     title: tax_total
 *     description: The tax total of the exchange.
 *   discount_total:
 *     type: number
 *     title: discount_total
 *     description: The discount total of the exchange.
 *   discount_tax_total:
 *     type: number
 *     title: discount_tax_total
 *     description: The total taxes on discount of the exchange.
 *   gift_card_total:
 *     type: number
 *     title: gift_card_total
 *     description: The gift cards total of the exchange.
 *   gift_card_tax_total:
 *     type: number
 *     title: gift_card_tax_total
 *     description: The total taxes on the gift card of the exchange.
 *   shipping_total:
 *     type: number
 *     title: shipping_total
 *     description: The exchange's shipping total.
 *   shipping_subtotal:
 *     type: number
 *     title: shipping_subtotal
 *     description: The exchange's shipping subtotal.
 *   shipping_tax_total:
 *     type: number
 *     title: shipping_tax_total
 *     description: The exchange's shipping tax total.
 *   original_shipping_total:
 *     type: number
 *     title: original_shipping_total
 *     description: The order's shipping total.
 *   original_shipping_subtotal:
 *     type: number
 *     title: original_shipping_subtotal
 *     description: The order's shipping subtotal.
 *   original_shipping_tax_total:
 *     type: number
 *     title: original_shipping_tax_total
 *     description: The order's shipping tax total.
 * 
*/

