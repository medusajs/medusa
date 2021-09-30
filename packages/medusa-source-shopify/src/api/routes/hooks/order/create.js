export default async (req, res) => {
  const shopifyService = req.scope.resolve("shopifyService")

  const order = req.body

  await shopifyService.createOrder(order)

  res.sendStatus(200)
}
