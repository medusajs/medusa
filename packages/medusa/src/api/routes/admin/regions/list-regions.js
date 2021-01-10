export default async (req, res) => {
  try {
    const regionService = req.scope.resolve("regionService")

    const limit = parseInt(req.query.limit) || 10
    const offset = parseInt(req.query.offset) || 0

    const selector = {}

    const listConfig = {
      relations: [
        "countries",
        "currency",
        "payment_providers",
        "fulfillment_providers",
      ],
      skip: offset,
      take: limit,
    }

    let regions = await regionService.list(selector, listConfig)

    res.json({ regions, count: regions.length, offset, limit })
  } catch (err) {
    throw err
  }
}
