import { MedusaError, Validator } from "medusa-core-utils"
import { defaultRelations } from "."

/**
 * @oas [get] /products
 * operationId: GetProducts
 * summary: List Products
 * description: "Retrieves a list of Products."
 * tags:
 *   - Product
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             count:
 *               description: The total number of Products.
 *               type: integer
 *             offset:
 *               description: The offset for pagination.
 *               type: integer
 *             limit:
 *               description: The maxmimum number of Products to return,
 *               type: integer
 *             products:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/product"
 */
export default async (req, res) => {
  try {
    const productService = req.scope.resolve("productService")

    const limit = parseInt(req.query.limit) || 100
    const offset = parseInt(req.query.offset) || 0

    const selector = {}

    if ("is_giftcard" in req.query && req.query.is_giftcard === "true") {
      selector.is_giftcard = req.query.is_giftcard === "true"
    }

    selector.status = ["published"]

    const listConfig = {
      relations: defaultRelations,
      skip: offset,
      take: limit,
    }

    const products = await productService.list(selector, listConfig)

    res.json({ products, count: products.length, offset, limit })
  } catch (error) {
    throw error
  }
}
