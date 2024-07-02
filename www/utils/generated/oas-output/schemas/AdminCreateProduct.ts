/**
 * @schema AdminCreateProduct
 * type: object
 * description: The create's details.
 * x-schemaName: AdminCreateProduct
 * required:
 *   - title
 * properties:
 *   title:
 *     type: string
 *     title: title
 *     description: The create's title.
 *   subtitle:
 *     type: string
 *     title: subtitle
 *     description: The create's subtitle.
 *   description:
 *     type: string
 *     title: description
 *     description: The create's description.
 *   is_giftcard:
 *     type: boolean
 *     title: is_giftcard
 *     description: The create's is giftcard.
 *   discountable:
 *     type: boolean
 *     title: discountable
 *     description: The create's discountable.
 *   images:
 *     type: array
 *     description: The create's images.
 *     items:
 *       type: object
 *       description: The image's images.
 *       required:
 *         - url
 *       properties:
 *         url:
 *           type: string
 *           title: url
 *           description: The image's url.
 *   thumbnail:
 *     type: string
 *     title: thumbnail
 *     description: The create's thumbnail.
 *   handle:
 *     type: string
 *     title: handle
 *     description: The create's handle.
 *   status:
 *     type: string
 *     enum:
 *       - draft
 *       - proposed
 *       - published
 *       - rejected
 *   type_id:
 *     type: string
 *     title: type_id
 *     description: The create's type id.
 *   collection_id:
 *     type: string
 *     title: collection_id
 *     description: The create's collection id.
 *   categories:
 *     type: array
 *     description: The create's categories.
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
 *   tags:
 *     type: array
 *     description: The create's tags.
 *     items:
 *       type: object
 *       description: The tag's tags.
 *       properties:
 *         id:
 *           type: string
 *           title: id
 *           description: The tag's ID.
 *         value:
 *           type: string
 *           title: value
 *           description: The tag's value.
 *   options:
 *     type: array
 *     description: The create's options.
 *     items:
 *       $ref: "#/components/schemas/AdminCreateProductOption"
 *   variants:
 *     type: array
 *     description: The create's variants.
 *     items:
 *       $ref: "#/components/schemas/AdminCreateProductVariant"
 *   sales_channels:
 *     type: array
 *     description: The create's sales channels.
 *     items:
 *       type: object
 *       description: The sales channel's sales channels.
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           title: id
 *           description: The sales channel's ID.
 *   weight:
 *     type: number
 *     title: weight
 *     description: The create's weight.
 *   length:
 *     type: number
 *     title: length
 *     description: The create's length.
 *   height:
 *     type: number
 *     title: height
 *     description: The create's height.
 *   width:
 *     type: number
 *     title: width
 *     description: The create's width.
 *   hs_code:
 *     type: string
 *     title: hs_code
 *     description: The create's hs code.
 *   mid_code:
 *     type: string
 *     title: mid_code
 *     description: The create's mid code.
 *   origin_country:
 *     type: string
 *     title: origin_country
 *     description: The create's origin country.
 *   material:
 *     type: string
 *     title: material
 *     description: The create's material.
 *   metadata:
 *     type: object
 *     description: The create's metadata.
 * 
*/

