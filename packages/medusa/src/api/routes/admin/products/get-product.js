import { defaultFields, defaultRelations } from "./"

/**
 * @oas [get] /products/{id}
 * operationId: "GetProductsProduct"
 * summary: "Retrieve a Product"
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

  const productService = req.scope.resolve("productService")

  const product = await productService.retrieve(id, {
    select: defaultFields,
    relations: defaultRelations,
  })

  res.json({ product })
}
