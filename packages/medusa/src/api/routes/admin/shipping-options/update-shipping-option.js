import _ from "lodash"
import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { option_id } = req.params
  const schema = Validator.object().keys({
    name: Validator.string().optional(),
    amount: Validator.number().optional(),
    requirements: Validator.array()
      .items(
        Validator.object({
          id: Validator.string().required(),
          type: Validator.string().required(),
          amount: Validator.number().required(),
        })
      )
      .optional(),
    metadata: Validator.object().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const optionService = req.scope.resolve("shippingOptionService")

    const data = await optionService.update(option_id, value)

    res.status(200).json({ shipping_option: data })
  } catch (err) {
    throw err
  }
}
