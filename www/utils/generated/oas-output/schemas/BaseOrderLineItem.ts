/**
 * @schema BaseOrderLineItem
 * type: object
 * description: The item's items.
 * x-schemaName: BaseOrderLineItem
 * required:
 *   - id
 *   - title
 *   - subtitle
 *   - thumbnail
 *   - variant_id
 *   - product_id
 *   - product_title
 *   - product_description
 *   - product_subtitle
 *   - product_type
 *   - product_collection
 *   - product_handle
 *   - variant_sku
 *   - variant_barcode
 *   - variant_title
 *   - variant_option_values
 *   - requires_shipping
 *   - is_discountable
 *   - is_tax_inclusive
 *   - unit_price
 *   - quantity
 *   - detail
 *   - created_at
 *   - updated_at
 *   - metadata
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
 *   variant:
 *     $ref: "#/components/schemas/BaseProductVariant"
 *   variant_id:
 *     type: string
 *     title: variant_id
 *     description: The item's variant id.
 *   product:
 *     $ref: "#/components/schemas/BaseProduct"
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
 *   unit_price:
 *     type: number
 *     title: unit_price
 *     description: The item's unit price.
 *   quantity:
 *     type: number
 *     title: quantity
 *     description: The item's quantity.
 *   tax_lines:
 *     type: array
 *     description: The item's tax lines.
 *     items:
 *       $ref: "#/components/schemas/BaseOrderLineItemTaxLine"
 *   adjustments:
 *     type: array
 *     description: The item's adjustments.
 *     items:
 *       $ref: "#/components/schemas/BaseOrderLineItemAdjustment"
 *   detail:
 *     $ref: "#/components/schemas/BaseOrderItemDetail"
 *   created_at:
 *     type: string
 *     title: created_at
 *     description: The item's created at.
 *     format: date-time
 *   updated_at:
 *     type: string
 *     title: updated_at
 *     description: The item's updated at.
 *     format: date-time
 *   metadata:
 *     type: object
 *     description: The item's metadata.
 *   original_total:
 *     type: number
 *     title: original_total
 *     description: The item's original total.
 *   original_subtotal:
 *     type: number
 *     title: original_subtotal
 *     description: The item's original subtotal.
 *   original_tax_total:
 *     type: number
 *     title: original_tax_total
 *     description: The item's original tax total.
 *   item_total:
 *     type: number
 *     title: item_total
 *     description: The item's item total.
 *   item_subtotal:
 *     type: number
 *     title: item_subtotal
 *     description: The item's item subtotal.
 *   item_tax_total:
 *     type: number
 *     title: item_tax_total
 *     description: The item's item tax total.
 *   total:
 *     type: number
 *     title: total
 *     description: The item's total.
 *   subtotal:
 *     type: number
 *     title: subtotal
 *     description: The item's subtotal.
 *   tax_total:
 *     type: number
 *     title: tax_total
 *     description: The item's tax total.
 *   discount_total:
 *     type: number
 *     title: discount_total
 *     description: The item's discount total.
 *   discount_tax_total:
 *     type: number
 *     title: discount_tax_total
 *     description: The item's discount tax total.
 *   refundable_total:
 *     type: number
 *     title: refundable_total
 *     description: The item's refundable total.
 *   refundable_total_per_unit:
 *     type: number
 *     title: refundable_total_per_unit
 *     description: The item's refundable total per unit.
 * 
*/

