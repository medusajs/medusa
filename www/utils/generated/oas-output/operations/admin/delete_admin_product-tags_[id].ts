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
 *   - lang: JavaScript
 *     label: JS SDK
 *     source: |-
 *       import Medusa from "@medusajs/js-sdk"
 * 
 *       export const sdk = new Medusa({
 *         baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
 *         debug: import.meta.env.DEV,
 *         auth: {
 *           type: "session",
 *         },
 *       })
 * 
 *       sdk.admin.productTag.delete("ptag_123")
 *       .then(({ deleted }) => {
 *         console.log(deleted)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X DELETE '{backend_url}/admin/product-tags/{id}' \
 *       -H 'Authorization: Bearer {jwt_token}'
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
 * x-events:
 *   - name: product-tag.deleted
 *     payload: |-
 *       ```ts
 *       {
 *         id, // The ID of the product tag
 *       }
 *       ```
 *     description: Emitted when product tags are deleted.
 *     deprecated: false
 * 
*/

