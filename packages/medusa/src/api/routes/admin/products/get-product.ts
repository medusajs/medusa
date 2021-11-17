import { defaultAdminProductFields, defaultAdminProductRelations } from "."
import { ProductService } from "../../../../services"

/**
 * @oas [get] /products/{id}
 * operationId: "GetProductsProduct"
 * summary: "Retrieve a Product"
 * description: "Retrieves a Product."
 * x-authenticated: true
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
export default async (req, res) => {
  const { id } = req.params

  const productService: ProductService = req.scope.resolve("productService")

  const product = await productService.retrieve(id, {
    select: defaultAdminProductFields,
    relations: defaultAdminProductRelations,
  })

  res.json({ product })
}
