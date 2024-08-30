/**
 * @schema AdminClaim
 * type: object
 * description: The claim's details.
 * x-schemaName: AdminClaim
 * required:
 *   - order_id
 *   - claim_items
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
 *     description: The claim's order id.
 *   claim_items:
 *     type: array
 *     description: The claim's claim items.
 *     items:
 *       $ref: "#/components/schemas/BaseClaimItem"
 *   additional_items:
 *     type: array
 *     description: The claim's additional items.
 *     items: {}
 *   return:
 *     $ref: "#/components/schemas/Return"
 *   return_id:
 *     type: string
 *     title: return_id
 *     description: The claim's return id.
 *   no_notification:
 *     type: boolean
 *     title: no_notification
 *     description: The claim's no notification.
 *   refund_amount:
 *     type: number
 *     title: refund_amount
 *     description: The claim's refund amount.
 *   currency_code:
 *     type: string
 *     title: currency_code
 *     description: The claim's currency code.
 *   id:
 *     type: string
 *     title: id
 *     description: The claim's ID.
 *   region_id:
 *     type: string
 *     title: region_id
 *     description: The claim's region id.
 *   customer_id:
 *     type: string
 *     title: customer_id
 *     description: The claim's customer id.
 *   sales_channel_id:
 *     type: string
 *     title: sales_channel_id
 *     description: The claim's sales channel id.
 *   email:
 *     type: string
 *     title: email
 *     description: The claim's email.
 *     format: email
 *   display_id:
 *     type: string
 *     title: display_id
 *     description: The claim's display id.
 *   shipping_address:
 *     $ref: "#/components/schemas/BaseOrderAddress"
 *   billing_address:
 *     $ref: "#/components/schemas/BaseOrderAddress"
 *   shipping_methods:
 *     type: array
 *     description: The claim's shipping methods.
 *     items:
 *       $ref: "#/components/schemas/BaseOrderShippingMethod"
 *   payment_collections:
 *     type: array
 *     description: The claim's payment collections.
 *     items:
 *       $ref: "#/components/schemas/BasePaymentCollection"
 *   payment_status:
 *     type: string
 *     description: The claim's payment status.
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
 *     description: The claim's fulfillments.
 *     items:
 *       $ref: "#/components/schemas/BaseOrderFulfillment"
 *   fulfillment_status:
 *     type: string
 *     description: The claim's fulfillment status.
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
 *     description: The claim's transactions.
 *     items:
 *       $ref: "#/components/schemas/BaseOrderTransaction"
 *   summary:
 *     $ref: "#/components/schemas/BaseOrderSummary"
 *   metadata:
 *     type: object
 *     description: The claim's metadata.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The claim's created at.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The claim's updated at.
 *   original_item_total:
 *     type: number
 *     title: original_item_total
 *     description: The claim's original item total.
 *   original_item_subtotal:
 *     type: number
 *     title: original_item_subtotal
 *     description: The claim's original item subtotal.
 *   original_item_tax_total:
 *     type: number
 *     title: original_item_tax_total
 *     description: The claim's original item tax total.
 *   item_total:
 *     type: number
 *     title: item_total
 *     description: The claim's item total.
 *   item_subtotal:
 *     type: number
 *     title: item_subtotal
 *     description: The claim's item subtotal.
 *   item_tax_total:
 *     type: number
 *     title: item_tax_total
 *     description: The claim's item tax total.
 *   original_total:
 *     type: number
 *     title: original_total
 *     description: The claim's original total.
 *   original_subtotal:
 *     type: number
 *     title: original_subtotal
 *     description: The claim's original subtotal.
 *   original_tax_total:
 *     type: number
 *     title: original_tax_total
 *     description: The claim's original tax total.
 *   total:
 *     type: number
 *     title: total
 *     description: The claim's total.
 *   subtotal:
 *     type: number
 *     title: subtotal
 *     description: The claim's subtotal.
 *   tax_total:
 *     type: number
 *     title: tax_total
 *     description: The claim's tax total.
 *   discount_total:
 *     type: number
 *     title: discount_total
 *     description: The claim's discount total.
 *   discount_tax_total:
 *     type: number
 *     title: discount_tax_total
 *     description: The claim's discount tax total.
 *   gift_card_total:
 *     type: number
 *     title: gift_card_total
 *     description: The claim's gift card total.
 *   gift_card_tax_total:
 *     type: number
 *     title: gift_card_tax_total
 *     description: The claim's gift card tax total.
 *   shipping_total:
 *     type: number
 *     title: shipping_total
 *     description: The claim's shipping total.
 *   shipping_subtotal:
 *     type: number
 *     title: shipping_subtotal
 *     description: The claim's shipping subtotal.
 *   shipping_tax_total:
 *     type: number
 *     title: shipping_tax_total
 *     description: The claim's shipping tax total.
 *   original_shipping_total:
 *     type: number
 *     title: original_shipping_total
 *     description: The claim's original shipping total.
 *   original_shipping_subtotal:
 *     type: number
 *     title: original_shipping_subtotal
 *     description: The claim's original shipping subtotal.
 *   original_shipping_tax_total:
 *     type: number
 *     title: original_shipping_tax_total
 *     description: The claim's original shipping tax total.
 * 
*/

