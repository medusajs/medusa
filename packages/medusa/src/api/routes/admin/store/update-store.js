import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    name: Validator.string(),
    swap_link_template: Validator.string(),
    payment_link_template: Validator.string(),
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
