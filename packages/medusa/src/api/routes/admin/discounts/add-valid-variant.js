import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { discount_id, variant_id } = req.params
  try {
    const discountService = req.scope.resolve("discountService")

    await discountService.addValidVariant(discount_id, variant_id)

    const data = discountService.retrieve(discount_id)
    res.status(200).json(data)
  } catch (err) {
    throw err
  }
}
