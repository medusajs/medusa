export default async (req, res) => {
  const shopifyService = req.scope.resolve("shopifyService")

  await shopifyService.createFulfillment(req.body)

  res.sendStatus(200)
}
