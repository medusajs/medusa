export default async (req, res) => {
  const { id, variant_id } = req.params

  try {
    const productService = req.scope.resolve("productService")
    const product = await productService.deleteVariant(id, variant_id)
    const data = await productService.decorate(product, [
      "title",
      "description",
      "tags",
      "handle",
      "images",
      "options",
      "published",
    ], ["variants"])

    res.json({
      variant_id,
      object: "product-variant",
      deleted: true,
      product: data,
    })
  } catch (err) {
    throw err
  }
}
