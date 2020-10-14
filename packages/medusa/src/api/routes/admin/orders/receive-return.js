import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { id, return_id } = req.params

  const schema = Validator.object().keys({
    items: Validator.array()
      .items({
        item_id: Validator.string().required(),
        quantity: Validator.number().required(),
      })
      .required(),
    refund: Validator.number().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const orderService = req.scope.resolve("orderService")

    let refundAmount = value.refund
    if (typeof value.refund !== "undefined" && value.refund < 0) {
      refundAmount = 0
    }
    let order = await orderService.return(
      id,
      return_id,
      value.items,
      refundAmount,
      true
    )
    order = await orderService.decorate(order, [], ["region"])

    res.status(200).json({ order })
  } catch (err) {
    throw err
  }
}
