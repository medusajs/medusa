/**
 * @oas [post] /store/carts/{id}/payment-collections
 * operationId: PostCartsIdPaymentCollections
 * summary: Add Payment Collections to Cart
 * description: Add a list of payment collections to a cart.
 * x-authenticated: false
 * parameters:
 *   - name: id
 *     in: path
 *     description: The cart's ID.
 *     required: true
 *     schema:
 *       type: string
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: curl -X POST '{backend_url}/store/carts/{id}/payment-collections'
 * tags:
 *   - Carts
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
 *           - region_id
 *           - email
 *           - billing_address
 *           - shipping_address
 *           - sales_channel_id
 *           - metadata
 *           - promo_codes
 *         properties:
 *           region_id:
 *             type: string
 *             title: region_id
 *             description: The cart's region id.
 *           email:
 *             type: string
 *             title: email
 *             description: The cart's email.
 *             format: email
 *           billing_address:
 *             oneOf:
 *               - type: string
 *                 title: billing_address
 *                 description: The cart's billing address.
 *               - type: object
 *                 description: The cart's billing address.
 *                 required:
 *                   - first_name
 *                   - last_name
 *                   - phone
 *                   - company
 *                   - address_1
 *                   - address_2
 *                   - city
 *                   - country_code
 *                   - province
 *                   - postal_code
 *                   - metadata
 *                 properties:
 *                   first_name:
 *                     type: string
 *                     title: first_name
 *                     description: The billing address's first name.
 *                   last_name:
 *                     type: string
 *                     title: last_name
 *                     description: The billing address's last name.
 *                   phone:
 *                     type: string
 *                     title: phone
 *                     description: The billing address's phone.
 *                   company:
 *                     type: string
 *                     title: company
 *                     description: The billing address's company.
 *                   address_1:
 *                     type: string
 *                     title: address_1
 *                     description: The billing address's address 1.
 *                   address_2:
 *                     type: string
 *                     title: address_2
 *                     description: The billing address's address 2.
 *                   city:
 *                     type: string
 *                     title: city
 *                     description: The billing address's city.
 *                   country_code:
 *                     type: string
 *                     title: country_code
 *                     description: The billing address's country code.
 *                   province:
 *                     type: string
 *                     title: province
 *                     description: The billing address's province.
 *                   postal_code:
 *                     type: string
 *                     title: postal_code
 *                     description: The billing address's postal code.
 *                   metadata:
 *                     type: object
 *                     description: The billing address's metadata.
 *                     properties: {}
 *           shipping_address:
 *             oneOf:
 *               - type: string
 *                 title: shipping_address
 *                 description: The cart's shipping address.
 *               - type: object
 *                 description: The cart's shipping address.
 *                 required:
 *                   - first_name
 *                   - last_name
 *                   - phone
 *                   - company
 *                   - address_1
 *                   - address_2
 *                   - city
 *                   - country_code
 *                   - province
 *                   - postal_code
 *                   - metadata
 *                 properties:
 *                   first_name:
 *                     type: string
 *                     title: first_name
 *                     description: The shipping address's first name.
 *                   last_name:
 *                     type: string
 *                     title: last_name
 *                     description: The shipping address's last name.
 *                   phone:
 *                     type: string
 *                     title: phone
 *                     description: The shipping address's phone.
 *                   company:
 *                     type: string
 *                     title: company
 *                     description: The shipping address's company.
 *                   address_1:
 *                     type: string
 *                     title: address_1
 *                     description: The shipping address's address 1.
 *                   address_2:
 *                     type: string
 *                     title: address_2
 *                     description: The shipping address's address 2.
 *                   city:
 *                     type: string
 *                     title: city
 *                     description: The shipping address's city.
 *                   country_code:
 *                     type: string
 *                     title: country_code
 *                     description: The shipping address's country code.
 *                   province:
 *                     type: string
 *                     title: province
 *                     description: The shipping address's province.
 *                   postal_code:
 *                     type: string
 *                     title: postal_code
 *                     description: The shipping address's postal code.
 *                   metadata:
 *                     type: object
 *                     description: The shipping address's metadata.
 *                     properties: {}
 *           sales_channel_id:
 *             type: string
 *             title: sales_channel_id
 *             description: The cart's sales channel id.
 *           metadata:
 *             type: object
 *             description: The cart's metadata.
 *             properties: {}
 *           promo_codes:
 *             type: array
 *             description: The cart's promo codes.
 *             items:
 *               type: string
 *               title: promo_codes
 *               description: The promo code's promo codes.
 * 
*/

