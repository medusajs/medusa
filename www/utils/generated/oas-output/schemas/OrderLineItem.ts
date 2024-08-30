/**
 * @schema OrderLineItem
 * type: object
 * description: The item's items.
 * x-schemaName: OrderLineItem
 * required:
 *   - id
 *   - title
 *   - requires_shipping
 *   - is_discountable
 *   - is_tax_inclusive
 *   - unit_price
 *   - raw_unit_price
 *   - quantity
 *   - raw_quantity
 *   - detail
 *   - created_at
 *   - updated_at
 *   - original_total
 *   - original_subtotal
 *   - original_tax_total
 *   - item_total
 *   - item_subtotal
 *   - item_tax_total
 *   - total
 *   - subtotal
 *   - tax_total
 *   - discount_total
 *   - discount_tax_total
 *   - refundable_total
 *   - refundable_total_per_unit
 *   - raw_original_total
 *   - raw_original_subtotal
 *   - raw_original_tax_total
 *   - raw_item_total
 *   - raw_item_subtotal
 *   - raw_item_tax_total
 *   - raw_total
 *   - raw_subtotal
 *   - raw_tax_total
 *   - raw_discount_total
 *   - raw_discount_tax_total
 *   - raw_refundable_total
 *   - raw_refundable_total_per_unit
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The item's ID.
 *   title:
 *     type: string
 *     title: title
 *     description: The item's title.
 *   subtitle:
 *     type: string
 *     title: subtitle
 *     description: The item's subtitle.
 *   thumbnail:
 *     type: string
 *     title: thumbnail
 *     description: The item's thumbnail.
 *   variant_id:
 *     type: string
 *     title: variant_id
 *     description: The item's variant id.
 *   product_id:
 *     type: string
 *     title: product_id
 *     description: The item's product id.
 *   product_title:
 *     type: string
 *     title: product_title
 *     description: The item's product title.
 *   product_description:
 *     type: string
 *     title: product_description
 *     description: The item's product description.
 *   product_subtitle:
 *     type: string
 *     title: product_subtitle
 *     description: The item's product subtitle.
 *   product_type:
 *     type: string
 *     title: product_type
 *     description: The item's product type.
 *   product_collection:
 *     type: string
 *     title: product_collection
 *     description: The item's product collection.
 *   product_handle:
 *     type: string
 *     title: product_handle
 *     description: The item's product handle.
 *   variant_sku:
 *     type: string
 *     title: variant_sku
 *     description: The item's variant sku.
 *   variant_barcode:
 *     type: string
 *     title: variant_barcode
 *     description: The item's variant barcode.
 *   variant_title:
 *     type: string
 *     title: variant_title
 *     description: The item's variant title.
 *   variant_option_values:
 *     type: object
 *     description: The item's variant option values.
 *   requires_shipping:
 *     type: boolean
 *     title: requires_shipping
 *     description: The item's requires shipping.
 *   is_discountable:
 *     type: boolean
 *     title: is_discountable
 *     description: The item's is discountable.
 *   is_tax_inclusive:
 *     type: boolean
 *     title: is_tax_inclusive
 *     description: The item's is tax inclusive.
 *   compare_at_unit_price:
 *     type: number
 *     title: compare_at_unit_price
 *     description: The item's compare at unit price.
 *   raw_compare_at_unit_price:
 *     type: object
 *     description: The item's raw compare at unit price.
 *   unit_price:
 *     type: number
 *     title: unit_price
 *     description: The item's unit price.
 *   raw_unit_price:
 *     type: object
 *     description: The item's raw unit price.
 *   quantity:
 *     type: number
 *     title: quantity
 *     description: The item's quantity.
 *   raw_quantity:
 *     type: object
 *     description: The item's raw quantity.
 *   tax_lines:
 *     type: array
 *     description: The item's tax lines.
 *     items:
 *       $ref: "#/components/schemas/OrderLineItemTaxLine"
 *   adjustments:
 *     type: array
 *     description: The item's adjustments.
 *     items:
 *       $ref: "#/components/schemas/OrderLineItemAdjustment"
 *   detail:
 *     $ref: "#/components/schemas/OrderItem"
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The item's created at.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The item's updated at.
 *   metadata:
 *     type: object
 *     description: The item's metadata.
 *   original_total:
 *     oneOf:
 *       - type: string
 *         title: original_total
 *         description: The item's original total.
 *       - type: number
 *         title: original_total
 *         description: The item's original total.
 *       - type: string
 *         title: original_total
 *         description: The item's original total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   original_subtotal:
 *     oneOf:
 *       - type: string
 *         title: original_subtotal
 *         description: The item's original subtotal.
 *       - type: number
 *         title: original_subtotal
 *         description: The item's original subtotal.
 *       - type: string
 *         title: original_subtotal
 *         description: The item's original subtotal.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   original_tax_total:
 *     oneOf:
 *       - type: string
 *         title: original_tax_total
 *         description: The item's original tax total.
 *       - type: number
 *         title: original_tax_total
 *         description: The item's original tax total.
 *       - type: string
 *         title: original_tax_total
 *         description: The item's original tax total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   item_total:
 *     oneOf:
 *       - type: string
 *         title: item_total
 *         description: The item's item total.
 *       - type: number
 *         title: item_total
 *         description: The item's item total.
 *       - type: string
 *         title: item_total
 *         description: The item's item total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   item_subtotal:
 *     oneOf:
 *       - type: string
 *         title: item_subtotal
 *         description: The item's item subtotal.
 *       - type: number
 *         title: item_subtotal
 *         description: The item's item subtotal.
 *       - type: string
 *         title: item_subtotal
 *         description: The item's item subtotal.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   item_tax_total:
 *     oneOf:
 *       - type: string
 *         title: item_tax_total
 *         description: The item's item tax total.
 *       - type: number
 *         title: item_tax_total
 *         description: The item's item tax total.
 *       - type: string
 *         title: item_tax_total
 *         description: The item's item tax total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   total:
 *     oneOf:
 *       - type: string
 *         title: total
 *         description: The item's total.
 *       - type: number
 *         title: total
 *         description: The item's total.
 *       - type: string
 *         title: total
 *         description: The item's total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   subtotal:
 *     oneOf:
 *       - type: string
 *         title: subtotal
 *         description: The item's subtotal.
 *       - type: number
 *         title: subtotal
 *         description: The item's subtotal.
 *       - type: string
 *         title: subtotal
 *         description: The item's subtotal.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   tax_total:
 *     oneOf:
 *       - type: string
 *         title: tax_total
 *         description: The item's tax total.
 *       - type: number
 *         title: tax_total
 *         description: The item's tax total.
 *       - type: string
 *         title: tax_total
 *         description: The item's tax total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   discount_total:
 *     oneOf:
 *       - type: string
 *         title: discount_total
 *         description: The item's discount total.
 *       - type: number
 *         title: discount_total
 *         description: The item's discount total.
 *       - type: string
 *         title: discount_total
 *         description: The item's discount total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   discount_tax_total:
 *     oneOf:
 *       - type: string
 *         title: discount_tax_total
 *         description: The item's discount tax total.
 *       - type: number
 *         title: discount_tax_total
 *         description: The item's discount tax total.
 *       - type: string
 *         title: discount_tax_total
 *         description: The item's discount tax total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   refundable_total:
 *     oneOf:
 *       - type: string
 *         title: refundable_total
 *         description: The item's refundable total.
 *       - type: number
 *         title: refundable_total
 *         description: The item's refundable total.
 *       - type: string
 *         title: refundable_total
 *         description: The item's refundable total.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   refundable_total_per_unit:
 *     oneOf:
 *       - type: string
 *         title: refundable_total_per_unit
 *         description: The item's refundable total per unit.
 *       - type: number
 *         title: refundable_total_per_unit
 *         description: The item's refundable total per unit.
 *       - type: string
 *         title: refundable_total_per_unit
 *         description: The item's refundable total per unit.
 *       - $ref: "#/components/schemas/IBigNumber"
 *   raw_original_total:
 *     type: object
 *     description: The item's raw original total.
 *   raw_original_subtotal:
 *     type: object
 *     description: The item's raw original subtotal.
 *   raw_original_tax_total:
 *     type: object
 *     description: The item's raw original tax total.
 *   raw_item_total:
 *     type: object
 *     description: The item's raw item total.
 *   raw_item_subtotal:
 *     type: object
 *     description: The item's raw item subtotal.
 *   raw_item_tax_total:
 *     type: object
 *     description: The item's raw item tax total.
 *   raw_total:
 *     type: object
 *     description: The item's raw total.
 *   raw_subtotal:
 *     type: object
 *     description: The item's raw subtotal.
 *   raw_tax_total:
 *     type: object
 *     description: The item's raw tax total.
 *   raw_discount_total:
 *     type: object
 *     description: The item's raw discount total.
 *   raw_discount_tax_total:
 *     type: object
 *     description: The item's raw discount tax total.
 *   raw_refundable_total:
 *     type: object
 *     description: The item's raw refundable total.
 *   raw_refundable_total_per_unit:
 *     type: object
 *     description: The item's raw refundable total per unit.
 * 
*/

