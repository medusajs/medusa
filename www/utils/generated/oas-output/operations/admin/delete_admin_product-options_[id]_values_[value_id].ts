/**
 * @oas [delete] /admin/product-options/{id}/values/{value_id}
 * operationId: DeleteProductOptionsIdValuesValue_id
 * summary: Remove Value from Product Option
 * description: Remove a Value from a product option.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The product option's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: value_id
 *     in: path
 *     description: The value's ID.
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
 *       sdk.admin.productOption.deleteValue("opt_123", "optval_123")
 *       .then(({ deleted }) => {
 *         console.log(deleted)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X DELETE '{backend_url}/admin/product-options/{id}/values/{value_id}' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Product Options
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminProductOptionValueDeleteResponse"
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
 * x-workflow: deleteProductOptionValuesWorkflow
 * x-events: []
 * x-since: 2.17.0
 * 
*/

