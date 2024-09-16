/**
 * @oas [post] /admin/products/import/{transaction_id}/confirm
 * operationId: PostProductsImportTransaction_idConfirm
 * summary: Confirm Product Import
 * description: Confirm that a created product import should start importing the products into Medusa.
 * x-authenticated: true
 * parameters:
 *   - name: transaction_id
 *     in: path
 *     description: The ID of the transaction returned when the product import was created.
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
 *       curl -X POST '{backend_url}/admin/products/import/{transaction_id}/confirm' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Products
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
 * x-workflow: importProductsWorkflowId
 * 
*/

