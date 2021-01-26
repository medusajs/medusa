export default async (req, res) => {
  const regionService = req.scope.resolve("regionService")

  const limit = parseInt(req.query.limit) || 100
  const offset = parseInt(req.query.offset) || 0

  const selector = {}

  const listConfig = {
    relations: ["countries", "payment_providers", "fulfillment_providers"],
    skip: offset,
    take: limit,
  }

  const regions = await regionService.list(selector, listConfig)

  res.json({ regions })
}
