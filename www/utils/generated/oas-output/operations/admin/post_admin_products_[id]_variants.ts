/**
 * @oas [post] /admin/products/{id}/variants
 * operationId: PostProductsIdVariants
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
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: SUMMARY
 *         required:
 *           - title
 *           - sku
 *           - ean
 *           - upc
 *           - barcode
 *           - hs_code
 *           - mid_code
 *           - inventory_quantity
 *           - allow_backorder
 *           - manage_inventory
 *           - variant_rank
 *           - weight
 *           - length
 *           - height
 *           - width
 *           - origin_country
 *           - material
 *           - metadata
 *           - prices
 *           - options
 *         properties:
 *           title:
 *             type: string
 *             title: title
 *             description: The product's title.
 *           sku:
 *             type: string
 *             title: sku
 *             description: The product's sku.
 *           ean:
 *             type: string
 *             title: ean
 *             description: The product's ean.
 *           upc:
 *             type: string
 *             title: upc
 *             description: The product's upc.
 *           barcode:
 *             type: string
 *             title: barcode
 *             description: The product's barcode.
 *           hs_code:
 *             type: string
 *             title: hs_code
 *             description: The product's hs code.
 *           mid_code:
 *             type: string
 *             title: mid_code
 *             description: The product's mid code.
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
 *           variant_rank:
 *             type: number
 *             title: variant_rank
 *             description: The product's variant rank.
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
 *           prices:
 *             type: array
 *             description: The product's prices.
 *             items:
 *               type: object
 *               description: The price's prices.
 *               required:
 *                 - currency_code
 *                 - amount
 *                 - min_quantity
 *                 - max_quantity
 *               properties:
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
 *           options:
 *             type: object
 *             description: The product's options.
 *             properties: {}
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/products/{id}/variants' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "title": "{value}",
 *         "sku": "{value}",
 *         "ean": "{value}",
 *         "upc": "{value}",
 *         "barcode": "{value}",
 *         "hs_code": "{value}",
 *         "mid_code": "{value}",
 *         "inventory_quantity": 3621544083324928,
 *         "allow_backorder": false,
 *         "manage_inventory": true,
 *         "variant_rank": 849570489696256,
 *         "weight": 7893319220723712,
 *         "length": 2949835917361152,
 *         "height": 2357674687594496,
 *         "width": 5150499311452160,
 *         "origin_country": "{value}",
 *         "material": "{value}",
 *         "metadata": {},
 *         "prices": [
 *           {
 *             "currency_code": "{value}",
 *             "amount": 8952600449777664,
 *             "min_quantity": 5462512040411136,
 *             "max_quantity": 4871260370632704
 *           }
 *         ],
 *         "options": {}
 *       }'
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
 * 
*/

