/**
 * @schema StoreCartLineItem
 * type: object
 * description: The item's details.
 * x-schemaName: StoreCartLineItem
 * required:
 *   - cart
 *   - title
 *   - id
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
 *   - requires_shipping
 *   - is_discountable
 *   - is_tax_inclusive
 *   - unit_price
 *   - quantity
 *   - cart_id
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
 *     description: The item's thumbnail URL.
 *   quantity:
 *     type: number
 *     title: quantity
 *     description: The item's quantity.
 *   product:
 *     $ref: "#/components/schemas/StoreProduct"
 *   product_id:
 *     type: string
 *     title: product_id
 *     description: The ID of the associated product.
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
 *     description: The ID of the associated product's type.
 *   product_collection:
 *     type: string
 *     title: product_collection
 *     description: The ID of the associated product's collection.
 *   product_handle:
 *     type: string
 *     title: product_handle
 *     description: The item's product handle.
 *   variant:
 *     $ref: "#/components/schemas/StoreProductVariant"
 *   variant_id:
 *     type: string
 *     title: variant_id
 *     description: The ID of the associated product variant.
 *   variant_sku:
 *     type: string
 *     title: variant_sku
 *     description: The item's variant SKU.
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
 *     description: The associated variant's value for the product's options.
 *     example:
 *       Color: Red
 *   requires_shipping:
 *     type: boolean
 *     title: requires_shipping
 *     description: Whether the item requires shipping.
 *   is_discountable:
 *     type: boolean
 *     title: is_discountable
 *     description: Whether the item is discountable.
 *   is_tax_inclusive:
 *     type: boolean
 *     title: is_tax_inclusive
 *     description: Whether the item's price includes taxes.
 *   compare_at_unit_price:
 *     type: number
 *     title: compare_at_unit_price
 *     description: The original price of the item before a promotion or sale.
 *   unit_price:
 *     type: number
 *     title: unit_price
 *     description: The price of a single quantity of the item.
 *   tax_lines:
 *     type: array
 *     description: The item's tax lines.
 *     items:
 *       allOf:
 *         - type: object
 *           description: The tax line's details.
 *           x-schemaName: BaseLineItemTaxLine
 *           required:
 *             - item
 *             - item_id
 *             - total
 *             - subtotal
 *             - id
 *             - code
 *             - rate
 *             - created_at
 *             - updated_at
 *           properties:
 *             item:
 *               type: object
 *               title: item
 *               description: The details of the item that the tax line belongs to.
 *             item_id:
 *               type: string
 *               title: item_id
 *               description: The ID of the line item this tax line belongs to.
 *             total:
 *               type: number
 *               title: total
 *               description: The item's total including taxes and promotions.
 *             subtotal:
 *               type: number
 *               title: subtotal
 *               description: The item's total excluding taxes, including promotions.
 *             id:
 *               type: string
 *               title: id
 *               description: The tax line's ID.
 *             description:
 *               type: string
 *               title: description
 *               description: The tax line's description.
 *             tax_rate_id:
 *               type: string
 *               title: tax_rate_id
 *               description: The ID of the applied tax rate.
 *             code:
 *               type: string
 *               title: code
 *               description: The code that the tax rate is identified by.
 *             rate:
 *               type: number
 *               title: rate
 *               description: The charged rate.
 *             provider_id:
 *               type: string
 *               title: provider_id
 *               description: The ID of the tax provider used to calculate the tax line.
 *             created_at:
 *               type: string
 *               format: date-time
 *               title: created_at
 *               description: The date the tax line was created.
 *             updated_at:
 *               type: string
 *               format: date-time
 *               title: updated_at
 *               description: The date the tax line was updated.
 *         - type: object
 *           description: The tax line's details.
 *           required:
 *             - item
 *           properties:
 *             item:
 *               type: object
 *               title: item
 *               description: The details of the item that the tax line belongs to.
 *       description: The tax line's details
 *   adjustments:
 *     type: array
 *     description: The item's adjustments.
 *     items:
 *       allOf:
 *         - type: object
 *           description: The adjustment's details.
 *           x-schemaName: BaseLineItemAdjustment
 *           required:
 *             - item
 *             - item_id
 *             - id
 *             - amount
 *             - cart_id
 *             - created_at
 *             - updated_at
 *           properties:
 *             item:
 *               type: object
 *               title: item
 *               description: The details of the item that the adjustment belongs to.
 *             item_id:
 *               type: string
 *               title: item_id
 *               description: The ID of the item that the adjustment belongs to.
 *             id:
 *               type: string
 *               title: id
 *               description: The adjustment's ID.
 *             code:
 *               type: string
 *               title: code
 *               description: The adjustment's code.
 *             amount:
 *               type: number
 *               title: amount
 *               description: The adjustment's amount.
 *             cart_id:
 *               type: string
 *               title: cart_id
 *               description: The ID of the associated cart.
 *             description:
 *               type: string
 *               title: description
 *               description: The adjustment's description.
 *             promotion_id:
 *               type: string
 *               title: promotion_id
 *               description: The ID of the applied promotion.
 *             provider_id:
 *               type: string
 *               title: provider_id
 *               description: The adjustment's provider ID.
 *             created_at:
 *               type: string
 *               format: date-time
 *               title: created_at
 *               description: The date the adjustment was created.
 *             updated_at:
 *               type: string
 *               format: date-time
 *               title: updated_at
 *               description: The date the adjustment was updated.
 *         - type: object
 *           description: The adjustment's details.
 *           required:
 *             - item
 *           properties:
 *             item:
 *               type: object
 *               title: item
 *               description: The details of the item that the adjustment belongs to.
 *       description: The adjustment's details.
 *   cart:
 *     $ref: "#/components/schemas/StoreCart"
 *   cart_id:
 *     type: string
 *     title: cart_id
 *     description: The ID of the cart that the line item belongs to.
 *   metadata:
 *     type: object
 *     description: The item's metadata, can hold custom key-value pairs.
 *   created_at:
 *     type: string
 *     title: created_at
 *     description: The date the item was created.
 *     format: date-time
 *   updated_at:
 *     type: string
 *     title: updated_at
 *     description: The date the item was updated.
 *     format: date-time
 *   deleted_at:
 *     type: string
 *     title: deleted_at
 *     description: The date the item was deleted.
 *     format: date-time
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
 *     description: The total taxes of the item excluding promotions.
 *   item_total:
 *     type: number
 *     title: original_tax_total
 *     description: The item's total including taxes and promotions.
 *   item_subtotal:
 *     type: number
 *     title: item_subtotal
 *     description: The item's total excluding taxes, including promotions.
 *   item_tax_total:
 *     type: number
 *     title: item_tax_total
 *     description: The total taxes of the item including promotions.
 *   total:
 *     type: number
 *     title: total
 *     description: The item's total including taxes and promotions.
 *   subtotal:
 *     type: number
 *     title: subtotal
 *     description: The item's total excluding taxes, including promotions.
 *   tax_total:
 *     type: number
 *     title: tax_total
 *     description: The total taxes of the item including promotions.
 *   discount_total:
 *     type: number
 *     title: discount_total
 *     description: The total discount of the item.
 *   discount_tax_total:
 *     type: number
 *     title: discount_tax_total
 *     description: The total taxes applied on the discounted amount.
 * 
*/

