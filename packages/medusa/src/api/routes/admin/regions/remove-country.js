import { MedusaError, Validator } from "medusa-core-utils"
import { defaultRelations, defaultFields } from "./"

export default async (req, res) => {
  const { region_id, country_code } = req.params
  try {
    const regionService = req.scope.resolve("regionService")
    await regionService.removeCountry(region_id, country_code)

    const region = await regionService.retrieve(region_id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.json({ region })
  } catch (err) {
    throw err
  }
}
