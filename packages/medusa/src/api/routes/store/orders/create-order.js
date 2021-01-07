import { MedusaError, Validator } from "medusa-core-utils"

export default async (req, res) => {
  const schema = Validator.object().keys({
    cart_id: Validator.string().required(),
  })

  const { value, error } = schema.validate(req.body)
  if (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, error.details)
  }

  try {
    const cartService = req.scope.resolve("cartService")
    const orderService = req.scope.resolve("orderService")
    const entityManager = req.scope.resolve("manager")

    await entityManager.transaction(async manager => {
      const cart = await cartService
        .withTransaction(manager)
        .retrieve(value.cart_id)

      let order

      try {
        order = await orderService.withTransaction(manager).createFromCart(cart)
      } catch (error) {
        if (error && error.message === "Order from cart already exists") {
          order = await orderService
            .withTransaction(manager)
            .retrieveByCartId(value.cart_id)
        } else {
          throw error
        }
      }

      order = order
        .withTransaction(manager)
        .retrieve(order.id, [
          "billing_address",
          "shipping_address",
          "items",
          "region",
          "discounts",
          "customer",
          "payments",
          "shipping_methods",
        ])

      res.status(200).json({ order })
    })
  } catch (err) {
    console.log(err)
    throw err
  }
}
