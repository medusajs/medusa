/**
 * @oas [post] /admin/inventory-items
 * operationId: PostInventoryItems
 * summary: Create Inventory Item
 * description: Create a inventory item.
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
 *     description: >-
 *       Comma-separated fields that should be included in the returned data.
 *        * if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default fields.
 *        * without prefix it will replace the entire default fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: >-
 *         Comma-separated fields that should be included in the returned data.
 *          * if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default fields.
 *          * without prefix it will replace the entire default fields.
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
 *         type: object
 *         description: SUMMARY
 *         required:
 *           - sku
 *           - hs_code
 *           - weight
 *           - length
 *           - height
 *           - width
 *           - origin_country
 *           - mid_code
 *           - material
 *           - title
 *           - description
 *           - thumbnail
 *           - metadata
 *         properties:
 *           sku:
 *             type: string
 *             title: sku
 *             description: The inventory item's sku.
 *           hs_code:
 *             type: string
 *             title: hs_code
 *             description: The inventory item's hs code.
 *           weight:
 *             type: number
 *             title: weight
 *             description: The inventory item's weight.
 *           length:
 *             type: number
 *             title: length
 *             description: The inventory item's length.
 *           height:
 *             type: number
 *             title: height
 *             description: The inventory item's height.
 *           width:
 *             type: number
 *             title: width
 *             description: The inventory item's width.
 *           origin_country:
 *             type: string
 *             title: origin_country
 *             description: The inventory item's origin country.
 *           mid_code:
 *             type: string
 *             title: mid_code
 *             description: The inventory item's mid code.
 *           material:
 *             type: string
 *             title: material
 *             description: The inventory item's material.
 *           title:
 *             type: string
 *             title: title
 *             description: The inventory item's title.
 *           description:
 *             type: string
 *             title: description
 *             description: The inventory item's description.
 *           requires_shipping:
 *             type: boolean
 *             title: requires_shipping
 *             description: The inventory item's requires shipping.
 *           thumbnail:
 *             type: string
 *             title: thumbnail
 *             description: The inventory item's thumbnail.
 *           metadata:
 *             type: object
 *             description: The inventory item's metadata.
 *           location_levels:
 *             type: array
 *             description: The inventory item's location levels.
 *             items:
 *               type: object
 *               description: The location level's location levels.
 *               required:
 *                 - location_id
 *               properties:
 *                 location_id:
 *                   type: string
 *                   title: location_id
 *                   description: The location level's location id.
 *                 stocked_quantity:
 *                   type: number
 *                   title: stocked_quantity
 *                   description: The location level's stocked quantity.
 *                 incoming_quantity:
 *                   type: number
 *                   title: incoming_quantity
 *                   description: The location level's incoming quantity.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/inventory-items' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "sku": "{value}",
 *         "hs_code": "{value}",
 *         "weight": 2857134683324416,
 *         "length": 2322256963305472,
 *         "height": 8391220613087232,
 *         "width": 1297863250280448,
 *         "origin_country": "{value}",
 *         "mid_code": "{value}",
 *         "material": "{value}",
 *         "title": "{value}",
 *         "description": "{value}",
 *         "thumbnail": "{value}",
 *         "metadata": {}
 *       }'
 * tags:
 *   - Inventory Items
 * responses:
 *   "200":
 *     description: OK
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

