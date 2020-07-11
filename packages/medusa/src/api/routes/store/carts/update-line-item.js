import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const { id, line_id } = req.params

  const schema = Validator.object().keys({
    quantity: Validator.number().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const lineItemService = req.scope.resolve("lineItemService")
    const cartService = req.scope.resolve("cartService")

    let cart
    if (value.quantity === 0) {
      cart = await cartService.removeLineItem(id, line_id)
    } else {
      cart = await cartService.retrieve(id)

      const existing = cart.items.find(i => i._id.equals(line_id))
      const lineItem = await lineItemService.generate(
        existing.content.variant._id,
        cart.region_id,
        value.quantity
      )

      cart = await cartService.updateLineItem(cart._id, line_id, lineItem)
    }

    cart = await cartService.decorate(cart, [], ["region"])

    res.status(200).json({ cart })
  } catch (err) {
    throw err
  }
}
