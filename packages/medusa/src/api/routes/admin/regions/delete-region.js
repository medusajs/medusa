import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { region_id } = req.params
  try {
    const regionService = req.scope.resolve("regionService")
    await regionService.delete(region_id)

    res.status(200).json({
      id: region_id,
      object: "region",
      deleted: true,
    })
  } catch (err) {
    throw err
  }
}
