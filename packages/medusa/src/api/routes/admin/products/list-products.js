import _ from "lodash"

export default async (req, res) => {
  try {
    const productService = req.scope.resolve("productService")
    const queryBuilderService = req.scope.resolve("queryBuilderService")

    const query = queryBuilderService.buildQuery(req.query, [
      "title",
      "description",
    ])

    let products = await productService.list(query)

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
    console.log(error)
    throw error
  }
}
