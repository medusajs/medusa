/**
 * @oas [get] /store/customers/me/addresses
 * operationId: GetCustomersMeAddresses
 * summary: List Customers
 * description: Retrieve a list of customers. The customers can be filtered by
 *   fields such as `id`. The customers can also be sorted or paginated.
 * x-authenticated: false
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
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: curl '{backend_url}/store/customers/me/addresses'
 * tags:
 *   - Customers
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
 *           - metadata
 *           - first_name
 *           - last_name
 *           - phone
 *           - company
 *           - address_1
 *           - address_2
 *           - city
 *           - country_code
 *           - province
 *           - postal_code
 *           - address_name
 *           - is_default_shipping
 *           - is_default_billing
 *         properties:
 *           metadata:
 *             type: object
 *             description: The customer's metadata.
 *             properties: {}
 *           first_name:
 *             type: string
 *             title: first_name
 *             description: The customer's first name.
 *           last_name:
 *             type: string
 *             title: last_name
 *             description: The customer's last name.
 *           phone:
 *             type: string
 *             title: phone
 *             description: The customer's phone.
 *           company:
 *             type: string
 *             title: company
 *             description: The customer's company.
 *           address_1:
 *             type: string
 *             title: address_1
 *             description: The customer's address 1.
 *           address_2:
 *             type: string
 *             title: address_2
 *             description: The customer's address 2.
 *           city:
 *             type: string
 *             title: city
 *             description: The customer's city.
 *           country_code:
 *             type: string
 *             title: country_code
 *             description: The customer's country code.
 *           province:
 *             type: string
 *             title: province
 *             description: The customer's province.
 *           postal_code:
 *             type: string
 *             title: postal_code
 *             description: The customer's postal code.
 *           address_name:
 *             type: string
 *             title: address_name
 *             description: The customer's address name.
 *           is_default_shipping:
 *             type: boolean
 *             title: is_default_shipping
 *             description: The customer's is default shipping.
 *           is_default_billing:
 *             type: boolean
 *             title: is_default_billing
 *             description: The customer's is default billing.
 * 
*/

