export default async (req, res) => {
  const { id } = req.params

  const productService = req.scope.resolve("productService")
  const product = await productService.retrieve(id)

  if (!product) {
    res.sendStatus(404)
    return
  }

  res.json(product)
}
