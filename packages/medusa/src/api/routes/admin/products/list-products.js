export default async (req, res) => {
  const productService = req.scope.resolve("productService")
  const products = await productService.list()

  if (!products) {
    res.sendStatus(404)
    return
  }

  res.json(products)
}
