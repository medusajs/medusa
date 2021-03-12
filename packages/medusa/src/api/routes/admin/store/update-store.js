import { MedusaError, Validator } from "medusa-core-utils"

/**
 * @oas [post] /store
 * operationId: "PostStore"
 * summary: "Update Store details."
 * description: "Updates the Store details"
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           name:
 *             description: "The name of the Store"
 *             type: string
 *           swap_link_template:
 *             description: "A template for Swap links - use `{{cart_id}}` to insert the Swap Cart id"
 *             type: string
 *           default_currency_code:
 *             description: "The default currency code for the Store."
 *             type: string
 * tags:
 *   - Store
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             store:
 *               $ref: "#/components/schemas/store"
 */
export default async (req, res) => {
  const schema = Validator.object().keys({
    name: Validator.string(),
    swap_link_template: Validator.string(),
    default_currency_code: Validator.string(),
    currencies: Validator.array().items(Validator.string()),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const storeService = req.scope.resolve("storeService")
    const store = await storeService.update(value)
    res.status(200).json({ store })
  } catch (err) {
    throw err
  }
}
