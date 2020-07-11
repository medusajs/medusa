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
    let order = await orderService.createFromCart(cart)

    order = await orderService.retrieveByCartId(value.cartId)
    order = await orderService.decorate(order, [
      "status",
      "fulfillment_status",
      "payment_status",
      "email",
      "billing_address",
      "shipping_address",
      "items",
      "region",
      "discounts",
      "customer_id",
      "payment_method",
      "shipping_methods",
      "metadata",
    ])

    res.status(200).json({ order })
  } catch (err) {
    throw err
  }
}
