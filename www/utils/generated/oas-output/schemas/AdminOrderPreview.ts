/**
 * @schema AdminOrderPreview
 * type: object
 * description: A preview of an order if a change, such as exchange, return, edit, or claim is applied on it.
 * x-schemaName: AdminOrderPreview
 * required:
 *   - return_requested_total
 *   - order_change
 *   - currency_code
 *   - id
 *   - version
 *   - region_id
 *   - customer_id
 *   - sales_channel_id
 *   - email
 *   - payment_collections
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
 *   return_requested_total:
 *     type: number
 *     title: return_requested_total
 *     description: The total of the requested return.
 *   order_change:
 *     $ref: "#/components/schemas/AdminOrderChange"
 *   items:
 *     type: array
 *     description: The order's items.
 *     items:
 *       allOf:
 *         - type: object
 *           description: An order's item.
 *           x-schemaName: BaseOrderLineItem
 *           required:
 *             - id
 *             - title
 *             - subtitle
 *             - thumbnail
 *             - variant_id
 *             - product_id
 *             - product_title
 *             - product_description
 *             - product_subtitle
 *             - product_type
 *             - product_collection
 *             - product_handle
 *             - variant_sku
 *             - variant_barcode
 *             - variant_title
 *             - variant_option_values
 *             - requires_shipping
 *             - is_discountable
 *             - is_tax_inclusive
 *             - unit_price
 *             - quantity
 *             - detail
 *             - created_at
 *             - updated_at
 *             - metadata
 *             - original_total
 *             - original_subtotal
 *             - original_tax_total
 *             - item_total
 *             - item_subtotal
 *             - item_tax_total
 *             - total
 *             - subtotal
 *             - tax_total
 *             - discount_total
 *             - discount_tax_total
 *             - refundable_total
 *             - refundable_total_per_unit
 *           properties:
 *             id:
 *               type: string
 *               title: id
 *               description: The item's ID.
 *             title:
 *               type: string
 *               title: title
 *               description: The item's title.
 *             subtitle:
 *               type: string
 *               title: subtitle
 *               description: The item's subtitle.
 *             thumbnail:
 *               type: string
 *               title: thumbnail
 *               description: The URL of the item's thumbnail.
 *             variant:
 *               $ref: "#/components/schemas/BaseProductVariant"
 *             variant_id:
 *               type: string
 *               title: variant_id
 *               description: The ID of the associated variant.
 *             product:
 *               $ref: "#/components/schemas/AdminProduct"
 *             product_id:
 *               type: string
 *               title: product_id
 *               description: The ID of the associated product.
 *             product_title:
 *               type: string
 *               title: product_title
 *               description: The title of the item's product.
 *             product_description:
 *               type: string
 *               title: product_description
 *               description: The description of the item's product.
 *             product_subtitle:
 *               type: string
 *               title: product_subtitle
 *               description: The subtitle of the item's product.
 *             product_type:
 *               type: string
 *               title: product_type
 *               description: The ID of type of the item's product.
 *             product_collection:
 *               type: string
 *               title: product_collection
 *               description: The ID of collection of the item's product.
 *             product_handle:
 *               type: string
 *               title: product_handle
 *               description: The handle of the item's product.
 *             variant_sku:
 *               type: string
 *               title: variant_sku
 *               description: The SKU of the item's variant.
 *             variant_barcode:
 *               type: string
 *               title: variant_barcode
 *               description: The barcode of the item's variant.
 *             variant_title:
 *               type: string
 *               title: variant_title
 *               description: The title of the item's variant.
 *             variant_option_values:
 *               type: object
 *               description: The option values of the item's variant as key-value pairs. The key is the title of an option, and the value is the option's value.
 *             requires_shipping:
 *               type: boolean
 *               title: requires_shipping
 *               description: Whether the item requires shipping.
 *             is_discountable:
 *               type: boolean
 *               title: is_discountable
 *               description: Whether the item is discountable.
 *             is_tax_inclusive:
 *               type: boolean
 *               title: is_tax_inclusive
 *               description: Whether the item's price includes taxes.
 *             compare_at_unit_price:
 *               type: number
 *               title: compare_at_unit_price
 *               description: The original price of the item before a promotion or sale.
 *             unit_price:
 *               type: number
 *               title: unit_price
 *               description: The item's unit price.
 *             quantity:
 *               type: number
 *               title: quantity
 *               description: The item's quantity.
 *             tax_lines:
 *               type: array
 *               description: The item's tax lines.
 *               items:
 *                 $ref: "#/components/schemas/BaseOrderLineItemTaxLine"
 *             adjustments:
 *               type: array
 *               description: The item's adjustments.
 *               items:
 *                 $ref: "#/components/schemas/BaseOrderLineItemAdjustment"
 *             detail:
 *               $ref: "#/components/schemas/BaseOrderItemDetail"
 *             created_at:
 *               type: string
 *               format: date-time
 *               title: created_at
 *               description: The date the item was created.
 *             updated_at:
 *               type: string
 *               format: date-time
 *               title: updated_at
 *               description: The date the item was updated.
 *             metadata:
 *               type: object
 *               description: The item's metadata, can hold custom key-value pairs.
 *             original_total:
 *               type: number
 *               title: original_total
 *               description: The item's total including taxes, excluding promotions.
 *             original_subtotal:
 *               type: number
 *               title: original_subtotal
 *               description: The item's total excluding taxes, including promotions.
 *             original_tax_total:
 *               type: number
 *               title: original_tax_total
 *               description: The tax total of the item excluding promotions.
 *             item_total:
 *               type: number
 *               title: item_total
 *               description: The item's total for a single unit including taxes and promotions.
 *             item_subtotal:
 *               type: number
 *               title: item_subtotal
 *               description: The item's total for a single unit excluding taxes, including promotions.
 *             item_tax_total:
 *               type: number
 *               title: item_tax_total
 *               description: The tax total for a single unit of the item including promotions.
 *             total:
 *               type: number
 *               title: total
 *               description: The item's total including taxes and promotions.
 *             subtotal:
 *               type: number
 *               title: subtotal
 *               description: The item's total excluding taxes, including promotions.
 *             tax_total:
 *               type: number
 *               title: tax_total
 *               description: The tax total of the item including promotions.
 *             discount_total:
 *               type: number
 *               title: discount_total
 *               description: The total of the item's discount / promotion.
 *             discount_tax_total:
 *               type: number
 *               title: discount_tax_total
 *               description: The tax total of the item's discount / promotion
 *             refundable_total:
 *               type: number
 *               title: refundable_total
 *               description: The total refundable amount of the item's total.
 *             refundable_total_per_unit:
 *               type: number
 *               title: refundable_total_per_unit
 *               description: The total refundable amount of the item's total for a single unit.
 *         - type: object
 *           description: An order's item.
 *           properties:
 *             actions:
 *               type: array
 *               description: The actions applied on an item.
 *               items:
 *                 type: object
 *                 description: The action's details.
 *                 x-schemaName: BaseOrderChangeAction
 *   shipping_methods:
 *     type: array
 *     description: The order's shipping methods.
 *     items:
 *       allOf:
 *         - type: object
 *           description: The shipping method's details.
 *           x-schemaName: BaseOrderShippingMethod
 *           required:
 *             - id
 *             - order_id
 *             - name
 *             - amount
 *             - is_tax_inclusive
 *             - shipping_option_id
 *             - data
 *             - metadata
 *             - original_total
 *             - original_subtotal
 *             - original_tax_total
 *             - total
 *             - subtotal
 *             - tax_total
 *             - discount_total
 *             - discount_tax_total
 *             - created_at
 *             - updated_at
 *           properties:
 *             id:
 *               type: string
 *               title: id
 *               description: The shipping method's ID.
 *             order_id:
 *               type: string
 *               title: order_id
 *               description: The ID of the order this shipping method belongs to.
 *             name:
 *               type: string
 *               title: name
 *               description: The shipping method's name.
 *             description:
 *               type: string
 *               title: description
 *               description: The shipping method's description.
 *             amount:
 *               type: number
 *               title: amount
 *               description: The shipping method's amount.
 *             is_tax_inclusive:
 *               type: boolean
 *               title: is_tax_inclusive
 *               description: Whether the shipping method's amount is tax inclusive.
 *             shipping_option_id:
 *               type: string
 *               title: shipping_option_id
 *               description: The ID of the shipping option this method was created from.
 *             data:
 *               type: object
 *               description: The data relevant for the fulfillment provider to process this shipment.
 *               externalDocs:
 *                 url: https://docs.medusajs.com/v2/resources/commerce-modules/order/concepts#data-property
 *             metadata:
 *               type: object
 *               description: The shipping method's metadata, can hold custom key-value pairs.
 *             tax_lines:
 *               type: array
 *               description: The shipping method's tax lines.
 *               items:
 *                 $ref: "#/components/schemas/BaseOrderShippingMethodTaxLine"
 *             adjustments:
 *               type: array
 *               description: The shipping method's adjustments.
 *               items:
 *                 $ref: "#/components/schemas/BaseOrderShippingMethodAdjustment"
 *             original_total:
 *               oneOf:
 *                 - type: string
 *                   title: original_total
 *                   description: The shipping method's total including taxes, excluding promotions.
 *                 - type: number
 *                   title: original_total
 *                   description: The shipping method's total including taxes, excluding promotions.
 *             original_subtotal:
 *               oneOf:
 *                 - type: string
 *                   title: original_subtotal
 *                   description: The shipping method's total excluding taxes, including promotions.
 *                 - type: number
 *                   title: original_subtotal
 *                   description: The shipping method's total excluding taxes, including promotions.
 *             original_tax_total:
 *               oneOf:
 *                 - type: string
 *                   title: original_tax_total
 *                   description: The tax total of the shipping method excluding promotions.
 *                 - type: number
 *                   title: original_tax_total
 *                   description: The tax total of the shipping method excluding promotions.
 *             total:
 *               oneOf:
 *                 - type: string
 *                   title: total
 *                   description: The shipping method's total including taxes and promotions.
 *                 - type: number
 *                   title: total
 *                   description: The shipping method's total including taxes and promotions.
 *             subtotal:
 *               oneOf:
 *                 - type: string
 *                   title: subtotal
 *                   description: The shipping method's total excluding taxes, including promotions.
 *                 - type: number
 *                   title: subtotal
 *                   description: The shipping method's total excluding taxes, including promotions.
 *             tax_total:
 *               oneOf:
 *                 - type: string
 *                   title: tax_total
 *                   description: The tax total of the shipping method including promotions.
 *                 - type: number
 *                   title: tax_total
 *                   description: The tax total of the shipping method including promotions.
 *             discount_total:
 *               oneOf:
 *                 - type: string
 *                   title: discount_total
 *                   description: The total of the shipping method's promotion.
 *                 - type: number
 *                   title: discount_total
 *                   description: The total of the shipping method's promotion.
 *             discount_tax_total:
 *               oneOf:
 *                 - type: string
 *                   title: discount_tax_total
 *                   description: The tax total of the shipping method's promotion.
 *                 - type: number
 *                   title: discount_tax_total
 *                   description: The shipping method's discount tax total.
 *             created_at:
 *               type: string
 *               format: date-time
 *               title: created_at
 *               description: The date the shipping method was created.
 *             updated_at:
 *               type: string
 *               format: date-time
 *               title: updated_at
 *               description: The date the shipping method was updated.
 *         - type: object
 *           description: The shipping method's details.
 *           properties:
 *             actions:
 *               type: array
 *               description: The actions applied on the shipping method.
 *               items:
 *                 type: object
 *                 description: The action's details.
 *                 x-schemaName: BaseOrderChangeAction
 *   currency_code:
 *     type: string
 *     title: currency_code
 *     description: The order's currency code.
 *   version:
 *     type: number
 *     title: version
 *     description: The order's version when this preview is applied.
 *   id:
 *     type: string
 *     title: id
 *     description: The order's ID.
 *   region_id:
 *     type: string
 *     title: region_id
 *     description: The ID of the order's associated region.
 *   customer_id:
 *     type: string
 *     title: customer_id
 *     description: The ID of the customer that placed the order.
 *   sales_channel_id:
 *     type: string
 *     title: sales_channel_id
 *     description: The ID of the sales channel that the order was placed in.
 *   email:
 *     type: string
 *     title: email
 *     description: The email of the customer that placed the order.
 *     format: email
 *   display_id:
 *     type: number
 *     title: display_id
 *     description: The order's display ID.
 *   shipping_address:
 *     $ref: "#/components/schemas/AdminOrderAddress"
 *   billing_address:
 *     $ref: "#/components/schemas/AdminOrderAddress"
 *   payment_collections:
 *     type: array
 *     description: The order's payment collections.
 *     items:
 *       $ref: "#/components/schemas/AdminPaymentCollection"
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
 *       $ref: "#/components/schemas/AdminOrderFulfillment"
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
 *   transactions:
 *     type: array
 *     description: The order's transactions.
 *     items:
 *       $ref: "#/components/schemas/BaseOrderTransaction"
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
 *     description: The total of the order's items including taxes, excluding promotions.
 *   original_item_subtotal:
 *     type: number
 *     title: original_item_subtotal
 *     description: The total of the order's items excluding taxes, including promotions.
 *   original_item_tax_total:
 *     type: number
 *     title: original_item_tax_total
 *     description: The tax total of the order's items excluding promotions.
 *   item_total:
 *     type: number
 *     title: item_total
 *     description: The total of the order's items including taxes and promotions.
 *   item_subtotal:
 *     type: number
 *     title: item_subtotal
 *     description: The total of the order's items excluding taxes, including promotions.
 *   item_tax_total:
 *     type: number
 *     title: item_tax_total
 *     description: The tax total of the order's items including promotions.
 *   original_total:
 *     type: number
 *     title: original_total
 *     description: The order's total excluding promotions, including taxes.
 *   original_subtotal:
 *     type: number
 *     title: original_subtotal
 *     description: The order's total excluding taxes, including promotions.
 *   original_tax_total:
 *     type: number
 *     title: original_tax_total
 *     description: The order's tax total, excluding promotions.
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
 *     description: The order's tax total including promotions.
 *   discount_total:
 *     type: number
 *     title: discount_total
 *     description: The order's discount or promotions total.
 *   discount_tax_total:
 *     type: number
 *     title: discount_tax_total
 *     description: The tax total of order's discount or promotion.
 *   gift_card_total:
 *     type: number
 *     title: gift_card_total
 *     description: The order's gift card total.
 *   gift_card_tax_total:
 *     type: number
 *     title: gift_card_tax_total
 *     description: The tax total of the order's gift card.
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
 *     description: The tax total of the order's shipping.
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
 *     description: The tax total of the order's shipping excluding promotions.
 *   customer:
 *     $ref: "#/components/schemas/AdminCustomer"
 *   sales_channel:
 *     $ref: "#/components/schemas/AdminSalesChannel"
 * 
*/

