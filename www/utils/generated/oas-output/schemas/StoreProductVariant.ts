/**
 * @schema StoreProductVariant
 * type: object
 * description: The variant's variants.
 * x-schemaName: StoreProductVariant
 * properties:
 *   options:
 *     type: array
 *     description: The variant's options.
 *     items:
 *       $ref: "#/components/schemas/StoreProductOptionValue"
 *   product:
 *     $ref: "#/components/schemas/StoreProduct"
 *   id:
 *     type: string
 *     title: id
 *     description: The variant's ID.
 *   metadata:
 *     type: object
 *     description: The variant's metadata.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The variant's created at.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The variant's updated at.
 *   title:
 *     type: string
 *     title: title
 *     description: The variant's title.
 *   product_id:
 *     type: string
 *     title: product_id
 *     description: The variant's product id.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The variant's deleted at.
 *   width:
 *     type: number
 *     title: width
 *     description: The variant's width.
 *   weight:
 *     type: number
 *     title: weight
 *     description: The variant's weight.
 *   length:
 *     type: number
 *     title: length
 *     description: The variant's length.
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
 *     description: The variant's hs code.
 *   mid_code:
 *     type: string
 *     title: mid_code
 *     description: The variant's mid code.
 *   material:
 *     type: string
 *     title: material
 *     description: The variant's material.
 *   sku:
 *     type: string
 *     title: sku
 *     description: The variant's sku.
 *   barcode:
 *     type: string
 *     title: barcode
 *     description: The variant's barcode.
 *   ean:
 *     type: string
 *     title: ean
 *     description: The variant's ean.
 *   upc:
 *     type: string
 *     title: upc
 *     description: The variant's upc.
 *   allow_backorder:
 *     oneOf:
 *       - {}
 *       - {}
 *   manage_inventory:
 *     oneOf:
 *       - {}
 *       - {}
 *   inventory_quantity:
 *     type: number
 *     title: inventory_quantity
 *     description: The variant's inventory quantity.
 *   variant_rank:
 *     type: number
 *     title: variant_rank
 *     description: The variant's variant rank.
 *   calculated_price:
 *     $ref: "#/components/schemas/BaseCalculatedPriceSet"
 * required:
 *   - options
 *   - id
 *   - created_at
 *   - updated_at
 *   - title
 *   - deleted_at
 *   - width
 *   - weight
 *   - length
 *   - height
 *   - origin_country
 *   - hs_code
 *   - mid_code
 *   - material
 *   - sku
 *   - barcode
 *   - ean
 *   - upc
 *   - allow_backorder
 *   - manage_inventory
 * 
*/

