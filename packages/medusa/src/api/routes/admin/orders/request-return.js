import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const { id } = req.params

  const schema = Validator.object().keys({
    items: Validator.array()
      .items({
        item_id: Validator.string().required(),
        quantity: Validator.number().required(),
      })
      .required(),
    shipping_method: Validator.string().optional(),
    shipping_price: Validator.number().optional(),
    receive_now: Validator.boolean().default(false),
    refund: Validator.number().optional(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const orderService = req.scope.resolve("orderService")

    let oldOrder
    let existingReturns = []
    if (value.receive_now) {
      oldOrder = await orderService.retrieve(id)
      existingReturns = oldOrder.returns.map(r => r._id)
    }

    let shippingMethod
    if (value.shipping_method) {
      shippingMethod = {
        id: value.shipping_method,
        price: value.shipping_price,
      }
    }

    let refundAmount = value.refund
    if (typeof value.refund !== "undefined" && value.refund < 0) {
      refundAmount = 0
    }
    let order = await orderService.requestReturn(
      id,
      value.items,
      shippingMethod,
      refundAmount
    )

    /**
     * If we are ready to receive immediately, we find the newly created return
     * and register it as received.
     */
    if (value.receive_now) {
      const newReturn = order.returns.find(
        r => !existingReturns.includes(r._id)
      )
      order = await orderService.return(
        id,
        newReturn._id,
        value.items,
        value.refund
      )
    }

    order = await orderService.decorate(order, [], ["region"])

    res.status(200).json({ order })
  } catch (err) {
    throw err
  }
}
