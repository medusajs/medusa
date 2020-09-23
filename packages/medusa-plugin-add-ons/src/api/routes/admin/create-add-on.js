import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    name: Validator.string().required(),
    prices: Validator.array()
      .items({
        currency_code: Validator.string(),
        amount: Validator.number(),
      })
      .required(),
    valid_for: Validator.array().items(),
    metadata: Validator.object().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }
  try {
    const addOnService = req.scope.resolve("addOnService")

    const addOn = await addOnService.create(value)

    res.status(200).json({ addOn })
  } catch (err) {
    throw err
  }
}
