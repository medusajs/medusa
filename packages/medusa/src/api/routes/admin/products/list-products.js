import { MedusaError, Validator } from "medusa-core-utils"
import { defaultFields, defaultRelations, filterableFields } from "./"

/**
 * @oas [get] /products
 * operationId: "GetProducts"
 * summary: "List Product"
 * description: "Retrieves a list of Product"
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
 *               description: The number of Products.
 *               type: integer
 *             offset:
 *               description: The offset of the Product query.
 *               type: integer
 *             limit:
 *               description: The limit of the Product query.
 *               type: integer
 *             products:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/product"
 */
export default async (req, res) => {
  const schema = Validator.productFilter()

  const { value, error } = schema.validate(req.query)

  if (error) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      JSON.stringify(error.details)
    )
  }

  const productService = req.scope.resolve("productService")

  const limit = parseInt(req.query.limit) || 50
  const offset = parseInt(req.query.offset) || 0

  const selector = {}

  if ("q" in req.query) {
    selector.q = req.query.q
  }

  let includeFields = []
  if ("fields" in req.query) {
    includeFields = req.query.fields.split(",")
  }

  let expandFields = []
  if ("expand" in req.query) {
    expandFields = req.query.expand.split(",")
  }

  for (const k of filterableFields) {
    if (k in value) {
      selector[k] = value[k]
    }
  }

  if (selector.status?.indexOf("null") > -1) {
    selector.status.splice(selector.status.indexOf("null"), 1)
    if (selector.status.length === 0) {
      delete selector.status
    }
  }

  const listConfig = {
    select: includeFields.length ? includeFields : defaultFields,
    relations: expandFields.length ? expandFields : defaultRelations,
    skip: offset,
    take: limit,
  }

  const [products, count] = await productService.listAndCount(
    selector,
    listConfig
  )

  res.json({ products, count, offset, limit })
}
