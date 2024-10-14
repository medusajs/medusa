/**
 * @oas [delete] /store/customers/me/addresses/{address_id}
 * operationId: DeleteCustomersMeAddressesAddress_id
 * summary: Remove Customer's Address
 * x-sidebar-summary: Remove Address
 * description: Remove an address of the logged-in customer.
 * x-authenticated: true
 * externalDocs:
 *   url: https://docs.medusajs.com/v2/resources/storefront-development/customers/addresses#delete-customer-address
 *   description: "Storefront guide: How to delete a customer's address."
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
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X DELETE '{backend_url}/store/customers/me/addresses/{address_id}' \ \
 *       -H 'x-publishable-api-key: {your_publishable_api_key}'
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
 *               description: The deletion's details.
 *               required:
 *                 - id
 *                 - object
 *                 - deleted
 *               properties:
 *                 id:
 *                   type: string
 *                   title: id
 *                   description: The address's ID.
 *                 object:
 *                   type: string
 *                   title: object
 *                   description: The name of the deleted object.
 *                   default: address
 *                 deleted:
 *                   type: boolean
 *                   title: deleted
 *                   description: Whether the address was deleted.
 *             - type: object
 *               description: The deletion's details.
 *               properties:
 *                 parent:
 *                   $ref: "#/components/schemas/StoreCustomer"
 *                   description: The details of the customer the address belongs to.
 *           description: The deletion's details.
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
 * x-workflow: deleteCustomerAddressesWorkflow
 * 
*/

