export default async (req, res) => {
  const orderService = req.scope.resolve("shopifyOrderService")

  const order = req.body

  console.log("ORDER ID => ", order.id)

  await orderService.create(order)

  res.sendStatus(200)
}
