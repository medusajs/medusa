/**
 * @oas [post] /admin/products/import
 * operationId: PostProductsImport
 * summary: Create Product Import
 * description: Create a new product import process. The products aren't imported until the import is confirmed with the `/admin/products/:transaction-id/import` API route.
 * x-authenticated: true
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminImportProductRequest"
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
 *       sdk.admin.product.import({
 *         file // uploaded File instance
 *       })
 *       .then(({ transaction_id }) => {
 *         console.log(transaction_id)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/products/import' \
 *       -H 'Authorization: Bearer {jwt_token}'
 * tags:
 *   - Products
 * responses:
 *   "202":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminImportProductResponse"
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
 * x-workflow: importProductsWorkflow
 * x-events:
 *   - name: product-variant.created
 *     payload: |-
 *       ```ts
 *       {
 *         id, // The ID of the product variant
 *       }
 *       ```
 *     description: Emitted when product variants are created.
 *     deprecated: false
 *   - name: product.updated
 *     payload: |-
 *       ```ts
 *       {
 *         id, // The ID of the product
 *       }
 *       ```
 *     description: Emitted when products are updated.
 *     deprecated: false
 *   - name: product.created
 *     payload: |-
 *       ```ts
 *       {
 *         id, // The ID of the product
 *       }
 *       ```
 *     description: Emitted when products are created.
 *     deprecated: false
 *   - name: product.deleted
 *     payload: |-
 *       ```ts
 *       {
 *         id, // The ID of the product
 *       }
 *       ```
 *     description: Emitted when products are deleted.
 *     deprecated: false
 * deprecated: true
 * x-deprecated_message: use `POST /admin/products/imports` instead.
 * 
*/

