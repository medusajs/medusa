/**
 * @schema OrderPreview
 * type: object
 * description: The order edit's order preview.
 * x-schemaName: OrderPreview
 * required:
 *   - order_change
 *   - status
 *   - currency_code
 *   - version
 *   - id
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
 *   - raw_original_item_total
 *   - raw_original_item_subtotal
 *   - raw_original_item_tax_total
 *   - raw_item_total
 *   - raw_item_subtotal
 *   - raw_item_tax_total
 *   - raw_original_total
 *   - raw_original_subtotal
 *   - raw_original_tax_total
 *   - raw_total
 *   - raw_subtotal
 *   - raw_tax_total
 *   - raw_discount_total
 *   - raw_discount_tax_total
 *   - raw_gift_card_total
 *   - raw_gift_card_tax_total
 *   - raw_shipping_total
 *   - raw_shipping_subtotal
 *   - raw_shipping_tax_total
 *   - raw_original_shipping_total
 *   - raw_original_shipping_subtotal
 *   - raw_original_shipping_tax_total
 * properties:
 *   order_change:
 *     $ref: "#/components/schemas/OrderChange"
 *   items:
 *     type: array
 *     description: The order preview's items.
 *     items:
 *       allOf:
 *         - type: object
 *           description: The item's items.
 *           x-schemaName: OrderLineItem
 *           required:
 *             - id
 *             - title
 *             - requires_shipping
 *             - is_discountable
 *             - is_tax_inclusive
 *             - unit_price
 *             - raw_unit_price
 *             - quantity
 *             - raw_quantity
 *             - detail
 *             - created_at
 *             - updated_at
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
 *             - raw_original_total
 *             - raw_original_subtotal
 *             - raw_original_tax_total
 *             - raw_item_total
 *             - raw_item_subtotal
 *             - raw_item_tax_total
 *             - raw_total
 *             - raw_subtotal
 *             - raw_tax_total
 *             - raw_discount_total
 *             - raw_discount_tax_total
 *             - raw_refundable_total
 *             - raw_refundable_total_per_unit
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
 *               description: The item's thumbnail.
 *             variant_id:
 *               type: string
 *               title: variant_id
 *               description: The item's variant id.
 *             product_id:
 *               type: string
 *               title: product_id
 *               description: The item's product id.
 *             product_title:
 *               type: string
 *               title: product_title
 *               description: The item's product title.
 *             product_description:
 *               type: string
 *               title: product_description
 *               description: The item's product description.
 *             product_subtitle:
 *               type: string
 *               title: product_subtitle
 *               description: The item's product subtitle.
 *             product_type:
 *               type: string
 *               title: product_type
 *               description: The item's product type.
 *             product_collection:
 *               type: string
 *               title: product_collection
 *               description: The item's product collection.
 *             product_handle:
 *               type: string
 *               title: product_handle
 *               description: The item's product handle.
 *             variant_sku:
 *               type: string
 *               title: variant_sku
 *               description: The item's variant sku.
 *             variant_barcode:
 *               type: string
 *               title: variant_barcode
 *               description: The item's variant barcode.
 *             variant_title:
 *               type: string
 *               title: variant_title
 *               description: The item's variant title.
 *             variant_option_values:
 *               type: object
 *               description: The item's variant option values.
 *             requires_shipping:
 *               type: boolean
 *               title: requires_shipping
 *               description: The item's requires shipping.
 *             is_discountable:
 *               type: boolean
 *               title: is_discountable
 *               description: The item's is discountable.
 *             is_tax_inclusive:
 *               type: boolean
 *               title: is_tax_inclusive
 *               description: The item's is tax inclusive.
 *             compare_at_unit_price:
 *               type: number
 *               title: compare_at_unit_price
 *               description: The item's compare at unit price.
 *             raw_compare_at_unit_price:
 *               type: object
 *               description: The item's raw compare at unit price.
 *             unit_price:
 *               type: number
 *               title: unit_price
 *               description: The item's unit price.
 *             raw_unit_price:
 *               type: object
 *               description: The item's raw unit price.
 *             quantity:
 *               type: number
 *               title: quantity
 *               description: The item's quantity.
 *             raw_quantity:
 *               type: object
 *               description: The item's raw quantity.
 *             tax_lines:
 *               type: array
 *               description: The item's tax lines.
 *               items:
 *                 $ref: "#/components/schemas/OrderLineItemTaxLine"
 *             adjustments:
 *               type: array
 *               description: The item's adjustments.
 *               items:
 *                 $ref: "#/components/schemas/OrderLineItemAdjustment"
 *             detail:
 *               $ref: "#/components/schemas/OrderItem"
 *             created_at:
 *               type: string
 *               format: date-time
 *               title: created_at
 *               description: The item's created at.
 *             updated_at:
 *               type: string
 *               format: date-time
 *               title: updated_at
 *               description: The item's updated at.
 *             metadata:
 *               type: object
 *               description: The item's metadata.
 *             original_total:
 *               oneOf:
 *                 - type: string
 *                   title: original_total
 *                   description: The item's original total.
 *                 - type: number
 *                   title: original_total
 *                   description: The item's original total.
 *                 - type: string
 *                   title: original_total
 *                   description: The item's original total.
 *                 - $ref: "#/components/schemas/IBigNumber"
 *             original_subtotal:
 *               oneOf:
 *                 - type: string
 *                   title: original_subtotal
 *                   description: The item's original subtotal.
 *                 - type: number
 *                   title: original_subtotal
 *                   description: The item's original subtotal.
 *                 - type: string
 *                   title: original_subtotal
 *                   description: The item's original subtotal.
 *                 - $ref: "#/components/schemas/IBigNumber"
 *             original_tax_total:
 *               oneOf:
 *                 - type: string
 *                   title: original_tax_total
 *                   description: The item's original tax total.
 *                 - type: number
 *                   title: original_tax_total
 *                   description: The item's original tax total.
 *                 - type: string
 *                   title: original_tax_total
 *                   description: The item's original tax total.
 *                 - $ref: "#/components/schemas/IBigNumber"
 *             item_total:
 *               oneOf:
 *                 - type: string
 *                   title: item_total
 *                   description: The item's item total.
 *                 - type: number
 *                   title: item_total
 *                   description: The item's item total.
 *                 - type: string
 *                   title: item_total
 *                   description: The item's item total.
 *                 - $ref: "#/components/schemas/IBigNumber"
 *             item_subtotal:
 *               oneOf:
 *                 - type: string
 *                   title: item_subtotal
 *                   description: The item's item subtotal.
 *                 - type: number
 *                   title: item_subtotal
 *                   description: The item's item subtotal.
 *                 - type: string
 *                   title: item_subtotal
 *                   description: The item's item subtotal.
 *                 - $ref: "#/components/schemas/IBigNumber"
 *             item_tax_total:
 *               oneOf:
 *                 - type: string
 *                   title: item_tax_total
 *                   description: The item's item tax total.
 *                 - type: number
 *                   title: item_tax_total
 *                   description: The item's item tax total.
 *                 - type: string
 *                   title: item_tax_total
 *                   description: The item's item tax total.
 *                 - $ref: "#/components/schemas/IBigNumber"
 *             total:
 *               oneOf:
 *                 - type: string
 *                   title: total
 *                   description: The item's total.
 *                 - type: number
 *                   title: total
 *                   description: The item's total.
 *                 - type: string
 *                   title: total
 *                   description: The item's total.
 *                 - $ref: "#/components/schemas/IBigNumber"
 *             subtotal:
 *               oneOf:
 *                 - type: string
 *                   title: subtotal
 *                   description: The item's subtotal.
 *                 - type: number
 *                   title: subtotal
 *                   description: The item's subtotal.
 *                 - type: string
 *                   title: subtotal
 *                   description: The item's subtotal.
 *                 - $ref: "#/components/schemas/IBigNumber"
 *             tax_total:
 *               oneOf:
 *                 - type: string
 *                   title: tax_total
 *                   description: The item's tax total.
 *                 - type: number
 *                   title: tax_total
 *                   description: The item's tax total.
 *                 - type: string
 *                   title: tax_total
 *                   description: The item's tax total.
 *                 - $ref: "#/components/schemas/IBigNumber"
 *             discount_total:
 *               oneOf:
 *                 - type: string
 *                   title: discount_total
 *                   description: The item's discount total.
 *                 - type: number
 *                   title: discount_total
 *                   description: The item's discount total.
 *                 - type: string
 *                   title: discount_total
 *                   description: The item's discount total.
 *                 - $ref: "#/components/schemas/IBigNumber"
 *             discount_tax_total:
 *               oneOf:
 *                 - type: string
 *                   title: discount_tax_total
 *                   description: The item's discount tax total.
 *                 - type: number
 *                   title: discount_tax_total
 *                   description: The item's discount tax total.
 *                 - type: string
 *                   title: discount_tax_total
 *                   description: The item's discount tax total.
 *                 - $ref: "#/components/schemas/IBigNumber"
 *             refundable_total:
 *               oneOf:
 *                 - type: string
 *                   title: refundable_total
 *                   description: The item's refundable total.
 *                 - type: number
 *                   title: refundable_total
 *                   description: The item's refundable total.
 *                 - type: string
 *                   title: refundable_total
 *                   description: The item's refundable total.
 *                 - $ref: "#/components/schemas/IBigNumber"
 *             refundable_total_per_unit:
 *               oneOf:
 *                 - type: string
 *                   title: refundable_total_per_unit
 *                   description: The item's refundable total per unit.
 *                 - type: number
 *                   title: refundable_total_per_unit
 *                   description: The item's refundable total per unit.
 *                 - type: string
 *                   title: refundable_total_per_unit
 *                   description: The item's refundable total per unit.
 *                 - $ref: "#/components/schemas/IBigNumber"
 *             raw_original_total:
 *               type: object
 *               description: The item's raw original total.
 *             raw_original_subtotal:
 *               type: object
 *               description: The item's raw original subtotal.
 *             raw_original_tax_total:
 *               type: object
 *               description: The item's raw original tax total.
 *             raw_item_total:
 *               type: object
 *               description: The item's raw item total.
 *             raw_item_subtotal:
 *               type: object
 *               description: The item's raw item subtotal.
 *             raw_item_tax_total:
 *               type: object
 *               description: The item's raw item tax total.
 *             raw_total:
 *               type: object
 *               description: The item's raw total.
 *             raw_subtotal:
 *               type: object
 *               description: The item's raw subtotal.
 *             raw_tax_total:
 *               type: object
 *               description: The item's raw tax total.
 *             raw_discount_total:
 *               type: object
 *               description: The item's raw discount total.
 *             raw_discount_tax_total:
 *               type: object
 *               description: The item's raw discount tax total.
 *             raw_refundable_total:
 *               type: object
 *               description: The item's raw refundable total.
 *             raw_refundable_total_per_unit:
 *               type: object
 *               description: The item's raw refundable total per unit.
 *         - type: object
 *           description: The item's items.
 *           properties:
 *             actions:
 *               type: array
 *               description: The item's actions.
 *               items:
 *                 type: object
 *                 description: The action's actions.
 *                 x-schemaName: OrderChangeAction
 *   shipping_methods:
 *     type: array
 *     description: The order preview's shipping methods.
 *     items:
 *       allOf:
 *         - type: object
 *           description: The shipping method's shipping methods.
 *           x-schemaName: OrderShippingMethod
 *           required:
 *             - id
 *             - order_id
 *             - name
 *             - amount
 *             - raw_amount
 *             - is_tax_inclusive
 *             - created_at
 *             - updated_at
 *             - original_total
 *             - original_subtotal
 *             - original_tax_total
 *             - total
 *             - subtotal
 *             - tax_total
 *             - discount_total
 *             - discount_tax_total
 *             - raw_original_total
 *             - raw_original_subtotal
 *             - raw_original_tax_total
 *             - raw_total
 *             - raw_subtotal
 *             - raw_tax_total
 *             - raw_discount_total
 *             - raw_discount_tax_total
 *           properties:
 *             id:
 *               type: string
 *               title: id
 *               description: The shipping method's ID.
 *             order_id:
 *               type: string
 *               title: order_id
 *               description: The shipping method's order id.
 *             name:
 *               type: string
 *               title: name
 *               description: The shipping method's name.
 *             description:
 *               type: string
 *               title: description
 *               description: The shipping method's description.
 *             amount:
 *               oneOf:
 *                 - type: string
 *                   title: amount
 *                   description: The shipping method's amount.
 *                 - type: number
 *                   title: amount
 *                   description: The shipping method's amount.
 *                 - type: string
 *                   title: amount
 *                   description: The shipping method's amount.
 *                 - $ref: "#/components/schemas/IBigNumber"
 *             raw_amount:
 *               type: object
 *               description: The shipping method's raw amount.
 *             is_tax_inclusive:
 *               type: boolean
 *               title: is_tax_inclusive
 *               description: The shipping method's is tax inclusive.
 *             shipping_option_id:
 *               type: string
 *               title: shipping_option_id
 *               description: The shipping method's shipping option id.
 *             data:
 *               type: object
 *               description: The shipping method's data.
 *             metadata:
 *               type: object
 *               description: The shipping method's metadata.
 *             tax_lines:
 *               type: array
 *               description: The shipping method's tax lines.
 *               items:
 *                 $ref: "#/components/schemas/OrderShippingMethodTaxLine"
 *             adjustments:
 *               type: array
 *               description: The shipping method's adjustments.
 *               items:
 *                 $ref: "#/components/schemas/OrderShippingMethodAdjustment"
 *             created_at:
 *               type: string
 *               format: date-time
 *               title: created_at
 *               description: The shipping method's created at.
 *             updated_at:
 *               type: string
 *               format: date-time
 *               title: updated_at
 *               description: The shipping method's updated at.
 *             original_total:
 *               oneOf:
 *                 - type: string
 *                   title: original_total
 *                   description: The shipping method's original total.
 *                 - type: number
 *                   title: original_total
 *                   description: The shipping method's original total.
 *                 - type: string
 *                   title: original_total
 *                   description: The shipping method's original total.
 *                 - $ref: "#/components/schemas/IBigNumber"
 *             original_subtotal:
 *               oneOf:
 *                 - type: string
 *                   title: original_subtotal
 *                   description: The shipping method's original subtotal.
 *                 - type: number
 *                   title: original_subtotal
 *                   description: The shipping method's original subtotal.
 *                 - type: string
 *                   title: original_subtotal
 *                   description: The shipping method's original subtotal.
 *                 - $ref: "#/components/schemas/IBigNumber"
 *             original_tax_total:
 *               oneOf:
 *                 - type: string
 *                   title: original_tax_total
 *                   description: The shipping method's original tax total.
 *                 - type: number
 *                   title: original_tax_total
 *                   description: The shipping method's original tax total.
 *                 - type: string
 *                   title: original_tax_total
 *                   description: The shipping method's original tax total.
 *                 - $ref: "#/components/schemas/IBigNumber"
 *             total:
 *               oneOf:
 *                 - type: string
 *                   title: total
 *                   description: The shipping method's total.
 *                 - type: number
 *                   title: total
 *                   description: The shipping method's total.
 *                 - type: string
 *                   title: total
 *                   description: The shipping method's total.
 *                 - $ref: "#/components/schemas/IBigNumber"
 *             subtotal:
 *               oneOf:
 *                 - type: string
 *                   title: subtotal
 *                   description: The shipping method's subtotal.
 *                 - type: number
 *                   title: subtotal
 *                   description: The shipping method's subtotal.
 *                 - type: string
 *                   title: subtotal
 *                   description: The shipping method's subtotal.
 *                 - $ref: "#/components/schemas/IBigNumber"
 *             tax_total:
 *               oneOf:
 *                 - type: string
 *                   title: tax_total
 *                   description: The shipping method's tax total.
 *                 - type: number
 *                   title: tax_total
 *                   description: The shipping method's tax total.
 *                 - type: string
 *                   title: tax_total
 *                   description: The shipping method's tax total.
 *                 - $ref: "#/components/schemas/IBigNumber"
 *             discount_total:
 *               oneOf:
 *                 - type: string
 *                   title: discount_total
 *                   description: The shipping method's discount total.
 *                 - type: number
 *                   title: discount_total
 *                   description: The shipping method's discount total.
 *                 - type: string
 *                   title: discount_total
 *                   description: The shipping method's discount total.
 *                 - $ref: "#/components/schemas/IBigNumber"
 *             discount_tax_total:
 *               oneOf:
 *                 - type: string
 *                   title: discount_tax_total
 *                   description: The shipping method's discount tax total.
 *                 - type: number
 *                   title: discount_tax_total
 *                   description: The shipping method's discount tax total.
 *                 - type: string
 *                   title: discount_tax_total
 *                   description: The shipping method's discount tax total.
 *                 - $ref: "#/components/schemas/IBigNumber"
 *             raw_original_total:
 *               type: object
 *               description: The shipping method's raw original total.
 *             raw_original_subtotal:
 *               type: object
 *               description: The shipping method's raw original subtotal.
 *             raw_original_tax_total:
 *               type: object
 *               description: The shipping method's raw original tax total.
 *             raw_total:
 *               type: object
 *               description: The shipping method's raw total.
 *             raw_subtotal:
 *               type: object
 *               description: The shipping method's raw subtotal.
 *             raw_tax_total:
 *               type: object
 *               description: The shipping method's raw tax total.
 *             raw_discount_total:
 *               type: object
 *               description: The shipping method's raw discount total.
 *             raw_discount_tax_total:
 *               type: object
 *               description: The shipping method's raw discount tax total.
 *         - type: object
 *           description: The shipping method's shipping methods.
 *           properties:
 *             actions:
 *               type: array
 *               description: The shipping method's actions.
 *               items:
 *                 type: object
 *                 description: The action's actions.
 *                 x-schemaName: OrderChangeAction
 *   status:
 *     type: string
 *     description: The order preview's status.
 *     enum:
 *       - canceled
 *       - requires_action
 *       - pending
 *       - completed
 *       - draft
 *       - archived
 *   currency_code:
 *     type: string
 *     title: currency_code
 *     description: The order preview's currency code.
 *   version:
 *     type: number
 *     title: version
 *     description: The order preview's version.
 *   id:
 *     type: string
 *     title: id
 *     description: The order preview's ID.
 *   region_id:
 *     type: string
 *     title: region_id
 *     description: The order preview's region id.
 *   customer_id:
 *     type: string
 *     title: customer_id
 *     description: The order preview's customer id.
 *   sales_channel_id:
 *     type: string
 *     title: sales_channel_id
 *     description: The order preview's sales channel id.
 *   email:
 *     type: string
 *     title: email
 *     description: The order preview's email.
 *     format: email
 *   shipping_address:
 *     $ref: "#/components/schemas/OrderAddress"
 *   billing_address:
 *     $ref: "#/components/schemas/OrderAddress"
 *   transactions:
 *     type: array
 *     description: The order preview's transactions.
 *     items:
 *       $ref: "#/components/schemas/OrderTransaction"
 *   summary:
 *     type: object
 *     description: The order preview's summary.
 *     required:
 *       - total
 *       - subtotal
 *       - total_tax
 *       - ordered_total
 *       - fulfilled_total
 *       - returned_total
 *       - return_request_total
 *       - write_off_total
 *       - projected_total
 *       - net_total
 *       - net_subtotal
 *       - net_total_tax
 *       - balance
 *       - paid_total
 *       - refunded_total
 *       - pending_difference
 *       - raw_pending_difference
 *     properties:
 *       total:
 *         oneOf:
 *           - type: string
 *             title: total
 *             description: The summary's total.
 *           - type: number
 *             title: total
 *             description: The summary's total.
 *           - type: string
 *             title: total
 *             description: The summary's total.
 *           - type: object
 *             description: The summary's total.
 *             x-schemaName: IBigNumber
 *       subtotal:
 *         oneOf:
 *           - type: string
 *             title: subtotal
 *             description: The summary's subtotal.
 *           - type: number
 *             title: subtotal
 *             description: The summary's subtotal.
 *           - type: string
 *             title: subtotal
 *             description: The summary's subtotal.
 *           - type: object
 *             description: The summary's subtotal.
 *             x-schemaName: IBigNumber
 *       total_tax:
 *         oneOf:
 *           - type: string
 *             title: total_tax
 *             description: The summary's total tax.
 *           - type: number
 *             title: total_tax
 *             description: The summary's total tax.
 *           - type: string
 *             title: total_tax
 *             description: The summary's total tax.
 *           - type: object
 *             description: The summary's total tax.
 *             x-schemaName: IBigNumber
 *       ordered_total:
 *         oneOf:
 *           - type: string
 *             title: ordered_total
 *             description: The summary's ordered total.
 *           - type: number
 *             title: ordered_total
 *             description: The summary's ordered total.
 *           - type: string
 *             title: ordered_total
 *             description: The summary's ordered total.
 *           - type: object
 *             description: The summary's ordered total.
 *             x-schemaName: IBigNumber
 *       fulfilled_total:
 *         oneOf:
 *           - type: string
 *             title: fulfilled_total
 *             description: The summary's fulfilled total.
 *           - type: number
 *             title: fulfilled_total
 *             description: The summary's fulfilled total.
 *           - type: string
 *             title: fulfilled_total
 *             description: The summary's fulfilled total.
 *           - type: object
 *             description: The summary's fulfilled total.
 *             x-schemaName: IBigNumber
 *       returned_total:
 *         oneOf:
 *           - type: string
 *             title: returned_total
 *             description: The summary's returned total.
 *           - type: number
 *             title: returned_total
 *             description: The summary's returned total.
 *           - type: string
 *             title: returned_total
 *             description: The summary's returned total.
 *           - type: object
 *             description: The summary's returned total.
 *             x-schemaName: IBigNumber
 *       return_request_total:
 *         oneOf:
 *           - type: string
 *             title: return_request_total
 *             description: The summary's return request total.
 *           - type: number
 *             title: return_request_total
 *             description: The summary's return request total.
 *           - type: string
 *             title: return_request_total
 *             description: The summary's return request total.
 *           - type: object
 *             description: The summary's return request total.
 *             x-schemaName: IBigNumber
 *       write_off_total:
 *         oneOf:
 *           - type: string
 *             title: write_off_total
 *             description: The summary's write off total.
 *           - type: number
 *             title: write_off_total
 *             description: The summary's write off total.
 *           - type: string
 *             title: write_off_total
 *             description: The summary's write off total.
 *           - type: object
 *             description: The summary's write off total.
 *             x-schemaName: IBigNumber
 *       projected_total:
 *         oneOf:
 *           - type: string
 *             title: projected_total
 *             description: The summary's projected total.
 *           - type: number
 *             title: projected_total
 *             description: The summary's projected total.
 *           - type: string
 *             title: projected_total
 *             description: The summary's projected total.
 *           - type: object
 *             description: The summary's projected total.
 *             x-schemaName: IBigNumber
 *       net_total:
 *         oneOf:
 *           - type: string
 *             title: net_total
 *             description: The summary's net total.
 *           - type: number
 *             title: net_total
 *             description: The summary's net total.
 *           - type: string
 *             title: net_total
 *             description: The summary's net total.
 *           - type: object
 *             description: The summary's net total.
 *             x-schemaName: IBigNumber
 *       net_subtotal:
 *         oneOf:
 *           - type: string
 *             title: net_subtotal
 *             description: The summary's net subtotal.
 *           - type: number
 *             title: net_subtotal
 *             description: The summary's net subtotal.
 *           - type: string
 *             title: net_subtotal
 *             description: The summary's net subtotal.
 *           - type: object
 *             description: The summary's net subtotal.
 *             x-schemaName: IBigNumber
 *       net_total_tax:
 *         oneOf:
 *           - type: string
 *             title: net_total_tax
 *             description: The summary's net total tax.
 *           - type: number
 *             title: net_total_tax
 *             description: The summary's net total tax.
 *           - type: string
 *             title: net_total_tax
 *             description: The summary's net total tax.
 *           - type: object
 *             description: The summary's net total tax.
 *             x-schemaName: IBigNumber
 *       balance:
 *         oneOf:
 *           - type: string
 *             title: balance
 *             description: The summary's balance.
 *           - type: number
 *             title: balance
 *             description: The summary's balance.
 *           - type: string
 *             title: balance
 *             description: The summary's balance.
 *           - type: object
 *             description: The summary's balance.
 *             x-schemaName: IBigNumber
 *       paid_total:
 *         oneOf:
 *           - type: string
 *             title: paid_total
 *             description: The summary's paid total.
 *           - type: number
 *             title: paid_total
 *             description: The summary's paid total.
 *           - type: string
 *             title: paid_total
 *             description: The summary's paid total.
 *           - type: object
 *             description: The summary's paid total.
 *             x-schemaName: IBigNumber
 *       refunded_total:
 *         oneOf:
 *           - type: string
 *             title: refunded_total
 *             description: The summary's refunded total.
 *           - type: number
 *             title: refunded_total
 *             description: The summary's refunded total.
 *           - type: string
 *             title: refunded_total
 *             description: The summary's refunded total.
 *           - type: object
 *             description: The summary's refunded total.
 *             x-schemaName: IBigNumber
 *       pending_difference:
 *         oneOf:
 *           - type: string
 *             title: pending_difference
 *             description: The summary's pending difference.
 *           - type: number
 *             title: pending_difference
 *             description: The summary's pending difference.
 *           - type: string
 *             title: pending_difference
 *             description: The summary's pending difference.
 *           - type: object
 *             description: The summary's pending difference.
 *             x-schemaName: IBigNumber
 *       raw_pending_difference:
 *         type: object
 *         description: The summary's raw pending difference.
 *   metadata:
 *     type: object
 *     description: The order preview's metadata.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The order preview's created at.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The order preview's updated at.
 *   original_item_total:
 *     oneOf:
 *       - type: string
 *         title: original_item_total
 *         description: The order preview's original item total.
 *       - type: number
 *         title: original_item_total
 *         description: The order preview's original item total.
 *       - type: string
 *         title: original_item_total
 *         description: The order preview's original item total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   original_item_subtotal:
 *     oneOf:
 *       - type: string
 *         title: original_item_subtotal
 *         description: The order preview's original item subtotal.
 *       - type: number
 *         title: original_item_subtotal
 *         description: The order preview's original item subtotal.
 *       - type: string
 *         title: original_item_subtotal
 *         description: The order preview's original item subtotal.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   original_item_tax_total:
 *     oneOf:
 *       - type: string
 *         title: original_item_tax_total
 *         description: The order preview's original item tax total.
 *       - type: number
 *         title: original_item_tax_total
 *         description: The order preview's original item tax total.
 *       - type: string
 *         title: original_item_tax_total
 *         description: The order preview's original item tax total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   item_total:
 *     oneOf:
 *       - type: string
 *         title: item_total
 *         description: The order preview's item total.
 *       - type: number
 *         title: item_total
 *         description: The order preview's item total.
 *       - type: string
 *         title: item_total
 *         description: The order preview's item total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   item_subtotal:
 *     oneOf:
 *       - type: string
 *         title: item_subtotal
 *         description: The order preview's item subtotal.
 *       - type: number
 *         title: item_subtotal
 *         description: The order preview's item subtotal.
 *       - type: string
 *         title: item_subtotal
 *         description: The order preview's item subtotal.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   item_tax_total:
 *     oneOf:
 *       - type: string
 *         title: item_tax_total
 *         description: The order preview's item tax total.
 *       - type: number
 *         title: item_tax_total
 *         description: The order preview's item tax total.
 *       - type: string
 *         title: item_tax_total
 *         description: The order preview's item tax total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   original_total:
 *     oneOf:
 *       - type: string
 *         title: original_total
 *         description: The order preview's original total.
 *       - type: number
 *         title: original_total
 *         description: The order preview's original total.
 *       - type: string
 *         title: original_total
 *         description: The order preview's original total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   original_subtotal:
 *     oneOf:
 *       - type: string
 *         title: original_subtotal
 *         description: The order preview's original subtotal.
 *       - type: number
 *         title: original_subtotal
 *         description: The order preview's original subtotal.
 *       - type: string
 *         title: original_subtotal
 *         description: The order preview's original subtotal.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   original_tax_total:
 *     oneOf:
 *       - type: string
 *         title: original_tax_total
 *         description: The order preview's original tax total.
 *       - type: number
 *         title: original_tax_total
 *         description: The order preview's original tax total.
 *       - type: string
 *         title: original_tax_total
 *         description: The order preview's original tax total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   total:
 *     oneOf:
 *       - type: string
 *         title: total
 *         description: The order preview's total.
 *       - type: number
 *         title: total
 *         description: The order preview's total.
 *       - type: string
 *         title: total
 *         description: The order preview's total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   subtotal:
 *     oneOf:
 *       - type: string
 *         title: subtotal
 *         description: The order preview's subtotal.
 *       - type: number
 *         title: subtotal
 *         description: The order preview's subtotal.
 *       - type: string
 *         title: subtotal
 *         description: The order preview's subtotal.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   tax_total:
 *     oneOf:
 *       - type: string
 *         title: tax_total
 *         description: The order preview's tax total.
 *       - type: number
 *         title: tax_total
 *         description: The order preview's tax total.
 *       - type: string
 *         title: tax_total
 *         description: The order preview's tax total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   discount_total:
 *     oneOf:
 *       - type: string
 *         title: discount_total
 *         description: The order preview's discount total.
 *       - type: number
 *         title: discount_total
 *         description: The order preview's discount total.
 *       - type: string
 *         title: discount_total
 *         description: The order preview's discount total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   discount_tax_total:
 *     oneOf:
 *       - type: string
 *         title: discount_tax_total
 *         description: The order preview's discount tax total.
 *       - type: number
 *         title: discount_tax_total
 *         description: The order preview's discount tax total.
 *       - type: string
 *         title: discount_tax_total
 *         description: The order preview's discount tax total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   gift_card_total:
 *     oneOf:
 *       - type: string
 *         title: gift_card_total
 *         description: The order preview's gift card total.
 *       - type: number
 *         title: gift_card_total
 *         description: The order preview's gift card total.
 *       - type: string
 *         title: gift_card_total
 *         description: The order preview's gift card total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   gift_card_tax_total:
 *     oneOf:
 *       - type: string
 *         title: gift_card_tax_total
 *         description: The order preview's gift card tax total.
 *       - type: number
 *         title: gift_card_tax_total
 *         description: The order preview's gift card tax total.
 *       - type: string
 *         title: gift_card_tax_total
 *         description: The order preview's gift card tax total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   shipping_total:
 *     oneOf:
 *       - type: string
 *         title: shipping_total
 *         description: The order preview's shipping total.
 *       - type: number
 *         title: shipping_total
 *         description: The order preview's shipping total.
 *       - type: string
 *         title: shipping_total
 *         description: The order preview's shipping total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   shipping_subtotal:
 *     oneOf:
 *       - type: string
 *         title: shipping_subtotal
 *         description: The order preview's shipping subtotal.
 *       - type: number
 *         title: shipping_subtotal
 *         description: The order preview's shipping subtotal.
 *       - type: string
 *         title: shipping_subtotal
 *         description: The order preview's shipping subtotal.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   shipping_tax_total:
 *     oneOf:
 *       - type: string
 *         title: shipping_tax_total
 *         description: The order preview's shipping tax total.
 *       - type: number
 *         title: shipping_tax_total
 *         description: The order preview's shipping tax total.
 *       - type: string
 *         title: shipping_tax_total
 *         description: The order preview's shipping tax total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   original_shipping_total:
 *     oneOf:
 *       - type: string
 *         title: original_shipping_total
 *         description: The order preview's original shipping total.
 *       - type: number
 *         title: original_shipping_total
 *         description: The order preview's original shipping total.
 *       - type: string
 *         title: original_shipping_total
 *         description: The order preview's original shipping total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   original_shipping_subtotal:
 *     oneOf:
 *       - type: string
 *         title: original_shipping_subtotal
 *         description: The order preview's original shipping subtotal.
 *       - type: number
 *         title: original_shipping_subtotal
 *         description: The order preview's original shipping subtotal.
 *       - type: string
 *         title: original_shipping_subtotal
 *         description: The order preview's original shipping subtotal.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   original_shipping_tax_total:
 *     oneOf:
 *       - type: string
 *         title: original_shipping_tax_total
 *         description: The order preview's original shipping tax total.
 *       - type: number
 *         title: original_shipping_tax_total
 *         description: The order preview's original shipping tax total.
 *       - type: string
 *         title: original_shipping_tax_total
 *         description: The order preview's original shipping tax total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   canceled_at:
 *     oneOf:
 *       - type: string
 *         title: canceled_at
 *         description: The order preview's canceled at.
 *       - type: string
 *         title: canceled_at
 *         description: The order preview's canceled at.
 *         format: date-time
 *   raw_original_item_total:
 *     type: object
 *     description: The order preview's raw original item total.
 *     required:
 *       - value
 *     properties:
 *       value:
 *         oneOf:
 *           - type: string
 *             title: value
 *             description: The raw original item total's value.
 *           - type: number
 *             title: value
 *             description: The raw original item total's value.
 *   raw_original_item_subtotal:
 *     type: object
 *     description: The order preview's raw original item subtotal.
 *     required:
 *       - value
 *     properties:
 *       value:
 *         oneOf:
 *           - type: string
 *             title: value
 *             description: The raw original item subtotal's value.
 *           - type: number
 *             title: value
 *             description: The raw original item subtotal's value.
 *   raw_original_item_tax_total:
 *     type: object
 *     description: The order preview's raw original item tax total.
 *     required:
 *       - value
 *     properties:
 *       value:
 *         oneOf:
 *           - type: string
 *             title: value
 *             description: The raw original item tax total's value.
 *           - type: number
 *             title: value
 *             description: The raw original item tax total's value.
 *   raw_item_total:
 *     type: object
 *     description: The order preview's raw item total.
 *     required:
 *       - value
 *     properties:
 *       value:
 *         oneOf:
 *           - type: string
 *             title: value
 *             description: The raw item total's value.
 *           - type: number
 *             title: value
 *             description: The raw item total's value.
 *   raw_item_subtotal:
 *     type: object
 *     description: The order preview's raw item subtotal.
 *     required:
 *       - value
 *     properties:
 *       value:
 *         oneOf:
 *           - type: string
 *             title: value
 *             description: The raw item subtotal's value.
 *           - type: number
 *             title: value
 *             description: The raw item subtotal's value.
 *   raw_item_tax_total:
 *     type: object
 *     description: The order preview's raw item tax total.
 *     required:
 *       - value
 *     properties:
 *       value:
 *         oneOf:
 *           - type: string
 *             title: value
 *             description: The raw item tax total's value.
 *           - type: number
 *             title: value
 *             description: The raw item tax total's value.
 *   raw_original_total:
 *     type: object
 *     description: The order preview's raw original total.
 *     required:
 *       - value
 *     properties:
 *       value:
 *         oneOf:
 *           - type: string
 *             title: value
 *             description: The raw original total's value.
 *           - type: number
 *             title: value
 *             description: The raw original total's value.
 *   raw_original_subtotal:
 *     type: object
 *     description: The order preview's raw original subtotal.
 *     required:
 *       - value
 *     properties:
 *       value:
 *         oneOf:
 *           - type: string
 *             title: value
 *             description: The raw original subtotal's value.
 *           - type: number
 *             title: value
 *             description: The raw original subtotal's value.
 *   raw_original_tax_total:
 *     type: object
 *     description: The order preview's raw original tax total.
 *     required:
 *       - value
 *     properties:
 *       value:
 *         oneOf:
 *           - type: string
 *             title: value
 *             description: The raw original tax total's value.
 *           - type: number
 *             title: value
 *             description: The raw original tax total's value.
 *   raw_total:
 *     type: object
 *     description: The order preview's raw total.
 *     required:
 *       - value
 *     properties:
 *       value:
 *         oneOf:
 *           - type: string
 *             title: value
 *             description: The raw total's value.
 *           - type: number
 *             title: value
 *             description: The raw total's value.
 *   raw_subtotal:
 *     type: object
 *     description: The order preview's raw subtotal.
 *     required:
 *       - value
 *     properties:
 *       value:
 *         oneOf:
 *           - type: string
 *             title: value
 *             description: The raw subtotal's value.
 *           - type: number
 *             title: value
 *             description: The raw subtotal's value.
 *   raw_tax_total:
 *     type: object
 *     description: The order preview's raw tax total.
 *     required:
 *       - value
 *     properties:
 *       value:
 *         oneOf:
 *           - type: string
 *             title: value
 *             description: The raw tax total's value.
 *           - type: number
 *             title: value
 *             description: The raw tax total's value.
 *   raw_discount_total:
 *     type: object
 *     description: The order preview's raw discount total.
 *     required:
 *       - value
 *     properties:
 *       value:
 *         oneOf:
 *           - type: string
 *             title: value
 *             description: The raw discount total's value.
 *           - type: number
 *             title: value
 *             description: The raw discount total's value.
 *   raw_discount_tax_total:
 *     type: object
 *     description: The order preview's raw discount tax total.
 *     required:
 *       - value
 *     properties:
 *       value:
 *         oneOf:
 *           - type: string
 *             title: value
 *             description: The raw discount tax total's value.
 *           - type: number
 *             title: value
 *             description: The raw discount tax total's value.
 *   raw_gift_card_total:
 *     type: object
 *     description: The order preview's raw gift card total.
 *     required:
 *       - value
 *     properties:
 *       value:
 *         oneOf:
 *           - type: string
 *             title: value
 *             description: The raw gift card total's value.
 *           - type: number
 *             title: value
 *             description: The raw gift card total's value.
 *   raw_gift_card_tax_total:
 *     type: object
 *     description: The order preview's raw gift card tax total.
 *     required:
 *       - value
 *     properties:
 *       value:
 *         oneOf:
 *           - type: string
 *             title: value
 *             description: The raw gift card tax total's value.
 *           - type: number
 *             title: value
 *             description: The raw gift card tax total's value.
 *   raw_shipping_total:
 *     type: object
 *     description: The order preview's raw shipping total.
 *     required:
 *       - value
 *     properties:
 *       value:
 *         oneOf:
 *           - type: string
 *             title: value
 *             description: The raw shipping total's value.
 *           - type: number
 *             title: value
 *             description: The raw shipping total's value.
 *   raw_shipping_subtotal:
 *     type: object
 *     description: The order preview's raw shipping subtotal.
 *     required:
 *       - value
 *     properties:
 *       value:
 *         oneOf:
 *           - type: string
 *             title: value
 *             description: The raw shipping subtotal's value.
 *           - type: number
 *             title: value
 *             description: The raw shipping subtotal's value.
 *   raw_shipping_tax_total:
 *     type: object
 *     description: The order preview's raw shipping tax total.
 *     required:
 *       - value
 *     properties:
 *       value:
 *         oneOf:
 *           - type: string
 *             title: value
 *             description: The raw shipping tax total's value.
 *           - type: number
 *             title: value
 *             description: The raw shipping tax total's value.
 *   raw_original_shipping_total:
 *     type: object
 *     description: The order preview's raw original shipping total.
 *     required:
 *       - value
 *     properties:
 *       value:
 *         oneOf:
 *           - type: string
 *             title: value
 *             description: The raw original shipping total's value.
 *           - type: number
 *             title: value
 *             description: The raw original shipping total's value.
 *   raw_original_shipping_subtotal:
 *     type: object
 *     description: The order preview's raw original shipping subtotal.
 *     required:
 *       - value
 *     properties:
 *       value:
 *         oneOf:
 *           - type: string
 *             title: value
 *             description: The raw original shipping subtotal's value.
 *           - type: number
 *             title: value
 *             description: The raw original shipping subtotal's value.
 *   raw_original_shipping_tax_total:
 *     type: object
 *     description: The order preview's raw original shipping tax total.
 *     required:
 *       - value
 *     properties:
 *       value:
 *         oneOf:
 *           - type: string
 *             title: value
 *             description: The raw original shipping tax total's value.
 *           - type: number
 *             title: value
 *             description: The raw original shipping tax total's value.
 * 
*/

