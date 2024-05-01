/**
 * @oas [post] /admin/products
 * operationId: PostProducts
 * summary: Create Product
 * description: Create a product.
 * x-authenticated: true
 * parameters: []
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/products' \
 *       -H 'x-medusa-access-token: {api_token}'
 * tags:
 *   - Products
 * responses:
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         required:
 *           - title
 *           - subtitle
 *           - description
 *           - is_giftcard
 *           - discountable
 *           - images
 *           - thumbnail
 *           - handle
 *           - status
 *           - type_id
 *           - collection_id
 *           - categories
 *           - tags
 *           - options
 *           - variants
 *           - sales_channels
 *           - weight
 *           - length
 *           - height
 *           - width
 *           - hs_code
 *           - mid_code
 *           - origin_country
 *           - material
 *           - metadata
 *         properties:
 *           title:
 *             type: string
 *             title: title
 *             description: The product's title.
 *           subtitle:
 *             type: string
 *             title: subtitle
 *             description: The product's subtitle.
 *           description:
 *             type: string
 *             title: description
 *             description: The product's description.
 *           is_giftcard:
 *             type: boolean
 *             title: is_giftcard
 *             description: The product's is giftcard.
 *           discountable:
 *             type: boolean
 *             title: discountable
 *             description: The product's discountable.
 *           images:
 *             type: array
 *             description: The product's images.
 *             items:
 *               type: object
 *               description: The image's images.
 *               required:
 *                 - url
 *               properties:
 *                 url:
 *                   type: string
 *                   title: url
 *                   description: The image's url.
 *           thumbnail:
 *             type: string
 *             title: thumbnail
 *             description: The product's thumbnail.
 *           handle:
 *             type: string
 *             title: handle
 *             description: The product's handle.
 *           status: {}
 *           type_id:
 *             type: string
 *             title: type_id
 *             description: The product's type id.
 *           collection_id:
 *             type: string
 *             title: collection_id
 *             description: The product's collection id.
 *           categories:
 *             type: array
 *             description: The product's categories.
 *             items:
 *               type: object
 *               description: The category's categories.
 *               required:
 *                 - id
 *               properties:
 *                 id:
 *                   type: string
 *                   title: id
 *                   description: The category's ID.
 *           tags:
 *             type: array
 *             description: The product's tags.
 *             items:
 *               type: object
 *               description: The tag's tags.
 *               required:
 *                 - id
 *                 - value
 *               properties:
 *                 id:
 *                   type: string
 *                   title: id
 *                   description: The tag's ID.
 *                 value:
 *                   type: string
 *                   title: value
 *                   description: The tag's value.
 *           options:
 *             type: array
 *             description: The product's options.
 *             items:
 *               type: object
 *               description: The option's options.
 *               required:
 *                 - title
 *                 - values
 *               properties:
 *                 title:
 *                   type: string
 *                   title: title
 *                   description: The option's title.
 *                 values:
 *                   type: array
 *                   description: The option's values.
 *                   items:
 *                     type: string
 *                     title: values
 *                     description: The value's values.
 *           variants:
 *             type: array
 *             description: The product's variants.
 *             items:
 *               type: object
 *               description: The variant's variants.
 *               required:
 *                 - title
 *                 - sku
 *                 - ean
 *                 - upc
 *                 - barcode
 *                 - hs_code
 *                 - mid_code
 *                 - inventory_quantity
 *                 - allow_backorder
 *                 - manage_inventory
 *                 - variant_rank
 *                 - weight
 *                 - length
 *                 - height
 *                 - width
 *                 - origin_country
 *                 - material
 *                 - metadata
 *                 - prices
 *                 - options
 *               properties:
 *                 title:
 *                   type: string
 *                   title: title
 *                   description: The variant's title.
 *                 sku:
 *                   type: string
 *                   title: sku
 *                   description: The variant's sku.
 *                 ean:
 *                   type: string
 *                   title: ean
 *                   description: The variant's ean.
 *                 upc:
 *                   type: string
 *                   title: upc
 *                   description: The variant's upc.
 *                 barcode:
 *                   type: string
 *                   title: barcode
 *                   description: The variant's barcode.
 *                 hs_code:
 *                   type: string
 *                   title: hs_code
 *                   description: The variant's hs code.
 *                 mid_code:
 *                   type: string
 *                   title: mid_code
 *                   description: The variant's mid code.
 *                 inventory_quantity:
 *                   type: number
 *                   title: inventory_quantity
 *                   description: The variant's inventory quantity.
 *                 allow_backorder:
 *                   type: boolean
 *                   title: allow_backorder
 *                   description: The variant's allow backorder.
 *                 manage_inventory:
 *                   type: boolean
 *                   title: manage_inventory
 *                   description: The variant's manage inventory.
 *                 variant_rank:
 *                   type: number
 *                   title: variant_rank
 *                   description: The variant's variant rank.
 *                 weight:
 *                   type: number
 *                   title: weight
 *                   description: The variant's weight.
 *                 length:
 *                   type: number
 *                   title: length
 *                   description: The variant's length.
 *                 height:
 *                   type: number
 *                   title: height
 *                   description: The variant's height.
 *                 width:
 *                   type: number
 *                   title: width
 *                   description: The variant's width.
 *                 origin_country:
 *                   type: string
 *                   title: origin_country
 *                   description: The variant's origin country.
 *                 material:
 *                   type: string
 *                   title: material
 *                   description: The variant's material.
 *                 metadata:
 *                   type: object
 *                   description: The variant's metadata.
 *                   properties: {}
 *                 prices:
 *                   type: array
 *                   description: The variant's prices.
 *                   items:
 *                     type: object
 *                     description: The price's prices.
 *                     required:
 *                       - currency_code
 *                       - amount
 *                       - min_quantity
 *                       - max_quantity
 *                     properties:
 *                       currency_code:
 *                         type: string
 *                         title: currency_code
 *                         description: The price's currency code.
 *                       amount:
 *                         type: number
 *                         title: amount
 *                         description: The price's amount.
 *                       min_quantity:
 *                         type: number
 *                         title: min_quantity
 *                         description: The price's min quantity.
 *                       max_quantity:
 *                         type: number
 *                         title: max_quantity
 *                         description: The price's max quantity.
 *                 options:
 *                   type: object
 *                   description: The variant's options.
 *                   properties: {}
 *           sales_channels:
 *             type: array
 *             description: The product's sales channels.
 *             items:
 *               type: object
 *               description: The sales channel's sales channels.
 *               required:
 *                 - id
 *               properties:
 *                 id:
 *                   type: string
 *                   title: id
 *                   description: The sales channel's ID.
 *           weight:
 *             type: number
 *             title: weight
 *             description: The product's weight.
 *           length:
 *             type: number
 *             title: length
 *             description: The product's length.
 *           height:
 *             type: number
 *             title: height
 *             description: The product's height.
 *           width:
 *             type: number
 *             title: width
 *             description: The product's width.
 *           hs_code:
 *             type: string
 *             title: hs_code
 *             description: The product's hs code.
 *           mid_code:
 *             type: string
 *             title: mid_code
 *             description: The product's mid code.
 *           origin_country:
 *             type: string
 *             title: origin_country
 *             description: The product's origin country.
 *           material:
 *             type: string
 *             title: material
 *             description: The product's material.
 *           metadata:
 *             type: object
 *             description: The product's metadata.
 *             properties: {}
 * 
*/

