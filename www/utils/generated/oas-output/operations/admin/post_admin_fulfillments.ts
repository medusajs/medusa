/**
 * @oas [post] /admin/fulfillments
 * operationId: PostFulfillments
 * summary: Create Fulfillment
 * description: Create a fulfillment.
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
 *           - location_id
 *           - provider_id
 *           - delivery_address
 *           - items
 *           - labels
 *           - order
 *           - metadata
 *         properties:
 *           location_id:
 *             type: string
 *             title: location_id
 *             description: The fulfillment's location id.
 *           provider_id:
 *             type: string
 *             title: provider_id
 *             description: The fulfillment's provider id.
 *           delivery_address:
 *             type: object
 *             description: The fulfillment's delivery address.
 *             required:
 *               - first_name
 *               - last_name
 *               - phone
 *               - company
 *               - address_1
 *               - address_2
 *               - city
 *               - country_code
 *               - province
 *               - postal_code
 *               - metadata
 *             properties:
 *               first_name:
 *                 type: string
 *                 title: first_name
 *                 description: The delivery address's first name.
 *               last_name:
 *                 type: string
 *                 title: last_name
 *                 description: The delivery address's last name.
 *               phone:
 *                 type: string
 *                 title: phone
 *                 description: The delivery address's phone.
 *               company:
 *                 type: string
 *                 title: company
 *                 description: The delivery address's company.
 *               address_1:
 *                 type: string
 *                 title: address_1
 *                 description: The delivery address's address 1.
 *               address_2:
 *                 type: string
 *                 title: address_2
 *                 description: The delivery address's address 2.
 *               city:
 *                 type: string
 *                 title: city
 *                 description: The delivery address's city.
 *               country_code:
 *                 type: string
 *                 title: country_code
 *                 description: The delivery address's country code.
 *               province:
 *                 type: string
 *                 title: province
 *                 description: The delivery address's province.
 *               postal_code:
 *                 type: string
 *                 title: postal_code
 *                 description: The delivery address's postal code.
 *               metadata:
 *                 type: object
 *                 description: The delivery address's metadata.
 *                 properties: {}
 *           items:
 *             type: array
 *             description: The fulfillment's items.
 *             items:
 *               type: object
 *               description: The item's items.
 *               required:
 *                 - title
 *                 - sku
 *                 - quantity
 *                 - barcode
 *                 - line_item_id
 *                 - inventory_item_id
 *               properties:
 *                 title:
 *                   type: string
 *                   title: title
 *                   description: The item's title.
 *                 sku:
 *                   type: string
 *                   title: sku
 *                   description: The item's sku.
 *                 quantity:
 *                   type: number
 *                   title: quantity
 *                   description: The item's quantity.
 *                 barcode:
 *                   type: string
 *                   title: barcode
 *                   description: The item's barcode.
 *                 line_item_id:
 *                   type: string
 *                   title: line_item_id
 *                   description: The item's line item id.
 *                 inventory_item_id:
 *                   type: string
 *                   title: inventory_item_id
 *                   description: The item's inventory item id.
 *           labels:
 *             type: array
 *             description: The fulfillment's labels.
 *             items:
 *               type: object
 *               description: The label's labels.
 *               required:
 *                 - tracking_number
 *                 - tracking_url
 *                 - label_url
 *               properties:
 *                 tracking_number:
 *                   type: string
 *                   title: tracking_number
 *                   description: The label's tracking number.
 *                 tracking_url:
 *                   type: string
 *                   title: tracking_url
 *                   description: The label's tracking url.
 *                 label_url:
 *                   type: string
 *                   title: label_url
 *                   description: The label's label url.
 *           order:
 *             type: object
 *             description: The fulfillment's order.
 *             properties: {}
 *           metadata:
 *             type: object
 *             description: The fulfillment's metadata.
 *             properties: {}
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/fulfillments' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "location_id": "{value}",
 *         "provider_id": "{value}",
 *         "delivery_address": {
 *           "first_name": "{value}",
 *           "last_name": "{value}",
 *           "phone": "{value}",
 *           "company": "{value}",
 *           "address_1": "{value}",
 *           "address_2": "{value}",
 *           "city": "{value}",
 *           "country_code": "{value}",
 *           "province": "{value}",
 *           "postal_code": "{value}",
 *           "metadata": {}
 *         },
 *         "items": [
 *           {
 *             "title": "{value}",
 *             "sku": "{value}",
 *             "quantity": 6350536800468992,
 *             "barcode": "{value}",
 *             "line_item_id": "{value}",
 *             "inventory_item_id": "{value}"
 *           }
 *         ],
 *         "labels": [
 *           {
 *             "tracking_number": "{value}",
 *             "tracking_url": "{value}",
 *             "label_url": "{value}"
 *           }
 *         ],
 *         "order": {},
 *         "metadata": {}
 *       }'
 * tags:
 *   - Fulfillments
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

