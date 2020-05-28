import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  try {
    const regionService = req.scope.resolve("regionService")
    const data = await regionService.list({})

    res.status(200).json({ regions: data })
  } catch (err) {
    throw err
  }
}
