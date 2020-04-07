import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { option_id} = req.params
  try {
    const optionService = req.scope.resolve("shippingOptionService")

    await optionService.delete(option_id)

    res.sendStatus(200)
  } catch (err) {
    throw err
  }
}
