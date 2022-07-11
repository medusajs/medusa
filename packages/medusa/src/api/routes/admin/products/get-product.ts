import { ProductService, PricingService } from "../../../../services"

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
  const pricingService: PricingService = req.scope.resolve("pricingService")

  const rawProduct = await productService.retrieve(id, req.retrieveConfig)

  const [product] = await pricingService.setProductPrices([rawProduct])

  res.json({ product })
}
