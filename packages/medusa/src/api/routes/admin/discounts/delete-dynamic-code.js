import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { discount_id, code } = req.params

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const discountService = req.scope.resolve("discountService")
    await discountService.deleteDynamicCode(discount_id, code)

    const data = await discountService.retrieve(dicsount_id)

    res.status(200).json({ discount: data })
  } catch (err) {
    throw err
  }
}
