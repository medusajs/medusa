import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { region_id, provider_id } = req.params
  try {
    const regionService = req.scope.resolve("regionService")
    await regionService.removePaymentProvider(region_id, provider_id)

    res.sendStatus(200)
  } catch (err) {
    throw err
  }
}
