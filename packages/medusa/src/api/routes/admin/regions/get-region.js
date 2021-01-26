import { MedusaError, Validator } from "medusa-core-utils"
import { defaultRelations, defaultFields } from "./"

export default async (req, res) => {
  const { region_id } = req.params
  try {
    const regionService = req.scope.resolve("regionService")
    const data = await regionService.retrieve(region_id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.status(200).json({ region: data })
  } catch (err) {
    throw err
  }
}
