/**
 * @oas [post] /admin/product-options
 * operationId: PostProductOptions
 * summary: Create Product Option
 * description: Create a product option.
 * x-authenticated: true
 * parameters: []
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminCreateProductOption"
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
 *       sdk.admin.productOption.create({
 *         title: "Size",
 *         values: ["S", "M"]
 *       })
 *       .then(({ product_option }) => {
 *         console.log(product_option)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/product-options' \
 *       -H 'Authorization: Bearer {access_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "title": "cuppedia",
 *         "values": [
 *           "{value}"
 *         ]
 *       }'
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
 * x-workflow: createProductOptionsWorkflow
 * x-events:
 *   - name: product-option.created
 *     payload: |-
 *       ```ts
 *       {
 *         id, // The ID of the product option
 *       }
 *       ```
 *     description: Emitted when product options are created.
 *     deprecated: false
 * x-since: 2.13.0
 * 
*/

