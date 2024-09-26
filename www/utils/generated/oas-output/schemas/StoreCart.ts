/**
 * @schema StoreCart
 * type: object
 * description: The cart's parent.
 * x-schemaName: StoreCart
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
 *     description: The parent's ID.
 *   region:
 *     $ref: "#/components/schemas/BaseRegion"
 *   region_id:
 *     type: string
 *     title: region_id
 *     description: The parent's region id.
 *   customer_id:
 *     type: string
 *     title: customer_id
 *     description: The parent's customer id.
 *   sales_channel_id:
 *     type: string
 *     title: sales_channel_id
 *     description: The parent's sales channel id.
 *   email:
 *     type: string
 *     title: email
 *     description: The parent's email.
 *     format: email
 *   currency_code:
 *     type: string
 *     title: currency_code
 *     description: The parent's currency code.
 *   shipping_address:
 *     $ref: "#/components/schemas/StoreCartAddress"
 *   billing_address:
 *     $ref: "#/components/schemas/StoreCartAddress"
 *   items:
 *     type: array
 *     description: The parent's items.
 *     items:
 *       $ref: "#/components/schemas/StoreCartLineItem"
 *   shipping_methods:
 *     type: array
 *     description: The parent's shipping methods.
 *     items:
 *       $ref: "#/components/schemas/BaseCartShippingMethod"
 *   payment_collection:
 *     $ref: "#/components/schemas/BasePaymentCollection"
 *   metadata:
 *     type: object
 *     description: The parent's metadata.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The parent's created at.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The parent's updated at.
 *   original_item_total:
 *     oneOf:
 *       - type: string
 *         title: original_item_total
 *         description: The parent's original item total.
 *       - type: number
 *         title: original_item_total
 *         description: The parent's original item total.
 *       - type: string
 *         title: original_item_total
 *         description: The parent's original item total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   original_item_subtotal:
 *     oneOf:
 *       - type: string
 *         title: original_item_subtotal
 *         description: The parent's original item subtotal.
 *       - type: number
 *         title: original_item_subtotal
 *         description: The parent's original item subtotal.
 *       - type: string
 *         title: original_item_subtotal
 *         description: The parent's original item subtotal.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   original_item_tax_total:
 *     oneOf:
 *       - type: string
 *         title: original_item_tax_total
 *         description: The parent's original item tax total.
 *       - type: number
 *         title: original_item_tax_total
 *         description: The parent's original item tax total.
 *       - type: string
 *         title: original_item_tax_total
 *         description: The parent's original item tax total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   item_total:
 *     oneOf:
 *       - type: string
 *         title: item_total
 *         description: The parent's item total.
 *       - type: number
 *         title: item_total
 *         description: The parent's item total.
 *       - type: string
 *         title: item_total
 *         description: The parent's item total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   item_subtotal:
 *     oneOf:
 *       - type: string
 *         title: item_subtotal
 *         description: The parent's item subtotal.
 *       - type: number
 *         title: item_subtotal
 *         description: The parent's item subtotal.
 *       - type: string
 *         title: item_subtotal
 *         description: The parent's item subtotal.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   item_tax_total:
 *     oneOf:
 *       - type: string
 *         title: item_tax_total
 *         description: The parent's item tax total.
 *       - type: number
 *         title: item_tax_total
 *         description: The parent's item tax total.
 *       - type: string
 *         title: item_tax_total
 *         description: The parent's item tax total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   original_total:
 *     oneOf:
 *       - type: string
 *         title: original_total
 *         description: The parent's original total.
 *       - type: number
 *         title: original_total
 *         description: The parent's original total.
 *       - type: string
 *         title: original_total
 *         description: The parent's original total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   original_subtotal:
 *     oneOf:
 *       - type: string
 *         title: original_subtotal
 *         description: The parent's original subtotal.
 *       - type: number
 *         title: original_subtotal
 *         description: The parent's original subtotal.
 *       - type: string
 *         title: original_subtotal
 *         description: The parent's original subtotal.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   original_tax_total:
 *     oneOf:
 *       - type: string
 *         title: original_tax_total
 *         description: The parent's original tax total.
 *       - type: number
 *         title: original_tax_total
 *         description: The parent's original tax total.
 *       - type: string
 *         title: original_tax_total
 *         description: The parent's original tax total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   total:
 *     oneOf:
 *       - type: string
 *         title: total
 *         description: The parent's total.
 *       - type: number
 *         title: total
 *         description: The parent's total.
 *       - type: string
 *         title: total
 *         description: The parent's total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   subtotal:
 *     oneOf:
 *       - type: string
 *         title: subtotal
 *         description: The parent's subtotal.
 *       - type: number
 *         title: subtotal
 *         description: The parent's subtotal.
 *       - type: string
 *         title: subtotal
 *         description: The parent's subtotal.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   tax_total:
 *     oneOf:
 *       - type: string
 *         title: tax_total
 *         description: The parent's tax total.
 *       - type: number
 *         title: tax_total
 *         description: The parent's tax total.
 *       - type: string
 *         title: tax_total
 *         description: The parent's tax total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   discount_total:
 *     oneOf:
 *       - type: string
 *         title: discount_total
 *         description: The parent's discount total.
 *       - type: number
 *         title: discount_total
 *         description: The parent's discount total.
 *       - type: string
 *         title: discount_total
 *         description: The parent's discount total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   discount_tax_total:
 *     oneOf:
 *       - type: string
 *         title: discount_tax_total
 *         description: The parent's discount tax total.
 *       - type: number
 *         title: discount_tax_total
 *         description: The parent's discount tax total.
 *       - type: string
 *         title: discount_tax_total
 *         description: The parent's discount tax total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   gift_card_total:
 *     oneOf:
 *       - type: string
 *         title: gift_card_total
 *         description: The parent's gift card total.
 *       - type: number
 *         title: gift_card_total
 *         description: The parent's gift card total.
 *       - type: string
 *         title: gift_card_total
 *         description: The parent's gift card total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   gift_card_tax_total:
 *     oneOf:
 *       - type: string
 *         title: gift_card_tax_total
 *         description: The parent's gift card tax total.
 *       - type: number
 *         title: gift_card_tax_total
 *         description: The parent's gift card tax total.
 *       - type: string
 *         title: gift_card_tax_total
 *         description: The parent's gift card tax total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   shipping_total:
 *     oneOf:
 *       - type: string
 *         title: shipping_total
 *         description: The parent's shipping total.
 *       - type: number
 *         title: shipping_total
 *         description: The parent's shipping total.
 *       - type: string
 *         title: shipping_total
 *         description: The parent's shipping total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   shipping_subtotal:
 *     oneOf:
 *       - type: string
 *         title: shipping_subtotal
 *         description: The parent's shipping subtotal.
 *       - type: number
 *         title: shipping_subtotal
 *         description: The parent's shipping subtotal.
 *       - type: string
 *         title: shipping_subtotal
 *         description: The parent's shipping subtotal.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   shipping_tax_total:
 *     oneOf:
 *       - type: string
 *         title: shipping_tax_total
 *         description: The parent's shipping tax total.
 *       - type: number
 *         title: shipping_tax_total
 *         description: The parent's shipping tax total.
 *       - type: string
 *         title: shipping_tax_total
 *         description: The parent's shipping tax total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   original_shipping_total:
 *     oneOf:
 *       - type: string
 *         title: original_shipping_total
 *         description: The parent's original shipping total.
 *       - type: number
 *         title: original_shipping_total
 *         description: The parent's original shipping total.
 *       - type: string
 *         title: original_shipping_total
 *         description: The parent's original shipping total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   original_shipping_subtotal:
 *     oneOf:
 *       - type: string
 *         title: original_shipping_subtotal
 *         description: The parent's original shipping subtotal.
 *       - type: number
 *         title: original_shipping_subtotal
 *         description: The parent's original shipping subtotal.
 *       - type: string
 *         title: original_shipping_subtotal
 *         description: The parent's original shipping subtotal.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   original_shipping_tax_total:
 *     oneOf:
 *       - type: string
 *         title: original_shipping_tax_total
 *         description: The parent's original shipping tax total.
 *       - type: number
 *         title: original_shipping_tax_total
 *         description: The parent's original shipping tax total.
 *       - type: string
 *         title: original_shipping_tax_total
 *         description: The parent's original shipping tax total.
 *       - $ref: "#/components/schemas/IBigNumber"
 * 
*/

