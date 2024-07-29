/**
 * @schema AdminProduct
 * type: object
 * description: The product's parent.
 * x-schemaName: AdminProduct
 * required:
 *   - type
 *   - title
 *   - status
 *   - length
 *   - options
 *   - description
 *   - id
 *   - handle
 *   - hs_code
 *   - weight
 *   - height
 *   - width
 *   - origin_country
 *   - mid_code
 *   - material
 *   - thumbnail
 *   - created_at
 *   - updated_at
 *   - deleted_at
 *   - subtitle
 *   - is_giftcard
 *   - collection_id
 *   - type_id
 *   - images
 *   - discountable
 *   - external_id
 * properties:
 *   collection:
 *     $ref: "#/components/schemas/AdminCollection"
 *   categories:
 *     type: array
 *     description: The parent's categories.
 *     items:
 *       $ref: "#/components/schemas/AdminProductCategory"
 *   sales_channels:
 *     type: array
 *     description: The parent's sales channels.
 *     items:
 *       $ref: "#/components/schemas/AdminSalesChannel"
 *   variants:
 *     type: array
 *     description: The parent's variants.
 *     items:
 *       $ref: "#/components/schemas/AdminProductVariant"
 *   type:
 *     $ref: "#/components/schemas/AdminProduct"
 *   tags:
 *     type: array
 *     description: The parent's tags.
 *     items:
 *       $ref: "#/components/schemas/AdminProductTag"
 *   title:
 *     type: string
 *     title: title
 *     description: The parent's title.
 *   status:
 *     type: string
 *     enum:
 *       - draft
 *       - proposed
 *       - published
 *       - rejected
 *   length:
 *     type: number
 *     title: length
 *     description: The parent's length.
 *   options:
 *     type: array
 *     description: The parent's options.
 *     items:
 *       $ref: "#/components/schemas/BaseProductOption"
 *   description:
 *     type: string
 *     title: description
 *     description: The parent's description.
 *   id:
 *     type: string
 *     title: id
 *     description: The parent's ID.
 *   metadata:
 *     type: object
 *     description: The parent's metadata.
 *   handle:
 *     type: string
 *     title: handle
 *     description: The parent's handle.
 *   hs_code:
 *     type: string
 *     title: hs_code
 *     description: The parent's hs code.
 *   weight:
 *     type: number
 *     title: weight
 *     description: The parent's weight.
 *   height:
 *     type: number
 *     title: height
 *     description: The parent's height.
 *   width:
 *     type: number
 *     title: width
 *     description: The parent's width.
 *   origin_country:
 *     type: string
 *     title: origin_country
 *     description: The parent's origin country.
 *   mid_code:
 *     type: string
 *     title: mid_code
 *     description: The parent's mid code.
 *   material:
 *     type: string
 *     title: material
 *     description: The parent's material.
 *   thumbnail:
 *     type: string
 *     title: thumbnail
 *     description: The parent's thumbnail.
 *   created_at:
 *     type: string
 *     format: date-time
 *     title: created_at
 *     description: The parent's created at.
 *   updated_at:
 *     type: string
 *     format: date-time
 *     title: updated_at
 *     description: The parent's updated at.
 *   deleted_at:
 *     type: string
 *     format: date-time
 *     title: deleted_at
 *     description: The parent's deleted at.
 *   subtitle:
 *     type: string
 *     title: subtitle
 *     description: The parent's subtitle.
 *   is_giftcard:
 *     type: boolean
 *     title: is_giftcard
 *     description: The parent's is giftcard.
 *   collection_id:
 *     type: string
 *     title: collection_id
 *     description: The parent's collection id.
 *   type_id:
 *     type: string
 *     title: type_id
 *     description: The parent's type id.
 *   images:
 *     type: array
 *     description: The parent's images.
 *     items:
 *       $ref: "#/components/schemas/BaseProductImage"
 *   discountable:
 *     type: boolean
 *     title: discountable
 *     description: The parent's discountable.
 *   external_id:
 *     type: string
 *     title: external_id
 *     description: The parent's external id.
 * 
*/

