export default async (req, res) => {
  const productService = req.scope.resolve("shopifyProductService")

  const product = req.body

  productService.update(product)

  res.sendStatus(200)
}
