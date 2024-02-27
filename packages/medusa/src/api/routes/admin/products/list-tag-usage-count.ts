import { ProductService } from "../../../../services"

/**
 * @oas [get] /admin/products/tag-usage
 * operationId: "GetProductsTagUsage"
 * summary: "List Tags Usage Number"
 * description: "Retrieve a list of Product Tags with how many times each is used in products."
 * x-authenticated: true
 * x-codegen:
 *   method: listTags
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.products.listTags()
 *       .then(({ tags }) => {
 *         console.log(tags.length);
 *       })
 *   - lang: tsx
 *     label: Medusa React
 *     source: |
 *       import React from "react"
 *       import { useAdminProductTagUsage } from "medusa-react"
 *
 *       const ProductTags = (productId: string) => {
 *         const { tags, isLoading } = useAdminProductTagUsage()
 *
 *         return (
 *           <div>
 *             {isLoading && <span>Loading...</span>}
 *             {tags && !tags.length && <span>No Product Tags</span>}
 *             {tags && tags.length > 0 && (
 *               <ul>
 *                 {tags.map((tag) => (
 *                   <li key={tag.id}>{tag.value} - {tag.usage_count}</li>
 *                 ))}
 *               </ul>
 *             )}
 *           </div>
 *         )
 *       }
 *
 *       export default ProductTags
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl '{backend_url}/admin/products/tag-usage' \
 *       -H 'x-medusa-access-token: {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 *   - jwt_token: []
 * tags:
 *   - Products
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           $ref: "#/components/schemas/AdminProductsListTagsRes"
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
 */
export default async (req, res) => {
  const productService: ProductService = req.scope.resolve("productService")

  const tags = await productService.listTagsByUsage()

  res.json({ tags })
}
