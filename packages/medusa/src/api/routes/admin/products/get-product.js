export default async (req, res) => {
  const { id } = req.params

  const productService = req.scope.resolve("productService")
  let product = await productService.retrieve(id)

  product = await productService.decorate(
    product,
    [
      "title",
      "description",
      "tags",
      "handle",
      "images",
      "options",
      "published",
    ],
    ["variants"]
  )

  res.json({ product })
}
