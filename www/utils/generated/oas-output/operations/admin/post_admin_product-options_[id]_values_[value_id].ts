/**
 * @oas [post] /admin/product-options/{id}/values/{value_id}
 * operationId: PostProductOptionsIdValuesValue_id
 * summary: Update Product Option Value
 * description: Update a product option value's details.
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
 *     description: The product option value's ID.
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
 *         $ref: "#/components/schemas/AdminUpdateProductOptionValue"
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
 *       sdk.admin.productOption.updateValue("opt_123", "optval_123", {
 *         metadata: { is_default: true }
 *       })
 *       .then(({ product_option_value }) => {
 *         console.log(product_option_value)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/product-options/{id}/values/{value_id}' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Product Options
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminProductOptionValueResponse"
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
 * x-workflow: updateProductOptionValuesWorkflow
 * x-events: []
 * x-since: 2.17.0
 * 
*/

