export default async (req, res) => {
  const { klarna_order_id } = req.query

  function isPaymentCollection(id) {
    return id && id.startsWith("paycol")
  }

  try {
    const orderService = req.scope.resolve("orderService")
    const klarnaProviderService = req.scope.resolve("pp_klarna")

    const klarnaOrder = await klarnaProviderService.retrieveCompletedOrder(
      klarna_order_id
    )

    const resourceId = klarnaOrder.merchant_data

    if (isPaymentCollection(resourceId)) {
      await klarnaProviderService.acknowledgeOrder(klarnaOrder.order_id)
    } else {
      const order = await orderService.retrieveByCartId(resourceId)

      await klarnaProviderService.acknowledgeOrder(
        klarnaOrder.order_id,
        order.id
      )
    }

    res.sendStatus(200)
  } catch (error) {
    console.log(error)
    throw error
  }
}
