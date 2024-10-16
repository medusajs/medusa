/**
 * @schema StoreProductVariant
 * type: object
 * description: The variant's details.
 * x-schemaName: StoreProductVariant
 * properties:
 *   options:
 *     type: array
 *     description: The variant's options.
 *     items:
 *       $ref: "#/components/schemas/StoreProductOptionValue"
 *   product:
 *     $ref: "#/components/schemas/StoreProduct"
 *   length:
 *     type: number
 *     title: length
 *     description: The variant's length.
 *   title:
 *     type: string
 *     title: title
 *     description: The variant's title.
 *   metadata:
 *     type: object
 *     description: The variant's metadata, can hold custom key-value pairs.
 *   id:
 *     type: string
 *     title: id
 *     description: The variant's ID.
 *   width:
 *     type: number
 *     title: width
 *     description: The variant's width.
 *   weight:
 *     type: number
 *     title: weight
 *     description: The variant's weight.
 *   height:
 *     type: number
 *     title: height
 *     description: The variant's height.
 *   origin_country:
 *     type: string
 *     title: origin_country
 *     description: The variant's origin country.
 *   hs_code:
 *     type: string
 *     title: hs_code
 *     description: The variant's HS code.
 *   mid_code:
 *     type: string
 *     title: mid_code
 *     description: The variant's MID code.
 *   material:
 *     type: string
 *     title: material
 *     description: The variant's material.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The date the variant was created.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The date the variant was updated.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The date the variant was deleted.
 *   product_id:
 *     type: string
 *     title: product_id
 *     description: The ID of the product this variant belongs to.
 *   sku:
 *     type: string
 *     title: sku
 *     description: The variant's SKU.
 *   barcode:
 *     type: string
 *     title: barcode
 *     description: The variant's barcode.
 *   ean:
 *     type: string
 *     title: ean
 *     description: The variant's EAN.
 *   upc:
 *     type: string
 *     title: upc
 *     description: The variant's UPC.
 *   allow_backorder:
 *     type: boolean
 *     title: allow_backorder
 *     description: Whether the variant can be ordered even if it's not in stock.
 *   manage_inventory:
 *     type: boolean
 *     title: manage_inventory
 *     description: Whether Medusa manages the variant's inventory. If disabled, the variant is always considered in stock.
 *     externalDocs:
 *       url: https://docs.medusajs.com/v2/resources/storefront-development/products/inventory
 *       description: "Storefront guide: How to retrieve a product variant's inventory details."
 *   inventory_quantity:
 *     type: number
 *     title: inventory_quantity
 *     description: The variant's inventory quantity. This property is only available if you pass `+variants.inventory_quantity` in the `fields` query parameter.
 *     externalDocs:
 *       url: https://docs.medusajs.com/v2/resources/storefront-development/products/inventory
 *       description: "Storefront guide: How to retrieve a product variant's inventory details."
 *   variant_rank:
 *     type: number
 *     title: variant_rank
 *     description: The variant's rank among its siblings.
 *   calculated_price:
 *     $ref: "#/components/schemas/BaseCalculatedPriceSet"
 * required:
 *   - options
 *   - length
 *   - title
 *   - id
 *   - created_at
 *   - updated_at
 *   - width
 *   - weight
 *   - height
 *   - origin_country
 *   - hs_code
 *   - mid_code
 *   - material
 *   - deleted_at
 *   - sku
 *   - barcode
 *   - ean
 *   - upc
 *   - allow_backorder
 *   - manage_inventory
 * 
*/

