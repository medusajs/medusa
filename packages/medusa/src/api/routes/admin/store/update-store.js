import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    name: Validator.string(),
    default_currency: Validator.string(),
    currencies: Validator.array().items(Validator.string()),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const storeService = req.scope.resolve("storeService")
    const data = await storeService.update(value)
    res.status(200).json({ store: data })
  } catch (err) {
    throw err
  }
}
