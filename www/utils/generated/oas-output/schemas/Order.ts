/**
 * @schema Order
 * type: object
 * description: The order change's order.
 * x-schemaName: Order
 * required:
 *   - id
 *   - version
 *   - display_id
 *   - status
 *   - currency_code
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
 *   - discount_subtotal
 *   - discount_total
 *   - discount_tax_total
 *   - credit_line_total
 *   - gift_card_total
 *   - gift_card_tax_total
 *   - shipping_total
 *   - shipping_subtotal
 *   - shipping_tax_total
 *   - shipping_discount_total
 *   - original_shipping_total
 *   - original_shipping_subtotal
 *   - original_shipping_tax_total
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The order's ID.
 *   version:
 *     type: number
 *     title: version
 *     description: The order's version.
 *   order_change:
 *     $ref: "#/components/schemas/OrderChange"
 *   status:
 *     type: string
 *     description: The order's status.
 *     enum:
 *       - canceled
 *       - requires_action
 *       - pending
 *       - completed
 *       - draft
 *       - archived
 *   region_id:
 *     type: string
 *     title: region_id
 *     description: The ID of the region the order belongs to.
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
 *   shipping_address:
 *     $ref: "#/components/schemas/OrderAddress"
 *   billing_address:
 *     $ref: "#/components/schemas/OrderAddress"
 *   items:
 *     type: array
 *     description: The order's items.
 *     items:
 *       $ref: "#/components/schemas/OrderLineItem"
 *   shipping_methods:
 *     type: array
 *     description: The order's shipping methods.
 *     items:
 *       $ref: "#/components/schemas/OrderShippingMethod"
 *   transactions:
 *     type: array
 *     description: The order's transactions.
 *     items:
 *       $ref: "#/components/schemas/OrderTransaction"
 *   summary:
 *     type: object
 *     description: The order's summary.
 *     properties:
 *       pending_difference:
 *         type: number
 *         title: pending_difference
 *         description: The remaining amount to be paid or refunded.
 *       current_order_total:
 *         type: number
 *         title: current_order_total
 *         description: The order's current total.
 *       original_order_total:
 *         type: number
 *         title: original_order_total
 *         description: The order's total before any changes.
 *       transaction_total:
 *         type: number
 *         title: transaction_total
 *         description: The total of the transactions (payments and refunds) made on the order.
 *       paid_total:
 *         type: number
 *         title: paid_total
 *         description: The total paid amount.
 *       refunded_total:
 *         type: number
 *         title: refunded_total
 *         description: The total refunded amount.
 *       credit_line_total:
 *         type: number
 *         title: credit_line_total
 *         description: The total credit line amount.
 *       accounting_total:
 *         type: number
 *         title: accounting_total
 *         description: The total amount for accounting purposes.
 *       raw_pending_difference:
 *         type: object
 *         description: The summary's raw pending difference.
 *       raw_current_order_total:
 *         type: object
 *         description: The summary's raw current order total.
 *       raw_original_order_total:
 *         type: object
 *         description: The summary's raw original order total.
 *       raw_transaction_total:
 *         type: object
 *         description: The summary's raw transaction total.
 *       raw_paid_total:
 *         type: object
 *         description: The summary's raw paid total.
 *       raw_refunded_total:
 *         type: object
 *         description: The summary's raw refunded total.
 *       raw_credit_line_total:
 *         type: object
 *         description: The summary's raw credit line total.
 *       raw_accounting_total:
 *         type: object
 *         description: The summary's raw accounting total.
 *     required:
 *       - pending_difference
 *       - current_order_total
 *       - original_order_total
 *       - transaction_total
 *       - paid_total
 *       - refunded_total
 *       - credit_line_total
 *       - accounting_total
 *       - raw_pending_difference
 *       - raw_current_order_total
 *       - raw_original_order_total
 *       - raw_transaction_total
 *       - raw_paid_total
 *       - raw_refunded_total
 *       - raw_credit_line_total
 *       - raw_accounting_total
 *   metadata:
 *     type: object
 *     description: The order's metadata, can hold custom key-value pairs.
 *     externalDocs:
 *       url: https://docs.medusajs.com/api/store#manage-metadata
 *       description: Learn how to manage metadata
 *   canceled_at:
 *     type: string
 *     format: date-time
 *     title: canceled_at
 *     description: The date the order was canceled.
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
 *     description: The taxes total for order items, excluding promotions.
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
 *     description: The tax total of the order items including promotions.
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
 *     description: The tax total of the order excluding promotions.
 *   total:
 *     type: number
 *     title: total
 *     description: The order's total including taxes and promotions.
 *   subtotal:
 *     type: number
 *     title: subtotal
 *     description: The order's subtotal excluding taxes, including promotions.
 *   tax_total:
 *     type: number
 *     title: tax_total
 *     description: The tax total of the order including promotions.
 *   discount_subtotal:
 *     type: number
 *     title: discount_subtotal
 *     description: The total discount excluding taxes.
 *   discount_total:
 *     type: number
 *     title: discount_total
 *     description: The total discount including taxes.
 *   discount_tax_total:
 *     type: number
 *     title: discount_tax_total
 *     description: The tax total applied on the discount.
 *   gift_card_total:
 *     type: number
 *     title: gift_card_total
 *     description: The order's gift card total.
 *   gift_card_tax_total:
 *     type: number
 *     title: gift_card_tax_total
 *     description: The order's gift card tax total.
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
 *     description: The total taxes of the order's shipping including taxes.
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
 *   display_id:
 *     type: number
 *     title: display_id
 *     description: The order's display ID.
 *   credit_lines:
 *     type: array
 *     description: The order's credit lines, useful to add additional payment amounts for an order.
 *     items:
 *       $ref: "#/components/schemas/OrderCreditLine"
 *   is_draft_order:
 *     type: boolean
 *     title: is_draft_order
 *     description: Whether the order is a draft order.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The date the order was deleted.
 *   credit_line_total:
 *     type: number
 *     title: credit_line_total
 *     description: The order's credit line total.
 *   item_discount_total:
 *     type: number
 *     title: item_discount_total
 *     description: The total discount amount applied on the order's items.
 *   shipping_discount_total:
 *     type: number
 *     title: shipping_discount_total
 *     description: The total discount amount applied on the order's shipping.
 *   custom_display_id:
 *     type: string
 *     title: custom_display_id
 *     description: The custom display ID of the order.
 *     externalDocs:
 *       url: https://docs.medusajs.com/resources/commerce-modules/order/custom-display-id
 *   locale:
 *     type: string
 *     title: locale
 *     description: The order's locale in [BCP 47](https://gist.github.com/typpo/b2b828a35e683b9bf8db91b5404f1bd1) format.
 *     example: en-US
 * 
*/

