export default async (req, res) => {
  const productService = req.scope.resolve("productService")
  let products = await productService.list()

  if (!products) {
    res.sendStatus(404)
    return
  }

  products = products.map(
    async product =>
      await productService.decorate(product, [
        "title",
        "description",
        "tags",
        "handle",
        "images",
        "options",
        "variants",
        "published",
      ])
  )
  res.json(products)
}
