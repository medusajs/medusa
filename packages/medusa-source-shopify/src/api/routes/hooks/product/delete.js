export default async (req, res) => {
  const productService = req.scope.resolve("shopifyProductService")
  await productService.delete(req.body.id)

  res.sendStatus(200)
}
