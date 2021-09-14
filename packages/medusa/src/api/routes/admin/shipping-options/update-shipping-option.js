import _ from "lodash"
import { MedusaError, Validator } from "medusa-core-utils"
import { defaultFields, defaultRelations } from "./"

/**
 * @oas [post] /shipping-options/{id}
 * operationId: "PostShippingOptionsOption"
 * summary: "Update Shipping Option"
 * description: "Updates a Shipping Option"
 * parameters:
 *   - (path) id=* {string} The id of the Shipping Option.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           name:
 *             description: "The name of the Shipping Option"
 *             type: string
 *           amount:
 *             description: "The amount to charge for the Shipping Option."
 *             type: integer
 *           requirements:
 *             description: "The requirements that must be satisfied for the Shipping Option to be available."
 *             type: array
 *             items:
 *               properties:
 *                 type:
 *                   description: The type of the requirement
 *                   type: string
 *                   enum:
 *                     - max_subtotal
 *                     - min_subtotal
 *                 amount:
 *                   description: The amount to compare with.
 *                   type: integer
 * tags:
 *   - Shipping Option
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             shipping_option:
 *               $ref: "#/components/schemas/shipping_option"
 */
export default async (req, res) => {
  const { option_id } = req.params
  const schema = Validator.object().keys({
    name: Validator.string().optional(),
    amount: Validator.number()
      .integer()
      .optional(),
    requirements: Validator.array()
      .items(
        Validator.object({
          id: Validator.string().optional(),
          type: Validator.string().required(),
          amount: Validator.number()
            .integer()
            .required(),
        })
      )
      .optional(),
    admin_only: Validator.boolean().optional(),
    metadata: Validator.object().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const optionService = req.scope.resolve("shippingOptionService")

    await optionService.update(option_id, value)

    const data = await optionService.retrieve(option_id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.status(200).json({ shipping_option: data })
  } catch (err) {
    throw err
  }
}
