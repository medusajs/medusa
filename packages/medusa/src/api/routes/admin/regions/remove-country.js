import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { region_id, country_code } = req.params
  try {
    const regionService = req.scope.resolve("regionService")
    const data = await regionService.removeCountry(region_id, country_code)

    res.json({ region: data })
  } catch (err) {
    throw err
  }
}
