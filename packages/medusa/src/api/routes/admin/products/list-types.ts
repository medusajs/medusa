import { ProductService } from "../../../../services"

/**
 * @oas [get] /products/types
 * operationId: "GetProductsTypes"
 * summary: "List Product Types"
 * description: "Retrieves a list of Product Types."
 * x-authenticated: true
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in
 *       medusa.admin.products.listTypes()
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'localhost:9000/admin/products/types' \
 *       --header 'Authorization: Bearer {api_token}'
 * tags:
 *   - Product
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             types:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/product_type"
 */
export default async (req, res) => {
  const productService: ProductService = req.scope.resolve("productService")

  const types = await productService.listTypes()

  res.json({ types })
}
