import { Validator, MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const { id, line_id } = req.params

  const schema = Validator.object().keys({
    variant_id: Validator.objectId().required(),
    quantity: Validator.number().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const lineItemService = req.scope.resolve("lineItemService")
    const cartService = req.scope.resolve("cartService")
    let cart = await cartService.retrieve(id)

    const lineItem = await lineItemService.generate(
      value.variant_id,
      value.quantity,
      cart.region_id
    )

    cart = await cartService.updateLineItem(cart._id, line_id, lineItem)
    cart = await cartService.decorate(cart, [], ["region"])

    res.status(200).json({ cart })
  } catch (err) {
    throw err
  }
}
