/**
 * @oas [post] /admin/customer-groups/{id}
 * operationId: PostCustomerGroupsId
 * summary: Update a Customer Group
 * description: Update a customer group's details.
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
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/customer-groups/{id}' \
 *       -H 'x-medusa-access-token: {api_token}'
 * tags:
 *   - Customer Groups
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
 *           - name
 *         properties:
 *           name:
 *             type: string
 *             title: name
 *             description: The customer group's name.
 * 
*/

