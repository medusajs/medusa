export default async (req, res) => {
  const productService = req.scope.resolve("shopifyProductService")
  productService.update(req.body)

  res.sendStatus(200)
}
