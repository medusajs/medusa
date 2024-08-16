/**
 * @oas [post] /admin/products
 * operationId: PostProducts
 * summary: Create Product
 * description: Create a product.
 * x-authenticated: true
 * parameters:
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
 *     description: Comma-separated fields that should be included in the returned
 *       data. if a field is prefixed with `+` it will be added to the default
 *       fields, using `-` will remove it from the default fields. without prefix
 *       it will replace the entire default fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned
 *         data. if a field is prefixed with `+` it will be added to the default
 *         fields, using `-` will remove it from the default fields. without prefix
 *         it will replace the entire default fields.
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
 *     description: The field to sort the data by. By default, the sort order is
 *       ascending. To change the order to descending, prefix the field name with
 *       `-`.
 *     required: false
 *     schema:
 *       type: string
 *       title: order
 *       description: The field to sort the data by. By default, the sort order is
 *         ascending. To change the order to descending, prefix the field name with
 *         `-`.
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         description: SUMMARY
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
 *           status:
 *             type: string
 *             enum:
 *               - draft
 *               - proposed
 *               - published
 *               - rejected
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
 *               properties:
 *                 id:
 *                   type: string
 *                   title: id
 *                   description: The tag's ID.
 *           options:
 *             type: array
 *             description: The product's options.
 *             items:
 *               $ref: "#/components/schemas/AdminCreateProductOption"
 *           variants:
 *             type: array
 *             description: The product's variants.
 *             items:
 *               $ref: "#/components/schemas/AdminCreateProductVariant"
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
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/products' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "title": "{value}"
 *       }'
 * tags:
 *   - Products
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminProductResponse"
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
 * x-workflow: createProductsWorkflow
 * 
*/

