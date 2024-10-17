/**
 * @oas [post] /admin/customers/{id}/addresses
 * operationId: PostCustomersIdAddresses
 * summary: Add a Customer Address
 * x-sidebar-summary: Add Address
 * description: Add an address to a customer.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The customer's ID.
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
 *         allOf:
 *           - type: object
 *             description: The address's details.
 *             required:
 *               - address_name
 *               - company
 *               - first_name
 *               - last_name
 *               - address_1
 *               - address_2
 *               - city
 *               - country_code
 *               - province
 *               - postal_code
 *               - phone
 *               - metadata
 *             properties:
 *               address_name:
 *                 type: string
 *                 title: address_name
 *                 description: The name of the address.
 *               is_default_shipping:
 *                 type: boolean
 *                 title: is_default_shipping
 *                 description: Whether this address is used by default for shipping when placing an order.
 *               is_default_billing:
 *                 type: boolean
 *                 title: is_default_billing
 *                 description: Whether this address is used by default for billing when placing an order.
 *               company:
 *                 type: string
 *                 title: company
 *                 description: The address's company.
 *               first_name:
 *                 type: string
 *                 title: first_name
 *                 description: The address's first name.
 *               last_name:
 *                 type: string
 *                 title: last_name
 *                 description: The address's last name.
 *               address_1:
 *                 type: string
 *                 title: address_1
 *                 description: The address's first line.
 *               address_2:
 *                 type: string
 *                 title: address_2
 *                 description: The address's second line.
 *               city:
 *                 type: string
 *                 title: city
 *                 description: The address's city.
 *               country_code:
 *                 type: string
 *                 title: country_code
 *                 description: The address's country code.
 *               province:
 *                 type: string
 *                 title: province
 *                 description: The address's province.
 *               postal_code:
 *                 type: string
 *                 title: postal_code
 *                 description: The address's postal code.
 *               phone:
 *                 type: string
 *                 title: phone
 *                 description: The address's phone.
 *               metadata:
 *                 type: object
 *                 description: The address's metadata.
 *           - type: object
 *             description: The address's details.
 *             properties:
 *               additional_data:
 *                 type: object
 *                 description: Pass additional custom data to the API route. This data is passed to the underlying workflow under the `additional_data` parameter.
 *         description: The address's details.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/customers/{id}/addresses' \
 *       -H 'Authorization: Bearer {access_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "address_name": "{value}",
 *         "company": "{value}",
 *         "first_name": "{value}",
 *         "last_name": "{value}",
 *         "address_1": "{value}",
 *         "address_2": "{value}",
 *         "city": "{value}",
 *         "country_code": "{value}",
 *         "province": "{value}",
 *         "postal_code": "{value}",
 *         "phone": "{value}",
 *         "metadata": {}
 *       }'
 * tags:
 *   - Customers
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminCustomerResponse"
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
 * x-workflow: createCustomerAddressesWorkflow
 * 
*/

