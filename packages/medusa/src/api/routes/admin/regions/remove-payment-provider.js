import { MedusaError, Validator } from "medusa-core-utils"
import { defaultRelations, defaultFields } from "./"

export default async (req, res) => {
  const { region_id, provider_id } = req.params
  try {
    const regionService = req.scope.resolve("regionService")
    await regionService.removePaymentProvider(region_id, provider_id)

    const region = await regionService.retrieve(region_id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.json({ region })
  } catch (err) {
    throw err
  }
}
