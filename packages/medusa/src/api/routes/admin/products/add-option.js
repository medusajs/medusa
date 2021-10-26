import { MedusaError, Validator } from "medusa-core-utils"
import { defaultRelations, defaultFields } from "./"

/**
 * @oas [post] /products/{id}/options
 * operationId: "PostProductsProductOptions"
 * summary: "Add an Option"
 * description: "Adds a Product Option to a Product"
 * parameters:
 *   - (path) id=* {string} The id of the Product.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           title:
 *             description: "The title the Product Option will be identified by i.e. \"Size\""
 *             type: string
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

  const schema = Validator.object().keys({
    title: Validator.string().required(),
  })
  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  const productService = req.scope.resolve("productService")

  await productService.addOption(id, value.title)
  const product = await productService.retrieve(id, {
    select: defaultFields,
    relations: defaultRelations,
  })

  res.json({ product })
}
