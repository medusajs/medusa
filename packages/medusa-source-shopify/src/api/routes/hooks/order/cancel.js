export default async (req, res) => {
  const shopifyService = req.scope.resolve("shopifyService")

  const order = req.body

  //TODO: cancel order

  res.sendStatus(200)
}
