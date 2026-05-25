/**
 * @schema StoreOrderLineItem
 * type: object
 * description: The item's details.
 * x-schemaName: StoreOrderLineItem
 * required:
 *   - detail
 *   - title
 *   - id
 *   - metadata
 *   - created_at
 *   - updated_at
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
 *   - subtitle
 *   - thumbnail
 *   - variant_id
 *   - product_id
 *   - product_title
 *   - product_description
 *   - product_subtitle
 *   - product_type_id
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
 *   - refundable_total
 *   - refundable_total_per_unit
 * properties:
 *   variant:
 *     $ref: "#/components/schemas/StoreProductVariant"
 *   product:
 *     $ref: "#/components/schemas/StoreProduct"
 *   tax_lines:
 *     type: array
 *     description: The item's tax lines.
 *     items:
 *       allOf:
 *         - $ref: "#/components/schemas/BaseOrderLineItemTaxLine"
 *         - type: object
 *           description: The tax line's tax lines.
 *           required:
 *             - item
 *           properties:
 *             item:
 *               $ref: "#/components/schemas/StoreOrderLineItem"
 *   adjustments:
 *     type: array
 *     description: The item's adjustments.
 *     items:
 *       allOf:
 *         - $ref: "#/components/schemas/BaseOrderLineItemAdjustment"
 *         - type: object
 *           description: The adjustment's adjustments.
 *           required:
 *             - item
 *           properties:
 *             item:
 *               $ref: "#/components/schemas/StoreOrderLineItem"
 *   detail:
 *     allOf:
 *       - $ref: "#/components/schemas/BaseOrderItemDetail"
 *       - type: object
 *         description: The item's detail.
 *         required:
 *           - item
 *         properties:
 *           item:
 *             $ref: "#/components/schemas/StoreOrderLineItem"
 *   title:
 *     type: string
 *     title: title
 *     description: The item's title.
 *   id:
 *     type: string
 *     title: id
 *     description: The item's ID.
 *   metadata:
 *     type: object
 *     description: Custom key-value pairs of the item.
 *     externalDocs:
 *       url: https://docs.medusajs.com/api/store#manage-metadata
 *       description: Learn how to manage metadata
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the item was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the item was updated.
 *   original_total:
 *     type: number
 *     title: original_total
 *     description: The item's total including taxes, excluding promotions.
 *   original_subtotal:
 *     type: number
 *     title: original_subtotal
 *     description: The item's total excluding taxes, including promotions.
 *   original_tax_total:
 *     type: number
 *     title: original_tax_total
 *     description: The total taxes of the item, excluding promotions.
 *   item_total:
 *     type: number
 *     title: item_total
 *     description: The total taxes of the item, including promotions.
 *   item_subtotal:
 *     type: number
 *     title: item_subtotal
 *     description: The item's total excluding taxes, including promotions.
 *   item_tax_total:
 *     type: number
 *     title: item_tax_total
 *     description: The total taxes of the item, including promotions.
 *   total:
 *     type: number
 *     title: total
 *     description: The item's total, including taxes and promotions.
 *   subtotal:
 *     type: number
 *     title: subtotal
 *     description: The item's subtotal excluding taxes, including promotions.
 *   tax_total:
 *     type: number
 *     title: tax_total
 *     description: The tax total of the item including promotions.
 *   discount_total:
 *     type: number
 *     title: discount_total
 *     description: The total discount amount of the item.
 *   discount_tax_total:
 *     type: number
 *     title: discount_tax_total
 *     description: The total taxes applied on the discounted amount.
 *   refundable_total:
 *     type: number
 *     title: refundable_total
 *     description: The total refundable amount of the item's total.
 *   refundable_total_per_unit:
 *     type: number
 *     title: refundable_total_per_unit
 *     description: The total refundable amount of the item's total for a single quantity.
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
 *     description: The ID of the associated variant.
 *   product_id:
 *     type: string
 *     title: product_id
 *     description: The ID of the associated product.
 *   product_title:
 *     type: string
 *     title: product_title
 *     description: The title of the associated product.
 *   product_description:
 *     type: string
 *     title: product_description
 *     description: The description of the associated product.
 *   product_subtitle:
 *     type: string
 *     title: product_subtitle
 *     description: The subtitle of the associated product.
 *   product_type:
 *     type: string
 *     title: product_type
 *     description: The type of the associated product.
 *   product_collection:
 *     type: string
 *     title: product_collection
 *     description: The ID of the associated product's collection.
 *   product_handle:
 *     type: string
 *     title: product_handle
 *     description: The handle of the associated product.
 *   variant_sku:
 *     type: string
 *     title: variant_sku
 *     description: The SKU of the associated variant.
 *   variant_barcode:
 *     type: string
 *     title: variant_barcode
 *     description: The barcode of the associated variant.
 *   variant_title:
 *     type: string
 *     title: variant_title
 *     description: The title of the associated variant.
 *   variant_option_values:
 *     type: object
 *     description: The option values of the associated variant, where the key is the option name and the value is the option value.
 *   requires_shipping:
 *     type: boolean
 *     title: requires_shipping
 *     description: Whether the associated variant requires shipping.
 *   is_discountable:
 *     type: boolean
 *     title: is_discountable
 *     description: Whether the associated variant is discountable.
 *   is_tax_inclusive:
 *     type: boolean
 *     title: is_tax_inclusive
 *     description: Whether the associated variant's price includes taxes.
 *   compare_at_unit_price:
 *     type: number
 *     title: The original price of the item before a promotion or sale.
 *     description: The item's compare at unit price.
 *   unit_price:
 *     type: number
 *     title: unit_price
 *     description: The price of a single quantity of the item.
 *   quantity:
 *     type: number
 *     title: quantity
 *     description: The item's quantity.
 *   product_type_id:
 *     type: string
 *     title: product_type_id
 *     description: The ID of the associated product's type.
 * 
*/

