export default async (req, res) => {
  const { klarna_order_id } = req.query

  try {
    const orderService = req.resolve("orderService")
    const klarnaProviderService = req.resolve("pp_klarna")

    const klarnaOrder = await klarnaProviderService.retrieveCompletedOrder(
      klarna_order_id
    )

    const cartId = klarnaOrder.merchant_data
    const order = await orderService.list({ cart_id: cartId })[0]

    await klarnaProviderService.acknowledgeOrder(klarnaOrder.id, order._id)
    res.sendStatus(200)
  } catch (error) {
    throw error
  }
}
