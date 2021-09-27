export default async (req, res) => {
  const shopifyService = req.scope.resolve("shopifyService")

  const product = req.body

  shopifyService.updateProduct(product)

  res.sendStatus(200)
}
