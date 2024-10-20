/**
 * @oas [post] /store/customers/me/addresses/{address_id}
 * operationId: PostCustomersMeAddressesAddress_id
 * summary: Update Customer's Address
 * x-sidebar-summary: Update Address
 * description: Update the logged-in customer's address.
 * externalDocs:
 *   url: https://docs.medusajs.com/v2/resources/storefront-development/customers/addresses#edit-an-address
 *   description: "Storefront guide: How to update an address of the logged-in customer."
 * x-authenticated: true
 * parameters:
 *   - name: address_id
 *     in: path
 *     description: The address's ID.
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
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: The properties to update in the address.
 *         properties:
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
 *             description: The address's company.
 *           address_1:
 *             type: string
 *             title: address_1
 *             description: The address's first line.
 *           address_2:
 *             type: string
 *             title: address_2
 *             description: The address's second line.
 *           city:
 *             type: string
 *             title: city
 *             description: The address's city.
 *           country_code:
 *             type: string
 *             title: country_code
 *             description: The address's country code.
 *           province:
 *             type: string
 *             title: province
 *             description: The address's province.
 *           postal_code:
 *             type: string
 *             title: postal_code
 *             description: The address's postal code.
 *           address_name:
 *             type: string
 *             title: address_name
 *             description: The address's name.
 *           is_default_shipping:
 *             type: boolean
 *             title: is_default_shipping
 *             description: Whether the address is used by default for shipping during checkout.
 *           is_default_billing:
 *             type: boolean
 *             title: is_default_billing
 *             description: Whether the address is used by default for billing during checkout.
 *           metadata:
 *             type: object
 *             description: Holds custom key-value pairs.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/store/customers/me/addresses/{address_id}' \
 *       -H 'Authorization: Bearer {access_token}' \
 *       -H 'Content-Type: application/json' \ \
 *       -H 'x-publishable-api-key: {your_publishable_api_key}'
 *       --data-raw '{
 *         "first_name": "{value}",
 *       }'
 * tags:
 *   - Customers
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StoreCustomerResponse"
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
 * x-workflow: updateCustomerAddressesWorkflow
 * 
*/

