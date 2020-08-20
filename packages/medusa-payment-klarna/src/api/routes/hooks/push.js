import { MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  const { klarna_order_id } = req.query

  try {
    const cartService = req.scope.resolve("cartService")
    const orderService = req.scope.resolve("orderService")
    const klarnaProviderService = req.scope.resolve("pp_klarna")

    const klarnaOrder = await klarnaProviderService.retrieveCompletedOrder(
      klarna_order_id
    ).then(({ data }) => data)

    const cartId = klarnaOrder.merchant_data
    try {
      const order = await orderService.retrieveByCartId(cartId)
      await klarnaProviderService.acknowledgeOrder(klarnaOrder.order_id, order._id)
    } catch (err) {
      if (err.type === MedusaError.Types.NOT_FOUND) {
        const cart = await cartService.retrieve(cartId)
        const order = await orderService.createFromCart(cart)
        await klarnaProviderService.acknowledgeOrder(klarnaOrder.order_id, order._id)
      }
    }

    res.sendStatus(200)
  } catch (error) {
    console.log(error)
    throw error
  }
}
