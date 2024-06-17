/**
 * @oas [post] /admin/products/{id}/variants/batch
 * operationId: PostProductsIdVariantsBatch
 * summary: Add Variants to Product
 * description: Add a list of variants to a product.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The product's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: expand
 *     in: query
 *     description: Comma-separated relations that should be expanded in the returned data.
 *     required: false
 *     schema:
 *       type: string
 *       title: expand
 *       description: Comma-separated relations that should be expanded in the returned data.
 *   - name: fields
 *     in: query
 *     description: Comma-separated fields that should be included in the returned data.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned data.
 *   - name: offset
 *     in: query
 *     description: The number of items to skip when retrieving a list.
 *     required: false
 *     schema:
 *       type: number
 *       title: offset
 *       description: The number of items to skip when retrieving a list.
 *   - name: limit
 *     in: query
 *     description: Limit the number of items returned in the list.
 *     required: false
 *     schema:
 *       type: number
 *       title: limit
 *       description: Limit the number of items returned in the list.
 *   - name: order
 *     in: query
 *     description: Field to sort items in the list by.
 *     required: false
 *     schema:
 *       type: string
 *       title: order
 *       description: Field to sort items in the list by.
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/products/{id}/variants/batch' \
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
 *         description: SUMMARY
 *         properties:
 *           create:
 *             type: array
 *             description: The product's create.
 *             items:
 *               type: object
 *               description: The create's details.
 *               required:
 *                 - title
 *                 - subtitle
 *                 - description
 *                 - is_giftcard
 *                 - discountable
 *                 - images
 *                 - thumbnail
 *                 - handle
 *                 - status
 *                 - type_id
 *                 - collection_id
 *                 - categories
 *                 - tags
 *                 - options
 *                 - variants
 *                 - sales_channels
 *                 - weight
 *                 - length
 *                 - height
 *                 - width
 *                 - hs_code
 *                 - mid_code
 *                 - origin_country
 *                 - material
 *                 - metadata
 *               properties:
 *                 title:
 *                   type: string
 *                   title: title
 *                   description: The create's title.
 *                 subtitle:
 *                   type: string
 *                   title: subtitle
 *                   description: The create's subtitle.
 *                 description:
 *                   type: string
 *                   title: description
 *                   description: The create's description.
 *                 is_giftcard:
 *                   type: boolean
 *                   title: is_giftcard
 *                   description: The create's is giftcard.
 *                 discountable:
 *                   type: boolean
 *                   title: discountable
 *                   description: The create's discountable.
 *                 images:
 *                   type: array
 *                   description: The create's images.
 *                   items:
 *                     type: object
 *                     description: The image's images.
 *                     required:
 *                       - url
 *                     properties:
 *                       url:
 *                         type: string
 *                         title: url
 *                         description: The image's url.
 *                 thumbnail:
 *                   type: string
 *                   title: thumbnail
 *                   description: The create's thumbnail.
 *                 handle:
 *                   type: string
 *                   title: handle
 *                   description: The create's handle.
 *                 status:
 *                   type: string
 *                   enum:
 *                     - draft
 *                     - proposed
 *                     - published
 *                     - rejected
 *                 type_id:
 *                   type: string
 *                   title: type_id
 *                   description: The create's type id.
 *                 collection_id:
 *                   type: string
 *                   title: collection_id
 *                   description: The create's collection id.
 *                 categories:
 *                   type: array
 *                   description: The create's categories.
 *                   items:
 *                     type: object
 *                     description: The category's categories.
 *                     required:
 *                       - id
 *                     properties:
 *                       id:
 *                         type: string
 *                         title: id
 *                         description: The category's ID.
 *                 tags:
 *                   type: array
 *                   description: The create's tags.
 *                   items:
 *                     type: object
 *                     description: The tag's tags.
 *                     required:
 *                       - id
 *                       - value
 *                     properties:
 *                       id:
 *                         type: string
 *                         title: id
 *                         description: The tag's ID.
 *                       value:
 *                         type: string
 *                         title: value
 *                         description: The tag's value.
 *                 options:
 *                   type: array
 *                   description: The create's options.
 *                   items:
 *                     type: object
 *                     description: The option's options.
 *                     required:
 *                       - title
 *                       - values
 *                     properties:
 *                       title:
 *                         type: string
 *                         title: title
 *                         description: The option's title.
 *                       values:
 *                         type: array
 *                         description: The option's values.
 *                         items:
 *                           type: string
 *                           title: values
 *                           description: The value's values.
 *                 variants:
 *                   type: array
 *                   description: The create's variants.
 *                   items:
 *                     type: object
 *                     description: The variant's variants.
 *                     required:
 *                       - title
 *                       - sku
 *                       - ean
 *                       - upc
 *                       - barcode
 *                       - hs_code
 *                       - mid_code
 *                       - inventory_quantity
 *                       - allow_backorder
 *                       - manage_inventory
 *                       - variant_rank
 *                       - weight
 *                       - length
 *                       - height
 *                       - width
 *                       - origin_country
 *                       - material
 *                       - metadata
 *                       - prices
 *                       - options
 *                     properties:
 *                       title:
 *                         type: string
 *                         title: title
 *                         description: The variant's title.
 *                       sku:
 *                         type: string
 *                         title: sku
 *                         description: The variant's sku.
 *                       ean:
 *                         type: string
 *                         title: ean
 *                         description: The variant's ean.
 *                       upc:
 *                         type: string
 *                         title: upc
 *                         description: The variant's upc.
 *                       barcode:
 *                         type: string
 *                         title: barcode
 *                         description: The variant's barcode.
 *                       hs_code:
 *                         type: string
 *                         title: hs_code
 *                         description: The variant's hs code.
 *                       mid_code:
 *                         type: string
 *                         title: mid_code
 *                         description: The variant's mid code.
 *                       inventory_quantity:
 *                         type: number
 *                         title: inventory_quantity
 *                         description: The variant's inventory quantity.
 *                       allow_backorder:
 *                         type: boolean
 *                         title: allow_backorder
 *                         description: The variant's allow backorder.
 *                       manage_inventory:
 *                         type: boolean
 *                         title: manage_inventory
 *                         description: The variant's manage inventory.
 *                       variant_rank:
 *                         type: number
 *                         title: variant_rank
 *                         description: The variant's variant rank.
 *                       weight:
 *                         type: number
 *                         title: weight
 *                         description: The variant's weight.
 *                       length:
 *                         type: number
 *                         title: length
 *                         description: The variant's length.
 *                       height:
 *                         type: number
 *                         title: height
 *                         description: The variant's height.
 *                       width:
 *                         type: number
 *                         title: width
 *                         description: The variant's width.
 *                       origin_country:
 *                         type: string
 *                         title: origin_country
 *                         description: The variant's origin country.
 *                       material:
 *                         type: string
 *                         title: material
 *                         description: The variant's material.
 *                       metadata:
 *                         type: object
 *                         description: The variant's metadata.
 *                         properties: {}
 *                       prices:
 *                         type: array
 *                         description: The variant's prices.
 *                         items:
 *                           type: object
 *                           description: The price's prices.
 *                           properties: {}
 *                       options:
 *                         type: object
 *                         description: The variant's options.
 *                         properties: {}
 *                 sales_channels:
 *                   type: array
 *                   description: The create's sales channels.
 *                   items:
 *                     type: object
 *                     description: The sales channel's sales channels.
 *                     required:
 *                       - id
 *                     properties:
 *                       id:
 *                         type: string
 *                         title: id
 *                         description: The sales channel's ID.
 *                 weight:
 *                   type: number
 *                   title: weight
 *                   description: The create's weight.
 *                 length:
 *                   type: number
 *                   title: length
 *                   description: The create's length.
 *                 height:
 *                   type: number
 *                   title: height
 *                   description: The create's height.
 *                 width:
 *                   type: number
 *                   title: width
 *                   description: The create's width.
 *                 hs_code:
 *                   type: string
 *                   title: hs_code
 *                   description: The create's hs code.
 *                 mid_code:
 *                   type: string
 *                   title: mid_code
 *                   description: The create's mid code.
 *                 origin_country:
 *                   type: string
 *                   title: origin_country
 *                   description: The create's origin country.
 *                 material:
 *                   type: string
 *                   title: material
 *                   description: The create's material.
 *                 metadata:
 *                   type: object
 *                   description: The create's metadata.
 *                   properties: {}
 *           update:
 *             type: array
 *             description: The product's update.
 *             items:
 *               type: object
 *               description: The update's details.
 *               required:
 *                 - title
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
 *                 - prices
 *                 - manage_inventory
 *                 - allow_backorder
 *                 - ean
 *                 - upc
 *                 - inventory_quantity
 *                 - variant_rank
 *                 - id
 *               properties:
 *                 title:
 *                   type: string
 *                   title: title
 *                   description: The update's title.
 *                 length:
 *                   type: number
 *                   title: length
 *                   description: The update's length.
 *                 options:
 *                   type: object
 *                   description: The update's options.
 *                   properties: {}
 *                 metadata:
 *                   type: object
 *                   description: The update's metadata.
 *                   properties: {}
 *                 sku:
 *                   type: string
 *                   title: sku
 *                   description: The update's sku.
 *                 barcode:
 *                   type: string
 *                   title: barcode
 *                   description: The update's barcode.
 *                 hs_code:
 *                   type: string
 *                   title: hs_code
 *                   description: The update's hs code.
 *                 weight:
 *                   type: number
 *                   title: weight
 *                   description: The update's weight.
 *                 height:
 *                   type: number
 *                   title: height
 *                   description: The update's height.
 *                 width:
 *                   type: number
 *                   title: width
 *                   description: The update's width.
 *                 origin_country:
 *                   type: string
 *                   title: origin_country
 *                   description: The update's origin country.
 *                 mid_code:
 *                   type: string
 *                   title: mid_code
 *                   description: The update's mid code.
 *                 material:
 *                   type: string
 *                   title: material
 *                   description: The update's material.
 *                 prices:
 *                   type: array
 *                   description: The update's prices.
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
 *                 manage_inventory:
 *                   type: boolean
 *                   title: manage_inventory
 *                   description: The update's manage inventory.
 *                 allow_backorder:
 *                   type: boolean
 *                   title: allow_backorder
 *                   description: The update's allow backorder.
 *                 ean:
 *                   type: string
 *                   title: ean
 *                   description: The update's ean.
 *                 upc:
 *                   type: string
 *                   title: upc
 *                   description: The update's upc.
 *                 inventory_quantity:
 *                   type: number
 *                   title: inventory_quantity
 *                   description: The update's inventory quantity.
 *                 variant_rank:
 *                   type: number
 *                   title: variant_rank
 *                   description: The update's variant rank.
 *                 id:
 *                   type: string
 *                   title: id
 *                   description: The update's ID.
 *           delete:
 *             type: array
 *             description: The product's delete.
 *             items:
 *               type: string
 *               title: delete
 *               description: The delete's details.
 * 
*/

