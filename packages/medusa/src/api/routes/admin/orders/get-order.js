export default async (req, res) => {
  const { id } = req.params

  try {
    const orderService = req.scope.resolve("orderService")
    const customerService = req.scope.resolve("customerService")

    let order = await orderService.retrieve(id)
    order = await orderService.decorate(order, [], ["region", "customer"])

    if (order.customer_id) {
      order.customer = await customerService.retrieve(order.customer_id)
    }

    res.json({ order })
  } catch (error) {
    throw error
  }
}
