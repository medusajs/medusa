import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { optionId } = req.params
  try {
    const optionService = req.scope.resolve("shippingOptionService")

    await optionService.delete(optionId)

    res.sendStatus(200)
  } catch (err) {
    throw err
  }
}
