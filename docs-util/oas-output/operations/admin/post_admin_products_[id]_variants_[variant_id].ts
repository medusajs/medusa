/**
 * @oas [post] /admin/products/{id}/variants/{variant_id}
 * operationId: PostProductsIdVariantsVariant_id
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
 *   - name: variant_id
 *     in: path
 *     description: The product's variant id.
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
 *       curl -X POST '{backend_url}/admin/products/{id}/variants/{variant_id}' \
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
 *           - options
 *           - metadata
 *           - sku
 *           - barcode
 *           - hs_code
 *           - weight
 *           - height
 *           - width
 *           - origin_country
 *           - mid_code
 *           - material
 *           - ean
 *           - upc
 *           - variant_rank
 *           - id
 *           - title
 *           - prices
 *           - inventory_quantity
 *           - allow_backorder
 *           - manage_inventory
 *         properties:
 *           length:
 *             type: number
 *             title: length
 *             description: The product's length.
 *           options:
 *             type: object
 *             description: The product's options.
 *             properties: {}
 *           metadata:
 *             type: object
 *             description: The product's metadata.
 *             properties: {}
 *           sku:
 *             type: string
 *             title: sku
 *             description: The product's sku.
 *           barcode:
 *             type: string
 *             title: barcode
 *             description: The product's barcode.
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
 *           ean:
 *             type: string
 *             title: ean
 *             description: The product's ean.
 *           upc:
 *             type: string
 *             title: upc
 *             description: The product's upc.
 *           variant_rank:
 *             type: number
 *             title: variant_rank
 *             description: The product's variant rank.
 *           id:
 *             type: string
 *             title: id
 *             description: The product's ID.
 *           title:
 *             type: string
 *             title: title
 *             description: The product's title.
 *           prices:
 *             type: array
 *             description: The product's prices.
 *             items:
 *               type: object
 *               description: The price's prices.
 *               required:
 *                 - id
 *                 - currency_code
 *                 - amount
 *                 - min_quantity
 *                 - max_quantity
 *               properties:
 *                 id:
 *                   type: string
 *                   title: id
 *                   description: The price's ID.
 *                 currency_code:
 *                   type: string
 *                   title: currency_code
 *                   description: The price's currency code.
 *                 amount:
 *                   type: number
 *                   title: amount
 *                   description: The price's amount.
 *                 min_quantity:
 *                   type: number
 *                   title: min_quantity
 *                   description: The price's min quantity.
 *                 max_quantity:
 *                   type: number
 *                   title: max_quantity
 *                   description: The price's max quantity.
 *           inventory_quantity:
 *             type: number
 *             title: inventory_quantity
 *             description: The product's inventory quantity.
 *           allow_backorder:
 *             type: boolean
 *             title: allow_backorder
 *             description: The product's allow backorder.
 *           manage_inventory:
 *             type: boolean
 *             title: manage_inventory
 *             description: The product's manage inventory.
 * 
*/

