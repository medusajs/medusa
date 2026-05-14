/**
 * @oas [post] /admin/products/batch
 * operationId: PostProductsBatch
 * summary: Manage Products
 * description: Manage products to create, update, or delete them.
 * x-authenticated: true
 * parameters:
 *   - name: fields
 *     in: query
 *     description: Comma-separated fields that should be included in the returned data. if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *       fields. without prefix it will replace the entire default fields.
 *     required: false
 *     schema:
 *       type: string
 *       title: fields
 *       description: Comma-separated fields that should be included in the returned data. if a field is prefixed with `+` it will be added to the default fields, using `-` will remove it from the default
 *         fields. without prefix it will replace the entire default fields.
 *       externalDocs:
 *         url: "#select-fields-and-relations"
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         $ref: "#/components/schemas/AdminBatchProductRequest"
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
 *       sdk.admin.product.batch({
 *         create: [
 *           {
 *             title: "Shirt",
 *             options: [{
 *               title: "Default",
 *               values: ["Default Option"]
 *             }],
 *             variants: [
 *               {
 *                 title: "Default",
 *                 options: {
 *                   Default: "Default Option"
 *                 },
 *                 prices: []
 *               }
 *             ]
 *           }
 *         ],
 *         update: [{
 *           id: "prod_123",
 *           title: "Pants"
 *         }],
 *         delete: ["prod_321"]
 *       })
 *       .then(({ created, updated, deleted }) => {
 *         console.log(created, updated, deleted)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/products/batch' \
 *       -H 'Authorization: Bearer {jwt_token}' \
 *       --data-raw '{
 *         "delete": [
 *           "prod_123"
 *         ]
 *       }'
 * tags:
 *   - Products
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminBatchProductResponse"
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
 * x-workflow: batchProductsWorkflow
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
 * 
*/

