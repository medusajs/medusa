/**
 * @oas [post] /admin/draft-orders
 * operationId: PostDraftOrders
 * summary: Create Draft Order
 * description: Create a draft order.
 * x-authenticated: true
 * parameters: []
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
 *           - status
 *           - sales_channel_id
 *           - email
 *           - customer_id
 *           - billing_address
 *           - shipping_address
 *           - items
 *           - region_id
 *           - promo_codes
 *           - currency_code
 *           - no_notification_order
 *           - shipping_methods
 *           - metadata
 *         properties:
 *           status:
 *             type: boolean
 *             title: status
 *             description: The draft order's status.
 *           sales_channel_id:
 *             type: string
 *             title: sales_channel_id
 *             description: The draft order's sales channel id.
 *           email:
 *             type: string
 *             title: email
 *             description: The draft order's email.
 *             format: email
 *           customer_id:
 *             type: string
 *             title: customer_id
 *             description: The draft order's customer id.
 *           billing_address:
 *             type: object
 *             description: The draft order's billing address.
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
 *                 description: The billing address's first name.
 *               last_name:
 *                 type: string
 *                 title: last_name
 *                 description: The billing address's last name.
 *               phone:
 *                 type: string
 *                 title: phone
 *                 description: The billing address's phone.
 *               company:
 *                 type: string
 *                 title: company
 *                 description: The billing address's company.
 *               address_1:
 *                 type: string
 *                 title: address_1
 *                 description: The billing address's address 1.
 *               address_2:
 *                 type: string
 *                 title: address_2
 *                 description: The billing address's address 2.
 *               city:
 *                 type: string
 *                 title: city
 *                 description: The billing address's city.
 *               country_code:
 *                 type: string
 *                 title: country_code
 *                 description: The billing address's country code.
 *               province:
 *                 type: string
 *                 title: province
 *                 description: The billing address's province.
 *               postal_code:
 *                 type: string
 *                 title: postal_code
 *                 description: The billing address's postal code.
 *               metadata:
 *                 type: object
 *                 description: The billing address's metadata.
 *                 properties: {}
 *           shipping_address:
 *             type: object
 *             description: The draft order's shipping address.
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
 *                 description: The shipping address's first name.
 *               last_name:
 *                 type: string
 *                 title: last_name
 *                 description: The shipping address's last name.
 *               phone:
 *                 type: string
 *                 title: phone
 *                 description: The shipping address's phone.
 *               company:
 *                 type: string
 *                 title: company
 *                 description: The shipping address's company.
 *               address_1:
 *                 type: string
 *                 title: address_1
 *                 description: The shipping address's address 1.
 *               address_2:
 *                 type: string
 *                 title: address_2
 *                 description: The shipping address's address 2.
 *               city:
 *                 type: string
 *                 title: city
 *                 description: The shipping address's city.
 *               country_code:
 *                 type: string
 *                 title: country_code
 *                 description: The shipping address's country code.
 *               province:
 *                 type: string
 *                 title: province
 *                 description: The shipping address's province.
 *               postal_code:
 *                 type: string
 *                 title: postal_code
 *                 description: The shipping address's postal code.
 *               metadata:
 *                 type: object
 *                 description: The shipping address's metadata.
 *                 properties: {}
 *           items:
 *             type: array
 *             description: The draft order's items.
 *             items:
 *               type: object
 *               description: The item's items.
 *               required:
 *                 - title
 *                 - sku
 *                 - barcode
 *                 - variant_id
 *                 - unit_price
 *                 - quantity
 *                 - metadata
 *               properties:
 *                 title:
 *                   type: string
 *                   title: title
 *                   description: The item's title.
 *                 sku:
 *                   type: string
 *                   title: sku
 *                   description: The item's sku.
 *                 barcode:
 *                   type: string
 *                   title: barcode
 *                   description: The item's barcode.
 *                 variant_id:
 *                   type: string
 *                   title: variant_id
 *                   description: The item's variant id.
 *                 unit_price:
 *                   oneOf:
 *                     - type: string
 *                       title: unit_price
 *                       description: The item's unit price.
 *                     - type: number
 *                       title: unit_price
 *                       description: The item's unit price.
 *                     - type: object
 *                       description: The item's unit price.
 *                       required:
 *                         - value
 *                         - precision
 *                       properties:
 *                         value:
 *                           type: string
 *                           title: value
 *                           description: The unit price's value.
 *                         precision:
 *                           type: number
 *                           title: precision
 *                           description: The unit price's precision.
 *                 quantity:
 *                   type: number
 *                   title: quantity
 *                   description: The item's quantity.
 *                 metadata:
 *                   type: object
 *                   description: The item's metadata.
 *                   properties: {}
 *           region_id:
 *             type: string
 *             title: region_id
 *             description: The draft order's region id.
 *           promo_codes:
 *             type: array
 *             description: The draft order's promo codes.
 *             items:
 *               type: string
 *               title: promo_codes
 *               description: The promo code's promo codes.
 *           currency_code:
 *             type: string
 *             title: currency_code
 *             description: The draft order's currency code.
 *           no_notification_order:
 *             type: boolean
 *             title: no_notification_order
 *             description: The draft order's no notification order.
 *           shipping_methods:
 *             type: array
 *             description: The draft order's shipping methods.
 *             items:
 *               type: object
 *               description: The shipping method's shipping methods.
 *               required:
 *                 - shipping_method_id
 *                 - order_id
 *                 - name
 *                 - option_id
 *                 - data
 *                 - amount
 *               properties:
 *                 shipping_method_id:
 *                   type: string
 *                   title: shipping_method_id
 *                   description: The shipping method's shipping method id.
 *                 order_id:
 *                   type: string
 *                   title: order_id
 *                   description: The shipping method's order id.
 *                 name:
 *                   type: string
 *                   title: name
 *                   description: The shipping method's name.
 *                 option_id:
 *                   type: string
 *                   title: option_id
 *                   description: The shipping method's option id.
 *                 data:
 *                   type: object
 *                   description: The shipping method's data.
 *                   properties: {}
 *                 amount:
 *                   oneOf:
 *                     - type: string
 *                       title: amount
 *                       description: The shipping method's amount.
 *                     - type: number
 *                       title: amount
 *                       description: The shipping method's amount.
 *                     - type: object
 *                       description: The shipping method's amount.
 *                       required:
 *                         - value
 *                         - precision
 *                       properties:
 *                         value:
 *                           type: string
 *                           title: value
 *                           description: The amount's value.
 *                         precision:
 *                           type: number
 *                           title: precision
 *                           description: The amount's precision.
 *           metadata:
 *             type: object
 *             description: The draft order's metadata.
 *             properties: {}
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/draft-orders' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "status": false,
 *         "sales_channel_id": "{value}",
 *         "email": "Rey.Durgan32@gmail.com",
 *         "customer_id": "{value}",
 *         "billing_address": {
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
 *         "shipping_address": {
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
 *             "barcode": "{value}",
 *             "variant_id": "{value}",
 *             "quantity": 2544865785151488,
 *             "metadata": {}
 *           }
 *         ],
 *         "region_id": "{value}",
 *         "promo_codes": [
 *           "{value}"
 *         ],
 *         "currency_code": "{value}",
 *         "no_notification_order": true,
 *         "shipping_methods": [
 *           {
 *             "shipping_method_id": "{value}",
 *             "order_id": "{value}",
 *             "name": "Herbert",
 *             "option_id": "{value}",
 *             "data": {}
 *           }
 *         ],
 *         "metadata": {}
 *       }'
 * tags:
 *   - Draft Orders
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

