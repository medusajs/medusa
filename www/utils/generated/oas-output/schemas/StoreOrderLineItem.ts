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
 *     description: The URL of the item's thumbnail.
 *   variant:
 *     $ref: "#/components/schemas/StoreProductVariant"
 *   variant_id:
 *     type: string
 *     title: variant_id
 *     description: The ID of the associated variant.
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
 *     description: The item's product type.
 *   product_collection:
 *     type: string
 *     title: product_collection
 *     description: The ID of the collection the item's product belongs to.
 *   product_handle:
 *     type: string
 *     title: product_handle
 *     description: The item's product handle.
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
 *     description: The values of the item variant's options.
 *     example:
 *       Color: Blue
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
 *     description: Whether the item is tax inclusive.
 *   compare_at_unit_price:
 *     type: number
 *     title: compare_at_unit_price
 *     description: The original price of the item before a promotion or sale.
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
 *       allOf:
 *         - type: object
 *           description: The tax line's tax lines.
 *           x-schemaName: BaseOrderLineItemTaxLine
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
 *               description: The tax line's item.
 *               x-schemaName: BaseOrderLineItem
 *               required:
 *                 - id
 *                 - title
 *                 - subtitle
 *                 - thumbnail
 *                 - variant_id
 *                 - product_id
 *                 - product_title
 *                 - product_description
 *                 - product_subtitle
 *                 - product_type
 *                 - product_collection
 *                 - product_handle
 *                 - variant_sku
 *                 - variant_barcode
 *                 - variant_title
 *                 - variant_option_values
 *                 - requires_shipping
 *                 - is_discountable
 *                 - is_tax_inclusive
 *                 - unit_price
 *                 - quantity
 *                 - detail
 *                 - created_at
 *                 - updated_at
 *                 - metadata
 *                 - original_total
 *                 - original_subtotal
 *                 - original_tax_total
 *                 - item_total
 *                 - item_subtotal
 *                 - item_tax_total
 *                 - total
 *                 - subtotal
 *                 - tax_total
 *                 - discount_total
 *                 - discount_tax_total
 *                 - refundable_total
 *                 - refundable_total_per_unit
 *               properties:
 *                 id:
 *                   type: string
 *                   title: id
 *                   description: The item's ID.
 *                 title:
 *                   type: string
 *                   title: title
 *                   description: The item's title.
 *                 subtitle:
 *                   type: string
 *                   title: subtitle
 *                   description: The item's subtitle.
 *                 thumbnail:
 *                   type: string
 *                   title: thumbnail
 *                   description: The item's thumbnail.
 *                 variant:
 *                   type: object
 *                   description: The item's variant.
 *                   x-schemaName: BaseProductVariant
 *                   required:
 *                     - id
 *                     - title
 *                     - sku
 *                     - barcode
 *                     - ean
 *                     - upc
 *                     - allow_backorder
 *                     - manage_inventory
 *                     - hs_code
 *                     - origin_country
 *                     - mid_code
 *                     - material
 *                     - weight
 *                     - length
 *                     - height
 *                     - width
 *                     - options
 *                     - created_at
 *                     - updated_at
 *                     - deleted_at
 *                   properties:
 *                     id:
 *                       type: string
 *                       title: id
 *                       description: The variant's ID.
 *                     title:
 *                       type: string
 *                       title: title
 *                       description: The variant's title.
 *                     sku:
 *                       type: string
 *                       title: sku
 *                       description: The variant's sku.
 *                     barcode:
 *                       type: string
 *                       title: barcode
 *                       description: The variant's barcode.
 *                     ean:
 *                       type: string
 *                       title: ean
 *                       description: The variant's ean.
 *                     upc:
 *                       type: string
 *                       title: upc
 *                       description: The variant's upc.
 *                     allow_backorder:
 *                       type: boolean
 *                       title: allow_backorder
 *                       description: The variant's allow backorder.
 *                     manage_inventory:
 *                       type: boolean
 *                       title: manage_inventory
 *                       description: The variant's manage inventory.
 *                     inventory_quantity:
 *                       type: number
 *                       title: inventory_quantity
 *                       description: The variant's inventory quantity.
 *                     hs_code:
 *                       type: string
 *                       title: hs_code
 *                       description: The variant's hs code.
 *                     origin_country:
 *                       type: string
 *                       title: origin_country
 *                       description: The variant's origin country.
 *                     mid_code:
 *                       type: string
 *                       title: mid_code
 *                       description: The variant's mid code.
 *                     material:
 *                       type: string
 *                       title: material
 *                       description: The variant's material.
 *                     weight:
 *                       type: number
 *                       title: weight
 *                       description: The variant's weight.
 *                     length:
 *                       type: number
 *                       title: length
 *                       description: The variant's length.
 *                     height:
 *                       type: number
 *                       title: height
 *                       description: The variant's height.
 *                     width:
 *                       type: number
 *                       title: width
 *                       description: The variant's width.
 *                     variant_rank:
 *                       type: number
 *                       title: variant_rank
 *                       description: The variant's variant rank.
 *                     options:
 *                       type: array
 *                       description: The variant's options.
 *                       items:
 *                         type: object
 *                         description: The option's options.
 *                         x-schemaName: BaseProductOptionValue
 *                     product:
 *                       type: object
 *                       description: The variant's product.
 *                       x-schemaName: BaseProduct
 *                     product_id:
 *                       type: string
 *                       title: product_id
 *                       description: The variant's product id.
 *                     calculated_price:
 *                       type: object
 *                       description: The variant's calculated price.
 *                       x-schemaName: BaseCalculatedPriceSet
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       title: created_at
 *                       description: The variant's created at.
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       title: updated_at
 *                       description: The variant's updated at.
 *                     deleted_at:
 *                       type: string
 *                       format: date-time
 *                       title: deleted_at
 *                       description: The variant's deleted at.
 *                     metadata:
 *                       type: object
 *                       description: The variant's metadata.
 *                 variant_id:
 *                   type: string
 *                   title: variant_id
 *                   description: The item's variant id.
 *                 product:
 *                   type: object
 *                   description: The item's product.
 *                   x-schemaName: BaseProduct
 *                   required:
 *                     - id
 *                     - title
 *                     - handle
 *                     - subtitle
 *                     - description
 *                     - is_giftcard
 *                     - status
 *                     - thumbnail
 *                     - width
 *                     - weight
 *                     - length
 *                     - height
 *                     - origin_country
 *                     - hs_code
 *                     - mid_code
 *                     - material
 *                     - collection_id
 *                     - type_id
 *                     - variants
 *                     - options
 *                     - images
 *                     - discountable
 *                     - external_id
 *                     - created_at
 *                     - updated_at
 *                     - deleted_at
 *                   properties:
 *                     id:
 *                       type: string
 *                       title: id
 *                       description: The product's ID.
 *                     title:
 *                       type: string
 *                       title: title
 *                       description: The product's title.
 *                     handle:
 *                       type: string
 *                       title: handle
 *                       description: The product's handle.
 *                     subtitle:
 *                       type: string
 *                       title: subtitle
 *                       description: The product's subtitle.
 *                     description:
 *                       type: string
 *                       title: description
 *                       description: The product's description.
 *                     is_giftcard:
 *                       type: boolean
 *                       title: is_giftcard
 *                       description: The product's is giftcard.
 *                     status:
 *                       type: string
 *                       description: The product's status.
 *                       enum:
 *                         - draft
 *                         - proposed
 *                         - published
 *                         - rejected
 *                     thumbnail:
 *                       type: string
 *                       title: thumbnail
 *                       description: The product's thumbnail.
 *                     width:
 *                       type: number
 *                       title: width
 *                       description: The product's width.
 *                     weight:
 *                       type: number
 *                       title: weight
 *                       description: The product's weight.
 *                     length:
 *                       type: number
 *                       title: length
 *                       description: The product's length.
 *                     height:
 *                       type: number
 *                       title: height
 *                       description: The product's height.
 *                     origin_country:
 *                       type: string
 *                       title: origin_country
 *                       description: The product's origin country.
 *                     hs_code:
 *                       type: string
 *                       title: hs_code
 *                       description: The product's hs code.
 *                     mid_code:
 *                       type: string
 *                       title: mid_code
 *                       description: The product's mid code.
 *                     material:
 *                       type: string
 *                       title: material
 *                       description: The product's material.
 *                     collection:
 *                       type: object
 *                       description: The product's collection.
 *                       x-schemaName: BaseCollection
 *                     collection_id:
 *                       type: string
 *                       title: collection_id
 *                       description: The product's collection id.
 *                     categories:
 *                       type: array
 *                       description: The product's categories.
 *                       items:
 *                         type: object
 *                         description: The category's categories.
 *                         x-schemaName: BaseProductCategory
 *                     type:
 *                       type: object
 *                       description: The product's type.
 *                       x-schemaName: BaseProduct
 *                     type_id:
 *                       type: string
 *                       title: type_id
 *                       description: The product's type id.
 *                     tags:
 *                       type: array
 *                       description: The product's tags.
 *                       items:
 *                         type: object
 *                         description: The tag's tags.
 *                         x-schemaName: BaseProductTag
 *                     variants:
 *                       type: array
 *                       description: The product's variants.
 *                       items:
 *                         type: object
 *                         description: The variant's variants.
 *                         x-schemaName: BaseProductVariant
 *                     options:
 *                       type: array
 *                       description: The product's options.
 *                       items:
 *                         type: object
 *                         description: The option's options.
 *                         x-schemaName: BaseProductOption
 *                     images:
 *                       type: array
 *                       description: The product's images.
 *                       items:
 *                         type: object
 *                         description: The image's images.
 *                         x-schemaName: BaseProductImage
 *                     discountable:
 *                       type: boolean
 *                       title: discountable
 *                       description: The product's discountable.
 *                     external_id:
 *                       type: string
 *                       title: external_id
 *                       description: The product's external id.
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       title: created_at
 *                       description: The product's created at.
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       title: updated_at
 *                       description: The product's updated at.
 *                     deleted_at:
 *                       type: string
 *                       format: date-time
 *                       title: deleted_at
 *                       description: The product's deleted at.
 *                     metadata:
 *                       type: object
 *                       description: The product's metadata.
 *                 product_id:
 *                   type: string
 *                   title: product_id
 *                   description: The item's product id.
 *                 product_title:
 *                   type: string
 *                   title: product_title
 *                   description: The item's product title.
 *                 product_description:
 *                   type: string
 *                   title: product_description
 *                   description: The item's product description.
 *                 product_subtitle:
 *                   type: string
 *                   title: product_subtitle
 *                   description: The item's product subtitle.
 *                 product_type:
 *                   type: string
 *                   title: product_type
 *                   description: The item's product type.
 *                 product_collection:
 *                   type: string
 *                   title: product_collection
 *                   description: The item's product collection.
 *                 product_handle:
 *                   type: string
 *                   title: product_handle
 *                   description: The item's product handle.
 *                 variant_sku:
 *                   type: string
 *                   title: variant_sku
 *                   description: The item's variant sku.
 *                 variant_barcode:
 *                   type: string
 *                   title: variant_barcode
 *                   description: The item's variant barcode.
 *                 variant_title:
 *                   type: string
 *                   title: variant_title
 *                   description: The item's variant title.
 *                 variant_option_values:
 *                   type: object
 *                   description: The item's variant option values.
 *                 requires_shipping:
 *                   type: boolean
 *                   title: requires_shipping
 *                   description: The item's requires shipping.
 *                 is_discountable:
 *                   type: boolean
 *                   title: is_discountable
 *                   description: The item's is discountable.
 *                 is_tax_inclusive:
 *                   type: boolean
 *                   title: is_tax_inclusive
 *                   description: The item's is tax inclusive.
 *                 compare_at_unit_price:
 *                   type: number
 *                   title: compare_at_unit_price
 *                   description: The item's compare at unit price.
 *                 unit_price:
 *                   type: number
 *                   title: unit_price
 *                   description: The item's unit price.
 *                 quantity:
 *                   type: number
 *                   title: quantity
 *                   description: The item's quantity.
 *                 tax_lines:
 *                   type: array
 *                   description: The item's tax lines.
 *                   items:
 *                     type: object
 *                     description: The tax line's tax lines.
 *                     x-schemaName: BaseOrderLineItemTaxLine
 *                     required:
 *                       - item
 *                       - item_id
 *                       - total
 *                       - subtotal
 *                       - id
 *                       - code
 *                       - rate
 *                       - created_at
 *                       - updated_at
 *                     properties:
 *                       item:
 *                         type: object
 *                         description: The tax line's item.
 *                         x-schemaName: BaseOrderLineItem
 *                       item_id:
 *                         type: string
 *                         title: item_id
 *                         description: The tax line's item id.
 *                       total:
 *                         type: number
 *                         title: total
 *                         description: The tax line's total.
 *                       subtotal:
 *                         type: number
 *                         title: subtotal
 *                         description: The tax line's subtotal.
 *                       id:
 *                         type: string
 *                         title: id
 *                         description: The tax line's ID.
 *                       description:
 *                         type: string
 *                         title: description
 *                         description: The tax line's description.
 *                       tax_rate_id:
 *                         type: string
 *                         title: tax_rate_id
 *                         description: The tax line's tax rate id.
 *                       code:
 *                         type: string
 *                         title: code
 *                         description: The tax line's code.
 *                       rate:
 *                         type: number
 *                         title: rate
 *                         description: The tax line's rate.
 *                       provider_id:
 *                         type: string
 *                         title: provider_id
 *                         description: The tax line's provider id.
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         title: created_at
 *                         description: The tax line's created at.
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         title: updated_at
 *                         description: The tax line's updated at.
 *                 adjustments:
 *                   type: array
 *                   description: The item's adjustments.
 *                   items:
 *                     type: object
 *                     description: The adjustment's adjustments.
 *                     x-schemaName: BaseOrderLineItemAdjustment
 *                     required:
 *                       - item
 *                       - item_id
 *                       - id
 *                       - amount
 *                       - order_id
 *                       - created_at
 *                       - updated_at
 *                     properties:
 *                       item:
 *                         type: object
 *                         description: The adjustment's item.
 *                         x-schemaName: BaseOrderLineItem
 *                       item_id:
 *                         type: string
 *                         title: item_id
 *                         description: The adjustment's item id.
 *                       id:
 *                         type: string
 *                         title: id
 *                         description: The adjustment's ID.
 *                       code:
 *                         type: string
 *                         title: code
 *                         description: The adjustment's code.
 *                       amount:
 *                         type: number
 *                         title: amount
 *                         description: The adjustment's amount.
 *                       order_id:
 *                         type: string
 *                         title: order_id
 *                         description: The adjustment's order id.
 *                       description:
 *                         type: string
 *                         title: description
 *                         description: The adjustment's description.
 *                       promotion_id:
 *                         type: string
 *                         title: promotion_id
 *                         description: The adjustment's promotion id.
 *                       provider_id:
 *                         type: string
 *                         title: provider_id
 *                         description: The adjustment's provider id.
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         title: created_at
 *                         description: The adjustment's created at.
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         title: updated_at
 *                         description: The adjustment's updated at.
 *                 detail:
 *                   type: object
 *                   description: The item's detail.
 *                   x-schemaName: BaseOrderItemDetail
 *                   required:
 *                     - id
 *                     - item_id
 *                     - item
 *                     - quantity
 *                     - fulfilled_quantity
 *                     - delivered_quantity
 *                     - shipped_quantity
 *                     - return_requested_quantity
 *                     - return_received_quantity
 *                     - return_dismissed_quantity
 *                     - written_off_quantity
 *                     - metadata
 *                     - created_at
 *                     - updated_at
 *                   properties:
 *                     id:
 *                       type: string
 *                       title: id
 *                       description: The detail's ID.
 *                     item_id:
 *                       type: string
 *                       title: item_id
 *                       description: The detail's item id.
 *                     item:
 *                       type: object
 *                       description: The detail's item.
 *                       x-schemaName: BaseOrderLineItem
 *                     quantity:
 *                       type: number
 *                       title: quantity
 *                       description: The detail's quantity.
 *                     fulfilled_quantity:
 *                       type: number
 *                       title: fulfilled_quantity
 *                       description: The detail's fulfilled quantity.
 *                     delivered_quantity:
 *                       type: number
 *                       title: delivered_quantity
 *                       description: The detail's delivered quantity.
 *                     shipped_quantity:
 *                       type: number
 *                       title: shipped_quantity
 *                       description: The detail's shipped quantity.
 *                     return_requested_quantity:
 *                       type: number
 *                       title: return_requested_quantity
 *                       description: The detail's return requested quantity.
 *                     return_received_quantity:
 *                       type: number
 *                       title: return_received_quantity
 *                       description: The detail's return received quantity.
 *                     return_dismissed_quantity:
 *                       type: number
 *                       title: return_dismissed_quantity
 *                       description: The detail's return dismissed quantity.
 *                     written_off_quantity:
 *                       type: number
 *                       title: written_off_quantity
 *                       description: The detail's written off quantity.
 *                     metadata:
 *                       type: object
 *                       description: The detail's metadata.
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       title: created_at
 *                       description: The detail's created at.
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       title: updated_at
 *                       description: The detail's updated at.
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   title: created_at
 *                   description: The item's created at.
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   title: updated_at
 *                   description: The item's updated at.
 *                 metadata:
 *                   type: object
 *                   description: The item's metadata.
 *                 original_total:
 *                   type: number
 *                   title: original_total
 *                   description: The item's original total.
 *                 original_subtotal:
 *                   type: number
 *                   title: original_subtotal
 *                   description: The item's original subtotal.
 *                 original_tax_total:
 *                   type: number
 *                   title: original_tax_total
 *                   description: The item's original tax total.
 *                 item_total:
 *                   type: number
 *                   title: item_total
 *                   description: The item's item total.
 *                 item_subtotal:
 *                   type: number
 *                   title: item_subtotal
 *                   description: The item's item subtotal.
 *                 item_tax_total:
 *                   type: number
 *                   title: item_tax_total
 *                   description: The item's item tax total.
 *                 total:
 *                   type: number
 *                   title: total
 *                   description: The item's total.
 *                 subtotal:
 *                   type: number
 *                   title: subtotal
 *                   description: The item's subtotal.
 *                 tax_total:
 *                   type: number
 *                   title: tax_total
 *                   description: The item's tax total.
 *                 discount_total:
 *                   type: number
 *                   title: discount_total
 *                   description: The item's discount total.
 *                 discount_tax_total:
 *                   type: number
 *                   title: discount_tax_total
 *                   description: The item's discount tax total.
 *                 refundable_total:
 *                   type: number
 *                   title: refundable_total
 *                   description: The item's refundable total.
 *                 refundable_total_per_unit:
 *                   type: number
 *                   title: refundable_total_per_unit
 *                   description: The item's refundable total per unit.
 *             item_id:
 *               type: string
 *               title: item_id
 *               description: The tax line's item id.
 *             total:
 *               type: number
 *               title: total
 *               description: The tax line's total.
 *             subtotal:
 *               type: number
 *               title: subtotal
 *               description: The tax line's subtotal.
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
 *               description: The tax line's tax rate id.
 *             code:
 *               type: string
 *               title: code
 *               description: The tax line's code.
 *             rate:
 *               type: number
 *               title: rate
 *               description: The tax line's rate.
 *             provider_id:
 *               type: string
 *               title: provider_id
 *               description: The tax line's provider id.
 *             created_at:
 *               type: string
 *               format: date-time
 *               title: created_at
 *               description: The tax line's created at.
 *             updated_at:
 *               type: string
 *               format: date-time
 *               title: updated_at
 *               description: The tax line's updated at.
 *         - type: object
 *           description: The tax line's tax lines.
 *           required:
 *             - item
 *           properties:
 *             item:
 *               type: object
 *               description: The tax line's item.
 *               x-schemaName: StoreOrderLineItem
 *               required:
 *                 - detail
 *                 - title
 *                 - id
 *                 - metadata
 *                 - created_at
 *                 - updated_at
 *                 - item_total
 *                 - item_subtotal
 *                 - item_tax_total
 *                 - original_total
 *                 - original_subtotal
 *                 - original_tax_total
 *                 - total
 *                 - subtotal
 *                 - tax_total
 *                 - discount_total
 *                 - discount_tax_total
 *                 - subtitle
 *                 - thumbnail
 *                 - variant_id
 *                 - product_id
 *                 - product_title
 *                 - product_description
 *                 - product_subtitle
 *                 - product_type
 *                 - product_collection
 *                 - product_handle
 *                 - variant_sku
 *                 - variant_barcode
 *                 - variant_title
 *                 - variant_option_values
 *                 - requires_shipping
 *                 - is_discountable
 *                 - is_tax_inclusive
 *                 - unit_price
 *                 - quantity
 *                 - refundable_total
 *                 - refundable_total_per_unit
 *               properties:
 *                 variant:
 *                   type: object
 *                   description: The item's variant.
 *                   x-schemaName: StoreProductVariant
 *                   required:
 *                     - options
 *                     - length
 *                     - title
 *                     - id
 *                     - created_at
 *                     - updated_at
 *                     - width
 *                     - weight
 *                     - height
 *                     - origin_country
 *                     - hs_code
 *                     - mid_code
 *                     - material
 *                     - deleted_at
 *                     - sku
 *                     - barcode
 *                     - ean
 *                     - upc
 *                     - allow_backorder
 *                     - manage_inventory
 *                   properties:
 *                     options:
 *                       type: array
 *                       description: The variant's options.
 *                       items:
 *                         type: object
 *                         description: The option's options.
 *                         x-schemaName: StoreProductOptionValue
 *                     product:
 *                       type: object
 *                       description: The variant's product.
 *                       x-schemaName: StoreProduct
 *                     length:
 *                       type: number
 *                       title: length
 *                       description: The variant's length.
 *                     title:
 *                       type: string
 *                       title: title
 *                       description: The variant's title.
 *                     id:
 *                       type: string
 *                       title: id
 *                       description: The variant's ID.
 *                     metadata:
 *                       type: object
 *                       description: The variant's metadata.
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       title: created_at
 *                       description: The variant's created at.
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       title: updated_at
 *                       description: The variant's updated at.
 *                     product_id:
 *                       type: string
 *                       title: product_id
 *                       description: The variant's product id.
 *                     width:
 *                       type: number
 *                       title: width
 *                       description: The variant's width.
 *                     weight:
 *                       type: number
 *                       title: weight
 *                       description: The variant's weight.
 *                     height:
 *                       type: number
 *                       title: height
 *                       description: The variant's height.
 *                     origin_country:
 *                       type: string
 *                       title: origin_country
 *                       description: The variant's origin country.
 *                     hs_code:
 *                       type: string
 *                       title: hs_code
 *                       description: The variant's hs code.
 *                     mid_code:
 *                       type: string
 *                       title: mid_code
 *                       description: The variant's mid code.
 *                     material:
 *                       type: string
 *                       title: material
 *                       description: The variant's material.
 *                     deleted_at:
 *                       type: string
 *                       format: date-time
 *                       title: deleted_at
 *                       description: The variant's deleted at.
 *                     sku:
 *                       type: string
 *                       title: sku
 *                       description: The variant's sku.
 *                     barcode:
 *                       type: string
 *                       title: barcode
 *                       description: The variant's barcode.
 *                     ean:
 *                       type: string
 *                       title: ean
 *                       description: The variant's ean.
 *                     upc:
 *                       type: string
 *                       title: upc
 *                       description: The variant's upc.
 *                     allow_backorder:
 *                       type: boolean
 *                       title: allow_backorder
 *                       description: The variant's allow backorder.
 *                     manage_inventory:
 *                       type: boolean
 *                       title: manage_inventory
 *                       description: The variant's manage inventory.
 *                     inventory_quantity:
 *                       type: number
 *                       title: inventory_quantity
 *                       description: The variant's inventory quantity.
 *                     variant_rank:
 *                       type: number
 *                       title: variant_rank
 *                       description: The variant's variant rank.
 *                     calculated_price:
 *                       type: object
 *                       description: The variant's calculated price.
 *                       x-schemaName: BaseCalculatedPriceSet
 *                 product:
 *                   type: object
 *                   description: The item's product.
 *                   x-schemaName: StoreProduct
 *                   required:
 *                     - variants
 *                     - options
 *                     - images
 *                     - length
 *                     - title
 *                     - status
 *                     - description
 *                     - id
 *                     - created_at
 *                     - updated_at
 *                     - subtitle
 *                     - thumbnail
 *                     - handle
 *                     - is_giftcard
 *                     - width
 *                     - weight
 *                     - height
 *                     - origin_country
 *                     - hs_code
 *                     - mid_code
 *                     - material
 *                     - collection_id
 *                     - type_id
 *                     - discountable
 *                     - external_id
 *                     - deleted_at
 *                   properties:
 *                     collection:
 *                       type: object
 *                       description: The product's collection.
 *                       x-schemaName: StoreCollection
 *                     categories:
 *                       type: array
 *                       description: The product's categories.
 *                       items:
 *                         type: object
 *                         description: The category's categories.
 *                         x-schemaName: StoreProductCategory
 *                     variants:
 *                       type: array
 *                       description: The product's variants.
 *                       items:
 *                         type: object
 *                         description: The variant's variants.
 *                         x-schemaName: StoreProductVariant
 *                     type:
 *                       type: object
 *                       description: The product's type.
 *                       x-schemaName: StoreProduct
 *                     tags:
 *                       type: array
 *                       description: The product's tags.
 *                       items:
 *                         type: object
 *                         description: The tag's tags.
 *                         x-schemaName: StoreProductTag
 *                     options:
 *                       type: array
 *                       description: The product's options.
 *                       items:
 *                         type: object
 *                         description: The option's options.
 *                         x-schemaName: StoreProductOption
 *                     images:
 *                       type: array
 *                       description: The product's images.
 *                       items:
 *                         type: object
 *                         description: The image's images.
 *                         x-schemaName: StoreProductImage
 *                     length:
 *                       type: number
 *                       title: length
 *                       description: The product's length.
 *                     title:
 *                       type: string
 *                       title: title
 *                       description: The product's title.
 *                     status:
 *                       type: string
 *                       description: The product's status.
 *                       enum:
 *                         - draft
 *                         - proposed
 *                         - published
 *                         - rejected
 *                     description:
 *                       type: string
 *                       title: description
 *                       description: The product's description.
 *                     id:
 *                       type: string
 *                       title: id
 *                       description: The product's ID.
 *                     metadata:
 *                       type: object
 *                       description: The product's metadata.
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       title: created_at
 *                       description: The product's created at.
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       title: updated_at
 *                       description: The product's updated at.
 *                     subtitle:
 *                       type: string
 *                       title: subtitle
 *                       description: The product's subtitle.
 *                     thumbnail:
 *                       type: string
 *                       title: thumbnail
 *                       description: The product's thumbnail.
 *                     handle:
 *                       type: string
 *                       title: handle
 *                       description: The product's handle.
 *                     is_giftcard:
 *                       type: boolean
 *                       title: is_giftcard
 *                       description: The product's is giftcard.
 *                     width:
 *                       type: number
 *                       title: width
 *                       description: The product's width.
 *                     weight:
 *                       type: number
 *                       title: weight
 *                       description: The product's weight.
 *                     height:
 *                       type: number
 *                       title: height
 *                       description: The product's height.
 *                     origin_country:
 *                       type: string
 *                       title: origin_country
 *                       description: The product's origin country.
 *                     hs_code:
 *                       type: string
 *                       title: hs_code
 *                       description: The product's hs code.
 *                     mid_code:
 *                       type: string
 *                       title: mid_code
 *                       description: The product's mid code.
 *                     material:
 *                       type: string
 *                       title: material
 *                       description: The product's material.
 *                     collection_id:
 *                       type: string
 *                       title: collection_id
 *                       description: The product's collection id.
 *                     type_id:
 *                       type: string
 *                       title: type_id
 *                       description: The product's type id.
 *                     discountable:
 *                       type: boolean
 *                       title: discountable
 *                       description: The product's discountable.
 *                     external_id:
 *                       type: string
 *                       title: external_id
 *                       description: The product's external id.
 *                     deleted_at:
 *                       type: string
 *                       format: date-time
 *                       title: deleted_at
 *                       description: The product's deleted at.
 *                 tax_lines:
 *                   type: array
 *                   description: The item's tax lines.
 *                   items:
 *                     allOf:
 *                       - type: object
 *                         description: The tax line's tax lines.
 *                         x-schemaName: BaseOrderLineItemTaxLine
 *                         required:
 *                           - item
 *                           - item_id
 *                           - total
 *                           - subtotal
 *                           - id
 *                           - code
 *                           - rate
 *                           - created_at
 *                           - updated_at
 *                         properties:
 *                           item:
 *                             type: object
 *                             description: The tax line's item.
 *                             x-schemaName: BaseOrderLineItem
 *                           item_id:
 *                             type: string
 *                             title: item_id
 *                             description: The tax line's item id.
 *                           total:
 *                             type: number
 *                             title: total
 *                             description: The tax line's total.
 *                           subtotal:
 *                             type: number
 *                             title: subtotal
 *                             description: The tax line's subtotal.
 *                           id:
 *                             type: string
 *                             title: id
 *                             description: The tax line's ID.
 *                           description:
 *                             type: string
 *                             title: description
 *                             description: The tax line's description.
 *                           tax_rate_id:
 *                             type: string
 *                             title: tax_rate_id
 *                             description: The tax line's tax rate id.
 *                           code:
 *                             type: string
 *                             title: code
 *                             description: The tax line's code.
 *                           rate:
 *                             type: number
 *                             title: rate
 *                             description: The tax line's rate.
 *                           provider_id:
 *                             type: string
 *                             title: provider_id
 *                             description: The tax line's provider id.
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                             title: created_at
 *                             description: The tax line's created at.
 *                           updated_at:
 *                             type: string
 *                             format: date-time
 *                             title: updated_at
 *                             description: The tax line's updated at.
 *                       - type: object
 *                         description: The tax line's tax lines.
 *                         required:
 *                           - item
 *                         properties:
 *                           item:
 *                             type: object
 *                             description: The tax line's item.
 *                             x-schemaName: StoreOrderLineItem
 *                 adjustments:
 *                   type: array
 *                   description: The item's adjustments.
 *                   items:
 *                     allOf:
 *                       - type: object
 *                         description: The adjustment's adjustments.
 *                         x-schemaName: BaseOrderLineItemAdjustment
 *                         required:
 *                           - item
 *                           - item_id
 *                           - id
 *                           - amount
 *                           - order_id
 *                           - created_at
 *                           - updated_at
 *                         properties:
 *                           item:
 *                             type: object
 *                             description: The adjustment's item.
 *                             x-schemaName: BaseOrderLineItem
 *                           item_id:
 *                             type: string
 *                             title: item_id
 *                             description: The adjustment's item id.
 *                           id:
 *                             type: string
 *                             title: id
 *                             description: The adjustment's ID.
 *                           code:
 *                             type: string
 *                             title: code
 *                             description: The adjustment's code.
 *                           amount:
 *                             type: number
 *                             title: amount
 *                             description: The adjustment's amount.
 *                           order_id:
 *                             type: string
 *                             title: order_id
 *                             description: The adjustment's order id.
 *                           description:
 *                             type: string
 *                             title: description
 *                             description: The adjustment's description.
 *                           promotion_id:
 *                             type: string
 *                             title: promotion_id
 *                             description: The adjustment's promotion id.
 *                           provider_id:
 *                             type: string
 *                             title: provider_id
 *                             description: The adjustment's provider id.
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                             title: created_at
 *                             description: The adjustment's created at.
 *                           updated_at:
 *                             type: string
 *                             format: date-time
 *                             title: updated_at
 *                             description: The adjustment's updated at.
 *                       - type: object
 *                         description: The adjustment's adjustments.
 *                         required:
 *                           - item
 *                         properties:
 *                           item:
 *                             type: object
 *                             description: The adjustment's item.
 *                             x-schemaName: StoreOrderLineItem
 *                 detail:
 *                   allOf:
 *                     - type: object
 *                       description: The item's detail.
 *                       x-schemaName: BaseOrderItemDetail
 *                       required:
 *                         - id
 *                         - item_id
 *                         - item
 *                         - quantity
 *                         - fulfilled_quantity
 *                         - delivered_quantity
 *                         - shipped_quantity
 *                         - return_requested_quantity
 *                         - return_received_quantity
 *                         - return_dismissed_quantity
 *                         - written_off_quantity
 *                         - metadata
 *                         - created_at
 *                         - updated_at
 *                       properties:
 *                         id:
 *                           type: string
 *                           title: id
 *                           description: The detail's ID.
 *                         item_id:
 *                           type: string
 *                           title: item_id
 *                           description: The detail's item id.
 *                         item:
 *                           type: object
 *                           description: The detail's item.
 *                           x-schemaName: BaseOrderLineItem
 *                         quantity:
 *                           type: number
 *                           title: quantity
 *                           description: The detail's quantity.
 *                         fulfilled_quantity:
 *                           type: number
 *                           title: fulfilled_quantity
 *                           description: The detail's fulfilled quantity.
 *                         delivered_quantity:
 *                           type: number
 *                           title: delivered_quantity
 *                           description: The detail's delivered quantity.
 *                         shipped_quantity:
 *                           type: number
 *                           title: shipped_quantity
 *                           description: The detail's shipped quantity.
 *                         return_requested_quantity:
 *                           type: number
 *                           title: return_requested_quantity
 *                           description: The detail's return requested quantity.
 *                         return_received_quantity:
 *                           type: number
 *                           title: return_received_quantity
 *                           description: The detail's return received quantity.
 *                         return_dismissed_quantity:
 *                           type: number
 *                           title: return_dismissed_quantity
 *                           description: The detail's return dismissed quantity.
 *                         written_off_quantity:
 *                           type: number
 *                           title: written_off_quantity
 *                           description: The detail's written off quantity.
 *                         metadata:
 *                           type: object
 *                           description: The detail's metadata.
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                           title: created_at
 *                           description: The detail's created at.
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *                           title: updated_at
 *                           description: The detail's updated at.
 *                     - type: object
 *                       description: The item's detail.
 *                       required:
 *                         - item
 *                       properties:
 *                         item:
 *                           type: object
 *                           description: The detail's item.
 *                           x-schemaName: StoreOrderLineItem
 *                 title:
 *                   type: string
 *                   title: title
 *                   description: The item's title.
 *                 id:
 *                   type: string
 *                   title: id
 *                   description: The item's ID.
 *                 metadata:
 *                   type: object
 *                   description: The item's metadata.
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   title: created_at
 *                   description: The item's created at.
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   title: updated_at
 *                   description: The item's updated at.
 *                 item_total:
 *                   type: number
 *                   title: item_total
 *                   description: The item's item total.
 *                 item_subtotal:
 *                   type: number
 *                   title: item_subtotal
 *                   description: The item's item subtotal.
 *                 item_tax_total:
 *                   type: number
 *                   title: item_tax_total
 *                   description: The item's item tax total.
 *                 original_total:
 *                   type: number
 *                   title: original_total
 *                   description: The item's original total.
 *                 original_subtotal:
 *                   type: number
 *                   title: original_subtotal
 *                   description: The item's original subtotal.
 *                 original_tax_total:
 *                   type: number
 *                   title: original_tax_total
 *                   description: The item's original tax total.
 *                 total:
 *                   type: number
 *                   title: total
 *                   description: The item's total.
 *                 subtotal:
 *                   type: number
 *                   title: subtotal
 *                   description: The item's subtotal.
 *                 tax_total:
 *                   type: number
 *                   title: tax_total
 *                   description: The item's tax total.
 *                 discount_total:
 *                   type: number
 *                   title: discount_total
 *                   description: The item's discount total.
 *                 discount_tax_total:
 *                   type: number
 *                   title: discount_tax_total
 *                   description: The item's discount tax total.
 *                 subtitle:
 *                   type: string
 *                   title: subtitle
 *                   description: The item's subtitle.
 *                 thumbnail:
 *                   type: string
 *                   title: thumbnail
 *                   description: The item's thumbnail.
 *                 variant_id:
 *                   type: string
 *                   title: variant_id
 *                   description: The item's variant id.
 *                 product_id:
 *                   type: string
 *                   title: product_id
 *                   description: The item's product id.
 *                 product_title:
 *                   type: string
 *                   title: product_title
 *                   description: The item's product title.
 *                 product_description:
 *                   type: string
 *                   title: product_description
 *                   description: The item's product description.
 *                 product_subtitle:
 *                   type: string
 *                   title: product_subtitle
 *                   description: The item's product subtitle.
 *                 product_type:
 *                   type: string
 *                   title: product_type
 *                   description: The item's product type.
 *                 product_collection:
 *                   type: string
 *                   title: product_collection
 *                   description: The item's product collection.
 *                 product_handle:
 *                   type: string
 *                   title: product_handle
 *                   description: The item's product handle.
 *                 variant_sku:
 *                   type: string
 *                   title: variant_sku
 *                   description: The item's variant sku.
 *                 variant_barcode:
 *                   type: string
 *                   title: variant_barcode
 *                   description: The item's variant barcode.
 *                 variant_title:
 *                   type: string
 *                   title: variant_title
 *                   description: The item's variant title.
 *                 variant_option_values:
 *                   type: object
 *                   description: The item's variant option values.
 *                 requires_shipping:
 *                   type: boolean
 *                   title: requires_shipping
 *                   description: The item's requires shipping.
 *                 is_discountable:
 *                   type: boolean
 *                   title: is_discountable
 *                   description: The item's is discountable.
 *                 is_tax_inclusive:
 *                   type: boolean
 *                   title: is_tax_inclusive
 *                   description: The item's is tax inclusive.
 *                 compare_at_unit_price:
 *                   type: number
 *                   title: compare_at_unit_price
 *                   description: The item's compare at unit price.
 *                 unit_price:
 *                   type: number
 *                   title: unit_price
 *                   description: The item's unit price.
 *                 quantity:
 *                   type: number
 *                   title: quantity
 *                   description: The item's quantity.
 *                 refundable_total:
 *                   type: number
 *                   title: refundable_total
 *                   description: The item's refundable total.
 *                 refundable_total_per_unit:
 *                   type: number
 *                   title: refundable_total_per_unit
 *                   description: The item's refundable total per unit.
 *       description: The tax line's tax lines.
 *   adjustments:
 *     type: array
 *     description: The item's adjustments.
 *     items:
 *       allOf:
 *         - type: object
 *           description: The adjustment's adjustments.
 *           x-schemaName: BaseOrderLineItemAdjustment
 *           required:
 *             - item
 *             - item_id
 *             - id
 *             - amount
 *             - order_id
 *             - created_at
 *             - updated_at
 *           properties:
 *             item:
 *               type: object
 *               description: The adjustment's item.
 *               x-schemaName: BaseOrderLineItem
 *               required:
 *                 - id
 *                 - title
 *                 - subtitle
 *                 - thumbnail
 *                 - variant_id
 *                 - product_id
 *                 - product_title
 *                 - product_description
 *                 - product_subtitle
 *                 - product_type
 *                 - product_collection
 *                 - product_handle
 *                 - variant_sku
 *                 - variant_barcode
 *                 - variant_title
 *                 - variant_option_values
 *                 - requires_shipping
 *                 - is_discountable
 *                 - is_tax_inclusive
 *                 - unit_price
 *                 - quantity
 *                 - detail
 *                 - created_at
 *                 - updated_at
 *                 - metadata
 *                 - original_total
 *                 - original_subtotal
 *                 - original_tax_total
 *                 - item_total
 *                 - item_subtotal
 *                 - item_tax_total
 *                 - total
 *                 - subtotal
 *                 - tax_total
 *                 - discount_total
 *                 - discount_tax_total
 *                 - refundable_total
 *                 - refundable_total_per_unit
 *               properties:
 *                 id:
 *                   type: string
 *                   title: id
 *                   description: The item's ID.
 *                 title:
 *                   type: string
 *                   title: title
 *                   description: The item's title.
 *                 subtitle:
 *                   type: string
 *                   title: subtitle
 *                   description: The item's subtitle.
 *                 thumbnail:
 *                   type: string
 *                   title: thumbnail
 *                   description: The item's thumbnail.
 *                 variant:
 *                   type: object
 *                   description: The item's variant.
 *                   x-schemaName: BaseProductVariant
 *                   required:
 *                     - id
 *                     - title
 *                     - sku
 *                     - barcode
 *                     - ean
 *                     - upc
 *                     - allow_backorder
 *                     - manage_inventory
 *                     - hs_code
 *                     - origin_country
 *                     - mid_code
 *                     - material
 *                     - weight
 *                     - length
 *                     - height
 *                     - width
 *                     - options
 *                     - created_at
 *                     - updated_at
 *                     - deleted_at
 *                   properties:
 *                     id:
 *                       type: string
 *                       title: id
 *                       description: The variant's ID.
 *                     title:
 *                       type: string
 *                       title: title
 *                       description: The variant's title.
 *                     sku:
 *                       type: string
 *                       title: sku
 *                       description: The variant's sku.
 *                     barcode:
 *                       type: string
 *                       title: barcode
 *                       description: The variant's barcode.
 *                     ean:
 *                       type: string
 *                       title: ean
 *                       description: The variant's ean.
 *                     upc:
 *                       type: string
 *                       title: upc
 *                       description: The variant's upc.
 *                     allow_backorder:
 *                       type: boolean
 *                       title: allow_backorder
 *                       description: The variant's allow backorder.
 *                     manage_inventory:
 *                       type: boolean
 *                       title: manage_inventory
 *                       description: The variant's manage inventory.
 *                     inventory_quantity:
 *                       type: number
 *                       title: inventory_quantity
 *                       description: The variant's inventory quantity.
 *                     hs_code:
 *                       type: string
 *                       title: hs_code
 *                       description: The variant's hs code.
 *                     origin_country:
 *                       type: string
 *                       title: origin_country
 *                       description: The variant's origin country.
 *                     mid_code:
 *                       type: string
 *                       title: mid_code
 *                       description: The variant's mid code.
 *                     material:
 *                       type: string
 *                       title: material
 *                       description: The variant's material.
 *                     weight:
 *                       type: number
 *                       title: weight
 *                       description: The variant's weight.
 *                     length:
 *                       type: number
 *                       title: length
 *                       description: The variant's length.
 *                     height:
 *                       type: number
 *                       title: height
 *                       description: The variant's height.
 *                     width:
 *                       type: number
 *                       title: width
 *                       description: The variant's width.
 *                     variant_rank:
 *                       type: number
 *                       title: variant_rank
 *                       description: The variant's variant rank.
 *                     options:
 *                       type: array
 *                       description: The variant's options.
 *                       items:
 *                         type: object
 *                         description: The option's options.
 *                         x-schemaName: BaseProductOptionValue
 *                     product:
 *                       type: object
 *                       description: The variant's product.
 *                       x-schemaName: BaseProduct
 *                     product_id:
 *                       type: string
 *                       title: product_id
 *                       description: The variant's product id.
 *                     calculated_price:
 *                       type: object
 *                       description: The variant's calculated price.
 *                       x-schemaName: BaseCalculatedPriceSet
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       title: created_at
 *                       description: The variant's created at.
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       title: updated_at
 *                       description: The variant's updated at.
 *                     deleted_at:
 *                       type: string
 *                       format: date-time
 *                       title: deleted_at
 *                       description: The variant's deleted at.
 *                     metadata:
 *                       type: object
 *                       description: The variant's metadata.
 *                 variant_id:
 *                   type: string
 *                   title: variant_id
 *                   description: The item's variant id.
 *                 product:
 *                   type: object
 *                   description: The item's product.
 *                   x-schemaName: BaseProduct
 *                   required:
 *                     - id
 *                     - title
 *                     - handle
 *                     - subtitle
 *                     - description
 *                     - is_giftcard
 *                     - status
 *                     - thumbnail
 *                     - width
 *                     - weight
 *                     - length
 *                     - height
 *                     - origin_country
 *                     - hs_code
 *                     - mid_code
 *                     - material
 *                     - collection_id
 *                     - type_id
 *                     - variants
 *                     - options
 *                     - images
 *                     - discountable
 *                     - external_id
 *                     - created_at
 *                     - updated_at
 *                     - deleted_at
 *                   properties:
 *                     id:
 *                       type: string
 *                       title: id
 *                       description: The product's ID.
 *                     title:
 *                       type: string
 *                       title: title
 *                       description: The product's title.
 *                     handle:
 *                       type: string
 *                       title: handle
 *                       description: The product's handle.
 *                     subtitle:
 *                       type: string
 *                       title: subtitle
 *                       description: The product's subtitle.
 *                     description:
 *                       type: string
 *                       title: description
 *                       description: The product's description.
 *                     is_giftcard:
 *                       type: boolean
 *                       title: is_giftcard
 *                       description: The product's is giftcard.
 *                     status:
 *                       type: string
 *                       description: The product's status.
 *                       enum:
 *                         - draft
 *                         - proposed
 *                         - published
 *                         - rejected
 *                     thumbnail:
 *                       type: string
 *                       title: thumbnail
 *                       description: The product's thumbnail.
 *                     width:
 *                       type: number
 *                       title: width
 *                       description: The product's width.
 *                     weight:
 *                       type: number
 *                       title: weight
 *                       description: The product's weight.
 *                     length:
 *                       type: number
 *                       title: length
 *                       description: The product's length.
 *                     height:
 *                       type: number
 *                       title: height
 *                       description: The product's height.
 *                     origin_country:
 *                       type: string
 *                       title: origin_country
 *                       description: The product's origin country.
 *                     hs_code:
 *                       type: string
 *                       title: hs_code
 *                       description: The product's hs code.
 *                     mid_code:
 *                       type: string
 *                       title: mid_code
 *                       description: The product's mid code.
 *                     material:
 *                       type: string
 *                       title: material
 *                       description: The product's material.
 *                     collection:
 *                       type: object
 *                       description: The product's collection.
 *                       x-schemaName: BaseCollection
 *                     collection_id:
 *                       type: string
 *                       title: collection_id
 *                       description: The product's collection id.
 *                     categories:
 *                       type: array
 *                       description: The product's categories.
 *                       items:
 *                         type: object
 *                         description: The category's categories.
 *                         x-schemaName: BaseProductCategory
 *                     type:
 *                       type: object
 *                       description: The product's type.
 *                       x-schemaName: BaseProduct
 *                     type_id:
 *                       type: string
 *                       title: type_id
 *                       description: The product's type id.
 *                     tags:
 *                       type: array
 *                       description: The product's tags.
 *                       items:
 *                         type: object
 *                         description: The tag's tags.
 *                         x-schemaName: BaseProductTag
 *                     variants:
 *                       type: array
 *                       description: The product's variants.
 *                       items:
 *                         type: object
 *                         description: The variant's variants.
 *                         x-schemaName: BaseProductVariant
 *                     options:
 *                       type: array
 *                       description: The product's options.
 *                       items:
 *                         type: object
 *                         description: The option's options.
 *                         x-schemaName: BaseProductOption
 *                     images:
 *                       type: array
 *                       description: The product's images.
 *                       items:
 *                         type: object
 *                         description: The image's images.
 *                         x-schemaName: BaseProductImage
 *                     discountable:
 *                       type: boolean
 *                       title: discountable
 *                       description: The product's discountable.
 *                     external_id:
 *                       type: string
 *                       title: external_id
 *                       description: The product's external id.
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       title: created_at
 *                       description: The product's created at.
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       title: updated_at
 *                       description: The product's updated at.
 *                     deleted_at:
 *                       type: string
 *                       format: date-time
 *                       title: deleted_at
 *                       description: The product's deleted at.
 *                     metadata:
 *                       type: object
 *                       description: The product's metadata.
 *                 product_id:
 *                   type: string
 *                   title: product_id
 *                   description: The item's product id.
 *                 product_title:
 *                   type: string
 *                   title: product_title
 *                   description: The item's product title.
 *                 product_description:
 *                   type: string
 *                   title: product_description
 *                   description: The item's product description.
 *                 product_subtitle:
 *                   type: string
 *                   title: product_subtitle
 *                   description: The item's product subtitle.
 *                 product_type:
 *                   type: string
 *                   title: product_type
 *                   description: The item's product type.
 *                 product_collection:
 *                   type: string
 *                   title: product_collection
 *                   description: The item's product collection.
 *                 product_handle:
 *                   type: string
 *                   title: product_handle
 *                   description: The item's product handle.
 *                 variant_sku:
 *                   type: string
 *                   title: variant_sku
 *                   description: The item's variant sku.
 *                 variant_barcode:
 *                   type: string
 *                   title: variant_barcode
 *                   description: The item's variant barcode.
 *                 variant_title:
 *                   type: string
 *                   title: variant_title
 *                   description: The item's variant title.
 *                 variant_option_values:
 *                   type: object
 *                   description: The item's variant option values.
 *                 requires_shipping:
 *                   type: boolean
 *                   title: requires_shipping
 *                   description: The item's requires shipping.
 *                 is_discountable:
 *                   type: boolean
 *                   title: is_discountable
 *                   description: The item's is discountable.
 *                 is_tax_inclusive:
 *                   type: boolean
 *                   title: is_tax_inclusive
 *                   description: The item's is tax inclusive.
 *                 compare_at_unit_price:
 *                   type: number
 *                   title: compare_at_unit_price
 *                   description: The item's compare at unit price.
 *                 unit_price:
 *                   type: number
 *                   title: unit_price
 *                   description: The item's unit price.
 *                 quantity:
 *                   type: number
 *                   title: quantity
 *                   description: The item's quantity.
 *                 tax_lines:
 *                   type: array
 *                   description: The item's tax lines.
 *                   items:
 *                     type: object
 *                     description: The tax line's tax lines.
 *                     x-schemaName: BaseOrderLineItemTaxLine
 *                     required:
 *                       - item
 *                       - item_id
 *                       - total
 *                       - subtotal
 *                       - id
 *                       - code
 *                       - rate
 *                       - created_at
 *                       - updated_at
 *                     properties:
 *                       item:
 *                         type: object
 *                         description: The tax line's item.
 *                         x-schemaName: BaseOrderLineItem
 *                       item_id:
 *                         type: string
 *                         title: item_id
 *                         description: The tax line's item id.
 *                       total:
 *                         type: number
 *                         title: total
 *                         description: The tax line's total.
 *                       subtotal:
 *                         type: number
 *                         title: subtotal
 *                         description: The tax line's subtotal.
 *                       id:
 *                         type: string
 *                         title: id
 *                         description: The tax line's ID.
 *                       description:
 *                         type: string
 *                         title: description
 *                         description: The tax line's description.
 *                       tax_rate_id:
 *                         type: string
 *                         title: tax_rate_id
 *                         description: The tax line's tax rate id.
 *                       code:
 *                         type: string
 *                         title: code
 *                         description: The tax line's code.
 *                       rate:
 *                         type: number
 *                         title: rate
 *                         description: The tax line's rate.
 *                       provider_id:
 *                         type: string
 *                         title: provider_id
 *                         description: The tax line's provider id.
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         title: created_at
 *                         description: The tax line's created at.
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         title: updated_at
 *                         description: The tax line's updated at.
 *                 adjustments:
 *                   type: array
 *                   description: The item's adjustments.
 *                   items:
 *                     type: object
 *                     description: The adjustment's adjustments.
 *                     x-schemaName: BaseOrderLineItemAdjustment
 *                     required:
 *                       - item
 *                       - item_id
 *                       - id
 *                       - amount
 *                       - order_id
 *                       - created_at
 *                       - updated_at
 *                     properties:
 *                       item:
 *                         type: object
 *                         description: The adjustment's item.
 *                         x-schemaName: BaseOrderLineItem
 *                       item_id:
 *                         type: string
 *                         title: item_id
 *                         description: The adjustment's item id.
 *                       id:
 *                         type: string
 *                         title: id
 *                         description: The adjustment's ID.
 *                       code:
 *                         type: string
 *                         title: code
 *                         description: The adjustment's code.
 *                       amount:
 *                         type: number
 *                         title: amount
 *                         description: The adjustment's amount.
 *                       order_id:
 *                         type: string
 *                         title: order_id
 *                         description: The adjustment's order id.
 *                       description:
 *                         type: string
 *                         title: description
 *                         description: The adjustment's description.
 *                       promotion_id:
 *                         type: string
 *                         title: promotion_id
 *                         description: The adjustment's promotion id.
 *                       provider_id:
 *                         type: string
 *                         title: provider_id
 *                         description: The adjustment's provider id.
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         title: created_at
 *                         description: The adjustment's created at.
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         title: updated_at
 *                         description: The adjustment's updated at.
 *                 detail:
 *                   type: object
 *                   description: The item's detail.
 *                   x-schemaName: BaseOrderItemDetail
 *                   required:
 *                     - id
 *                     - item_id
 *                     - item
 *                     - quantity
 *                     - fulfilled_quantity
 *                     - delivered_quantity
 *                     - shipped_quantity
 *                     - return_requested_quantity
 *                     - return_received_quantity
 *                     - return_dismissed_quantity
 *                     - written_off_quantity
 *                     - metadata
 *                     - created_at
 *                     - updated_at
 *                   properties:
 *                     id:
 *                       type: string
 *                       title: id
 *                       description: The detail's ID.
 *                     item_id:
 *                       type: string
 *                       title: item_id
 *                       description: The detail's item id.
 *                     item:
 *                       type: object
 *                       description: The detail's item.
 *                       x-schemaName: BaseOrderLineItem
 *                     quantity:
 *                       type: number
 *                       title: quantity
 *                       description: The detail's quantity.
 *                     fulfilled_quantity:
 *                       type: number
 *                       title: fulfilled_quantity
 *                       description: The detail's fulfilled quantity.
 *                     delivered_quantity:
 *                       type: number
 *                       title: delivered_quantity
 *                       description: The detail's delivered quantity.
 *                     shipped_quantity:
 *                       type: number
 *                       title: shipped_quantity
 *                       description: The detail's shipped quantity.
 *                     return_requested_quantity:
 *                       type: number
 *                       title: return_requested_quantity
 *                       description: The detail's return requested quantity.
 *                     return_received_quantity:
 *                       type: number
 *                       title: return_received_quantity
 *                       description: The detail's return received quantity.
 *                     return_dismissed_quantity:
 *                       type: number
 *                       title: return_dismissed_quantity
 *                       description: The detail's return dismissed quantity.
 *                     written_off_quantity:
 *                       type: number
 *                       title: written_off_quantity
 *                       description: The detail's written off quantity.
 *                     metadata:
 *                       type: object
 *                       description: The detail's metadata.
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       title: created_at
 *                       description: The detail's created at.
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       title: updated_at
 *                       description: The detail's updated at.
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   title: created_at
 *                   description: The item's created at.
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   title: updated_at
 *                   description: The item's updated at.
 *                 metadata:
 *                   type: object
 *                   description: The item's metadata.
 *                 original_total:
 *                   type: number
 *                   title: original_total
 *                   description: The item's original total.
 *                 original_subtotal:
 *                   type: number
 *                   title: original_subtotal
 *                   description: The item's original subtotal.
 *                 original_tax_total:
 *                   type: number
 *                   title: original_tax_total
 *                   description: The item's original tax total.
 *                 item_total:
 *                   type: number
 *                   title: item_total
 *                   description: The item's item total.
 *                 item_subtotal:
 *                   type: number
 *                   title: item_subtotal
 *                   description: The item's item subtotal.
 *                 item_tax_total:
 *                   type: number
 *                   title: item_tax_total
 *                   description: The item's item tax total.
 *                 total:
 *                   type: number
 *                   title: total
 *                   description: The item's total.
 *                 subtotal:
 *                   type: number
 *                   title: subtotal
 *                   description: The item's subtotal.
 *                 tax_total:
 *                   type: number
 *                   title: tax_total
 *                   description: The item's tax total.
 *                 discount_total:
 *                   type: number
 *                   title: discount_total
 *                   description: The item's discount total.
 *                 discount_tax_total:
 *                   type: number
 *                   title: discount_tax_total
 *                   description: The item's discount tax total.
 *                 refundable_total:
 *                   type: number
 *                   title: refundable_total
 *                   description: The item's refundable total.
 *                 refundable_total_per_unit:
 *                   type: number
 *                   title: refundable_total_per_unit
 *                   description: The item's refundable total per unit.
 *             item_id:
 *               type: string
 *               title: item_id
 *               description: The adjustment's item id.
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
 *             order_id:
 *               type: string
 *               title: order_id
 *               description: The adjustment's order id.
 *             description:
 *               type: string
 *               title: description
 *               description: The adjustment's description.
 *             promotion_id:
 *               type: string
 *               title: promotion_id
 *               description: The adjustment's promotion id.
 *             provider_id:
 *               type: string
 *               title: provider_id
 *               description: The adjustment's provider id.
 *             created_at:
 *               type: string
 *               format: date-time
 *               title: created_at
 *               description: The adjustment's created at.
 *             updated_at:
 *               type: string
 *               format: date-time
 *               title: updated_at
 *               description: The adjustment's updated at.
 *         - type: object
 *           description: The adjustment's adjustments.
 *           required:
 *             - item
 *           properties:
 *             item:
 *               type: object
 *               description: The adjustment's item.
 *               x-schemaName: StoreOrderLineItem
 *               required:
 *                 - detail
 *                 - title
 *                 - id
 *                 - metadata
 *                 - created_at
 *                 - updated_at
 *                 - item_total
 *                 - item_subtotal
 *                 - item_tax_total
 *                 - original_total
 *                 - original_subtotal
 *                 - original_tax_total
 *                 - total
 *                 - subtotal
 *                 - tax_total
 *                 - discount_total
 *                 - discount_tax_total
 *                 - subtitle
 *                 - thumbnail
 *                 - variant_id
 *                 - product_id
 *                 - product_title
 *                 - product_description
 *                 - product_subtitle
 *                 - product_type
 *                 - product_collection
 *                 - product_handle
 *                 - variant_sku
 *                 - variant_barcode
 *                 - variant_title
 *                 - variant_option_values
 *                 - requires_shipping
 *                 - is_discountable
 *                 - is_tax_inclusive
 *                 - unit_price
 *                 - quantity
 *                 - refundable_total
 *                 - refundable_total_per_unit
 *               properties:
 *                 variant:
 *                   type: object
 *                   description: The item's variant.
 *                   x-schemaName: StoreProductVariant
 *                   required:
 *                     - options
 *                     - length
 *                     - title
 *                     - id
 *                     - created_at
 *                     - updated_at
 *                     - width
 *                     - weight
 *                     - height
 *                     - origin_country
 *                     - hs_code
 *                     - mid_code
 *                     - material
 *                     - deleted_at
 *                     - sku
 *                     - barcode
 *                     - ean
 *                     - upc
 *                     - allow_backorder
 *                     - manage_inventory
 *                   properties:
 *                     options:
 *                       type: array
 *                       description: The variant's options.
 *                       items:
 *                         type: object
 *                         description: The option's options.
 *                         x-schemaName: StoreProductOptionValue
 *                     product:
 *                       type: object
 *                       description: The variant's product.
 *                       x-schemaName: StoreProduct
 *                     length:
 *                       type: number
 *                       title: length
 *                       description: The variant's length.
 *                     title:
 *                       type: string
 *                       title: title
 *                       description: The variant's title.
 *                     id:
 *                       type: string
 *                       title: id
 *                       description: The variant's ID.
 *                     metadata:
 *                       type: object
 *                       description: The variant's metadata.
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       title: created_at
 *                       description: The variant's created at.
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       title: updated_at
 *                       description: The variant's updated at.
 *                     product_id:
 *                       type: string
 *                       title: product_id
 *                       description: The variant's product id.
 *                     width:
 *                       type: number
 *                       title: width
 *                       description: The variant's width.
 *                     weight:
 *                       type: number
 *                       title: weight
 *                       description: The variant's weight.
 *                     height:
 *                       type: number
 *                       title: height
 *                       description: The variant's height.
 *                     origin_country:
 *                       type: string
 *                       title: origin_country
 *                       description: The variant's origin country.
 *                     hs_code:
 *                       type: string
 *                       title: hs_code
 *                       description: The variant's hs code.
 *                     mid_code:
 *                       type: string
 *                       title: mid_code
 *                       description: The variant's mid code.
 *                     material:
 *                       type: string
 *                       title: material
 *                       description: The variant's material.
 *                     deleted_at:
 *                       type: string
 *                       format: date-time
 *                       title: deleted_at
 *                       description: The variant's deleted at.
 *                     sku:
 *                       type: string
 *                       title: sku
 *                       description: The variant's sku.
 *                     barcode:
 *                       type: string
 *                       title: barcode
 *                       description: The variant's barcode.
 *                     ean:
 *                       type: string
 *                       title: ean
 *                       description: The variant's ean.
 *                     upc:
 *                       type: string
 *                       title: upc
 *                       description: The variant's upc.
 *                     allow_backorder:
 *                       type: boolean
 *                       title: allow_backorder
 *                       description: The variant's allow backorder.
 *                     manage_inventory:
 *                       type: boolean
 *                       title: manage_inventory
 *                       description: The variant's manage inventory.
 *                     inventory_quantity:
 *                       type: number
 *                       title: inventory_quantity
 *                       description: The variant's inventory quantity.
 *                     variant_rank:
 *                       type: number
 *                       title: variant_rank
 *                       description: The variant's variant rank.
 *                     calculated_price:
 *                       type: object
 *                       description: The variant's calculated price.
 *                       x-schemaName: BaseCalculatedPriceSet
 *                 product:
 *                   type: object
 *                   description: The item's product.
 *                   x-schemaName: StoreProduct
 *                   required:
 *                     - variants
 *                     - options
 *                     - images
 *                     - length
 *                     - title
 *                     - status
 *                     - description
 *                     - id
 *                     - created_at
 *                     - updated_at
 *                     - subtitle
 *                     - thumbnail
 *                     - handle
 *                     - is_giftcard
 *                     - width
 *                     - weight
 *                     - height
 *                     - origin_country
 *                     - hs_code
 *                     - mid_code
 *                     - material
 *                     - collection_id
 *                     - type_id
 *                     - discountable
 *                     - external_id
 *                     - deleted_at
 *                   properties:
 *                     collection:
 *                       type: object
 *                       description: The product's collection.
 *                       x-schemaName: StoreCollection
 *                     categories:
 *                       type: array
 *                       description: The product's categories.
 *                       items:
 *                         type: object
 *                         description: The category's categories.
 *                         x-schemaName: StoreProductCategory
 *                     variants:
 *                       type: array
 *                       description: The product's variants.
 *                       items:
 *                         type: object
 *                         description: The variant's variants.
 *                         x-schemaName: StoreProductVariant
 *                     type:
 *                       type: object
 *                       description: The product's type.
 *                       x-schemaName: StoreProduct
 *                     tags:
 *                       type: array
 *                       description: The product's tags.
 *                       items:
 *                         type: object
 *                         description: The tag's tags.
 *                         x-schemaName: StoreProductTag
 *                     options:
 *                       type: array
 *                       description: The product's options.
 *                       items:
 *                         type: object
 *                         description: The option's options.
 *                         x-schemaName: StoreProductOption
 *                     images:
 *                       type: array
 *                       description: The product's images.
 *                       items:
 *                         type: object
 *                         description: The image's images.
 *                         x-schemaName: StoreProductImage
 *                     length:
 *                       type: number
 *                       title: length
 *                       description: The product's length.
 *                     title:
 *                       type: string
 *                       title: title
 *                       description: The product's title.
 *                     status:
 *                       type: string
 *                       description: The product's status.
 *                       enum:
 *                         - draft
 *                         - proposed
 *                         - published
 *                         - rejected
 *                     description:
 *                       type: string
 *                       title: description
 *                       description: The product's description.
 *                     id:
 *                       type: string
 *                       title: id
 *                       description: The product's ID.
 *                     metadata:
 *                       type: object
 *                       description: The product's metadata.
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       title: created_at
 *                       description: The product's created at.
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       title: updated_at
 *                       description: The product's updated at.
 *                     subtitle:
 *                       type: string
 *                       title: subtitle
 *                       description: The product's subtitle.
 *                     thumbnail:
 *                       type: string
 *                       title: thumbnail
 *                       description: The product's thumbnail.
 *                     handle:
 *                       type: string
 *                       title: handle
 *                       description: The product's handle.
 *                     is_giftcard:
 *                       type: boolean
 *                       title: is_giftcard
 *                       description: The product's is giftcard.
 *                     width:
 *                       type: number
 *                       title: width
 *                       description: The product's width.
 *                     weight:
 *                       type: number
 *                       title: weight
 *                       description: The product's weight.
 *                     height:
 *                       type: number
 *                       title: height
 *                       description: The product's height.
 *                     origin_country:
 *                       type: string
 *                       title: origin_country
 *                       description: The product's origin country.
 *                     hs_code:
 *                       type: string
 *                       title: hs_code
 *                       description: The product's hs code.
 *                     mid_code:
 *                       type: string
 *                       title: mid_code
 *                       description: The product's mid code.
 *                     material:
 *                       type: string
 *                       title: material
 *                       description: The product's material.
 *                     collection_id:
 *                       type: string
 *                       title: collection_id
 *                       description: The product's collection id.
 *                     type_id:
 *                       type: string
 *                       title: type_id
 *                       description: The product's type id.
 *                     discountable:
 *                       type: boolean
 *                       title: discountable
 *                       description: The product's discountable.
 *                     external_id:
 *                       type: string
 *                       title: external_id
 *                       description: The product's external id.
 *                     deleted_at:
 *                       type: string
 *                       format: date-time
 *                       title: deleted_at
 *                       description: The product's deleted at.
 *                 tax_lines:
 *                   type: array
 *                   description: The item's tax lines.
 *                   items:
 *                     allOf:
 *                       - type: object
 *                         description: The tax line's tax lines.
 *                         x-schemaName: BaseOrderLineItemTaxLine
 *                         required:
 *                           - item
 *                           - item_id
 *                           - total
 *                           - subtotal
 *                           - id
 *                           - code
 *                           - rate
 *                           - created_at
 *                           - updated_at
 *                         properties:
 *                           item:
 *                             type: object
 *                             description: The tax line's item.
 *                             x-schemaName: BaseOrderLineItem
 *                           item_id:
 *                             type: string
 *                             title: item_id
 *                             description: The tax line's item id.
 *                           total:
 *                             type: number
 *                             title: total
 *                             description: The tax line's total.
 *                           subtotal:
 *                             type: number
 *                             title: subtotal
 *                             description: The tax line's subtotal.
 *                           id:
 *                             type: string
 *                             title: id
 *                             description: The tax line's ID.
 *                           description:
 *                             type: string
 *                             title: description
 *                             description: The tax line's description.
 *                           tax_rate_id:
 *                             type: string
 *                             title: tax_rate_id
 *                             description: The tax line's tax rate id.
 *                           code:
 *                             type: string
 *                             title: code
 *                             description: The tax line's code.
 *                           rate:
 *                             type: number
 *                             title: rate
 *                             description: The tax line's rate.
 *                           provider_id:
 *                             type: string
 *                             title: provider_id
 *                             description: The tax line's provider id.
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                             title: created_at
 *                             description: The tax line's created at.
 *                           updated_at:
 *                             type: string
 *                             format: date-time
 *                             title: updated_at
 *                             description: The tax line's updated at.
 *                       - type: object
 *                         description: The tax line's tax lines.
 *                         required:
 *                           - item
 *                         properties:
 *                           item:
 *                             type: object
 *                             description: The tax line's item.
 *                             x-schemaName: StoreOrderLineItem
 *                 adjustments:
 *                   type: array
 *                   description: The item's adjustments.
 *                   items:
 *                     allOf:
 *                       - type: object
 *                         description: The adjustment's adjustments.
 *                         x-schemaName: BaseOrderLineItemAdjustment
 *                         required:
 *                           - item
 *                           - item_id
 *                           - id
 *                           - amount
 *                           - order_id
 *                           - created_at
 *                           - updated_at
 *                         properties:
 *                           item:
 *                             type: object
 *                             description: The adjustment's item.
 *                             x-schemaName: BaseOrderLineItem
 *                           item_id:
 *                             type: string
 *                             title: item_id
 *                             description: The adjustment's item id.
 *                           id:
 *                             type: string
 *                             title: id
 *                             description: The adjustment's ID.
 *                           code:
 *                             type: string
 *                             title: code
 *                             description: The adjustment's code.
 *                           amount:
 *                             type: number
 *                             title: amount
 *                             description: The adjustment's amount.
 *                           order_id:
 *                             type: string
 *                             title: order_id
 *                             description: The adjustment's order id.
 *                           description:
 *                             type: string
 *                             title: description
 *                             description: The adjustment's description.
 *                           promotion_id:
 *                             type: string
 *                             title: promotion_id
 *                             description: The adjustment's promotion id.
 *                           provider_id:
 *                             type: string
 *                             title: provider_id
 *                             description: The adjustment's provider id.
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                             title: created_at
 *                             description: The adjustment's created at.
 *                           updated_at:
 *                             type: string
 *                             format: date-time
 *                             title: updated_at
 *                             description: The adjustment's updated at.
 *                       - type: object
 *                         description: The adjustment's adjustments.
 *                         required:
 *                           - item
 *                         properties:
 *                           item:
 *                             type: object
 *                             description: The adjustment's item.
 *                             x-schemaName: StoreOrderLineItem
 *                 detail:
 *                   allOf:
 *                     - type: object
 *                       description: The item's detail.
 *                       x-schemaName: BaseOrderItemDetail
 *                       required:
 *                         - id
 *                         - item_id
 *                         - item
 *                         - quantity
 *                         - fulfilled_quantity
 *                         - delivered_quantity
 *                         - shipped_quantity
 *                         - return_requested_quantity
 *                         - return_received_quantity
 *                         - return_dismissed_quantity
 *                         - written_off_quantity
 *                         - metadata
 *                         - created_at
 *                         - updated_at
 *                       properties:
 *                         id:
 *                           type: string
 *                           title: id
 *                           description: The detail's ID.
 *                         item_id:
 *                           type: string
 *                           title: item_id
 *                           description: The detail's item id.
 *                         item:
 *                           type: object
 *                           description: The detail's item.
 *                           x-schemaName: BaseOrderLineItem
 *                         quantity:
 *                           type: number
 *                           title: quantity
 *                           description: The detail's quantity.
 *                         fulfilled_quantity:
 *                           type: number
 *                           title: fulfilled_quantity
 *                           description: The detail's fulfilled quantity.
 *                         delivered_quantity:
 *                           type: number
 *                           title: delivered_quantity
 *                           description: The detail's delivered quantity.
 *                         shipped_quantity:
 *                           type: number
 *                           title: shipped_quantity
 *                           description: The detail's shipped quantity.
 *                         return_requested_quantity:
 *                           type: number
 *                           title: return_requested_quantity
 *                           description: The detail's return requested quantity.
 *                         return_received_quantity:
 *                           type: number
 *                           title: return_received_quantity
 *                           description: The detail's return received quantity.
 *                         return_dismissed_quantity:
 *                           type: number
 *                           title: return_dismissed_quantity
 *                           description: The detail's return dismissed quantity.
 *                         written_off_quantity:
 *                           type: number
 *                           title: written_off_quantity
 *                           description: The detail's written off quantity.
 *                         metadata:
 *                           type: object
 *                           description: The detail's metadata.
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                           title: created_at
 *                           description: The detail's created at.
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *                           title: updated_at
 *                           description: The detail's updated at.
 *                     - type: object
 *                       description: The item's detail.
 *                       required:
 *                         - item
 *                       properties:
 *                         item:
 *                           type: object
 *                           description: The detail's item.
 *                           x-schemaName: StoreOrderLineItem
 *                 title:
 *                   type: string
 *                   title: title
 *                   description: The item's title.
 *                 id:
 *                   type: string
 *                   title: id
 *                   description: The item's ID.
 *                 metadata:
 *                   type: object
 *                   description: The item's metadata.
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   title: created_at
 *                   description: The item's created at.
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *                   title: updated_at
 *                   description: The item's updated at.
 *                 item_total:
 *                   type: number
 *                   title: item_total
 *                   description: The item's item total.
 *                 item_subtotal:
 *                   type: number
 *                   title: item_subtotal
 *                   description: The item's item subtotal.
 *                 item_tax_total:
 *                   type: number
 *                   title: item_tax_total
 *                   description: The item's item tax total.
 *                 original_total:
 *                   type: number
 *                   title: original_total
 *                   description: The item's original total.
 *                 original_subtotal:
 *                   type: number
 *                   title: original_subtotal
 *                   description: The item's original subtotal.
 *                 original_tax_total:
 *                   type: number
 *                   title: original_tax_total
 *                   description: The item's original tax total.
 *                 total:
 *                   type: number
 *                   title: total
 *                   description: The item's total.
 *                 subtotal:
 *                   type: number
 *                   title: subtotal
 *                   description: The item's subtotal.
 *                 tax_total:
 *                   type: number
 *                   title: tax_total
 *                   description: The item's tax total.
 *                 discount_total:
 *                   type: number
 *                   title: discount_total
 *                   description: The item's discount total.
 *                 discount_tax_total:
 *                   type: number
 *                   title: discount_tax_total
 *                   description: The item's discount tax total.
 *                 subtitle:
 *                   type: string
 *                   title: subtitle
 *                   description: The item's subtitle.
 *                 thumbnail:
 *                   type: string
 *                   title: thumbnail
 *                   description: The item's thumbnail.
 *                 variant_id:
 *                   type: string
 *                   title: variant_id
 *                   description: The item's variant id.
 *                 product_id:
 *                   type: string
 *                   title: product_id
 *                   description: The item's product id.
 *                 product_title:
 *                   type: string
 *                   title: product_title
 *                   description: The item's product title.
 *                 product_description:
 *                   type: string
 *                   title: product_description
 *                   description: The item's product description.
 *                 product_subtitle:
 *                   type: string
 *                   title: product_subtitle
 *                   description: The item's product subtitle.
 *                 product_type:
 *                   type: string
 *                   title: product_type
 *                   description: The item's product type.
 *                 product_collection:
 *                   type: string
 *                   title: product_collection
 *                   description: The item's product collection.
 *                 product_handle:
 *                   type: string
 *                   title: product_handle
 *                   description: The item's product handle.
 *                 variant_sku:
 *                   type: string
 *                   title: variant_sku
 *                   description: The item's variant sku.
 *                 variant_barcode:
 *                   type: string
 *                   title: variant_barcode
 *                   description: The item's variant barcode.
 *                 variant_title:
 *                   type: string
 *                   title: variant_title
 *                   description: The item's variant title.
 *                 variant_option_values:
 *                   type: object
 *                   description: The item's variant option values.
 *                 requires_shipping:
 *                   type: boolean
 *                   title: requires_shipping
 *                   description: The item's requires shipping.
 *                 is_discountable:
 *                   type: boolean
 *                   title: is_discountable
 *                   description: The item's is discountable.
 *                 is_tax_inclusive:
 *                   type: boolean
 *                   title: is_tax_inclusive
 *                   description: The item's is tax inclusive.
 *                 compare_at_unit_price:
 *                   type: number
 *                   title: compare_at_unit_price
 *                   description: The item's compare at unit price.
 *                 unit_price:
 *                   type: number
 *                   title: unit_price
 *                   description: The item's unit price.
 *                 quantity:
 *                   type: number
 *                   title: quantity
 *                   description: The item's quantity.
 *                 refundable_total:
 *                   type: number
 *                   title: refundable_total
 *                   description: The item's refundable total.
 *                 refundable_total_per_unit:
 *                   type: number
 *                   title: refundable_total_per_unit
 *                   description: The item's refundable total per unit.
 *       description: The adjustment's details.
 *   detail:
 *     allOf:
 *       - $ref: "#/components/schemas/BaseOrderItemDetail"
 *       - type: object
 *         description: The item's detail.
 *         required:
 *           - item
 *         properties:
 *           item:
 *             type: object
 *             description: The detail's item.
 *             x-schemaName: StoreOrderLineItem
 *             required:
 *               - detail
 *               - title
 *               - id
 *               - metadata
 *               - created_at
 *               - updated_at
 *               - item_total
 *               - item_subtotal
 *               - item_tax_total
 *               - original_total
 *               - original_subtotal
 *               - original_tax_total
 *               - total
 *               - subtotal
 *               - tax_total
 *               - discount_total
 *               - discount_tax_total
 *               - subtitle
 *               - thumbnail
 *               - variant_id
 *               - product_id
 *               - product_title
 *               - product_description
 *               - product_subtitle
 *               - product_type
 *               - product_collection
 *               - product_handle
 *               - variant_sku
 *               - variant_barcode
 *               - variant_title
 *               - variant_option_values
 *               - requires_shipping
 *               - is_discountable
 *               - is_tax_inclusive
 *               - unit_price
 *               - quantity
 *               - refundable_total
 *               - refundable_total_per_unit
 *             properties:
 *               variant:
 *                 type: object
 *                 description: The item's variant.
 *                 x-schemaName: StoreProductVariant
 *                 required:
 *                   - options
 *                   - length
 *                   - title
 *                   - id
 *                   - created_at
 *                   - updated_at
 *                   - width
 *                   - weight
 *                   - height
 *                   - origin_country
 *                   - hs_code
 *                   - mid_code
 *                   - material
 *                   - deleted_at
 *                   - sku
 *                   - barcode
 *                   - ean
 *                   - upc
 *                   - allow_backorder
 *                   - manage_inventory
 *                 properties:
 *                   options:
 *                     type: array
 *                     description: The variant's options.
 *                     items:
 *                       type: object
 *                       description: The option's options.
 *                       x-schemaName: StoreProductOptionValue
 *                   product:
 *                     type: object
 *                     description: The variant's product.
 *                     x-schemaName: StoreProduct
 *                   length:
 *                     type: number
 *                     title: length
 *                     description: The variant's length.
 *                   title:
 *                     type: string
 *                     title: title
 *                     description: The variant's title.
 *                   id:
 *                     type: string
 *                     title: id
 *                     description: The variant's ID.
 *                   metadata:
 *                     type: object
 *                     description: The variant's metadata.
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     title: created_at
 *                     description: The variant's created at.
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                     title: updated_at
 *                     description: The variant's updated at.
 *                   product_id:
 *                     type: string
 *                     title: product_id
 *                     description: The variant's product id.
 *                   width:
 *                     type: number
 *                     title: width
 *                     description: The variant's width.
 *                   weight:
 *                     type: number
 *                     title: weight
 *                     description: The variant's weight.
 *                   height:
 *                     type: number
 *                     title: height
 *                     description: The variant's height.
 *                   origin_country:
 *                     type: string
 *                     title: origin_country
 *                     description: The variant's origin country.
 *                   hs_code:
 *                     type: string
 *                     title: hs_code
 *                     description: The variant's hs code.
 *                   mid_code:
 *                     type: string
 *                     title: mid_code
 *                     description: The variant's mid code.
 *                   material:
 *                     type: string
 *                     title: material
 *                     description: The variant's material.
 *                   deleted_at:
 *                     type: string
 *                     format: date-time
 *                     title: deleted_at
 *                     description: The variant's deleted at.
 *                   sku:
 *                     type: string
 *                     title: sku
 *                     description: The variant's sku.
 *                   barcode:
 *                     type: string
 *                     title: barcode
 *                     description: The variant's barcode.
 *                   ean:
 *                     type: string
 *                     title: ean
 *                     description: The variant's ean.
 *                   upc:
 *                     type: string
 *                     title: upc
 *                     description: The variant's upc.
 *                   allow_backorder:
 *                     type: boolean
 *                     title: allow_backorder
 *                     description: The variant's allow backorder.
 *                   manage_inventory:
 *                     type: boolean
 *                     title: manage_inventory
 *                     description: The variant's manage inventory.
 *                   inventory_quantity:
 *                     type: number
 *                     title: inventory_quantity
 *                     description: The variant's inventory quantity.
 *                   variant_rank:
 *                     type: number
 *                     title: variant_rank
 *                     description: The variant's variant rank.
 *                   calculated_price:
 *                     type: object
 *                     description: The variant's calculated price.
 *                     x-schemaName: BaseCalculatedPriceSet
 *               product:
 *                 type: object
 *                 description: The item's product.
 *                 x-schemaName: StoreProduct
 *                 required:
 *                   - variants
 *                   - options
 *                   - images
 *                   - length
 *                   - title
 *                   - status
 *                   - description
 *                   - id
 *                   - created_at
 *                   - updated_at
 *                   - subtitle
 *                   - thumbnail
 *                   - handle
 *                   - is_giftcard
 *                   - width
 *                   - weight
 *                   - height
 *                   - origin_country
 *                   - hs_code
 *                   - mid_code
 *                   - material
 *                   - collection_id
 *                   - type_id
 *                   - discountable
 *                   - external_id
 *                   - deleted_at
 *                 properties:
 *                   collection:
 *                     type: object
 *                     description: The product's collection.
 *                     x-schemaName: StoreCollection
 *                   categories:
 *                     type: array
 *                     description: The product's categories.
 *                     items:
 *                       type: object
 *                       description: The category's categories.
 *                       x-schemaName: StoreProductCategory
 *                   variants:
 *                     type: array
 *                     description: The product's variants.
 *                     items:
 *                       type: object
 *                       description: The variant's variants.
 *                       x-schemaName: StoreProductVariant
 *                   type:
 *                     type: object
 *                     description: The product's type.
 *                     x-schemaName: StoreProduct
 *                   tags:
 *                     type: array
 *                     description: The product's tags.
 *                     items:
 *                       type: object
 *                       description: The tag's tags.
 *                       x-schemaName: StoreProductTag
 *                   options:
 *                     type: array
 *                     description: The product's options.
 *                     items:
 *                       type: object
 *                       description: The option's options.
 *                       x-schemaName: StoreProductOption
 *                   images:
 *                     type: array
 *                     description: The product's images.
 *                     items:
 *                       type: object
 *                       description: The image's images.
 *                       x-schemaName: StoreProductImage
 *                   length:
 *                     type: number
 *                     title: length
 *                     description: The product's length.
 *                   title:
 *                     type: string
 *                     title: title
 *                     description: The product's title.
 *                   status:
 *                     type: string
 *                     description: The product's status.
 *                     enum:
 *                       - draft
 *                       - proposed
 *                       - published
 *                       - rejected
 *                   description:
 *                     type: string
 *                     title: description
 *                     description: The product's description.
 *                   id:
 *                     type: string
 *                     title: id
 *                     description: The product's ID.
 *                   metadata:
 *                     type: object
 *                     description: The product's metadata.
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     title: created_at
 *                     description: The product's created at.
 *                   updated_at:
 *                     type: string
 *                     format: date-time
 *                     title: updated_at
 *                     description: The product's updated at.
 *                   subtitle:
 *                     type: string
 *                     title: subtitle
 *                     description: The product's subtitle.
 *                   thumbnail:
 *                     type: string
 *                     title: thumbnail
 *                     description: The product's thumbnail.
 *                   handle:
 *                     type: string
 *                     title: handle
 *                     description: The product's handle.
 *                   is_giftcard:
 *                     type: boolean
 *                     title: is_giftcard
 *                     description: The product's is giftcard.
 *                   width:
 *                     type: number
 *                     title: width
 *                     description: The product's width.
 *                   weight:
 *                     type: number
 *                     title: weight
 *                     description: The product's weight.
 *                   height:
 *                     type: number
 *                     title: height
 *                     description: The product's height.
 *                   origin_country:
 *                     type: string
 *                     title: origin_country
 *                     description: The product's origin country.
 *                   hs_code:
 *                     type: string
 *                     title: hs_code
 *                     description: The product's hs code.
 *                   mid_code:
 *                     type: string
 *                     title: mid_code
 *                     description: The product's mid code.
 *                   material:
 *                     type: string
 *                     title: material
 *                     description: The product's material.
 *                   collection_id:
 *                     type: string
 *                     title: collection_id
 *                     description: The product's collection id.
 *                   type_id:
 *                     type: string
 *                     title: type_id
 *                     description: The product's type id.
 *                   discountable:
 *                     type: boolean
 *                     title: discountable
 *                     description: The product's discountable.
 *                   external_id:
 *                     type: string
 *                     title: external_id
 *                     description: The product's external id.
 *                   deleted_at:
 *                     type: string
 *                     format: date-time
 *                     title: deleted_at
 *                     description: The product's deleted at.
 *               tax_lines:
 *                 type: array
 *                 description: The item's tax lines.
 *                 items:
 *                   allOf:
 *                     - type: object
 *                       description: The tax line's tax lines.
 *                       x-schemaName: BaseOrderLineItemTaxLine
 *                       required:
 *                         - item
 *                         - item_id
 *                         - total
 *                         - subtotal
 *                         - id
 *                         - code
 *                         - rate
 *                         - created_at
 *                         - updated_at
 *                       properties:
 *                         item:
 *                           type: object
 *                           description: The tax line's item.
 *                           x-schemaName: BaseOrderLineItem
 *                         item_id:
 *                           type: string
 *                           title: item_id
 *                           description: The tax line's item id.
 *                         total:
 *                           type: number
 *                           title: total
 *                           description: The tax line's total.
 *                         subtotal:
 *                           type: number
 *                           title: subtotal
 *                           description: The tax line's subtotal.
 *                         id:
 *                           type: string
 *                           title: id
 *                           description: The tax line's ID.
 *                         description:
 *                           type: string
 *                           title: description
 *                           description: The tax line's description.
 *                         tax_rate_id:
 *                           type: string
 *                           title: tax_rate_id
 *                           description: The tax line's tax rate id.
 *                         code:
 *                           type: string
 *                           title: code
 *                           description: The tax line's code.
 *                         rate:
 *                           type: number
 *                           title: rate
 *                           description: The tax line's rate.
 *                         provider_id:
 *                           type: string
 *                           title: provider_id
 *                           description: The tax line's provider id.
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                           title: created_at
 *                           description: The tax line's created at.
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *                           title: updated_at
 *                           description: The tax line's updated at.
 *                     - type: object
 *                       description: The tax line's tax lines.
 *                       required:
 *                         - item
 *                       properties:
 *                         item:
 *                           type: object
 *                           description: The tax line's item.
 *                           x-schemaName: StoreOrderLineItem
 *               adjustments:
 *                 type: array
 *                 description: The item's adjustments.
 *                 items:
 *                   allOf:
 *                     - type: object
 *                       description: The adjustment's adjustments.
 *                       x-schemaName: BaseOrderLineItemAdjustment
 *                       required:
 *                         - item
 *                         - item_id
 *                         - id
 *                         - amount
 *                         - order_id
 *                         - created_at
 *                         - updated_at
 *                       properties:
 *                         item:
 *                           type: object
 *                           description: The adjustment's item.
 *                           x-schemaName: BaseOrderLineItem
 *                         item_id:
 *                           type: string
 *                           title: item_id
 *                           description: The adjustment's item id.
 *                         id:
 *                           type: string
 *                           title: id
 *                           description: The adjustment's ID.
 *                         code:
 *                           type: string
 *                           title: code
 *                           description: The adjustment's code.
 *                         amount:
 *                           type: number
 *                           title: amount
 *                           description: The adjustment's amount.
 *                         order_id:
 *                           type: string
 *                           title: order_id
 *                           description: The adjustment's order id.
 *                         description:
 *                           type: string
 *                           title: description
 *                           description: The adjustment's description.
 *                         promotion_id:
 *                           type: string
 *                           title: promotion_id
 *                           description: The adjustment's promotion id.
 *                         provider_id:
 *                           type: string
 *                           title: provider_id
 *                           description: The adjustment's provider id.
 *                         created_at:
 *                           type: string
 *                           format: date-time
 *                           title: created_at
 *                           description: The adjustment's created at.
 *                         updated_at:
 *                           type: string
 *                           format: date-time
 *                           title: updated_at
 *                           description: The adjustment's updated at.
 *                     - type: object
 *                       description: The adjustment's adjustments.
 *                       required:
 *                         - item
 *                       properties:
 *                         item:
 *                           type: object
 *                           description: The adjustment's item.
 *                           x-schemaName: StoreOrderLineItem
 *               detail:
 *                 allOf:
 *                   - type: object
 *                     description: The item's detail.
 *                     x-schemaName: BaseOrderItemDetail
 *                     required:
 *                       - id
 *                       - item_id
 *                       - item
 *                       - quantity
 *                       - fulfilled_quantity
 *                       - delivered_quantity
 *                       - shipped_quantity
 *                       - return_requested_quantity
 *                       - return_received_quantity
 *                       - return_dismissed_quantity
 *                       - written_off_quantity
 *                       - metadata
 *                       - created_at
 *                       - updated_at
 *                     properties:
 *                       id:
 *                         type: string
 *                         title: id
 *                         description: The detail's ID.
 *                       item_id:
 *                         type: string
 *                         title: item_id
 *                         description: The detail's item id.
 *                       item:
 *                         type: object
 *                         description: The detail's item.
 *                         x-schemaName: BaseOrderLineItem
 *                       quantity:
 *                         type: number
 *                         title: quantity
 *                         description: The detail's quantity.
 *                       fulfilled_quantity:
 *                         type: number
 *                         title: fulfilled_quantity
 *                         description: The detail's fulfilled quantity.
 *                       delivered_quantity:
 *                         type: number
 *                         title: delivered_quantity
 *                         description: The detail's delivered quantity.
 *                       shipped_quantity:
 *                         type: number
 *                         title: shipped_quantity
 *                         description: The detail's shipped quantity.
 *                       return_requested_quantity:
 *                         type: number
 *                         title: return_requested_quantity
 *                         description: The detail's return requested quantity.
 *                       return_received_quantity:
 *                         type: number
 *                         title: return_received_quantity
 *                         description: The detail's return received quantity.
 *                       return_dismissed_quantity:
 *                         type: number
 *                         title: return_dismissed_quantity
 *                         description: The detail's return dismissed quantity.
 *                       written_off_quantity:
 *                         type: number
 *                         title: written_off_quantity
 *                         description: The detail's written off quantity.
 *                       metadata:
 *                         type: object
 *                         description: The detail's metadata.
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         title: created_at
 *                         description: The detail's created at.
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         title: updated_at
 *                         description: The detail's updated at.
 *                   - type: object
 *                     description: The item's detail.
 *                     required:
 *                       - item
 *                     properties:
 *                       item:
 *                         type: object
 *                         description: The detail's item.
 *                         x-schemaName: StoreOrderLineItem
 *               title:
 *                 type: string
 *                 title: title
 *                 description: The item's title.
 *               id:
 *                 type: string
 *                 title: id
 *                 description: The item's ID.
 *               metadata:
 *                 type: object
 *                 description: The item's metadata.
 *               created_at:
 *                 type: string
 *                 format: date-time
 *                 title: created_at
 *                 description: The item's created at.
 *               updated_at:
 *                 type: string
 *                 format: date-time
 *                 title: updated_at
 *                 description: The item's updated at.
 *               item_total:
 *                 type: number
 *                 title: item_total
 *                 description: The item's item total.
 *               item_subtotal:
 *                 type: number
 *                 title: item_subtotal
 *                 description: The item's item subtotal.
 *               item_tax_total:
 *                 type: number
 *                 title: item_tax_total
 *                 description: The item's item tax total.
 *               original_total:
 *                 type: number
 *                 title: original_total
 *                 description: The item's original total.
 *               original_subtotal:
 *                 type: number
 *                 title: original_subtotal
 *                 description: The item's original subtotal.
 *               original_tax_total:
 *                 type: number
 *                 title: original_tax_total
 *                 description: The item's original tax total.
 *               total:
 *                 type: number
 *                 title: total
 *                 description: The item's total.
 *               subtotal:
 *                 type: number
 *                 title: subtotal
 *                 description: The item's subtotal.
 *               tax_total:
 *                 type: number
 *                 title: tax_total
 *                 description: The item's tax total.
 *               discount_total:
 *                 type: number
 *                 title: discount_total
 *                 description: The item's discount total.
 *               discount_tax_total:
 *                 type: number
 *                 title: discount_tax_total
 *                 description: The item's discount tax total.
 *               subtitle:
 *                 type: string
 *                 title: subtitle
 *                 description: The item's subtitle.
 *               thumbnail:
 *                 type: string
 *                 title: thumbnail
 *                 description: The item's thumbnail.
 *               variant_id:
 *                 type: string
 *                 title: variant_id
 *                 description: The item's variant id.
 *               product_id:
 *                 type: string
 *                 title: product_id
 *                 description: The item's product id.
 *               product_title:
 *                 type: string
 *                 title: product_title
 *                 description: The item's product title.
 *               product_description:
 *                 type: string
 *                 title: product_description
 *                 description: The item's product description.
 *               product_subtitle:
 *                 type: string
 *                 title: product_subtitle
 *                 description: The item's product subtitle.
 *               product_type:
 *                 type: string
 *                 title: product_type
 *                 description: The item's product type.
 *               product_collection:
 *                 type: string
 *                 title: product_collection
 *                 description: The item's product collection.
 *               product_handle:
 *                 type: string
 *                 title: product_handle
 *                 description: The item's product handle.
 *               variant_sku:
 *                 type: string
 *                 title: variant_sku
 *                 description: The item's variant sku.
 *               variant_barcode:
 *                 type: string
 *                 title: variant_barcode
 *                 description: The item's variant barcode.
 *               variant_title:
 *                 type: string
 *                 title: variant_title
 *                 description: The item's variant title.
 *               variant_option_values:
 *                 type: object
 *                 description: The item's variant option values.
 *               requires_shipping:
 *                 type: boolean
 *                 title: requires_shipping
 *                 description: The item's requires shipping.
 *               is_discountable:
 *                 type: boolean
 *                 title: is_discountable
 *                 description: The item's is discountable.
 *               is_tax_inclusive:
 *                 type: boolean
 *                 title: is_tax_inclusive
 *                 description: The item's is tax inclusive.
 *               compare_at_unit_price:
 *                 type: number
 *                 title: compare_at_unit_price
 *                 description: The item's compare at unit price.
 *               unit_price:
 *                 type: number
 *                 title: unit_price
 *                 description: The item's unit price.
 *               quantity:
 *                 type: number
 *                 title: quantity
 *                 description: The item's quantity.
 *               refundable_total:
 *                 type: number
 *                 title: refundable_total
 *                 description: The item's refundable total.
 *               refundable_total_per_unit:
 *                 type: number
 *                 title: refundable_total_per_unit
 *                 description: The item's refundable total per unit.
 *     description: The item's detail.
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
 *   metadata:
 *     type: object
 *     description: The item's metadata, can hold custom key-value pairs.
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
 * 
*/

