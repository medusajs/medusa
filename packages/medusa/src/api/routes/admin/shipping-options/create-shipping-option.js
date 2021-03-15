import { MedusaError, Validator } from "medusa-core-utils"
import { defaultFields, defaultRelations } from "./"

/**
 * @oas [post] /shipping-options
 * operationId: "PostShippingOptions"
 * summary: "Create Shipping Option"
 * description: "Creates a Shipping Option"
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           name:
 *             description: "The name of the Shipping Option"
 *             type: string
 *           region_id:
 *             description: "The id of the Region in which the Shipping Option will be available."
 *             type: string
 *           provider_id:
 *             description: "The id of the Fulfillment Provider that handles the Shipping Option."
 *             type: string
 *           profile_id:
 *             description: "The id of the Shipping Profile to add the Shipping Option to."
 *             type: number
 *           data:
 *             description: "The data needed for the Fulfillment Provider to handle shipping with this Shipping Option."
 *             type: object
 *           price_type:
 *             description: "The type of the Shipping Option price."
 *             type: string
 *             enum:
 *               - flat_rate
 *               - calculated
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
 *           is_return:
 *             description: Whether the Shipping Option defines a return shipment.
 *             type: boolean
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
  const schema = Validator.object().keys({
    name: Validator.string().required(),
    region_id: Validator.string().required(),
    provider_id: Validator.string().required(),
    profile_id: Validator.string(),
    data: Validator.object().required(),
    price_type: Validator.string().required(),
    amount: Validator.number()
      .integer()
      .optional(),
    requirements: Validator.array()
      .items(
        Validator.object({
          type: Validator.string().required(),
          amount: Validator.number()
            .integer()
            .required(),
        })
      )
      .optional(),
    is_return: Validator.boolean().default(false),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const optionService = req.scope.resolve("shippingOptionService")
    const shippingProfileService = req.scope.resolve("shippingProfileService")

    // Add to default shipping profile
    if (!value.profile_id) {
      const { id } = await shippingProfileService.retrieveDefault()
      value.profile_id = id
    }

    const result = await optionService.create(value)
    const data = await optionService.retrieve(result.id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.status(200).json({ shipping_option: data })
  } catch (err) {
    throw err
  }
}
