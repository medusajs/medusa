import { ProductService } from "../../../../services"

/**
 * @oas [get] /products/types
 * operationId: "GetProductsTypes"
 * summary: "List Product Types"
 * description: "Retrieves a list of Product Types."
 * x-authenticated: true
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
