export default async (req, res) => {
  const orderService = req.scope.resolve("shopifyOrderService")
  await orderService.update(req.body)

  res.sendStatus(200)
}
