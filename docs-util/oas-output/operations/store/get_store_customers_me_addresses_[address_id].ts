/**
 * @oas [get] /store/customers/me/addresses/{address_id}
 * operationId: GetCustomersMeAddressesAddress_id
 * summary: List Addresses
 * description: Retrieve a list of addresses in a customer. The addresses can be
 *   filtered by fields like FILTER FIELDS. The addresses can also be paginated.
 * x-authenticated: false
 * parameters:
 *   - name: address_id
 *     in: path
 *     description: The customer's address id.
 *     required: true
 *     schema:
 *       type: string
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: curl '{backend_url}/store/customers/me/addresses/{address_id}'
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
 *           - fields
 *         properties:
 *           fields:
 *             type: string
 *             title: fields
 *             description: The customer's fields.
 * 
*/

