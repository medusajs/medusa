/**
 * @schema StoreOrder
 * type: object
 * description: The order's details.
 * x-schemaName: StoreOrder
 * required:
 *   - items
 *   - shipping_methods
 *   - currency_code
 *   - id
 *   - region_id
 *   - customer_id
 *   - sales_channel_id
 *   - email
 *   - payment_status
 *   - fulfillment_status
 *   - summary
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
 *   id:
 *     type: string
 *     title: id
 *     description: The order's ID.
 *   region_id:
 *     type: string
 *     title: region_id
 *     description: The ID of the associated region.
 *   customer_id:
 *     type: string
 *     title: customer_id
 *     description: The ID of the customer that placed the order.
 *   sales_channel_id:
 *     type: string
 *     title: sales_channel_id
 *     description: The ID of the sales channel the order was placed in.
 *   email:
 *     type: string
 *     title: email
 *     description: The email of the customer that placed the order.
 *     format: email
 *   currency_code:
 *     type: string
 *     title: currency_code
 *     description: The order's currency code.
 *     example: usd
 *   display_id:
 *     type: number
 *     title: display_id
 *     description: The order's display ID.
 *   shipping_address:
 *     $ref: "#/components/schemas/StoreOrderAddress"
 *   billing_address:
 *     $ref: "#/components/schemas/StoreOrderAddress"
 *   items:
 *     type: array
 *     description: The order's items.
 *     items:
 *       $ref: "#/components/schemas/StoreOrderLineItem"
 *   shipping_methods:
 *     type: array
 *     description: The order's shipping methods.
 *     items:
 *       $ref: "#/components/schemas/StoreOrderShippingMethod"
 *   payment_collections:
 *     type: array
 *     description: The order's payment collections.
 *     items:
 *       $ref: "#/components/schemas/StorePaymentCollection"
 *   payment_status:
 *     type: string
 *     description: The order's payment status.
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
 *     description: The order's fulfillments.
 *     items:
 *       $ref: "#/components/schemas/StoreOrderFulfillment"
 *   fulfillment_status:
 *     type: string
 *     description: The order's fulfillment status.
 *     enum:
 *       - canceled
 *       - not_fulfilled
 *       - partially_fulfilled
 *       - fulfilled
 *       - partially_shipped
 *       - shipped
 *       - partially_delivered
 *       - delivered
 *   summary:
 *     $ref: "#/components/schemas/BaseOrderSummary"
 *   metadata:
 *     type: object
 *     description: The order's metadata, can hold custom key-value pairs.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the order was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the order was updated.
 *   original_item_total:
 *     type: number
 *     title: original_item_total
 *     description: The order items' total including taxes, excluding promotions.
 *   original_item_subtotal:
 *     type: number
 *     title: original_item_subtotal
 *     description: The order items' total excluding taxes, including promotions.
 *   original_item_tax_total:
 *     type: number
 *     title: original_item_tax_total
 *     description: The total taxes applied on the order items, excluding promotions.
 *   item_total:
 *     type: number
 *     title: item_total
 *     description: The order items' total including taxes and promotions.
 *   item_subtotal:
 *     type: number
 *     title: item_subtotal
 *     description: The order items' total excluding taxes, including promotions.
 *   item_tax_total:
 *     type: number
 *     title: item_tax_total
 *     description: The total taxes applied on the order's items, including promotions.
 *   original_total:
 *     type: number
 *     title: original_total
 *     description: The order's total including taxes, excluding promotions.
 *   original_subtotal:
 *     type: number
 *     title: original_subtotal
 *     description: The order's total excluding taxes, including promotions.
 *   original_tax_total:
 *     type: number
 *     title: original_tax_total
 *     description: The total taxes of the order excluding promotions.
 *   total:
 *     type: number
 *     title: total
 *     description: The order's total including taxes and promotions.
 *   subtotal:
 *     type: number
 *     title: subtotal
 *     description: The order's total excluding taxes, including promotions.
 *   tax_total:
 *     type: number
 *     title: tax_total
 *     description: The tax totals of the order including promotions.
 *   discount_total:
 *     type: number
 *     title: discount_total
 *     description: The order's discount total.
 *   discount_tax_total:
 *     type: number
 *     title: discount_tax_total
 *     description: The total taxes applied on the discounted amount.
 *   gift_card_total:
 *     type: number
 *     title: gift_card_total
 *     description: The order's gift card total.
 *   gift_card_tax_total:
 *     type: number
 *     title: gift_card_tax_total
 *     description: The total taxes applied on the gift card's amount.
 *   shipping_total:
 *     type: number
 *     title: shipping_total
 *     description: The order's shipping total including taxes and promotions.
 *   shipping_subtotal:
 *     type: number
 *     title: shipping_subtotal
 *     description: The order's shipping total excluding taxes, including promotions.
 *   shipping_tax_total:
 *     type: number
 *     title: shipping_tax_total
 *     description: The total taxes of the order's shipping including promotions.
 *   original_shipping_total:
 *     type: number
 *     title: original_shipping_total
 *     description: The order's shipping total including taxes, excluding promotions.
 *   original_shipping_subtotal:
 *     type: number
 *     title: original_shipping_subtotal
 *     description: The order's shipping total excluding taxes, including promotions.
 *   original_shipping_tax_total:
 *     type: number
 *     title: original_shipping_tax_total
 *     description: The total taxes of the order's shipping excluding promotions.
 *   customer:
 *     $ref: "#/components/schemas/StoreCustomer"
 *   transactions:
 *     type: array
 *     description: The order's transactions.
 *     items:
 *       $ref: "#/components/schemas/BaseOrderTransaction"
 * 
*/

