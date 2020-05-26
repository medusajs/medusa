export default async (req, res) => {
  const { id, variantId } = req.params

  try {
    const productService = req.scope.resolve("productService")
    const product = await productService.deleteVariant(id, variantId)
    const data = await productService.decorate(product, [
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
  } catch (err) {
    throw err
  }
}
