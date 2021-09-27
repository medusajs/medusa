export default async (req, res) => {
  const shopifyService = req.scope.resolve("shopifyService")

  const product = req.body

  //TODO: delete product

  res.sendStatus(200)
}
