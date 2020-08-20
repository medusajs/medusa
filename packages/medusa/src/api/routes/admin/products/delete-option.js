export default async (req, res) => {
  const { id, option_id } = req.params

  try {
    const productService = req.scope.resolve("productService")
    const product = await productService.deleteOption(id, option_id)
    const data = await productService.decorate(
      product,
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

    res.json({
      option_id,
      object: "option",
      deleted: true,
      product: data,
    })
  } catch (err) {
    throw err
  }
}
