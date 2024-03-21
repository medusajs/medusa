/**
 * @oas [post] /admin/customer-groups/{id}/customers/batch
 * operationId: PostCustomerGroupsIdCustomersBatch
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
 *         $ref: "#/components/schemas/AdminPostCustomerGroupsGroupCustomersBatchReq"
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/customer-groups/{id}/customers/batch' \
 *       -H 'x-medusa-access-token: {api_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "customer_ids": [
 *           {
 *             "id": "id_dx2Wieq4uGG"
 *           }
 *         ]
 *       }'
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

