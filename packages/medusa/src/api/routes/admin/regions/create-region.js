import { MedusaError, Validator } from "medusa-core-utils"
import { defaultRelations, defaultFields } from "./"

export default async (req, res) => {
  const schema = Validator.object().keys({
    name: Validator.string().required(),
    currency_code: Validator.string().required(),
    tax_code: Validator.string().allow(""),
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
    const result = await regionService.create(value)

    const region = await regionService.retrieve(result.id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.status(200).json({ region })
  } catch (err) {
    throw err
  }
}
