export default async (req, res) => {
  const { id, variantId } = req.params

  try {
    const productService = req.scope.resolve("productService")
    const product = await productService.retrieve(id)
    await productService.addVariant(product._id, variantId)
    let newProduct = await productService.retrieve(product._id)
    newProduct = await productService.decorate(newProduct, [
      "title",
      "description",
      "tags",
      "handle",
      "images",
      "options",
      "variants",
      "published",
    ])
    res.json(newProduct)
  } catch (err) {
    throw err
  }
}
