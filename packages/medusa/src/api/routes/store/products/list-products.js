export default async (req, res) => {
  try {
    const productService = req.scope.resolve("productService")

    const limit = parseInt(req.query.limit) || 100
    const offset = parseInt(req.query.offset) || 0

    const selector = {}

    if ("is_giftcard" in req.query && req.query.is_giftcard === "true") {
      selector.is_giftcard = req.query.is_giftcard === "true"
    }

    const listConfig = {
      relations: ["variants", "options", "images"],
      skip: offset,
      take: limit,
    }

    let products = await productService.list(selector, listConfig)

    res.json({ products, count: products.length, offset, limit })
  } catch (error) {
    throw error
  }
}
