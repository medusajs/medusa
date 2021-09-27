export default async (req, res) => {
  const shopifyService = req.scope.resolve("shopifyService")

  const order = req.body

  //TODO: delete order

  res.sendStatus(200)
}
