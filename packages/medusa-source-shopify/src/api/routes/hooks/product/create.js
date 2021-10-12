export default async (req, res) => {
  const productService = req.scope.resolve("shopifyProductService")
  await productService.create(req.body)

  res.sendStatus(200)
}
