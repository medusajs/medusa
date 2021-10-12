export default async (req, res) => {
  const orderService = req.scope.resolve("shopifyOrderService")
  await orderService.create(req.body)

  res.sendStatus(200)
}
