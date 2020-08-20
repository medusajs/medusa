export default async (req, res) => {
  const { id } = req.params

  try {
    const productService = req.scope.resolve("productService")
    const product = await productService.retrieve(id)
    await productService.publish(product._id)
    let publishedProduct = await productService.retrieve(product._id)
    publishedProduct = await productService.decorate(
      publishedProduct,
      [
        "title",
        "description",
        "tags",
        "handle",
        "thumbnail",
        "images",
        "options",
        "published",
      ],
      ["variants"]
    )
    res.json({ product: publishedProduct })
  } catch (error) {
    throw error
  }
}
