export default async (req, res) => {
  const regionService = req.scope.resolve("productService")

  const limit = parseInt(req.query.limit) || 100
  const offset = parseInt(req.query.offset) || 0

  const selector = {}

  if ("is_giftcard" in req.query && req.query.is_giftcard === "true") {
    selector.is_giftcard = req.query.is_giftcard === "true"
  }

  const listConfig = {
    relations: ["countries", "payment_providers", "fulfillment_providers"],
    skip: offset,
    take: limit,
  }

  const regions = await regionService.list(selector, listConfig)

  res.json({ regions })
}
