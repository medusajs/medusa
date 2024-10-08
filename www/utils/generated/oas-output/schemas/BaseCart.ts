/**
 * @schema BaseCart
 * type: object
 * description: The item's cart.
 * x-schemaName: BaseCart
 * required:
 *   - id
 *   - currency_code
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
 *     description: The cart's ID.
 *   region:
 *     $ref: "#/components/schemas/BaseRegion"
 *   region_id:
 *     type: string
 *     title: region_id
 *     description: The cart's region id.
 *   customer_id:
 *     type: string
 *     title: customer_id
 *     description: The cart's customer id.
 *   sales_channel_id:
 *     type: string
 *     title: sales_channel_id
 *     description: The cart's sales channel id.
 *   email:
 *     type: string
 *     title: email
 *     description: The cart's email.
 *     format: email
 *   currency_code:
 *     type: string
 *     title: currency_code
 *     description: The cart's currency code.
 *   shipping_address:
 *     $ref: "#/components/schemas/BaseCartAddress"
 *   billing_address:
 *     $ref: "#/components/schemas/BaseCartAddress"
 *   items:
 *     type: array
 *     description: The cart's items.
 *     items:
 *       $ref: "#/components/schemas/BaseCartLineItem"
 *   shipping_methods:
 *     type: array
 *     description: The cart's shipping methods.
 *     items:
 *       $ref: "#/components/schemas/BaseCartShippingMethod"
 *   payment_collection:
 *     $ref: "#/components/schemas/BasePaymentCollection"
 *   metadata:
 *     type: object
 *     description: The cart's metadata.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The cart's created at.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The cart's updated at.
 *   original_item_total:
 *     type: number
 *     title: original_item_total
 *     description: The cart's original item total.
 *   original_item_subtotal:
 *     type: number
 *     title: original_item_subtotal
 *     description: The cart's original item subtotal.
 *   original_item_tax_total:
 *     type: number
 *     title: original_item_tax_total
 *     description: The cart's original item tax total.
 *   item_total:
 *     type: number
 *     title: item_total
 *     description: The cart's item total.
 *   item_subtotal:
 *     type: number
 *     title: item_subtotal
 *     description: The cart's item subtotal.
 *   item_tax_total:
 *     type: number
 *     title: item_tax_total
 *     description: The cart's item tax total.
 *   original_total:
 *     type: number
 *     title: original_total
 *     description: The cart's original total.
 *   original_subtotal:
 *     type: number
 *     title: original_subtotal
 *     description: The cart's original subtotal.
 *   original_tax_total:
 *     type: number
 *     title: original_tax_total
 *     description: The cart's original tax total.
 *   total:
 *     type: number
 *     title: total
 *     description: The cart's total.
 *   subtotal:
 *     type: number
 *     title: subtotal
 *     description: The cart's subtotal.
 *   tax_total:
 *     type: number
 *     title: tax_total
 *     description: The cart's tax total.
 *   discount_total:
 *     type: number
 *     title: discount_total
 *     description: The cart's discount total.
 *   discount_tax_total:
 *     type: number
 *     title: discount_tax_total
 *     description: The cart's discount tax total.
 *   gift_card_total:
 *     type: number
 *     title: gift_card_total
 *     description: The cart's gift card total.
 *   gift_card_tax_total:
 *     type: number
 *     title: gift_card_tax_total
 *     description: The cart's gift card tax total.
 *   shipping_total:
 *     type: number
 *     title: shipping_total
 *     description: The cart's shipping total.
 *   shipping_subtotal:
 *     type: number
 *     title: shipping_subtotal
 *     description: The cart's shipping subtotal.
 *   shipping_tax_total:
 *     type: number
 *     title: shipping_tax_total
 *     description: The cart's shipping tax total.
 *   original_shipping_total:
 *     type: number
 *     title: original_shipping_total
 *     description: The cart's original shipping total.
 *   original_shipping_subtotal:
 *     type: number
 *     title: original_shipping_subtotal
 *     description: The cart's original shipping subtotal.
 *   original_shipping_tax_total:
 *     type: number
 *     title: original_shipping_tax_total
 *     description: The cart's original shipping tax total.
 * 
*/

