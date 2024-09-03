/**
 * @schema AdminExchange
 * type: object
 * description: The exchange's details.
 * x-schemaName: AdminExchange
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
 *     description: The exchange's order id.
 *   return_items:
 *     type: array
 *     description: The exchange's return items.
 *     items:
 *       $ref: "#/components/schemas/AdminReturnItem"
 *   additional_items:
 *     type: array
 *     description: The exchange's additional items.
 *     items:
 *       $ref: "#/components/schemas/BaseExchangeItem"
 *   no_notification:
 *     type: boolean
 *     title: no_notification
 *     description: The exchange's no notification.
 *   difference_due:
 *     type: number
 *     title: difference_due
 *     description: The exchange's difference due.
 *   return:
 *     $ref: "#/components/schemas/AdminReturn"
 *   return_id:
 *     type: string
 *     title: return_id
 *     description: The exchange's return id.
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
 *     description: The exchange's region id.
 *   customer_id:
 *     type: string
 *     title: customer_id
 *     description: The exchange's customer id.
 *   sales_channel_id:
 *     type: string
 *     title: sales_channel_id
 *     description: The exchange's sales channel id.
 *   email:
 *     type: string
 *     title: email
 *     description: The exchange's email.
 *     format: email
 *   display_id:
 *     type: number
 *     title: display_id
 *     description: The exchange's display id.
 *   shipping_address:
 *     $ref: "#/components/schemas/BaseOrderAddress"
 *   billing_address:
 *     $ref: "#/components/schemas/BaseOrderAddress"
 *   shipping_methods:
 *     type: array
 *     description: The exchange's shipping methods.
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
 *     description: The exchange's fulfillments.
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
 *     items:
 *       $ref: "#/components/schemas/BaseOrderTransaction"
 *   summary:
 *     $ref: "#/components/schemas/BaseOrderSummary"
 *   metadata:
 *     type: object
 *     description: The exchange's metadata.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The exchange's created at.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The exchange's updated at.
 *   original_item_total:
 *     type: number
 *     title: original_item_total
 *     description: The exchange's original item total.
 *   original_item_subtotal:
 *     type: number
 *     title: original_item_subtotal
 *     description: The exchange's original item subtotal.
 *   original_item_tax_total:
 *     type: number
 *     title: original_item_tax_total
 *     description: The exchange's original item tax total.
 *   item_total:
 *     type: number
 *     title: item_total
 *     description: The exchange's item total.
 *   item_subtotal:
 *     type: number
 *     title: item_subtotal
 *     description: The exchange's item subtotal.
 *   item_tax_total:
 *     type: number
 *     title: item_tax_total
 *     description: The exchange's item tax total.
 *   original_total:
 *     type: number
 *     title: original_total
 *     description: The exchange's original total.
 *   original_subtotal:
 *     type: number
 *     title: original_subtotal
 *     description: The exchange's original subtotal.
 *   original_tax_total:
 *     type: number
 *     title: original_tax_total
 *     description: The exchange's original tax total.
 *   total:
 *     type: number
 *     title: total
 *     description: The exchange's total.
 *   subtotal:
 *     type: number
 *     title: subtotal
 *     description: The exchange's subtotal.
 *   tax_total:
 *     type: number
 *     title: tax_total
 *     description: The exchange's tax total.
 *   discount_total:
 *     type: number
 *     title: discount_total
 *     description: The exchange's discount total.
 *   discount_tax_total:
 *     type: number
 *     title: discount_tax_total
 *     description: The exchange's discount tax total.
 *   gift_card_total:
 *     type: number
 *     title: gift_card_total
 *     description: The exchange's gift card total.
 *   gift_card_tax_total:
 *     type: number
 *     title: gift_card_tax_total
 *     description: The exchange's gift card tax total.
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
 *     description: The exchange's original shipping total.
 *   original_shipping_subtotal:
 *     type: number
 *     title: original_shipping_subtotal
 *     description: The exchange's original shipping subtotal.
 *   original_shipping_tax_total:
 *     type: number
 *     title: original_shipping_tax_total
 *     description: The exchange's original shipping tax total.
 * 
*/

