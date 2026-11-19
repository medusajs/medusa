/**
 * @oas [post] /admin/products/{id}/images/{image_id}/variants/batch
 * operationId: PostProductsIdImagesImage_idVariantsBatch
 * summary: Manage Variants of Product Image
 * description: Manage the association between product variants and a product image. You can add or remove associations between variants and the image.
 * x-authenticated: true
 * parameters:
 *   - name: id
 *     in: path
 *     description: The product's ID.
 *     required: true
 *     schema:
 *       type: string
 *   - name: image_id
 *     in: path
 *     description: The product image's ID.
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
 *         $ref: "#/components/schemas/AdminBatchImageVariantRequest"
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
 *       sdk.admin.product.batchImageVariants("prod_123", "img_123", {
 *         add: ["variant_123", "variant_456"],
 *         remove: ["variant_789"]
 *       })
 *       .then(({ added, removed }) => {
 *         console.log(added, removed)
 *       })
 *   - lang: Shell
 *     label: cURL
 *     source: |-
 *       curl -X POST '{backend_url}/admin/products/{id}/images/{image_id}/variants/batch' \
 *       -H 'Authorization: Bearer {access_token}' \
 *       -H 'Content-Type: application/json' \
 *       --data-raw '{
 *         "add": ["variant_123", "variant_456"],
 *         "remove": ["variant_789"]
 *       }'
 * tags:
 *   - Products
 * responses:
 *   "200":
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminBatchImageVariantResponse"
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
 * x-workflow: batchImageVariantsWorkflow
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

