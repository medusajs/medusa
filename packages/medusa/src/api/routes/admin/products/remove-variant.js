export default async (req, res) => {
  const { id, variantId } = req.params

  try {
    const productService = req.scope.resolve("productService")
    await productService.removeVariant(id, variantId)
    let updatedProduct = await productService.retrieve(id)
    updatedProduct = await productService.decorate(updatedProduct, [
      "title",
      "description",
      "tags",
      "handle",
      "images",
      "options",
      "variants",
      "published",
    ])
    res.json(updatedProduct)
  } catch (err) {
    throw err
  }
}
