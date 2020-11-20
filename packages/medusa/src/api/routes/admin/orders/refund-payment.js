import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { id } = req.params
  const schema = Validator.object().keys({
    amount: Validator.number().required(),
    reason: Validator.string().required(),
    note: Validator.string()
      .allow("")
      .optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const orderService = req.scope.resolve("orderService")
    let order = await orderService.createRefund(
      id,
      value.amount,
      value.reason,
      value.note
    )
    order = await orderService.decorate(
      order,
      [],
      ["region", "customer", "swaps"]
    )

    res.status(200).json({ order })
  } catch (err) {
    throw err
  }
}
