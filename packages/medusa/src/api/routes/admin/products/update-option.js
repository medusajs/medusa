import { MedusaError, Validator } from "medusa-core-utils"
import { defaultFields, defaultRelations } from "./"

/**
 * @oas [post] /products/{id}/options/{option_id}
 * operationId: "PostProductsProductOptionsOption"
 * summary: "Update a Product Option."
 * description: "Updates a Product Option"
 * parameters:
 *   - (path) id=* {string} The id of the Product.
 *   - (path) option_id=* {string} The id of the Product Option.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           title:
 *             description: "The title of the Product Option"
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
  const { id, option_id } = req.params

  const schema = Validator.object().keys({
    title: Validator.string().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  const productService = req.scope.resolve("productService")

  await productService.updateOption(id, option_id, value)

  const product = await productService.retrieve(id, {
    select: defaultFields,
    relations: defaultRelations,
  })

  res.json({ product })
}
