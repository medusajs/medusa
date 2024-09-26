/**
 * @schema BaseCartLineItem
 * type: object
 * description: The tax line's item.
 * x-schemaName: BaseCartLineItem
 * required:
 *   - id
 *   - title
 *   - quantity
 *   - requires_shipping
 *   - is_discountable
 *   - is_tax_inclusive
 *   - unit_price
 *   - cart
 *   - cart_id
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
 *   quantity:
 *     type: number
 *     title: quantity
 *     description: The item's quantity.
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
 *   variant:
 *     $ref: "#/components/schemas/BaseProductVariant"
 *   variant_id:
 *     type: string
 *     title: variant_id
 *     description: The item's variant id.
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
 *   tax_lines:
 *     type: array
 *     description: The item's tax lines.
 *     items:
 *       $ref: "#/components/schemas/BaseLineItemTaxLine"
 *   adjustments:
 *     type: array
 *     description: The item's adjustments.
 *     items:
 *       $ref: "#/components/schemas/BaseLineItemAdjustment"
 *   cart:
 *     $ref: "#/components/schemas/BaseCart"
 *   cart_id:
 *     type: string
 *     title: cart_id
 *     description: The item's cart id.
 *   metadata:
 *     type: object
 *     description: The item's metadata.
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
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The item's deleted at.
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
 * 
*/

