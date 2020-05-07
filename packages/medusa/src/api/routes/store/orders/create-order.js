import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    cartId: Validator.string().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const cartService = req.scope.resolve("cartService")
    const orderService = req.scope.resolve("orderService")

    const cart = await cartService.retrieve(value.cartId)
    const order = await orderService.create(cart)

    res.status(200).json(order)
  } catch (err) {
    throw err
  }
}
