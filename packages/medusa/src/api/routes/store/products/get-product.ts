import { defaultStoreProductsRelations } from "."
import { ProductService } from "../../../../services"
import { Request } from "@interfaces/http"

/**
 * @oas [get] /products/{id}
 * operationId: GetProductsProduct
 * summary: Retrieves a Product
 * description: "Retrieves a Product."
 * parameters:
 *   - (path) id=* {string} The id of the Product.
 * tags:
 *   - Product
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             product:
 *               $ref: "#/components/schemas/product"
 */
export default async (req: Request, res) => {
  const { id } = req.params

  const productService: ProductService = req.scope.resolve("productService")
  const product = await productService.retrieve(id, {
    relations: defaultStoreProductsRelations,
  })

  res.json({ product })
}
