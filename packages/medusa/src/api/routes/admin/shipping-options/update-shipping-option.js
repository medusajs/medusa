import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { option_id } = req.params
  const schema = Validator.object().keys({
    name: Validator.string().optional(),
    price: Validator.object()
      .keys({
        type: Validator.string().required(),
        amount: Validator.number().optional(),
      })
      .optional(),
    requirements: Validator.array()
      .items(
        Validator.object({
          type: Validator.string().required(),
          value: Validator.number().required(),
        })
      )
      .optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const optionService = req.scope.resolve("shippingOptionService")

    await optionService.update(option_id, value)

    const data = await optionService.retrieve(option_id)

    res.status(200).json(data)
  } catch (err) {
    throw err
  }
}
