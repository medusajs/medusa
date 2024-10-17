/**
 * @oas [post] /admin/inventory-items/{id}
 * operationId: PostInventoryItemsId
 * summary: Update an Inventory Item
 * description: Update an inventory item's details.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The inventory item's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: fields
 *     in: query
 *     description: Comma-separated fields that should be included in the returned data. if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *       fields. without prefix it will replace the entire default fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned data. if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *         fields. without prefix it will replace the entire default fields.
 *       externalDocs:
 *         url: "#select-fields-and-relations"
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: The properties to update in the inventory item.
 *         properties:
 *           sku:
 *             type: string
 *             title: sku
 *             description: The inventory item's SKU.
 *           hs_code:
 *             type: string
 *             title: hs_code
 *             description: The inventory item's HS code.
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
 *             description: The inventory item's MID code.
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
 *             description: Whether the inventory item requires shipping.
 *           thumbnail:
 *             type: string
 *             title: thumbnail
 *             description: The URL of an image to be used as the inventory item's thumbnail. You can use the Upload API routes to upload an image and get its URL.
 *           metadata:
 *             type: object
 *             description: The inventory item's metadata. Can be custom data in key-value pairs.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/inventory-items/{id}' \
 *       -H 'Authorization: Bearer {access_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "sku": "{value}",
 *         "hs_code": "{value}",
 *         "weight": 8979922215239680,
 *         "length": 667491233693696,
 *         "height": 6328111551479808,
 *         "width": 7175104570064896,
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
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminInventoryItemResponse"
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
 * x-workflow: updateInventoryItemsWorkflow
 * 
*/

