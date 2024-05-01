/**
 * @oas [delete] /admin/customer-groups/{id}
 * operationId: DeleteCustomerGroupsId
 * summary: Delete a Customer Group
 * description: Delete a customer group.
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
 *       curl -X DELETE '{backend_url}/admin/customer-groups/{id}' \
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
 *       schema: {}
 * 
*/

