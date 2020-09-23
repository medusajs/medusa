import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    name: Validator.string().optional(),
    prices: Validator.array()
      .items({
        currency_code: Validator.string().required(),
        amount: Validator.number().required(),
      })
      .optional(),
    valid_for: Validator.array().optional(),
    metadata: Validator.object().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }
  try {
    const addOnService = req.scope.resolve("addOnService")

    if (value.metadata) {
      Object.entries(value.metadata).map(([key, value]) => {
        addOnService.setMetadata(id, key, value)
      })

      delete value.metadata
    }

    const addOn = await addOnService.update(id, value)

    res.status(200).json({ addOn })
  } catch (err) {
    throw err
  }
}
