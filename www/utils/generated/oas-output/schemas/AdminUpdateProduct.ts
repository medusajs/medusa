/**
 * @schema AdminUpdateProduct
 * type: object
 * description: The update's details.
 * x-schemaName: AdminUpdateProduct
 * properties:
 *   title:
 *     type: string
 *     title: title
 *     description: The update's title.
 *   subtitle:
 *     type: string
 *     title: subtitle
 *     description: The update's subtitle.
 *   description:
 *     type: string
 *     title: description
 *     description: The update's description.
 *   is_giftcard:
 *     type: boolean
 *     title: is_giftcard
 *     description: The update's is giftcard.
 *   discountable:
 *     type: boolean
 *     title: discountable
 *     description: The update's discountable.
 *   images:
 *     type: array
 *     description: The update's images.
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
 *     description: The update's thumbnail.
 *   handle:
 *     type: string
 *     title: handle
 *     description: The update's handle.
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
 *     description: The update's type id.
 *   collection_id:
 *     type: string
 *     title: collection_id
 *     description: The update's collection id.
 *   categories:
 *     type: array
 *     description: The update's categories.
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
 *     description: The update's tags.
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
 *     description: The update's options.
 *     items:
 *       $ref: "#/components/schemas/AdminUpdateProductOption"
 *   variants:
 *     type: array
 *     description: The update's variants.
 *     items:
 *       $ref: "#/components/schemas/AdminCreateProductVariant"
 *   sales_channels:
 *     type: array
 *     description: The update's sales channels.
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
 *     description: The update's weight.
 *   length:
 *     type: number
 *     title: length
 *     description: The update's length.
 *   height:
 *     type: number
 *     title: height
 *     description: The update's height.
 *   width:
 *     type: number
 *     title: width
 *     description: The update's width.
 *   hs_code:
 *     type: string
 *     title: hs_code
 *     description: The update's hs code.
 *   mid_code:
 *     type: string
 *     title: mid_code
 *     description: The update's mid code.
 *   origin_country:
 *     type: string
 *     title: origin_country
 *     description: The update's origin country.
 *   material:
 *     type: string
 *     title: material
 *     description: The update's material.
 *   metadata:
 *     type: object
 *     description: The update's metadata.
 * 
*/

