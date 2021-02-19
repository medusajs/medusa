import {
  defaultFields as defaultOrderFields,
  defaultRelations as defaultOrderRelations,
} from "../orders/index"

export default async (req, res) => {
  const { id } = req.params

  try {
    const draftOrderService = req.scope.resolve("draftOrderService")
    const paymentProviderService = req.scope.resolve("paymentProviderService")
    const orderService = req.scope.resolve("orderService")
    const cartService = req.scope.resolve("cartService")
    const entityManager = req.scope.resolve("manager")

    let result
    await entityManager.transaction(async manager => {
      const draftOrder = await draftOrderService
        .withTransaction(manager)
        .retrieve(id)

      const cart = await cartService
        .withTransaction(manager)
        .retrieve(draftOrder.cart_id, {
          select: ["total"],
          relations: ["discounts", "shipping_methods", "region", "items"],
        })

      await paymentProviderService
        .withTransaction(manager)
        .createSession("system", cart)

      await cartService
        .withTransaction(manager)
        .setPaymentSession(cart.id, "system")

      await cartService.withTransaction(manager).authorizePayment(cart.id)

      result = await orderService
        .withTransaction(manager)
        .createFromCart(cart.id)

      await draftOrderService
        .withTransaction(manager)
        .registerCartCompletion(draftOrder.id, result.id)
    })

    const order = await orderService.retrieve(result.id, {
      relations: defaultOrderRelations,
      select: defaultOrderFields,
    })

    res.status(200).json({ order })
  } catch (err) {
    throw err
  }
}
