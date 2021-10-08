export default async (req, res) => {
  const orderService = req.scope.resolve("shopifyOrderService")

  // //TODO: update payment
  await orderService.update(req.body)

  res.sendStatus(200)
}
