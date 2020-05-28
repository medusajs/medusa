import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    name: Validator.string().required(),
    currency_code: Validator.string().required(),
    tax_rate: Validator.number().required(),
    payment_providers: Validator.array().items(Validator.string()),
    fulfillment_providers: Validator.array().items(Validator.string()),
    countries: Validator.array().items(Validator.string()),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const regionService = req.scope.resolve("regionService")
    const data = await regionService.create(value)
    res.status(200).json({ region: data })
  } catch (err) {
    throw err
  }
}
