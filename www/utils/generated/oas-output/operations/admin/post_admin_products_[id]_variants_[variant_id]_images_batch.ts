/**
 * @oas [post] /admin/products/{id}/variants/{variant_id}/images/batch
 * operationId: PostProductsIdVariantsVariant_idImagesBatch
 * summary: Manage Images of Product Variant
 * description: Manage the association between product images and a product variant. You can add or remove associations between images and the variant.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The product's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: variant_id
 *     in: path
 *     description: The product variant's ID.
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
 *         $ref: "#/components/schemas/AdminBatchVariantImagesRequest"
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
 *       sdk.admin.product.batchVariantImages("prod_123", "variant_123", {
 *         add: ["img_123", "img_456"],
 *         remove: ["img_789"]
 *       })
 *       .then(({ added, removed }) => {
 *         console.log(added, removed)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/products/{id}/variants/{variant_id}/images/batch' \
 *       -H 'Authorization: Bearer {access_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "add": ["img_123", "img_456"],
 *         "remove": ["img_789"]
 *       }'
 * tags:
 *   - Products
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminBatchVariantImagesResponse"
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
 * x-workflow: batchVariantImagesWorkflow
 * x-events:
 *   - name: product-variant.updated
 *     payload: |-
 *       ```ts
 *       {
 *         id, // The ID of the product variant
 *       }
 *       ```
 *     description: Emitted when product variants are updated.
 *     deprecated: false
 * x-since: 2.11.2
 * 
*/

