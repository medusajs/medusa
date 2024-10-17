/**
 * @oas [get] /store/customers/me/addresses
 * operationId: GetCustomersMeAddresses
 * summary: List Customer's Addresses
 * x-sidebary-summary: List Addresses
 * description: Retrieve the addresses of the logged-in customer. The addresses can be filtered by fields such as `country_code`. The addresses can also be sorted or paginated.
 * x-authenticated: true
 * externalDocs:
 *   url: https://docs.medusajs.com/v2/resources/storefront-development/customers/addresses#list-customer-addresses
 *   description: "Storefront guide: How to retrieve the logged-in customer's addresses."
 * parameters:
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
 *   - name: offset
 *     in: query
 *     description: The number of items to skip when retrieving a list.
 *     required: false
 *     schema:
 *       type: number
 *       title: offset
 *       description: The number of items to skip when retrieving a list.
 *       externalDocs:
 *         url: "#pagination"
 *   - name: limit
 *     in: query
 *     description: Limit the number of items returned in the list.
 *     required: false
 *     schema:
 *       type: number
 *       title: limit
 *       description: Limit the number of items returned in the list.
 *       externalDocs:
 *         url: "#pagination"
 *   - name: order
 *     in: query
 *     description: The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
 *     required: false
 *     schema:
 *       type: string
 *       title: order
 *       description: The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
 *   - name: city
 *     in: query
 *     description: Filter by the address's city.
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: city
 *           description: Filter by a city.
 *         - type: array
 *           description: Filter by cities.
 *           items:
 *             type: string
 *             title: city
 *             description: A city.
 *   - name: postal_code
 *     in: query
 *     description: Filter by the address's postal code.
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: postal_code
 *           description: Filter by a postal code.
 *         - type: array
 *           description: Filter by postal codes.
 *           items:
 *             type: string
 *             title: postal_code
 *             description: A postal code.
 *   - name: country_code
 *     in: query
 *     description: Filter by the address's country code.
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: country_code
 *           description: Filter by a country code.
 *         - type: array
 *           description: Filter by country codes.
 *           items:
 *             type: string
 *             title: country_code
 *             description: A country code.
 *   - name: q
 *     in: query
 *     description: Search term to filter the address's searchable properties.
 *     required: false
 *     schema:
 *       type: string
 *       title: q
 *       description: Search term to filter the address's searchable properties.
 * security:
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/store/customers/me/addresses' \
 *       -H 'Authorization: Bearer {access_token}' \
 *       -H 'x-publishable-api-key: {your_publishable_api_key}'
 * tags:
 *   - Customers
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/StoreCustomerAddressListResponse"
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

