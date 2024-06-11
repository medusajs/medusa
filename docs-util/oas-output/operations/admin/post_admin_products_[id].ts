/**
 * @oas [post] /admin/products/{id}
 * operationId: PostProductsId
 * summary: Update a Product
 * description: Update a product's details.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The product's ID.
 *     required: true
 *     schema:
 *       type: string
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/products/{id}' \
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
 *           - length
 *           - description
 *           - handle
 *           - metadata
 *           - hs_code
 *           - weight
 *           - height
 *           - width
 *           - origin_country
 *           - mid_code
 *           - material
 *           - thumbnail
 *           - collection_id
 *           - tags
 *           - type_id
 *           - subtitle
 *           - images
 *           - categories
 *           - sales_channels
 *           - title
 *           - discountable
 *           - options
 *           - variants
 *           - status
 *         properties:
 *           length:
 *             type: number
 *             title: length
 *             description: The product's length.
 *           description:
 *             type: string
 *             title: description
 *             description: The product's description.
 *           handle:
 *             type: string
 *             title: handle
 *             description: The product's handle.
 *           metadata:
 *             type: object
 *             description: The product's metadata.
 *             properties: {}
 *           hs_code:
 *             type: string
 *             title: hs_code
 *             description: The product's hs code.
 *           weight:
 *             type: number
 *             title: weight
 *             description: The product's weight.
 *           height:
 *             type: number
 *             title: height
 *             description: The product's height.
 *           width:
 *             type: number
 *             title: width
 *             description: The product's width.
 *           origin_country:
 *             type: string
 *             title: origin_country
 *             description: The product's origin country.
 *           mid_code:
 *             type: string
 *             title: mid_code
 *             description: The product's mid code.
 *           material:
 *             type: string
 *             title: material
 *             description: The product's material.
 *           thumbnail:
 *             type: string
 *             title: thumbnail
 *             description: The product's thumbnail.
 *           collection_id:
 *             type: string
 *             title: collection_id
 *             description: The product's collection id.
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
 *           type_id:
 *             type: string
 *             title: type_id
 *             description: The product's type id.
 *           subtitle:
 *             type: string
 *             title: subtitle
 *             description: The product's subtitle.
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
 *           title:
 *             type: string
 *             title: title
 *             description: The product's title.
 *           discountable:
 *             type: boolean
 *             title: discountable
 *             description: The product's discountable.
 *           options:
 *             type: array
 *             description: The product's options.
 *             items:
 *               type: object
 *               description: The option's options.
 *               required:
 *                 - id
 *                 - title
 *                 - values
 *               properties:
 *                 id:
 *                   type: string
 *                   title: id
 *                   description: The option's ID.
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
 *                 - length
 *                 - options
 *                 - metadata
 *                 - sku
 *                 - barcode
 *                 - hs_code
 *                 - weight
 *                 - height
 *                 - width
 *                 - origin_country
 *                 - mid_code
 *                 - material
 *                 - ean
 *                 - upc
 *                 - variant_rank
 *                 - id
 *                 - title
 *                 - prices
 *                 - inventory_quantity
 *                 - allow_backorder
 *                 - manage_inventory
 *               properties:
 *                 length:
 *                   type: number
 *                   title: length
 *                   description: The variant's length.
 *                 options:
 *                   type: object
 *                   description: The variant's options.
 *                   properties: {}
 *                 metadata:
 *                   type: object
 *                   description: The variant's metadata.
 *                   properties: {}
 *                 sku:
 *                   type: string
 *                   title: sku
 *                   description: The variant's sku.
 *                 barcode:
 *                   type: string
 *                   title: barcode
 *                   description: The variant's barcode.
 *                 hs_code:
 *                   type: string
 *                   title: hs_code
 *                   description: The variant's hs code.
 *                 weight:
 *                   type: number
 *                   title: weight
 *                   description: The variant's weight.
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
 *                 mid_code:
 *                   type: string
 *                   title: mid_code
 *                   description: The variant's mid code.
 *                 material:
 *                   type: string
 *                   title: material
 *                   description: The variant's material.
 *                 ean:
 *                   type: string
 *                   title: ean
 *                   description: The variant's ean.
 *                 upc:
 *                   type: string
 *                   title: upc
 *                   description: The variant's upc.
 *                 variant_rank:
 *                   type: number
 *                   title: variant_rank
 *                   description: The variant's variant rank.
 *                 id:
 *                   type: string
 *                   title: id
 *                   description: The variant's ID.
 *                 title:
 *                   type: string
 *                   title: title
 *                   description: The variant's title.
 *                 prices:
 *                   type: array
 *                   description: The variant's prices.
 *                   items:
 *                     type: object
 *                     description: The price's prices.
 *                     required:
 *                       - id
 *                       - currency_code
 *                       - amount
 *                       - min_quantity
 *                       - max_quantity
 *                     properties:
 *                       id:
 *                         type: string
 *                         title: id
 *                         description: The price's ID.
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
 *           status: {}
 * 
*/

