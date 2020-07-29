export default async (req, res) => {
  try {
    const productService = req.scope.resolve("productService")
    let products = await productService.list({})
    products = await Promise.all(
      products.map(
        async product =>
          await productService.decorate(
            product,
            [
              "title",
              "description",
              "is_giftcard",
              "tags",
              "thumbnail",
              "handle",
              "images",
              "options",
              "published",
            ],
            ["variants"]
          )
      )
    )
    res.json({ products })
  } catch (error) {
    throw error
  }
}
