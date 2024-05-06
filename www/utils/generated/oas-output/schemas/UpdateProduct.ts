/**
 * @schema UpdateProduct
 * type: object
 * description: SUMMARY
 * x-schemaName: UpdateProduct
 * properties:
 *   title:
 *     type: string
 *     title: title
 *     description: The product's title.
 *   subtitle:
 *     type: string
 *     title: subtitle
 *     description: The product's subtitle.
 *   description:
 *     type: string
 *     title: description
 *     description: The product's description.
 *   is_giftcard:
 *     type: boolean
 *     title: is_giftcard
 *     description: The product's is giftcard.
 *   discountable:
 *     type: boolean
 *     title: discountable
 *     description: The product's discountable.
 *   images:
 *     oneOf:
 *       - type: array
 *         description: The product's images.
 *         items:
 *           type: string
 *           title: images
 *           description: The image's images.
 *       - type: array
 *         description: The product's images.
 *         items:
 *           type: object
 *           description: The image's images.
 *           required:
 *             - url
 *           properties:
 *             id:
 *               type: string
 *               title: id
 *               description: The image's ID.
 *             url:
 *               type: string
 *               title: url
 *               description: The image's url.
 *   thumbnail:
 *     type: string
 *     title: thumbnail
 *     description: The product's thumbnail.
 *   handle:
 *     type: string
 *     title: handle
 *     description: The product's handle.
 *   status:
 *     type: string
 *     enum:
 *       - draft
 *       - proposed
 *       - published
 *       - rejected
 *   type:
 *     $ref: "#/components/schemas/CreateProductType"
 *   type_id:
 *     type: string
 *     title: type_id
 *     description: The product's type id.
 *   collection_id:
 *     type: string
 *     title: collection_id
 *     description: The product's collection id.
 *   tags:
 *     type: array
 *     description: The product's tags.
 *     items:
 *       type: object
 *       description: The tag's tags.
 *       x-schemaName: CreateProductTag
 *       required:
 *         - value
 *       properties:
 *         value:
 *           type: string
 *           title: value
 *           description: The tag's value.
 *   categories:
 *     type: array
 *     description: The product's categories.
 *     items:
 *       type: object
 *       description: The category's categories.
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           title: id
 *           description: The category's ID.
 *   options:
 *     type: array
 *     description: The product's options.
 *     items:
 *       type: object
 *       description: The option's options.
 *       x-schemaName: CreateProductOption
 *       required:
 *         - title
 *         - values
 *       properties:
 *         title:
 *           type: string
 *           title: title
 *           description: The option's title.
 *         values:
 *           oneOf:
 *             - type: array
 *               description: The option's values.
 *               items:
 *                 type: string
 *                 title: values
 *                 description: The value's values.
 *             - type: array
 *               description: The option's values.
 *               items:
 *                 type: object
 *                 description: The value's values.
 *                 required:
 *                   - value
 *                 properties:
 *                   value:
 *                     type: string
 *                     title: value
 *                     description: The value's details.
 *         product_id:
 *           type: string
 *           title: product_id
 *           description: The option's product id.
 *   variants:
 *     type: array
 *     description: The product's variants.
 *     items:
 *       type: object
 *       description: The variant's variants.
 *       x-schemaName: UpsertProductVariant
 *       properties:
 *         id:
 *           type: string
 *           title: id
 *           description: The variant's ID.
 *         title:
 *           type: string
 *           title: title
 *           description: The variant's title.
 *         sku:
 *           type: string
 *           title: sku
 *           description: The variant's sku.
 *         barcode:
 *           type: string
 *           title: barcode
 *           description: The variant's barcode.
 *         ean:
 *           type: string
 *           title: ean
 *           description: The variant's ean.
 *         upc:
 *           type: string
 *           title: upc
 *           description: The variant's upc.
 *         allow_backorder:
 *           type: boolean
 *           title: allow_backorder
 *           description: The variant's allow backorder.
 *         inventory_quantity:
 *           type: number
 *           title: inventory_quantity
 *           description: The variant's inventory quantity.
 *         manage_inventory:
 *           type: boolean
 *           title: manage_inventory
 *           description: The variant's manage inventory.
 *         hs_code:
 *           type: string
 *           title: hs_code
 *           description: The variant's hs code.
 *         origin_country:
 *           type: string
 *           title: origin_country
 *           description: The variant's origin country.
 *         mid_code:
 *           type: string
 *           title: mid_code
 *           description: The variant's mid code.
 *         material:
 *           type: string
 *           title: material
 *           description: The variant's material.
 *         weight:
 *           type: number
 *           title: weight
 *           description: The variant's weight.
 *         length:
 *           type: number
 *           title: length
 *           description: The variant's length.
 *         height:
 *           type: number
 *           title: height
 *           description: The variant's height.
 *         width:
 *           type: number
 *           title: width
 *           description: The variant's width.
 *         options:
 *           type: object
 *           description: The variant's options.
 *           properties: {}
 *         metadata:
 *           type: object
 *           description: The variant's metadata.
 *           properties: {}
 *   width:
 *     type: number
 *     title: width
 *     description: The product's width.
 *   height:
 *     type: number
 *     title: height
 *     description: The product's height.
 *   length:
 *     type: number
 *     title: length
 *     description: The product's length.
 *   weight:
 *     type: number
 *     title: weight
 *     description: The product's weight.
 *   origin_country:
 *     type: string
 *     title: origin_country
 *     description: The product's origin country.
 *   hs_code:
 *     type: string
 *     title: hs_code
 *     description: The product's hs code.
 *   material:
 *     type: string
 *     title: material
 *     description: The product's material.
 *   mid_code:
 *     type: string
 *     title: mid_code
 *     description: The product's mid code.
 *   metadata:
 *     type: object
 *     description: The product's metadata.
 *     properties: {}
 * 
*/

