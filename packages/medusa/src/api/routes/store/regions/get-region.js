import { Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { region_id } = req.params

  const schema = Validator.objectId()
  const { value, error } = schema.validate(region_id)

  if (error) {
    throw error
  }

  const regionService = req.scope.resolve("regionService")
  const region = await regionService.retrieve(value)

  const data = await regionService.decorate(region, [
    "name",
    "currency_code",
    "tax_rate",
    "countries",
    "payment_providers",
    "fulfillment_providers",
  ])

  res.json({ region: data })
}
