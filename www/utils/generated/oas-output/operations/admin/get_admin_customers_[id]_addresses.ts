/**
 * @oas [get] /admin/customers/{id}/addresses
 * operationId: GetCustomersIdAddresses
 * summary: List Addresses
 * description: Retrieve a list of addresses in a customer. The addresses can be filtered by fields like `query`. The addresses can also be paginated.
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
 *   - name: q
 *     in: query
 *     description: Search term to apply on the address's searchable properties.
 *     required: false
 *     schema:
 *       type: string
 *       title: q
 *       description: Search term to apply on the address's searchable properties.
 *   - name: company
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: company
 *           description: Filter by a company.
 *         - type: array
 *           description: Filter by companies.
 *           items:
 *             type: string
 *             title: company
 *             description: A company's name.
 *   - name: city
 *     in: query
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
 *             description: A city's name.
 *   - name: country_code
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: country_code
 *           description: Filter by a currency code.
 *         - type: array
 *           description: Filter by currency codes.
 *           items:
 *             type: string
 *             title: country_code
 *             description: A currency code.
 *   - name: province
 *     in: query
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: province
 *           description: Filter by a province.
 *         - type: array
 *           description: Filter by provinces.
 *           items:
 *             type: string
 *             title: province
 *             description: A province code.
 *   - name: postal_code
 *     in: query
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
 *   - name: $and
 *     in: query
 *     description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *     required: false
 *     schema:
 *       type: array
 *       description: Join query parameters with an AND condition. Each object's content is the same type as the expected query parameters.
 *       items:
 *         type: object
 *       title: $and
 *   - name: $or
 *     in: query
 *     description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *     required: false
 *     schema:
 *       type: array
 *       description: Join query parameters with an OR condition. Each object's content is the same type as the expected query parameters.
 *       items:
 *         type: object
 *       title: $or
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/admin/customers/{id}/addresses' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Customers
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           allOf:
 *             - type: object
 *               description: The paginated list of customer addresses.
 *               required:
 *                 - limit
 *                 - offset
 *                 - count
 *               properties:
 *                 limit:
 *                   type: number
 *                   title: limit
 *                   description: The maximum number of items returned.
 *                 offset:
 *                   type: number
 *                   title: offset
 *                   description: The number of items skipped before retrieving the returned items.
 *                 count:
 *                   type: number
 *                   title: count
 *                   description: The total number of items.
 *             - type: object
 *               description: The paginated list of customer addresses
 *               required:
 *                 - addresses
 *               properties:
 *                 addresses:
 *                   type: array
 *                   description: The customer addresses.
 *                   items:
 *                     $ref: "#/components/schemas/AdminCustomerAddress"
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

