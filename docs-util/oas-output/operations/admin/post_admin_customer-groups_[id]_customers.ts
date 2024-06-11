/**
 * @oas [post] /admin/customer-groups/{id}/customers
 * operationId: PostCustomerGroupsIdCustomers
 * summary: Add Customers to Customer Group
 * description: Add a list of customers to a customer group.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The customer group's ID.
 *     required: true
 *     schema:
 *       type: string
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         description: SUMMARY
 *         properties:
 *           add:
 *             type: array
 *             description: The customer group's add.
 *             items:
 *               type: string
 *               title: add
 *               description: The add's details.
 *           remove:
 *             type: array
 *             description: The customer group's remove.
 *             items:
 *               type: string
 *               title: remove
 *               description: The remove's details.
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/customer-groups/{id}/customers' \
 *       -H 'x-medusa-access-token: {api_token}'
 * tags:
 *   - Customer Groups
 * responses:
 *   "200":
 *     description: OK
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

