import { Validator } from "medusa-core-utils"

export default async (req, res) => {
  const selector = {}

  const regionService = req.scope.resolve("regionService")
  const regions = await regionService.list(selector)

  const data = await Promise.all(
    regions.map(r =>
      regionService.decorate(r, [
        "name",
        "currency_code",
        "tax_rate",
        "countries",
        "payment_providers",
        "fulfillment_providers",
      ])
    )
  )

  res.json({ regions: data })
}
