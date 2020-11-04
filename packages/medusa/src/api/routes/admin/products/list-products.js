import _ from "lodash"

export default async (req, res) => {
  try {
    const productService = req.scope.resolve("productService")
    const queryBuilderService = req.scope.resolve("queryBuilderService")

    const query = queryBuilderService.buildQuery(req.query, [
      "title",
      "description",
    ])

    if ("is_giftcard" in req.query) {
      query.is_giftcard = req.query.is_giftcard === "true"
    }

    const limit = parseInt(req.query.limit) || 0
    const offset = parseInt(req.query.offset) || 0

    let products = await productService.list(query, offset, limit)

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

    const numProducts = await productService.count()

    res.json({ products, total_count: numProducts })
  } catch (error) {
    throw error
  }
}
