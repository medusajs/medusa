/**
 * @oas [delete] /admin/product-tags/{id}
 * operationId: DeleteProductTagsId
 * summary: Delete a Product Tag
 * description: Delete a product tag. This doesn't delete products using the tag.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The product tag's ID.
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
 *       curl -X DELETE '{backend_url}/admin/product-tags/{id}' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Product Tags
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminProductTagDeleteResponse"
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
 * x-workflow: deleteProductTagsWorkflow
 * 
*/

