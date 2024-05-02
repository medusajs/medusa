/**
 * @oas [post] /admin/customers/{id}/addresses
 * operationId: PostCustomersIdAddresses
 * summary: Add Addresses to Customer
 * description: Add a list of addresses to a customer.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The customer's ID.
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
 *       curl -X POST '{backend_url}/admin/customers/{id}/addresses' \
 *       -H 'x-medusa-access-token: {api_token}'
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
 *           - address_name
 *           - is_default_shipping
 *           - is_default_billing
 *           - company
 *           - first_name
 *           - last_name
 *           - address_1
 *           - address_2
 *           - city
 *           - country_code
 *           - province
 *           - postal_code
 *           - phone
 *           - metadata
 *         properties:
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
 *           company:
 *             type: string
 *             title: company
 *             description: The customer's company.
 *           first_name:
 *             type: string
 *             title: first_name
 *             description: The customer's first name.
 *           last_name:
 *             type: string
 *             title: last_name
 *             description: The customer's last name.
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
 *           phone:
 *             type: string
 *             title: phone
 *             description: The customer's phone.
 *           metadata:
 *             type: object
 *             description: The customer's metadata.
 *             properties: {}
 * 
*/

