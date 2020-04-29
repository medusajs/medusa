import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { region_id } = req.params
  try {
    const regionService = req.scope.resolve("regionService")
    const data = await regionService.retrieve(region_id)

    res.status(200).json(data)
  } catch (err) {
    throw err
  }
}
