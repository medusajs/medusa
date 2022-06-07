import { defaultStoreProductsRelations } from "."
import { ProductService } from "../../../../services"
import { PriceSelectionParams } from "../../../../types/price-selection"
import { validator } from "../../../../utils/validator"

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
export default async (req, res) => {
  const { id } = req.params

  const validated = await validator(PriceSelectionParams, req.query)

  const customer_id = req.user?.customer_id

  const productService: ProductService = req.scope.resolve("productService")
  const product = await productService.retrieve(id, {
    relations: defaultStoreProductsRelations,
    cart_id: validated.cart_id,
    customer_id: customer_id,
    region_id: validated.region_id,
    currency_code: validated.currency_code,
    include_discount_prices: true,
  })

  res.json({ product })
}
