/**
 * @oas [get] /store/customers/me/addresses
 * operationId: GetCustomersMeAddresses
 * summary: List Customers
 * description: Retrieve a list of customers. The customers can be filtered by fields such as `id`. The customers can also be sorted or paginated.
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
 *     description: Comma-separated fields that should be included in the returned data. if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *       fields. without prefix it will replace the entire default fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned data. if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *         fields. without prefix it will replace the entire default fields.
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
 *     description: The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
 *     required: false
 *     schema:
 *       type: string
 *       title: order
 *       description: The field to sort the data by. By default, the sort order is ascending. To change the order to descending, prefix the field name with `-`.
 *   - name: city
 *     in: query
 *     description: The customer's city.
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: city
 *           description: The customer's city.
 *         - type: array
 *           description: The customer's city.
 *           items:
 *             type: string
 *             title: city
 *             description: The city's details.
 *   - name: country_code
 *     in: query
 *     description: The customer's country code.
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: country_code
 *           description: The customer's country code.
 *         - type: array
 *           description: The customer's country code.
 *           items:
 *             type: string
 *             title: country_code
 *             description: The country code's details.
 *   - name: postal_code
 *     in: query
 *     description: The customer's postal code.
 *     required: false
 *     schema:
 *       oneOf:
 *         - type: string
 *           title: postal_code
 *           description: The customer's postal code.
 *         - type: array
 *           description: The customer's postal code.
 *           items:
 *             type: string
 *             title: postal_code
 *             description: The postal code's details.
 *   - name: q
 *     in: query
 *     description: The customer's q.
 *     required: false
 *     schema:
 *       type: string
 *       title: q
 *       description: The customer's q.
 * security:
 *   - cookie_auth: []
 *   - jwt_token: []
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl '{backend_url}/store/customers/me/addresses' \
 *       -H 'Authorization: Bearer {access_token}'
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

