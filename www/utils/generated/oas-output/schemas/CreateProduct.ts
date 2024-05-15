/**
 * @schema CreateProduct
 * type: object
 * description: SUMMARY
 * x-schemaName: CreateProduct
 * required:
 *   - title
 * properties:
 *   title:
 *     type: string
 *     title: title
 *     description: The upload's title.
 *   subtitle:
 *     type: string
 *     title: subtitle
 *     description: The upload's subtitle.
 *   description:
 *     type: string
 *     title: description
 *     description: The upload's description.
 *   is_giftcard:
 *     type: boolean
 *     title: is_giftcard
 *     description: The upload's is giftcard.
 *   discountable:
 *     type: boolean
 *     title: discountable
 *     description: The upload's discountable.
 *   thumbnail:
 *     type: string
 *     title: thumbnail
 *     description: The upload's thumbnail.
 *   handle:
 *     type: string
 *     title: handle
 *     description: The upload's handle.
 *   status:
 *     type: string
 *     enum:
 *       - draft
 *       - proposed
 *       - published
 *       - rejected
 *   images:
 *     type: array
 *     description: The upload's images.
 *     items:
 *       $ref: "#/components/schemas/UpsertProductImage"
 *   type_id:
 *     type: string
 *     title: type_id
 *     description: The upload's type id.
 *   collection_id:
 *     type: string
 *     title: collection_id
 *     description: The upload's collection id.
 *   tags:
 *     type: array
 *     description: The upload's tags.
 *     items:
 *       $ref: "#/components/schemas/UpsertProductTag"
 *   category_ids:
 *     type: array
 *     description: The upload's category ids.
 *     items:
 *       type: string
 *       title: category_ids
 *       description: The category id's category ids.
 *   options:
 *     type: array
 *     description: The upload's options.
 *     items:
 *       $ref: "#/components/schemas/CreateProductOption"
 *   variants:
 *     type: array
 *     description: The upload's variants.
 *     items:
 *       $ref: "#/components/schemas/CreateProductVariant"
 *   width:
 *     type: number
 *     title: width
 *     description: The upload's width.
 *   height:
 *     type: number
 *     title: height
 *     description: The upload's height.
 *   length:
 *     type: number
 *     title: length
 *     description: The upload's length.
 *   weight:
 *     type: number
 *     title: weight
 *     description: The upload's weight.
 *   origin_country:
 *     type: string
 *     title: origin_country
 *     description: The upload's origin country.
 *   hs_code:
 *     type: string
 *     title: hs_code
 *     description: The upload's hs code.
 *   material:
 *     type: string
 *     title: material
 *     description: The upload's material.
 *   mid_code:
 *     type: string
 *     title: mid_code
 *     description: The upload's mid code.
 *   metadata:
 *     type: object
 *     description: The upload's metadata.
 *     properties: {}
 * 
*/

