import { defaultRelations } from "."
import { MedusaError, Validator } from "medusa-core-utils"

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
  const schema = Validator.storeProductFilter()
  const filteringSchema = Validator.storeProductFilteringFields()

  const { value, error } = schema.validate(req.query)

  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  const productService = req.scope.resolve("productService")

  const limit = parseInt(req.query.limit) || 100
  const offset = parseInt(req.query.offset) || 0

  const { value: selector } = filteringSchema.validate(value, {
    stripUnknown: true,
  })

  if ("q" in req.query) {
    selector.q = req.query.q
  }

  selector.status = ["published"]

  const listConfig = {
    relations: defaultRelations,
    skip: offset,
    take: limit,
  }

  const products = await productService.list(selector, listConfig)

  res.json({ products, count: products.length, offset, limit })
}
