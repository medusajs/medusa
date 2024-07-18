/**
 * @oas [post] /store/customers/me/addresses/{address_id}
 * operationId: PostCustomersMeAddressesAddress_id
 * summary: Add Addresses to Customer
 * description: Add a list of addresses to a customer.
 * x-authenticated: true
 * parameters:
 *   - name: address_id
 *     in: path
 *     description: The customer's address id.
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
 *     description: Comma-separated fields that should be included in the returned
 *       data. if a field is prefixed with `+` it will be added to the default
 *       fields, using `-` will remove it from the default fields. without prefix
 *       it will replace the entire default fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned
 *         data. if a field is prefixed with `+` it will be added to the default
 *         fields, using `-` will remove it from the default fields. without prefix
 *         it will replace the entire default fields.
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
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: SUMMARY
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
 *         properties:
 *           metadata:
 *             type: object
 *             description: The customer's metadata.
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
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/store/customers/me/addresses/{address_id}' \
 *       -H 'Authorization: Bearer {access_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "metadata": {},
 *         "first_name": "{value}",
 *         "last_name": "{value}",
 *         "phone": "{value}",
 *         "company": "{value}",
 *         "address_1": "{value}",
 *         "address_2": "{value}",
 *         "city": "{value}",
 *         "country_code": "{value}",
 *         "province": "{value}",
 *         "postal_code": "{value}",
 *         "address_name": "{value}"
 *       }'
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
 * 
*/

