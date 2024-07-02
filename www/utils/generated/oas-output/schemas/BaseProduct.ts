/**
 * @schema BaseProduct
 * type: object
 * description: The updated's product.
 * x-schemaName: BaseProduct
 * required:
 *   - id
 *   - title
 *   - handle
 *   - subtitle
 *   - description
 *   - is_giftcard
 *   - status
 *   - thumbnail
 *   - width
 *   - weight
 *   - length
 *   - height
 *   - origin_country
 *   - hs_code
 *   - mid_code
 *   - material
 *   - collection_id
 *   - type_id
 *   - tags
 *   - variants
 *   - options
 *   - images
 *   - discountable
 *   - external_id
 *   - created_at
 *   - updated_at
 *   - deleted_at
 * properties:
 *   id:
 *     type: string
 *     title: id
 *     description: The product's ID.
 *   title:
 *     type: string
 *     title: title
 *     description: The product's title.
 *   handle:
 *     type: string
 *     title: handle
 *     description: The product's handle.
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
 *   status:
 *     type: string
 *     enum:
 *       - draft
 *       - proposed
 *       - published
 *       - rejected
 *   thumbnail:
 *     type: string
 *     title: thumbnail
 *     description: The product's thumbnail.
 *   width:
 *     type: number
 *     title: width
 *     description: The product's width.
 *   weight:
 *     type: number
 *     title: weight
 *     description: The product's weight.
 *   length:
 *     type: number
 *     title: length
 *     description: The product's length.
 *   height:
 *     type: number
 *     title: height
 *     description: The product's height.
 *   origin_country:
 *     type: string
 *     title: origin_country
 *     description: The product's origin country.
 *   hs_code:
 *     type: string
 *     title: hs_code
 *     description: The product's hs code.
 *   mid_code:
 *     type: string
 *     title: mid_code
 *     description: The product's mid code.
 *   material:
 *     type: string
 *     title: material
 *     description: The product's material.
 *   collection:
 *     $ref: "#/components/schemas/BaseCollection"
 *   collection_id:
 *     type: string
 *     title: collection_id
 *     description: The product's collection id.
 *   categories:
 *     type: array
 *     description: The product's categories.
 *     items:
 *       $ref: "#/components/schemas/BaseProductCategory"
 *   type:
 *     $ref: "#/components/schemas/BaseProduct"
 *   type_id:
 *     type: string
 *     title: type_id
 *     description: The product's type id.
 *   tags:
 *     type: array
 *     description: The product's tags.
 *     items:
 *       $ref: "#/components/schemas/BaseProductTag"
 *   variants:
 *     type: array
 *     description: The product's variants.
 *     items:
 *       $ref: "#/components/schemas/BaseProductVariant"
 *   options:
 *     type: array
 *     description: The product's options.
 *     items:
 *       $ref: "#/components/schemas/BaseProductOption"
 *   images:
 *     type: array
 *     description: The product's images.
 *     items:
 *       $ref: "#/components/schemas/BaseProductImage"
 *   discountable:
 *     type: boolean
 *     title: discountable
 *     description: The product's discountable.
 *   external_id:
 *     type: string
 *     title: external_id
 *     description: The product's external id.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The product's created at.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The product's updated at.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The product's deleted at.
 *   metadata:
 *     type: object
 *     description: The product's metadata.
 * 
*/

