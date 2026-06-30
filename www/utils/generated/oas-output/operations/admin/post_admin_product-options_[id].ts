/**
 * @oas [post] /admin/product-options/{id}
 * operationId: PostProductOptionsId
 * summary: Update a Product Option
 * description: Update a product option's details.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The product option's ID.
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
 *         $ref: "#/components/schemas/AdminUpdateProductOption"
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
 *       sdk.admin.productOption.update("opt_123", {
 *         title: "Size"
 *       })
 *       .then(({ product_option }) => {
 *         console.log(product_option)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/product-options/{id}' \
 *       -H 'Authorization: Bearer {access_token}'
 * tags:
 *   - Product Options
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminProductOptionResponse"
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
 * x-workflow: updateProductOptionsWorkflow
 * x-events:
 *   - name: product-option.updated
 *     payload: |-
 *       ```ts
 *       {
 *         id, // The ID of the product option
 *       }
 *       ```
 *     description: Emitted when product options are updated.
 *     deprecated: false
 * x-since: 2.13.0
 * 
*/

