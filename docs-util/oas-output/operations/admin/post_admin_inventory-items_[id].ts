/**
 * @oas [post] /admin/inventory-items/{id}
 * operationId: PostInventoryItemsId
 * summary: Update a Inventory Item
 * description: Update a inventory item's details.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The inventory item's ID.
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
 *         $ref: "#/components/schemas/AdminPostInventoryItemsInventoryItemReq"
 * x-codeSamples:
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/inventory-items/{id}' \
 *       -H 'x-medusa-access-token: {api_token}'
 * tags:
 *   - Inventory Items
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

