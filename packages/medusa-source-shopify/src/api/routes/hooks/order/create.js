export default async (req, res) => {
  const orderService = req.scope.resolve("shopifyOrderService")

  const order = req.body
  await orderService.create(order)

  res.sendStatus(200)
}
