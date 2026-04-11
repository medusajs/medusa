/**
 * @schema AdminDraftOrder
 * type: object
 * description: The draft order's details.
 * x-schemaName: AdminDraftOrder
 * required:
 *   - payment_collections
 *   - items
 *   - shipping_methods
 *   - status
 *   - id
 *   - version
 *   - region_id
 *   - customer_id
 *   - sales_channel_id
 *   - email
 *   - currency_code
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
 *   - item_discount_total
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
 *   - shipping_discount_total
 *   - original_shipping_total
 *   - original_shipping_subtotal
 *   - original_shipping_tax_total
 *   - credit_line_total
 * properties:
 *   payment_collections:
 *     type: array
 *     description: The draft order's payment collections.
 *     items:
 *       $ref: "#/components/schemas/AdminPaymentCollection"
 *   fulfillments:
 *     type: array
 *     description: The draft order's fulfillments.
 *     items:
 *       $ref: "#/components/schemas/AdminOrderFulfillment"
 *   sales_channel:
 *     $ref: "#/components/schemas/AdminSalesChannel"
 *   customer:
 *     $ref: "#/components/schemas/AdminCustomer"
 *   shipping_address:
 *     $ref: "#/components/schemas/AdminOrderAddress"
 *   billing_address:
 *     $ref: "#/components/schemas/AdminOrderAddress"
 *   items:
 *     type: array
 *     description: The draft order's items.
 *     items:
 *       $ref: "#/components/schemas/AdminOrderLineItem"
 *   shipping_methods:
 *     type: array
 *     description: The draft order's shipping methods.
 *     items:
 *       $ref: "#/components/schemas/AdminOrderShippingMethod"
 *   status:
 *     type: string
 *     title: status
 *     description: The draft order's status.
 *   currency_code:
 *     type: string
 *     title: currency_code
 *     description: The draft order's currency code.
 *     example: usd
 *   id:
 *     type: string
 *     title: id
 *     description: The draft order's ID.
 *   version:
 *     type: number
 *     title: version
 *     description: The draft order's version.
 *   region_id:
 *     type: string
 *     title: region_id
 *     description: The ID of the region associated with the draft order.
 *   customer_id:
 *     type: string
 *     title: customer_id
 *     description: The ID of the customer that the draft order belongs to.
 *   sales_channel_id:
 *     type: string
 *     title: sales_channel_id
 *     description: The ID of the sales channel that the draft order is placed in.
 *   email:
 *     type: string
 *     title: email
 *     description: The customer email associated with the draft order.
 *     format: email
 *   display_id:
 *     type: number
 *     title: display_id
 *     description: The draft order's display ID.
 *   payment_status:
 *     type: string
 *     description: The draft order's payment status.
 *     enum:
 *       - not_paid
 *       - awaiting
 *       - authorized
 *       - partially_authorized
 *       - canceled
 *       - captured
 *       - partially_captured
 *       - partially_refunded
 *       - refunded
 *       - requires_action
 *   fulfillment_status:
 *     type: string
 *     description: The draft order's fulfillment status.
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
 *     description: The draft order's transactions.
 *     items:
 *       $ref: "#/components/schemas/BaseOrderTransaction"
 *   summary:
 *     $ref: "#/components/schemas/BaseOrderSummary"
 *   metadata:
 *     type: object
 *     description: The draft order's metadata, can hold custom key-value pairs.
 *     externalDocs:
 *       url: https://docs.medusajs.com/api/admin#manage-metadata
 *       description: Learn how to manage metadata
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the draft order was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the draft order was updated.
 *   original_item_total:
 *     type: number
 *     title: original_item_total
 *     description: The total of the draft order's items including taxes, excluding promotions.
 *   original_item_subtotal:
 *     type: number
 *     title: original_item_subtotal
 *     description: The total of the draft order's items excluding taxes, including promotions.
 *   original_item_tax_total:
 *     type: number
 *     title: original_item_tax_total
 *     description: The tax total of the draft order's items excluding promotions.
 *   item_total:
 *     type: number
 *     title: item_total
 *     description: The total of the draft order's items including taxes and promotions.
 *   item_subtotal:
 *     type: number
 *     title: item_subtotal
 *     description: The total of the draft order's items excluding taxes, including promotions.
 *   item_tax_total:
 *     type: number
 *     title: item_tax_total
 *     description: The tax total of the draft order's items including promotions.
 *   original_total:
 *     type: number
 *     title: original_total
 *     description: The draft order's total excluding promotions, including taxes.
 *   original_subtotal:
 *     type: number
 *     title: original_subtotal
 *     description: The draft order's total excluding taxes, including promotions.
 *   original_tax_total:
 *     type: number
 *     title: original_tax_total
 *     description: The draft order's tax total, excluding promotions.
 *   total:
 *     type: number
 *     title: total
 *     description: The draft order's total including taxes and promotions.
 *   subtotal:
 *     type: number
 *     title: subtotal
 *     description: The draft order's total excluding taxes, including promotions.
 *   tax_total:
 *     type: number
 *     title: tax_total
 *     description: The draft order's tax total including promotions.
 *   discount_total:
 *     type: number
 *     title: discount_total
 *     description: The draft order's discount or promotions total.
 *   discount_tax_total:
 *     type: number
 *     title: discount_tax_total
 *     description: The tax total of draft order's discount or promotion.
 *   gift_card_total:
 *     type: number
 *     title: gift_card_total
 *     description: The draft order's gift card total.
 *   gift_card_tax_total:
 *     type: number
 *     title: gift_card_tax_total
 *     description: The tax total of the draft order's gift card.
 *   shipping_total:
 *     type: number
 *     title: shipping_total
 *     description: The draft order's shipping total including taxes and promotions.
 *   shipping_subtotal:
 *     type: number
 *     title: shipping_subtotal
 *     description: The draft order's shipping total excluding taxes, including promotions.
 *   shipping_tax_total:
 *     type: number
 *     title: shipping_tax_total
 *     description: The tax total of the draft order's shipping.
 *   original_shipping_total:
 *     type: number
 *     title: original_shipping_total
 *     description: The draft order's shipping total including taxes, excluding promotions.
 *   original_shipping_subtotal:
 *     type: number
 *     title: original_shipping_subtotal
 *     description: The draft order's shipping total excluding taxes, including promotions.
 *   original_shipping_tax_total:
 *     type: number
 *     title: original_shipping_tax_total
 *     description: The tax total of the draft order's shipping excluding promotions.
 *   region:
 *     $ref: "#/components/schemas/AdminRegion"
 *   credit_lines:
 *     type: array
 *     description: The draft order's credit lines.
 *     items:
 *       $ref: "#/components/schemas/OrderCreditLine"
 *   credit_line_total:
 *     type: number
 *     title: credit_line_total
 *     description: The draft order's credit line total.
 *   item_discount_total:
 *     type: number
 *     title: item_discount_total
 *     description: The total discount amount applied on the draft order's items.
 *   shipping_discount_total:
 *     type: number
 *     title: shipping_discount_total
 *     description: The total discount amount applied on the draft order's shipping.
 *   custom_display_id:
 *     type: string
 *     title: custom_display_id
 *     description: The custom display ID of the draft order.
 *     externalDocs:
 *       url: https://docs.medusajs.com/resources/commerce-modules/order/custom-display-id
 * 
*/

