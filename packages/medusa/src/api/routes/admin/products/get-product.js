export default async (req, res) => {
  const { id } = req.params

  const productService = req.scope.resolve("productService")
  let product = await productService.retrieve(id)

  if (!product) {
    res.sendStatus(404)
    return
  }

  product = await productService.decorate(product, [
    "title",
    "description",
    "tags",
    "handle",
    "images",
    "options",
    "variants",
    "published",
  ])

  res.json(product)
}
